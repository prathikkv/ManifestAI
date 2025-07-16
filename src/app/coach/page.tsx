'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { 
  Brain, 
  Send, 
  Sparkles, 
  MessageCircle,
  Lightbulb,
  Target,
  ArrowLeft
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export default function CoachPage() {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hello ${user?.firstName || 'there'}! 👋 I'm your AI manifestation coach. I'm here to help you turn your dreams into reality through practical guidance and positive action steps. What would you like to work on today?`,
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          context: {
            userGoals: ['Personal growth', 'Career advancement'], // Mock data
            recentProgress: 'Just starting manifestation journey',
          }
        }),
      });

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || data.fallback || 'I apologize, but I couldn\'t generate a response right now.',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I\'m having trouble connecting right now. In the meantime, remember that every small step towards your dreams matters. What\'s one action you can take today?',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickStarters = [
    "Help me set better goals",
    "I'm feeling stuck with my dreams",
    "How do I stay motivated?",
    "Create an action plan for my career"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard"
                className="p-2 hover:bg-secondary/50 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">AI Manifestation Coach</h1>
                  <p className="text-sm text-muted-foreground">Your personal guide to achieving dreams</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl shadow-xl overflow-hidden">
          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground'
                  }`}
                >
                  {!message.isUser && (
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-primary">AI Coach</span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary text-foreground p-4 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                    <span className="text-sm">AI Coach is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Starters */}
          {messages.length === 1 && (
            <div className="px-6 py-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">Quick starters:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {quickStarters.map((starter, index) => (
                  <button
                    key={index}
                    onClick={() => setInputValue(starter)}
                    className="text-left p-3 text-sm bg-secondary/50 hover:bg-secondary/80 rounded-lg transition-colors"
                  >
                    <Lightbulb className="w-4 h-4 inline mr-2 text-yellow-500" />
                    {starter}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-6 border-t border-border">
            <div className="flex space-x-4">
              <div className="flex-1">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about manifesting your dreams..."
                  className="w-full p-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                  rows={2}
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="p-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
            <Target className="w-8 h-8 text-blue-500 mb-4" />
            <h3 className="font-semibold mb-2">Goal Setting</h3>
            <p className="text-sm text-muted-foreground">
              Get help breaking down big dreams into achievable milestones
            </p>
          </div>
          
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
            <MessageCircle className="w-8 h-8 text-green-500 mb-4" />
            <h3 className="font-semibold mb-2">24/7 Support</h3>
            <p className="text-sm text-muted-foreground">
              Always here when you need motivation or guidance
            </p>
          </div>
          
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
            <Sparkles className="w-8 h-8 text-purple-500 mb-4" />
            <h3 className="font-semibold mb-2">Personalized</h3>
            <p className="text-sm text-muted-foreground">
              Tailored advice based on your unique dreams and progress
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}