import { Request, Response } from 'express';
import Event from '../models/Event';

// Get all events for the logged-in user
export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?._id;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const events = await Event.find({ userId }).sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Server error fetching events' });
  }
};

// Create a new event
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?._id;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { title, description, date, category, priority, status } = req.body;
    
    if (!title || !description || !date) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const newEvent = new Event({
      title,
      description,
      date: new Date(date),
      category: category || 'exam',
      priority: priority || 'low',
      status: status || 'upcoming',
      userId
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Server error creating event' });
  }
};

// Delete an event
export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?._id;
    const { id } = req.params;
    
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const event = await Event.findOneAndDelete({ _id: id, userId });
    
    if (!event) {
      res.status(404).json({ message: 'Event not found or unauthorized' });
      return;
    }

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Server error deleting event' });
  }
};

// Update an event
export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?._id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { title, description, date, category, priority, status } = req.body;

    const event = await Event.findOneAndUpdate(
      { _id: id, userId },
      {
        ...(title && { title }),
        ...(description && { description }),
        ...(date && { date: new Date(date) }),
        ...(category && { category }),
        ...(priority && { priority }),
        ...(status && { status }),
      },
      { new: true }
    );

    if (!event) {
      res.status(404).json({ message: 'Event not found or unauthorized' });
      return;
    }

    res.status(200).json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Server error updating event' });
  }
};
