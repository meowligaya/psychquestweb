import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { 
  MapPin, 
  GamepadIcon, 
  BookOpen, 
  Award, 
  MessageCircle,
  User,
  Settings,
  Star,
  Target,
  Brain,
  Play,
  Home
} from "lucide-react";
import GameModal from "./GameModal";
import BreathingModal from "./BreathingModal";
import QuizModal from "./QuizModal";

interface IslandDashboardProps {
  questGroup: string;
  userName?: string;
}

const getQuestGroupContent = (questGroup: string) => {
  const content = {
    emotionExplorer: {
      title: "Emotion Island",
      description: "Learn about feelings and make friends!",
      activities: [
        { name: "Happy Face Hunt", icon: "😊", progress: 75, type: "game" },
        { name: "Kindness Quest", icon: "❤️", progress: 25, type: "lesson" }
      ],
      achievements: ["First Smile", "Emotion Expert", "Helper Hero"]
    },
    mindMaster: {
      title: "Resilience Archipelago", 
      description: "Navigate life's waves with confidence",
      activities: [
        { name: "Memoji Match", icon: "🧠", progress: 60, type: "game" },
        { name: "Friendship Bridge", icon: "🌉", progress: 80, type: "lesson" }
      ],
      achievements: ["Stress Warrior", "Choice Champion", "Social Navigator"]
    },
    timeTactician: {
      title: "Growth Peninsula",
      description: "Building your future, one step at a time", 
      activities: [
        { name: "Time Treasures", icon: "⏰", progress: 45, type: "game" },
        { name: "Independence Island", icon: "🗽", progress: 35, type: "lesson" }
      ],
      achievements: ["Time Master", "Goal Crusher", "Independence Hero"]
    },
    mindfulSage: {
      title: "Mindful Sanctuary",
      description: "Find balance in life's complexity",
      activities: [
        { name: "Mindful Moments", icon: "🧠", progress: 55, type: "game" },
        { name: "Wisdom Waves", icon: "🌊", progress: 40, type: "lesson" }
      ],
      achievements: ["Zen Master", "Balance Keeper", "Wisdom Guardian"]
    },
    quizCove: {
      title: "Quiz Cove",
      description: "Test your knowledge on psychological health!",
      activities: [
        { name: "Stress Awareness Quiz", icon: "❓", progress: 0, type: "quiz" },      
      ],
      achievements: ["Quiz Novice", "Psych Health Pro", "Mind Master"]
    }
  };
  
  return content[questGroup as keyof typeof content] || content.emotionExplorer;
};

