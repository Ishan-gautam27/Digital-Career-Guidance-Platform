import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { CheckCircle, Brain, ArrowRight, ArrowLeft } from 'lucide-react';

interface AptitudeQuizProps {
  onComplete: (results: any) => void;
}

interface Question {
  id: string;
  category: 'interests' | 'strengths' | 'preferences';
  question: string;
  options: Array<{
    value: string;
    label: string;
    stream: 'science' | 'commerce' | 'arts' | 'vocational';
  }>;
}

const questions: Question[] = [
  {
    id: '1',
    category: 'interests',
    question: 'Which subjects do you find most engaging?',
    options: [
      { value: 'math-physics', label: 'Mathematics and Physics', stream: 'science' },
      { value: 'business-economics', label: 'Business Studies and Economics', stream: 'commerce' },
      { value: 'history-literature', label: 'History and Literature', stream: 'arts' },
      { value: 'practical-skills', label: 'Practical and Technical Skills', stream: 'vocational' }
    ]
  },
  {
    id: '2',
    category: 'strengths',
    question: 'What are your strongest abilities?',
    options: [
      { value: 'analytical', label: 'Analytical and Problem-solving', stream: 'science' },
      { value: 'numerical', label: 'Numerical and Financial analysis', stream: 'commerce' },
      { value: 'creative', label: 'Creative and Communication skills', stream: 'arts' },
      { value: 'hands-on', label: 'Hands-on and Technical skills', stream: 'vocational' }
    ]
  },
  {
    id: '3',
    category: 'preferences',
    question: 'What type of career environment appeals to you?',
    options: [
      { value: 'research', label: 'Research labs and innovation centers', stream: 'science' },
      { value: 'corporate', label: 'Corporate offices and business settings', stream: 'commerce' },
      { value: 'creative', label: 'Creative studios and cultural institutions', stream: 'arts' },
      { value: 'field', label: 'Field work and practical applications', stream: 'vocational' }
    ]
  },
  {
    id: '4',
    category: 'interests',
    question: 'Which activities do you enjoy most in your free time?',
    options: [
      { value: 'experiments', label: 'Conducting experiments and research', stream: 'science' },
      { value: 'business-news', label: 'Reading business news and market trends', stream: 'commerce' },
      { value: 'arts-culture', label: 'Engaging with arts, culture, and literature', stream: 'arts' },
      { value: 'building', label: 'Building, crafting, or technical projects', stream: 'vocational' }
    ]
  },
  {
    id: '5',
    category: 'strengths',
    question: 'What type of problems do you solve best?',
    options: [
      { value: 'scientific', label: 'Scientific and logical problems', stream: 'science' },
      { value: 'financial', label: 'Financial and strategic problems', stream: 'commerce' },
      { value: 'social', label: 'Social and communication challenges', stream: 'arts' },
      { value: 'technical', label: 'Technical and practical problems', stream: 'vocational' }
    ]
  }
];

export function AptitudeQuiz({ onComplete }: AptitudeQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateResults = () => {
    const streamScores = {
      science: 0,
      commerce: 0,
      arts: 0,
      vocational: 0
    };

    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = questions.find(q => q.id === questionId);
      const option = question?.options.find(opt => opt.value === answer);
      if (option) {
        streamScores[option.stream]++;
      }
    });

    const recommendedStream = Object.entries(streamScores).reduce((a, b) => 
      streamScores[a[0] as keyof typeof streamScores] > streamScores[b[0] as keyof typeof streamScores] ? a : b
    )[0];

    const results = {
      recommendedStream,
      scores: streamScores,
      completedAt: new Date().toISOString(),
      totalQuestions: questions.length,
      answeredQuestions: Object.keys(answers).length
    };

    setShowResults(true);
    onComplete(results);
  };

  const getStreamInfo = (stream: string) => {
    const streamData = {
      science: {
        title: 'Science Stream',
        description: 'Perfect for analytical minds interested in research, technology, and innovation',
        careers: ['Engineering', 'Medicine', 'Research', 'Technology', 'Environmental Sciences'],
        color: 'bg-blue-500'
      },
      commerce: {
        title: 'Commerce Stream',
        description: 'Ideal for business-minded individuals interested in finance and management',
        careers: ['Business Management', 'Finance', 'Accounting', 'Economics', 'Entrepreneurship'],
        color: 'bg-green-500'
      },
      arts: {
        title: 'Arts Stream',
        description: 'Great for creative and socially conscious individuals',
        careers: ['Literature', 'Psychology', 'Social Work', 'Journalism', 'Design'],
        color: 'bg-purple-500'
      },
      vocational: {
        title: 'Vocational Stream',
        description: 'Perfect for hands-on learners who prefer practical applications',
        careers: ['Technical Skills', 'Craftsmanship', 'Applied Sciences', 'Professional Training'],
        color: 'bg-orange-500'
      }
    };

    return streamData[stream as keyof typeof streamData];
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];
  const hasAnswer = answers[currentQ.id];

  if (showResults) {
    const recommendedStream = Object.entries(answers).reduce((acc, [qId, answer]) => {
      const question = questions.find(q => q.id === qId);
      const option = question?.options.find(opt => opt.value === answer);
      return option?.stream || acc;
    }, 'science');

    const streamInfo = getStreamInfo(recommendedStream);

    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="mb-2">Assessment Complete!</h1>
          <p className="text-muted-foreground">
            Based on your responses, here's your personalized recommendation
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{streamInfo.title}</CardTitle>
                <CardDescription className="mt-2">
                  {streamInfo.description}
                </CardDescription>
              </div>
              <div className={`w-4 h-4 rounded-full ${streamInfo.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h3 className="mb-3">Recommended Career Paths:</h3>
              <div className="flex flex-wrap gap-2">
                {streamInfo.careers.map((career, index) => (
                  <Badge key={index} variant="secondary">
                    {career}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="mb-3">Your Assessment Scores:</h3>
                <div className="space-y-2">
                  {Object.entries({
                    science: 'Science',
                    commerce: 'Commerce', 
                    arts: 'Arts',
                    vocational: 'Vocational'
                  }).map(([key, label]) => {
                    const score = Object.values(answers).filter((answer, index) => {
                      const question = questions[index];
                      const option = question?.options.find(opt => opt.value === answer);
                      return option?.stream === key;
                    }).length;
                    
                    return (
                      <div key={key} className="flex justify-between items-center">
                        <span>{label}</span>
                        <span className="text-sm text-muted-foreground">{score}/{questions.length}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <h3 className="mb-3">Next Steps:</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Explore {streamInfo.title.toLowerCase()} colleges near you</li>
                  <li>• Review career pathways in detail</li>
                  <li>• Check admission timelines and requirements</li>
                  <li>• Connect with career counselors</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button size="lg" onClick={() => onComplete({
            recommendedStream,
            completedAt: new Date().toISOString()
          })}>
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Brain className="h-6 w-6 text-primary" />
            <div>
              <h1>Aptitude Assessment</h1>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </div>
          </div>
          <Badge variant="outline">
            {Math.round(progress)}% Complete
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {currentQ.question}
          </CardTitle>
          <CardDescription>
            Choose the option that best describes you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={answers[currentQ.id] || ''}
            onValueChange={(value) => handleAnswer(currentQ.id, value)}
          >
            {currentQ.options.map((option, index) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="flex-1 cursor-pointer py-2">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!hasAnswer}
        >
          {currentQuestion === questions.length - 1 ? 'Complete Assessment' : 'Next'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}