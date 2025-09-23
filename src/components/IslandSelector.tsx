import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Gamepad2, HelpCircle, BookOpen } from "lucide-react";

interface IslandSelectorProps {
  onIslandSelect: (island: string) => void;
}

const islands = [
  {
    id: "games",
    label: "Play Isle",
    description: "Fun games & emotion learning",
    icon: Gamepad2,
    color: "from-coral/30 to-palm/30",
    activities: "Explore interactive games for mental wellness."
  },
  {
    id: "quizzes",
    label: "Quiz Cove",
    description: "Test your knowledge on psychological health",
    icon: HelpCircle,
    color: "from-sky/30 to-indigo/30",
    activities: "Multiple choice quizzes & self-assessments."
  },
  {
    id: "lessons",
    label: "Lesson Lagoon",
    description: "Learn skills for a healthier mind",
    icon: BookOpen,
    color: "from-primary/30 to-sunset-purple/30",
    activities: "Guided lessons on stress, relationships, and mindfulness."
  }
];

export default function IslandSelector({ onIslandSelect }: IslandSelectorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-full px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gradient-ocean mb-4 font-nunito">
            MHapa
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Your mental wellness adventure awaits! 🏝️
          </p>
          <p className="text-lg text-muted-foreground">
            Choose an island to begin your journey
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {islands.map((island) => {
            const IconComponent = island.icon;
            return (
              <Card 
                key={island.id} 
                className="island-card cursor-pointer"
                onClick={() => onIslandSelect(island.id)}
              >
                <div className={`w-full h-full p-6 bg-gradient-to-br ${island.color} rounded-3xl`}>
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="activity-bubble">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-card-foreground font-nunito">
                        {island.label}
                      </h3>
                      <p className="text-sm text-muted-foreground font-medium">
                        {island.description}
                      </p>
                    </div>
                    
                    <p className="text-sm text-card-foreground opacity-80 leading-relaxed">
                      {island.activities}
                    </p>
                    
                    <Button className="ocean-button w-full">
                      Sail to Island
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            🌊 Dive into activities designed just for you
          </p>
        </div>
      </div>
    </div>
  );
}