export default function IslandDashboard({ questGroup, userName = "Explorer" }: IslandDashboardProps) {
  const content = getQuestGroupContent(questGroup);
  const navigate = useNavigate();
  const [gameModal, setGameModal] = useState({ isOpen: false, gameType: "", questGroup: "" });
  const [breathingOpen, setBreathingOpen] = useState(false);
  const [quizModal, setQuizModal] = useState({ isOpen: false, quizType: "", questGroup: "" });

  return (
    <div className="min-h-screen p-2 sm:p-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gradient-ocean font-nunito break-words">
            Welcome, {userName}! 🏝️
          </h1>
          <p className="text-muted-foreground text-base">Ready for your next adventure?</p>
        </div>
        
        <div className="flex gap-2 sm:gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full"
            onClick={() => navigate(0)}
          >
            <Home className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <User className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Island Overview */}
      <Card className="island-card mb-6 sm:mb-8">
        <div className="text-center p-4 sm:p-8">
          <h2 className="text-2xl sm:text-4xl font-bold text-gradient-sunset mb-2 sm:mb-3 font-nunito break-words">
            {content.title}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6">
            {content.description}
          </p>
          
          <div className="flex justify-center gap-2 sm:gap-4 flex-wrap">
            <Badge variant="secondary" className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm">
              <Star className="w-4 h-4 mr-2" />
              Level 3 Explorer
            </Badge>
            <Badge variant="secondary" className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm">
              <Target className="w-4 h-4 mr-2" />
              5 Quests Completed
            </Badge>
            <Badge variant="secondary" className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm">
              <Award className="w-4 h-4 mr-2" />
              3 Achievements
            </Badge>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Activities Section */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 font-nunito">Your Activities</h3>
            <div className="grid gap-3 sm:gap-4">
              {content.activities.map((activity, index) => (
                <Card key={index} className="island-card">
                  <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 gap-4 sm:gap-0">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="activity-bubble">
                        <span className="text-2xl">{activity.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-base sm:text-lg font-nunito">{activity.name}</h4>
                        <Badge variant={
                          activity.type === 'game' ? 'default' :
                          activity.type === 'lesson' ? 'secondary' :
                          activity.type === 'quiz' ? 'outline' : 'secondary'
                        } className="text-xs sm:text-sm">
                          {activity.type === 'game' && (
                            <><GamepadIcon className="w-3 h-3 mr-1" /> Game</>
                          )}
                          {activity.type === 'lesson' && (
                            <><BookOpen className="w-3 h-3 mr-1" /> Lesson</>
                          )}
                          {activity.type === 'quiz' && (
                            <><Star className="w-3 h-3 mr-1" /> Quiz</>
                          )}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                      <div className="flex-1 sm:flex-none text-right">
                        <div className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                          {activity.progress}% Complete
                        </div>
                        <div className="w-full sm:w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                            style={{ width: `${activity.progress}%` }}
                          />
                        </div>
                      </div>
                      {activity.type === 'game' && (
                        <Button 
                          size="sm" 
                          className="ocean-button"
                          onClick={() => setGameModal({ isOpen: true, gameType: activity.name, questGroup })}
                        >
                          <Play className="w-3 h-3 mr-1" />
                          <span className="hidden xs:inline">Play</span>
                        </Button>
                      )}
                      {activity.type === 'lesson' && (
                        <Link to={`/lesson/${encodeURIComponent(activity.name)}`}>
                          <Button size="sm" className="beach-button">
                            <BookOpen className="w-3 h-3 mr-1" />
                            <span className="hidden xs:inline">View Lesson</span>
                          </Button>
                        </Link>
                      )}
                      {activity.type === 'quiz' && (
                        <Button 
                          size="sm" 
                          className="quiz-button"
                          onClick={() => setQuizModal({ isOpen: true, quizType: activity.name, questGroup })}
                        >
                          <Star className="w-3 h-3 mr-1" />
                          <span className="hidden xs:inline">Start Quiz</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Support Services Map */}
          <Card className="island-card">
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 font-nunito flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Local Support Services
              </h3>
              <div className="h-40 sm:h-64 bg-muted rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto mb-2" />
                  <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
                    Find counseling and support services in Mariveles, Bataan
                  </p>
                  <Button 
                    className="beach-button"
                    onClick={() => navigate('/local-services')}
                  >
                    View Local Services
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar - Progress & Achievements */}
        <div className="space-y-4 sm:space-y-6">
          <Card className="island-card">
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 font-nunito flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Achievements
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {content.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-accent to-primary flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-xs sm:text-sm">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="island-card">
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 font-nunito flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                Daily Wellness
              </h3>
              <div className="space-y-2 sm:space-y-4">
                <div className="text-center p-3 sm:p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl">
                  <p className="text-xl sm:text-2xl mb-2">🌅</p>
                  <p className="font-medium text-base sm:text-lg">Morning Mindfulness</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">4-4-4-4 breathing exercise</p>
                  <Button 
                    size="sm" 
                    className="mt-2 ocean-button"
                    onClick={() => setBreathingOpen(true)}
                  >
                    Start Now
                  </Button>
                </div>
                {/* Breathing modal */}
                <BreathingModal isOpen={breathingOpen} onClose={() => setBreathingOpen(false)} />
              </div>
            </div>
          </Card>

          <Card className="island-card">
            <div className="p-4 sm:p-6 text-center">
              <h3 className="font-bold mb-2 sm:mb-3 font-nunito text-base sm:text-lg">Need to talk?</h3>
              <div className="activity-bubble mb-3 sm:mb-4">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                Our support chatbot is here 24/7
              </p>
              {/* <Button className="beach-button w-full">
                Chat Now
              </Button> */}
            </div>
          </Card>
        </div>
      </div>
      
      <GameModal 
        isOpen={gameModal.isOpen}
        onClose={() => setGameModal({ isOpen: false, gameType: "", questGroup: "" })}
        gameType={gameModal.gameType}
        questGroup={gameModal.questGroup}
      />

      <QuizModal 
        isOpen={quizModal.isOpen}
        onClose={() => setQuizModal({ isOpen: false, quizType: "", questGroup: "" })}
        quizType={quizModal.quizType}
        questGroup={quizModal.questGroup}
      />
    </div>
    
  );
}