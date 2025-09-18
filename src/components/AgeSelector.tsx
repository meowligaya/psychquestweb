import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Baby, Users, Heart, Briefcase, PersonStanding, Clock1, BrainCog, HelpCircle } from "lucide-react";

interface AgeSelectorProps {
  onAgeSelect: (ageGroup: string) => void;
}

const ageGroups = [
  {
    id: "child",
    label: "Emotion Explorer",
    description: "",
    icon: BrainCog,
    color: "from-coral/30 to-palm/30",
    activities: "Fun games & emotion learning"
  },
  {
    id: "teen", 
    label: "Mind Master",
    description: "",
    icon: Heart,
    color: "from-primary/30 to-sunset-purple/30",
    activities: "Stress management & social skills"
  },
  {
    id: "young-adult",
    label: "Time Tactician", 
    description: "",
    icon: Clock1,
    color: "from-sunset-orange/30 to-coral/30", 
    activities: "Life transitions & relationships"
  },
  {
    id: "adult",
    label: "Mindful Sage",
    description: "",
    icon: Briefcase,
    color: "from-palm/30 to-sky/30",
    activities: "Work-life balance & mindfulness"
  },
  {
    id: "quiz",
    label: "Quiz Cove",
    description: "Test your knowledge on psychological health",
    icon: HelpCircle,
    color: "from-sky/30 to-indigo/30",
    activities: "Multiple choice quizzes & self-assessments"
  }
];

export default function AgeSelector({ onAgeSelect }: AgeSelectorProps) {
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
            Choose a quest to begin your journey
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {ageGroups.map((group) => {
            const IconComponent = group.icon;
            return (
              <Card 
                key={group.id} 
                className="age-group-card cursor-pointer"
                onClick={() => onAgeSelect(group.id)}
              >
                <div className={`w-full h-full p-6 bg-gradient-to-br ${group.color} rounded-3xl`}>
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="activity-bubble">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-card-foreground font-nunito">
                        {group.label}
                      </h3>
                      <p className="text-sm text-muted-foreground font-medium">
                        {group.description}
                      </p>
                    </div>
                    
                    <p className="text-sm text-card-foreground opacity-80 leading-relaxed">
                      {group.activities}
                    </p>
                    
                    <Button className="ocean-button w-full">
                      Start Journey
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