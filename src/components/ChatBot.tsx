import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  MessageCircle, 
  Send, 
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

const supportiveResponses = [
 "Healing takes time, and that's completely okay. Be gentle with yourself. 🌸",
"You don't need to have it all figured out right now. One step at a time. 🚶",
"Your worth isn't measured by your struggles—you are valuable just as you are. 🌟",
"Even small wins are worth celebrating. You're doing better than you think. 🎉",
"It's okay to rest. Resting is part of healing too. 🌙",
"Your voice matters, and I'm glad you're using it. 🗣️",
"You're not defined by one hard day. Better ones are ahead. 🌈",
"You've overcome challenges before, and you can do it again. 💎",
"Don't underestimate your strength—you've carried yourself this far. 🛤️",
"It's brave to be honest about how you feel. 💌",
"You're not a burden—your feelings are important. 💕",
"The fact that you keep going shows resilience. 🌻",
"You're learning, growing, and evolving every single day. 🌞",
"Remember to show yourself the kindness you give to others. 🕊️",
"Storms don't last forever—the sun will shine again. ☀️",
"You deserve peace, love, and healing. 🌼",
"It's okay to ask for help—reaching out shows wisdom, not weakness. 📞",
"No matter how slow progress feels, it's still progress. 🐢",
"You're more capable than you give yourself credit for. 🎯",
"Be proud of yourself—you're showing up, and that matters. 🌹",
"You're not alone in this—support is around you. 🤝",
"The way you feel is real, and it deserves care. 💙",
"You're allowed to start over whenever you need to. 🔄",
"Don't compare your journey to anyone else's. Yours is unique. ✨",
"You are worthy of love exactly as you are. 💖",
"Every day you keep trying is a victory. 🏆",
"You're building strength even when it doesn't feel like it. 🧩",
"You've made it through 100% of your hardest days so far. 🌍",
"It's okay to not be okay all the time. 🌙",
"Even in tough times, you are still you—and that's enough. 💫",
"Your feelings deserve space and respect. 🪷",
"Healing isn't a race—move at your own pace. ⏳",
"There's no shame in struggling. It means you're human. 🤍",
"You bring light into this world, even if you can't see it right now. 🕯️",
"Every emotion you feel is part of your story. 📖",
"The fact that you care shows your strength. 💚",
"You're doing the best you can, and that is enough. 🍃",
"Believe in yourself a little more—you deserve it. 🌈",
"You're allowed to rest and still be strong. 💤",
"You are not your mistakes—they don't define you. 🔑",
"Your courage inspires others, even if you don't realize it. 🌟",
"You've already come so far—be proud of your journey. 🛶",
"Every sunrise is a reminder that new beginnings are possible. 🌅",
"You're stronger than the doubt in your mind. ⚡",
"You are worthy of happiness and joy. 🌻",
"Taking care of your mental health is a sign of wisdom. 🧠",
"One step today brings you closer to tomorrow. 🚀",
"You're allowed to set boundaries—it's self-care, not selfishness. 🛑",
"Remember how far you've come, not just how far you have to go. 📍",
"You are not alone on this path—support and hope are with you. 🌍",
"You matter simply because you exist. 🌺",
"Even on heavy days, your heart keeps going. ❤️",
"Take pride in your journey, even if it feels unfinished. 🛤️",
"You're not behind—you're moving at your own pace. 🌙",
"Healing is messy, but that doesn't mean you're failing. 🎨",
"Every breath you take is proof of your resilience. 🌊",
"Your feelings are part of what makes you beautifully human. 🌹"
];

const getRandomResponse = () => {
  const randomIndex = Math.floor(Math.random() * supportiveResponses.length);
  return supportiveResponses[randomIndex];
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi there! 👋 I'm your wellness companion. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");

    // Simulate bot response after a short delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getRandomResponse(),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-[var(--shadow-glow)] z-50 beach-button floating-wave"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-80 h-96 z-50 island-card flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
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
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/50">
        <div className="flex space-x-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share how you're feeling..."
            className="flex-1 rounded-xl"
          />
          <Button
            onClick={sendMessage}
            size="icon"
            className="rounded-xl ocean-button"
            disabled={!inputText.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 flex items-center">
          <Heart className="w-3 h-3 mr-1" />
          Your wellness journey and story matters
        </p>
      </div>
    </Card>
  );
}