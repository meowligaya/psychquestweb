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

// Each option label has multiple possible responses
const chatOptions = [
  {
    label: "I'm feeling anxious",
    responses: [
      "It's okay to feel anxious sometimes. Try to focus on your breath and remember that these feelings will pass. 🌸",
      "Remember, anxiety is just a feeling—it can’t hurt you. You are safe right now.",
      "You are not alone in feeling anxious. Reach out if you need someone to talk to. 🤝"
    ]
  },
  {
    label: "I'm struggling today",
    responses: [
      "Even on tough days, you are still you—and that's enough. Take things one step at a time. 💫",
      "Struggling doesn't mean you're failing—it means you're trying, and that's brave.",
      "You have overcome hard days before. This one will pass too. 🌈"
    ]
  },
  {
    label: "I need some motivation",
    responses: [
      "You've overcome challenges before, and you can do it again. Believe in yourself, you're stronger than you think! 💎",
      "Every small step forward is progress. Keep going, you're doing great! 🚀",
      "Your efforts matter, even if progress feels slow. Trust your journey."
    ]
  },
  {
    label: "I want to rest",
    responses: [
      "It's okay to rest. Resting is part of healing too. Give yourself permission to recharge. 🌙",
      "Rest is productive. Taking care of yourself helps you move forward.",
      "You deserve to rest. Listen to your body and mind—they know what you need."
    ]
  },
  {
    label: "I'm proud of myself",
    responses: [
      "You have every reason to be proud! Celebrate your progress and how far you've come. 🎉",
      "Your achievements—big and small—are worth celebrating.",
      "Being proud of yourself is a beautiful thing. Keep shining! 🌟"
    ]
  },
  {
    label: "I feel alone",
    responses: [
      "You're not alone in this—support is around you, and your feelings matter. 🤝",
      "It’s normal to feel alone sometimes, but remember, people care about you.",
      "Reach out to someone you trust. You're worthy of connection."
    ]
  },
  {
    label: "I'm grateful today",
    responses: [
      "Gratitude is powerful! Recognizing what you're thankful for brings light to your journey. 🌅",
      "What you appreciate, appreciates. Keep noticing the good around you.",
      "Gratitude helps heal. Thank you for sharing your positive energy!"
    ]
  },
  {
    label: "I want to start over",
    responses: [
      "You're allowed to start over whenever you need to. Every sunrise brings new beginnings. 🌅",
      "Starting over isn't failing—it's choosing yourself and your growth.",
      "A fresh start means you’re brave enough to keep moving forward."
    ]
  },
  {
    label: "I'm overwhelmed",
    responses: [
      "When life feels overwhelming, remember to pause and take a deep breath. You are handling more than you realize, and it's okay to ask for support. 🌊",
      "Break big tasks into small steps—one at a time is enough.",
      "Your feelings are valid. Take things slow and be gentle with yourself."
    ]
  },
  {
    label: "I'm feeling hopeful",
    responses: [
      "Hope is a powerful force! Keep nurturing it, and let it guide you towards brighter days ahead. ✨",
      "Hold on to hope—it can light up even the darkest times.",
      "Your hope inspires others. Thank you for sharing it."
    ]
  },
  {
    label: "I need encouragement",
    responses: [
      "You are capable of amazing things. Every step you take matters, and you have what it takes to keep moving forward. 🚀",
      "Remember, progress is progress, no matter how small.",
      "Your strength and courage are showing, even if you can't see it yet."
    ]
  },
  {
    label: "I want to set boundaries",
    responses: [
      "Setting boundaries is an act of self-care. You deserve respect and space—it's okay to say no. 🛑",
      "Healthy boundaries protect your peace. Be proud of yourself for setting them.",
      "Your needs matter. Setting boundaries lets others know how to support you."
    ]
  },
  {
    label: "I'm healing from a loss",
    responses: [
      "Healing from loss takes time. Be gentle with yourself and allow yourself to grieve. You're not alone in this. 🕊️",
      "Your feelings are valid. Honor them and give yourself space to heal.",
      "It's okay to ask for help while healing. Others want to support you."
    ]
  },
  {
    label: "I want to celebrate small wins",
    responses: [
      "Small wins are worth celebrating! Every achievement, no matter the size, is a sign of progress. 🎈",
      "Every step forward is a reason for joy. Celebrate your journey.",
      "Your small wins add up to big changes. Keep going!"
    ]
  },
  {
    label: "I'm tired of struggling",
    responses: [
      "It's okay to feel tired. Remember, your resilience has brought you this far—rest, and know that you are stronger than you think. 🌻",
      "Struggle is part of growth. Rest and recharge as you need.",
      "You've gotten through difficult times before—you will again."
    ]
  },
  {
    label: "I feel misunderstood",
    responses: [
      "Your feelings are valid, even if others don't understand them. You deserve to be heard and respected for who you are. 💙",
      "You matter, and your story matters. Keep expressing yourself.",
      "Being misunderstood is hard, but your truth is important."
    ]
  },
  {
    label: "I want to forgive myself",
    responses: [
      "Forgiving yourself is a brave and healing act. You are not your mistakes—embrace growth and kindness. 🍃",
      "You deserve compassion, especially from yourself.",
      "Let go of guilt. You're learning and growing every day."
    ]
  },
  {
    label: "I'm learning and growing",
    responses: [
      "Every day brings new opportunities for learning and growth. Be proud of your journey and the person you're becoming. 🌱",
      "Growth is not always linear—keep moving forward.",
      "Learning is a sign of strength. Keep going!"
    ]
  },
];

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
  const [showOptions, setShowOptions] = useState(true);

  // Pick a random response for the selected label
  const handleOptionSelect = (option: typeof chatOptions[0]) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: option.label,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setShowOptions(false);

    setTimeout(() => {
      // Pick a random response from the available responses for the label
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: option.responses[Math.floor(Math.random() * option.responses.length)],
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setShowOptions(true);
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
        fixed bottom-2 right-2 w-[98vw] max-w-xl h-[85vh] z-50 island-card flex flex-col
        sm:bottom-6 sm:right-6 sm:w-[520px] sm:h-[600px]
        rounded-xl
        shadow-lg
        bg-white
        transition-all
      "
      style={{
        maxWidth: '600px',
        minWidth: '240px',
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

      {/* Option Selection - mobile responsive, can be closed */}
      {showOptions && (
        <div className="p-3 border-t border-border/50 bg-white">
          <div
            className="
              grid grid-cols-2 gap-2
              sm:flex sm:flex-wrap sm:gap-2
              max-h-[220px] overflow-y-auto overscroll-y-contain
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
                  fontSize: '1rem',
                  margin: 0,
                  maxWidth: '100%'
                }}
              >
                {option.label}
              </Button>
            ))}
          </div>
          <div className="flex justify-center mb-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs px-2 py-1"
              onClick={() => setShowOptions(false)}
            >
              Hide Options
            </Button>
          </div>
          <p className="text-xs text-muted-foreground flex items-center justify-center">
            <Heart className="w-3 h-3 mr-1" />
            Your wellness journey and story matters
          </p>
        </div>
      )}

      {/* Show option to reveal chatOptions again if hidden */}
      {!showOptions && (
        <div className="p-2 border-t border-border/50 bg-white flex justify-center">
          <Button
            variant="outline"
            size="sm"
            className="text-xs px-3 py-1"
            onClick={() => setShowOptions(true)}
          >
            Show Options
          </Button>
        </div>
      )}
    </Card>
  );
}