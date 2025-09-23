import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EmotionGame from "./games/EmotionGame";
import StressGame from "./games/StressGame";
import TimeGame from "./games/TimeGame";
import MindfulnessGame from "./games/MindfulnessGame";

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameType: string;
  island: string; // Changed from ageGroup to island
}

export default function GameModal({ isOpen, onClose, gameType, island }: GameModalProps) {
  const getGameComponent = () => {
    // Game selection logic based on island and gameType
    if (island === 'games' && gameType.includes('Happy Face')) {
      return <EmotionGame />;
    }
    if (island === 'games' && gameType.includes('MindMatch')) {
      return <StressGame />;
    }
    if (island === 'games' && gameType.includes('Time')) {
      return <TimeGame />;
    }
    if (island === 'games' && gameType.includes('Mindful')) {
      return <MindfulnessGame />;
    }

    // Fallback: always return EmotionGame for games island
    if (island === 'games') {
      return <EmotionGame />;
    }

    // Other islands do not have games, fallback to EmotionGame as default
    return <EmotionGame />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-nunito text-2xl">
            {gameType}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {getGameComponent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}