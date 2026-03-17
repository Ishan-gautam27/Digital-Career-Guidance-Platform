import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Bot, X, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FloatingChatButtonProps {
  onNavigate: (section: string) => void;
  currentSection: string;
}

export function FloatingChatButton({ onNavigate, currentSection }: FloatingChatButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Don't show the button if user is already on chatbot page
  if (currentSection === 'chatbot') {
    return null;
  }

  const handleClick = () => {
    onNavigate('chatbot');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full right-0 mb-3 bg-popover border border-border rounded-lg p-3 shadow-lg max-w-xs"
          >
            <div className="flex items-start space-x-2">
              <Bot className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Need Help?</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Ask me about careers, colleges, or educational guidance!
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTooltip(false)}
                className="p-1 h-6 w-6"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="absolute bottom-0 right-6 transform translate-y-full">
              <div className="border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-popover"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg relative overflow-hidden"
          onClick={handleClick}
          onMouseEnter={() => {
            setIsHovered(true);
            setTimeout(() => setShowTooltip(true), 500);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
            setShowTooltip(false);
          }}
        >
          <div className="relative">
            <Bot className="h-6 w-6" />
            {/* Pulse animation */}
            <div className="absolute inset-0">
              <motion.div
                className="absolute inset-0 bg-primary rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 0, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            </div>
          </div>
          
          {/* Online indicator */}
          <div className="absolute -top-1 -right-1">
            <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-background">
              <div className="w-full h-full bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Message count badge */}
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -left-2 h-5 w-5 flex items-center justify-center text-xs p-0"
          >
            <MessageCircle className="h-3 w-3" />
          </Badge>
        </Button>
      </motion.div>

      {/* Background glow effect */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="w-14 h-14 rounded-full bg-primary/20"
          animate={{
            scale: isHovered ? [1, 1.3, 1] : 1,
            opacity: isHovered ? [0.5, 0.2, 0.5] : 0,
          }}
          transition={{
            duration: 1.5,
            repeat: isHovered ? Infinity : 0,
          }}
        />
      </div>
    </div>
  );
}