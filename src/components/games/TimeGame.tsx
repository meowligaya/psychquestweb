import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Clock, CheckCircle, Heart, BookOpen, Smile } from "lucide-react";

/**
 * Mental Wellness Planner Game
 * Plan a healthy day by scheduling tasks that support your mental health and wellbeing.
 * Each activity includes a mental health benefit. Try to balance your day for the best score!
 */

const activities = [
  {
    name: "Morning Stretch",
    time: 20,
    category: "Physical Wellness",
    priority: "high",
    benefit: "Regular movement can reduce anxiety and boost mood."
  },
  {
    name: "Mindful Breathing",
    time: 10,
    category: "Mindfulness",
    priority: "high",
    benefit: "Mindfulness helps you manage stress and stay grounded."
  },
  {
    name: "Talk to a Friend",
    time: 25,
    category: "Social Connection",
    priority: "medium",
    benefit: "Connecting with others supports emotional wellbeing."
  },
  {
    name: "Read a Book",
    time: 30,
    category: "Relaxation",
    priority: "medium",
    benefit: "Reading can help you relax and escape negative thoughts."
  },
  {
    name: "Healthy Lunch",
    time: 40,
    category: "Nutrition",
    priority: "high",
    benefit: "Eating nutritious meals can improve energy and focus."
  },
  {
    name: "Nature Walk",
    time: 30,
    category: "Self-Care",
    priority: "high",
    benefit: "Spending time outdoors reduces stress and improves mood."
  },
  {
    name: "Short Nap",
    time: 15,
    category: "Rest",
    priority: "low",
    benefit: "Rest helps your brain recharge and recover from stress."
  },
  {
    name: "Journaling",
    time: 20,
    category: "Reflection",
    priority: "medium",
    benefit: "Writing about your feelings can provide clarity and relief."
  },
  {
    name: "Watch a Comedy",
    time: 30,
    category: "Laughter",
    priority: "low",
    benefit: "Laughter releases endorphins and lowers stress levels."
  },
  {
    name: "Gratitude Practice",
    time: 10,
    category: "Mindfulness",
    priority: "medium",
    benefit: "Gratitude boosts positivity and lowers depressive symptoms."
  },
];

const TOTAL_TIME = 240; // 4 hours in minutes

export default function MentalHealthTimeGame() {
  const [selectedActivities, setSelectedActivities] = useState<typeof activities>([]);
  const [timeRemaining, setTimeRemaining] = useState(TOTAL_TIME);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);

  const startGame = () => {
    setGameStarted(true);
    setSelectedActivities([]);
    setTimeRemaining(TOTAL_TIME);
    setScore(0);
  };

  const addActivity = (activity: typeof activities[0]) => {
    if (timeRemaining >= activity.time) {
      setSelectedActivities([...selectedActivities, activity]);
      setTimeRemaining(timeRemaining - activity.time);

      // Score: prioritize high (30), medium (20), low (10), bonus for balance
      const points = activity.priority === 'high' ? 30 : activity.priority === 'medium' ? 20 : 10;
      setScore(score + points);

      toast.success(
        <span>
          Added <strong>{activity.name}</strong>! <br />
          <span className="text-xs italic">{activity.benefit}</span> <br />
          +{points} points
        </span>
      );
    } else {
      toast.error("Not enough time for this activity!");
    }
  };

  const removeActivity = (activityIndex: number) => {
    const activity = selectedActivities[activityIndex];
    setSelectedActivities(selectedActivities.filter((_, index) => index !== activityIndex));
    setTimeRemaining(timeRemaining + activity.time);

    const points = activity.priority === 'high' ? 30 : activity.priority === 'medium' ? 20 : 10;
    setScore(Math.max(0, score - points));
  };

  const finishDay = () => {
    // Score bonuses: at least 1 from each category = +40, at least 1 from each priority = +30
    const categories = new Set(selectedActivities.map(a => a.category));
    const priorities = new Set(selectedActivities.map(a => a.priority));
    let bonus = 0;
    if (
      ["Physical Wellness", "Mindfulness", "Social Connection", "Nutrition", "Self-Care", "Rest", "Reflection", "Laughter", "Relaxation"].every(cat => categories.has(cat) || activities.some(a => a.category === cat && selectedActivities.includes(a)))
    ) {
      bonus += 40;
    }
    if (["high", "medium", "low"].every(prio => priorities.has(prio))) {
      bonus += 30;
    }
    const finalScore = score + bonus;

    toast.success(
      <span>
        <strong>Day completed!</strong> <br />
        Final score: {finalScore} <br />
        (Bonus: +{bonus} for a balanced day)
      </span>
    );
    setGameStarted(false);
  };

  const priorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const categoryIcon = (category: string) => {
    switch (category) {
      case "Physical Wellness": return <Heart className="w-4 h-4 text-red-500" />;
      case "Mindfulness": return <Smile className="w-4 h-4 text-blue-500" />;
      case "Social Connection": return <CheckCircle className="w-4 h-4 text-pink-500" />;
      case "Nutrition": return <Heart className="w-4 h-4 text-green-600" />;
      case "Self-Care": return <Smile className="w-4 h-4 text-teal-500" />;
      case "Rest": return <Clock className="w-4 h-4 text-purple-500" />;
      case "Reflection": return <BookOpen className="w-4 h-4 text-indigo-500" />;
      case "Laughter": return <Smile className="w-4 h-4 text-yellow-500" />;
      case "Relaxation": return <BookOpen className="w-4 h-4 text-cyan-500" />;
      default: return null;
    }
  };

  const timeProgress = ((TOTAL_TIME - timeRemaining) / TOTAL_TIME) * 100;

  return (
    <Card className="island-card p-6">
      <div>
        <h3 className="text-2xl font-bold mb-4 font-nunito">Mental Wellness Planner</h3>

        {!gameStarted ? (
          <div className="text-center">
            <div className="text-6xl mb-4">🧘‍♂️</div>
            <p className="text-muted-foreground mb-4">
              Welcome! Build your mentally healthy day. <br />
              Choose activities for your 4-hour schedule.<br />
              Balance wellness, rest, social time, and self-care for the best score.
            </p>
            <Button onClick={startGame} className="ocean-button">
              Start Planning
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <Badge variant="secondary">Score: {score}</Badge>
              <Badge variant="outline">
                <Clock className="w-3 h-3 mr-1" />
                {Math.floor(timeRemaining / 60)}h {timeRemaining % 60}m left
              </Badge>
            </div>

            <Progress value={timeProgress} className="mb-6" />

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Available Activities</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {activities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="flex items-center gap-2 font-medium">
                          {categoryIcon(activity.category)}
                          {activity.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {activity.time} min • {activity.category}
                        </div>
                        <div className="text-xs mt-1 text-blue-800 italic">
                          {activity.benefit}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={priorityColor(activity.priority)} variant="secondary">
                          {activity.priority}
                        </Badge>
                        <Button
                          size="sm"
                          onClick={() => addActivity(activity)}
                          disabled={timeRemaining < activity.time}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Your Wellness Schedule</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedActivities.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No activities scheduled yet
                    </p>
                  ) : (
                    selectedActivities.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <div>
                            <div className="font-medium">{activity.name}</div>
                            <div className="text-sm text-muted-foreground">{activity.time} min</div>
                            <div className="text-xs mt-1 text-blue-800 italic">{activity.benefit}</div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeActivity(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))
                  )}
                </div>

                {selectedActivities.length > 0 && (
                  <Button
                    className="w-full mt-4 beach-button"
                    onClick={finishDay}
                  >
                    Finish Day
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}