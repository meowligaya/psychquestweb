import { useState } from "react";
import IslandSelector from "../components/IslandSelector";
import IslandDashboard from "../components/IslandDashboard";
import ChatBot from "../components/ChatBot";

const Index = () => {
  const [selectedIsland, setSelectedIsland] = useState<string | null>(null);

  const handleIslandSelect = (island: string) => {
    setSelectedIsland(island);
  };

  return (
    <div className="min-h-screen">
      {!selectedIsland ? (
        <IslandSelector onIslandSelect={handleIslandSelect} />
      ) : (
        <>
          <IslandDashboard island={selectedIsland} />
          <ChatBot />
        </>
      )}
    </div>
  );
};

export default Index;