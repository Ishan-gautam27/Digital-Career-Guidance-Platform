import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import axios from 'axios';
import {
  Calendar as CalendarIcon,
  Clock,
  AlertCircle,
  CheckCircle,
  Bell,
  Filter,
  Plus,
  ExternalLink,
  Trash2,
  Pencil
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  category: 'admission' | 'exam' | 'scholarship' | 'application';
  priority: 'high' | 'medium' | 'low';
  status: 'upcoming' | 'ongoing' | 'completed' | 'missed';
  college?: string;
  stream?: string;
  reminder?: boolean;
}

export function TimelineTracker() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<TimelineEvent>>({
    title: '',
    description: '',
    date: new Date(),
    category: 'exam',
    priority: 'low',
    status: 'upcoming'
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : null;
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      const response = await axios.get('/api/events', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Ensure date objects are deeply restored from ISO strings coming from API
      const hydratedEvents = response.data.map((evt: any) => ({
        ...evt,
        id: evt._id,
        date: new Date(evt.date)
      }));
      setEvents(hydratedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : null;
      
      if (token) {
        await axios.delete(`/api/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      // Update local state by filtering out the deleted event
      setEvents(events.filter(event => event.id !== id));
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const startEdit = (event: TimelineEvent) => {
    setEditingEvent(event);
    setNewEvent({
      title: event.title,
      description: event.description,
      date: new Date(event.date),
      category: event.category,
      priority: event.priority,
      status: event.status
    });
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingEvent(null);
    setNewEvent({ title: '', description: '', date: new Date(), category: 'exam', priority: 'low', status: 'upcoming' });
  };

  const categories = [
    { id: 'all', label: 'All Events', icon: CalendarIcon },
    { id: 'exam', label: 'Exams', icon: Clock },
    { id: 'admission', label: 'Admissions', icon: CheckCircle },
    { id: 'application', label: 'Applications', icon: Plus },
    { id: 'scholarship', label: 'Scholarships', icon: Bell }
  ];

  const statuses = [
    { id: 'all', label: 'All Status' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'ongoing', label: 'Ongoing' },
    { id: 'completed', label: 'Completed' },
    { id: 'missed', label: 'Missed' }
  ];

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
      return matchesCategory && matchesStatus;
    });
  }, [filterCategory, filterStatus, events]);

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return filteredEvents.filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return event.status === 'upcoming' && eventDate.getTime() >= today.getTime();
    }).sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [filteredEvents]);

  const calendarEvents = useMemo(() => {
    if (!selectedDate) return [];
    
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);

    return filteredEvents.filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === selected.getTime();
    });
  }, [filteredEvents, selectedDate]);

  const hasEventMatcher = React.useCallback((day: Date) => {
    return filteredEvents.some(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day.getDate() &&
        eventDate.getMonth() === day.getMonth() &&
        eventDate.getFullYear() === day.getFullYear()
      );
    });
  }, [filteredEvents]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'exam': return 'bg-blue-500';
      case 'admission': return 'bg-green-500';
      case 'application': return 'bg-orange-500';
      case 'scholarship': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-blue-600';
      case 'ongoing': return 'text-green-600';
      case 'completed': return 'text-gray-600';
      case 'missed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return null;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysUntil = (date: Date) => {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Past';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2">Timeline Tracker</h1>
          <p className="text-muted-foreground">
            Stay updated with important admission dates, exam schedules, and scholarship deadlines.
          </p>
        </div>
        <Button onClick={() => {
          if (showAddForm) {
            cancelForm();
          } else {
            setShowAddForm(true);
          }
        }}>
          <Plus className="h-4 w-4 mr-2" />
          {showAddForm ? 'Cancel' : 'Add Event'}
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-8 border-2 border-primary/20">
          <CardHeader>
            <CardTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</CardTitle>
            <CardDescription>{editingEvent ? 'Update the details of your event.' : 'Fill in the details for the new timeline event.'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Event Title</label>
                <Input 
                  placeholder="Enter event title" 
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input 
                  type="date" 
                  value={newEvent.date ? `${newEvent.date.getFullYear()}-${String(newEvent.date.getMonth() + 1).padStart(2, '0')}-${String(newEvent.date.getDate()).padStart(2, '0')}` : ''}
                  onChange={(e) => {
                    const parsedDate = new Date(e.target.value);
                    if (!isNaN(parsedDate.getTime())) {
                      setNewEvent({ ...newEvent, date: parsedDate });
                    }
                  }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input 
                placeholder="Enter event description" 
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select 
                  value={newEvent.category as string} 
                  onValueChange={(val) => setNewEvent({ ...newEvent, category: val as any })}
                >
                  <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admission">Admission</SelectItem>
                    <SelectItem value="exam">Exam</SelectItem>
                    <SelectItem value="scholarship">Scholarship</SelectItem>
                    <SelectItem value="application">Application</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select 
                  value={newEvent.priority as string} 
                  onValueChange={(val) => setNewEvent({ ...newEvent, priority: val as any })}
                >
                  <SelectTrigger><SelectValue placeholder="Select Priority" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button disabled={isSaving} onClick={async () => {
                if (!newEvent.title || !newEvent.description || !newEvent.date) return;
                
                setIsSaving(true);
                try {
                  const userStr = localStorage.getItem('user');
                  const token = userStr ? JSON.parse(userStr).token : null;
                  
                  const eventPayload = {
                    title: newEvent.title,
                    description: newEvent.description,
                    date: newEvent.date,
                    category: newEvent.category || 'exam',
                    priority: newEvent.priority || 'low',
                    status: newEvent.status || 'upcoming'
                  };

                  if (token && editingEvent) {
                    // UPDATE existing event
                    const response = await axios.put(`/api/events/${editingEvent.id}`, eventPayload, {
                      headers: { Authorization: `Bearer ${token}` }
                    });
                    const updatedEvent: TimelineEvent = {
                      ...response.data,
                      id: response.data._id,
                      date: new Date(response.data.date)
                    };
                    setEvents(events.map(ev => ev.id === editingEvent.id ? updatedEvent : ev).sort((a,b) => a.date.getTime() - b.date.getTime()));
                  } else if (token) {
                    // CREATE new event
                    const response = await axios.post('/api/events', eventPayload, {
                      headers: { Authorization: `Bearer ${token}` }
                    });
                    const savedEvent: TimelineEvent = {
                      ...response.data,
                      id: response.data._id,
                      date: new Date(response.data.date)
                    };
                    setEvents([...events, savedEvent].sort((a,b) => a.date.getTime() - b.date.getTime()));
                  } else {
                    const localEvent: TimelineEvent = {
                      id: Date.now().toString(),
                      ...(eventPayload as any)
                    };
                    setEvents([...events, localEvent].sort((a,b) => a.date.getTime() - b.date.getTime()));
                  }
                  
                  cancelForm();
                } catch (error) {
                  console.error('Failed to save event', error);
                } finally {
                  setIsSaving(false);
                }
              }}>
                {isSaving ? 'Saving...' : (editingEvent ? 'Update Event' : 'Save Event')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Filters and Calendar */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Category</label>
                <div className="space-y-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <Button
                        key={category.id}
                        variant={filterCategory === category.id ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setFilterCategory(category.id)}
                        className="w-full justify-start"
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {category.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Status</label>
                <div className="space-y-1">
                  {statuses.map((status) => (
                    <Button
                      key={status.id}
                      variant={filterStatus === status.id ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setFilterStatus(status.id)}
                      className="w-full justify-start"
                    >
                      {status.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={{ hasEvent: hasEventMatcher }}
                modifiersClassNames={{ hasEvent: "bg-blue-500 text-white font-bold hover:bg-blue-600 hover:text-white" }}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              <div className="mb-4">
                <h2>Urgent Deadlines</h2>
                <p className="text-muted-foreground">
                  Events you need to pay attention to immediately.
                </p>
              </div>

              {upcomingEvents.length === 0 ? (
                <Card className="text-center py-8">
                  <CardContent>
                    <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="mb-2">No Upcoming Events</h3>
                    <p className="text-muted-foreground">
                      All your important deadlines will appear here when they're available.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                upcomingEvents.map((event) => (
                <Card key={event.id} className="border-l-4" style={{
                  borderLeftColor: event.priority === 'high' ? '#ef4444' : 
                                   event.priority === 'medium' ? '#f59e0b' : '#10b981'
                }}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          {getPriorityIcon(event.priority)}
                          {event.reminder && <Bell className="h-4 w-4 text-blue-500" />}
                        </div>
                        <CardDescription>{event.description}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className={`w-3 h-3 rounded-full ${getCategoryColor(event.category)} mb-1`} />
                        <Badge variant="outline" className="text-xs">
                          {event.category}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => startEdit(event)}
                          className="h-6 w-6 p-0 ml-2 text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => deleteEvent(event.id)}
                          className="h-6 w-6 p-0 ml-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{getDaysUntil(event.date)}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </div>
                    </div>
                    {event.college && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        📍 {event.college}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2>All Events</h2>
                  <p className="text-muted-foreground">
                    Complete timeline of educational events ({filteredEvents.length} events)
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <Card key={event.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-base">{event.title}</h3>
                            {getPriorityIcon(event.priority)}
                            {event.reminder && <Bell className="h-4 w-4 text-blue-500" />}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {event.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-1">
                              <CalendarIcon className="h-3 w-3" />
                              <span>{formatDate(event.date)}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {event.category}
                            </Badge>
                            <span className={getStatusColor(event.status)}>
                              {event.status}
                            </span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => startEdit(event)}
                              className="h-6 w-6 p-0 ml-2 text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => deleteEvent(event.id)}
                              className="h-6 w-6 p-0 ml-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">
                            {getDaysUntil(event.date)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="calendar" className="space-y-4">
              <Card className="border shadow-none">
                <CardContent className="p-6 flex flex-col items-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    modifiers={{ hasEvent: hasEventMatcher }}
                    modifiersClassNames={{ hasEvent: "bg-blue-500 text-white font-bold hover:bg-blue-600 hover:text-white" }}
                    className="rounded-md border bg-background"
                  />
                  <p className="mt-4 text-sm text-muted-foreground">Select a highlighted date to view its events</p>
                </CardContent>
              </Card>

              <div className="mb-4 flex items-center justify-between mt-8">
                <div>
                  <h2 className="text-xl font-semibold">Events for {selectedDate ? formatDate(selectedDate) : 'Selected Date'}</h2>
                  <p className="text-muted-foreground">
                    {calendarEvents.length === 0 ? 'No events scheduled for this day.' : `${calendarEvents.length} event(s) scheduled.`}
                  </p>
                </div>
              </div>

                {calendarEvents.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12 text-muted-foreground">
                      <CalendarIcon className="h-12 w-12 mx-auto mb-4" />
                      <p>No events found for this selection.</p>
                      <p className="text-sm">Try selecting a different date from the calendar</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {calendarEvents.map((event) => (
                    <Card key={event.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-base">{event.title}</h3>
                              {getPriorityIcon(event.priority)}
                              {event.reminder && <Bell className="h-4 w-4 text-blue-500" />}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {event.description}
                            </p>
                            <div className="flex items-center space-x-4 text-sm">
                              <div className="flex items-center space-x-1">
                                <CalendarIcon className="h-3 w-3" />
                                <span>{formatDate(event.date)}</span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {event.category}
                              </Badge>
                              <span className={getStatusColor(event.status)}>
                                {event.status}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => startEdit(event)}
                                className="h-6 w-6 p-0 ml-2 text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => deleteEvent(event.id)}
                                className="h-6 w-6 p-0 ml-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">
                              {getDaysUntil(event.date)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}