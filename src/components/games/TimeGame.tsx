import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Clock, CheckCircle } from "lucide-react";

const tasks = [
  { name: "Morning Exercise", time: 30, category: "Health", priority: "high" },
  { name: "Check Emails", time: 15, category: "Work", priority: "medium" },
  { name: "Lunch Break", time: 45, category: "Personal", priority: "high" },
  { name: "Project Planning", time: 60, category: "Work", priority: "high" },
  { name: "Social Media", time: 20, category: "Entertainment", priority: "low" },
  { name: "Learning Session", time: 40, category: "Education", priority: "medium" }
];

export default function TimeGame() {
  const [selectedTasks, setSelectedTasks] = useState<typeof tasks>([]);
  const [timeRemaining, setTimeRemaining] = useState(240); // 4 hours in minutes
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);

  const startGame = () => {
    setGameStarted(true);
    setSelectedTasks([]);
    setTimeRemaining(240);
    setScore(0);
  };

  const addTask = (task: typeof tasks[0]) => {
    if (timeRemaining >= task.time) {
      setSelectedTasks([...selectedTasks, task]);
      setTimeRemaining(timeRemaining - task.time);
      
      // Calculate score based on priority
      const points = task.priority === 'high' ? 30 : task.priority === 'medium' ? 20 : 10;
      setScore(score + points);
      
      toast.success(`Added ${task.name}! +${points} points`);
    } else {
      toast.error("Not enough time for this task!");
    }
  };

  const removeTask = (taskIndex: number) => {
    const task = selectedTasks[taskIndex];
    setSelectedTasks(selectedTasks.filter((_, index) => index !== taskIndex));
    setTimeRemaining(timeRemaining + task.time);
    
    const points = task.priority === 'high' ? 30 : task.priority === 'medium' ? 20 : 10;
    setScore(Math.max(0, score - points));
  };

  const finishDay = () => {
    const highPriorityTasks = selectedTasks.filter(task => task.priority === 'high').length;
    const bonus = highPriorityTasks * 10;
    const finalScore = score + bonus;
    
    toast.success(`Day completed! Final score: ${finalScore} (Bonus: +${bonus})`);
    setGameStarted(false);
  };

  const priorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const timeProgress = ((240 - timeRemaining) / 240) * 100;

  return (
    <Card className="island-card p-6">
      <div>
        <h3 className="text-2xl font-bold mb-4 font-nunito">Time Management Challenge</h3>
        
        {!gameStarted ? (
          <div className="text-center">
            <div className="text-6xl mb-4">⏰</div>
            <p className="text-muted-foreground mb-4">
              Plan your perfect day! You have 4 hours to allocate wisely.
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
                <h4 className="font-semibold mb-3">Available Tasks</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {tasks.map((task, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{task.name}</div>
                        <div className="text-sm text-muted-foreground">{task.time} min • {task.category}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={priorityColor(task.priority)} variant="secondary">
                          {task.priority}
                        </Badge>
                        <Button 
                          size="sm" 
                          onClick={() => addTask(task)}
                          disabled={timeRemaining < task.time}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Your Schedule</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedTasks.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No tasks scheduled yet
                    </p>
                  ) : (
                    selectedTasks.map((task, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <div>
                            <div className="font-medium">{task.name}</div>
                            <div className="text-sm text-muted-foreground">{task.time} min</div>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => removeTask(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))
                  )}
                </div>
                
                {selectedTasks.length > 0 && (
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