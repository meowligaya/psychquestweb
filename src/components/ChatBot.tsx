import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  MessageCircle, 
  X, 
  Bot,
  Heart
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const chatOptions = [
  { label: "I'm feeling anxious", response: "It's okay to feel anxious sometimes. Try to focus on your breath and remember that these feelings will pass. 🌸" },
  { label: "I'm struggling today", response: "Even on tough days, you are still you—and that's enough. Take things one step at a time. 💫" },
  { label: "I need some motivation", response: "You've overcome challenges before, and you can do it again. Believe in yourself, you're stronger than you think! 💎" },
  { label: "I want to rest", response: "It's okay to rest. Resting is part of healing too. Give yourself permission to recharge. 🌙" },
  { label: "I'm proud of myself", response: "You have every reason to be proud! Celebrate your progress and how far you've come. 🎉" },
  { label: "I feel alone", response: "You're not alone in this—support is around you, and your feelings matter. 🤝" },
  { label: "I'm grateful today", response: "Gratitude is powerful! Recognizing what you're thankful for brings light to your journey. 🌅" },
  { label: "I want to start over", response: "You're allowed to start over whenever you need to. Every sunrise brings new beginnings. 🌅" },
  { label: "I'm overwhelmed", response: "When life feels overwhelming, remember to pause and take a deep breath. You are handling more than you realize, and it's okay to ask for support. 🌊" },
  { label: "I'm feeling hopeful", response: "Hope is a powerful force! Keep nurturing it, and let it guide you towards brighter days ahead. ✨" },
  { label: "I need encouragement", response: "You are capable of amazing things. Every step you take matters, and you have what it takes to keep moving forward. 🚀" },
  { label: "I want to set boundaries", response: "Setting boundaries is an act of self-care. You deserve respect and space—it's okay to say no. 🛑" },
  { label: "I'm healing from a loss", response: "Healing from loss takes time. Be gentle with yourself and allow yourself to grieve. You're not alone in this. 🕊️" },
  { label: "I want to celebrate small wins", response: "Small wins are worth celebrating! Every achievement, no matter the size, is a sign of progress. 🎈" },
  { label: "I'm tired of struggling", response: "It's okay to feel tired. Remember, your resilience has brought you this far—rest, and know that you are stronger than you think. 🌻" },
  { label: "I feel misunderstood", response: "Your feelings are valid, even if others don't understand them. You deserve to be heard and respected for who you are. 💙" },
  { label: "I want to forgive myself", response: "Forgiving yourself is a brave and healing act. You are not your mistakes—embrace growth and kindness. 🍃" },
  { label: "I'm learning and growing", response: "Every day brings new opportunities for learning and growth. Be proud of your journey and the person you're becoming. 🌱" }
];

// ...imports and chatOptions remain unchanged

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi there! 👋 I'm your wellness companion. Choose how you're feeling today:",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);

  const handleOptionSelect = (option: typeof chatOptions[0]) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: option.label,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: option.response,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 800);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-[var(--shadow-glow)] z-50 beach-button floating-wave"
        style={{ touchAction: 'manipulation' }}
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card
      className="
        fixed bottom-4 right-4 w-[96vw] max-w-lg h-[75vh] z-50 island-card flex flex-col
        sm:bottom-6 sm:right-6 sm:w-[420px] sm:h-[540px]
        rounded-xl
        shadow-lg
        bg-white
        transition-all
      "
      style={{
        maxWidth: '520px',
        minWidth: '260px',
        boxSizing: 'border-box'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border/50 bg-gradient-to-r from-primary/20 to-accent/10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm font-nunito">Wellness Buddy</h3>
            <p className="text-xs text-muted-foreground">Always here for you</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="w-8 h-8"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ backgroundColor: "#f8fafc", minHeight: 0 }}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm break-words ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
              style={{
                fontFamily: 'Nunito, sans-serif',
                wordBreak: 'break-word'
              }}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {/* Option Selection */}
      <div className="p-3 border-t border-border/50 bg-white">
        <div
          className="
            grid grid-cols-2 gap-2
            sm:flex sm:flex-wrap sm:gap-2
            max-h-[200px] overflow-y-auto overscroll-y-contain
            mb-2
            "
        >
          {chatOptions.map((option, idx) => (
            <Button
              key={option.label}
              onClick={() => handleOptionSelect(option)}
              className="rounded-xl px-2 py-2 text-xs font-nunito min-w-0 w-full whitespace-normal leading-tight bg-accent/80 hover:bg-accent"
              variant="outline"
              style={{
                boxSizing: 'border-box',
                fontSize: '0.98rem',
                margin: 0,
                maxWidth: '100%'
              }}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center">
          <Heart className="w-3 h-3 mr-1" />
          Your wellness journey and story matters
        </p>
      </div>
    </Card>
  );
}