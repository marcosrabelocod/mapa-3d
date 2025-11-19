import React, { useState } from 'react';
import { Scene } from './components/Scene';
import { Interface } from './components/Interface';

export interface Obstacle {
  x: number;
  z: number;
  id: string;
}

export interface Agent {
  id: string;
  x: number;
  z: number;
  type: 'blue'; // Expansível para outros tipos
}

const App: React.FC = () => {
  // Updated to requested grass colors
  const [boardColor1, setBoardColor1] = useState('#6dc83c'); // Lighter green
  const [boardColor2, setBoardColor2] = useState('#409136'); // Darker green
  const [boardSize, setBoardSize] = useState(8); // Padrão 8x8
  const [showLabels, setShowLabels] = useState(false); // Estado para legendas
  
  // Obstacle State
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  
  // Agents State
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgentType, setSelectedAgentType] = useState<string | null>(null);
  const [selectedAgentInfo, setSelectedAgentInfo] = useState<Agent | null>(null);
  
  // Single interactions
  const [pendingObstacle, setPendingObstacle] = useState<{x: number, z: number} | null>(null);
  const [pendingRemoval, setPendingRemoval] = useState<Obstacle | null>(null);

  // Mass interactions
  const [pendingMassAdd, setPendingMassAdd] = useState<{ obstaclesToAdd: {x: number, z: number}[] } | null>(null);
  const [pendingMassRemove, setPendingMassRemove] = useState<{ obstaclesToRemove: Obstacle[] } | null>(null);

  const handleAgentClick = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      setSelectedAgentInfo(agent);
      
      // Reset other interaction modes without clearing the agent info
      setPendingObstacle(null);
      setPendingRemoval(null);
      setPendingMassAdd(null);
      setPendingMassRemove(null);
    }
  };

  const handleRemoveAgent = (agentId: string) => {
    setAgents(prev => prev.filter(a => a.id !== agentId));
    setSelectedAgentInfo(null);
  };

  const handleSquareClick = (x: number, z: number) => {
    // Clear agent selection when clicking on the board
    setSelectedAgentInfo(null);

    // --- AGENT PLACEMENT MODE ---
    if (selectedAgentType) {
      // Check if spot is valid (no obstacle, no agent)
      const hasObstacle = obstacles.some(obs => obs.x === x && obs.z === z);
      const hasAgent = agents.some(a => a.x === x && a.z === z);

      if (!hasObstacle && !hasAgent) {
        const newAgent: Agent = {
          id: `agent-${Date.now()}`,
          x,
          z,
          type: selectedAgentType as 'blue'
        };
        setAgents(prev => [...prev, newAgent]);
        setSelectedAgentType(null); // Deselect after placement
      } else {
        // Optional: Feedback that placement is invalid
        console.log("Invalid placement position");
      }
      return; // Stop execution so we don't trigger obstacle logic
    }

    // --- OBSTACLE MODE (Default) ---
    // Check if obstacle already exists at this location
    const existing = obstacles.find(obs => obs.x === x && obs.z === z);
    
    if (existing) {
      // If exists, ask to remove
      setPendingRemoval(existing);
      setPendingObstacle(null);
      setPendingMassAdd(null);
      setPendingMassRemove(null);
    } else {
      // If empty, ask to add
      setPendingObstacle({ x, z });
      setPendingRemoval(null);
      setPendingMassAdd(null);
      setPendingMassRemove(null);
    }
  };

  const handleSelectionEnd = (start: {x: number, z: number}, end: {x: number, z: number}) => {
    // If in agent placement mode, ignore drag selections
    if (selectedAgentType) return;

    // If start and end are the same, treat as a click
    if (start.x === end.x && start.z === end.z) {
      handleSquareClick(start.x, start.z);
      return;
    }

    // Determine logic based on the FIRST block clicked (Start)
    const startHasObstacle = obstacles.some(obs => obs.x === start.x && obs.z === start.z);

    // Calculate range
    const minX = Math.min(start.x, end.x);
    const maxX = Math.max(start.x, end.x);
    const minZ = Math.min(start.z, end.z);
    const maxZ = Math.max(start.z, end.z);

    if (startHasObstacle) {
      // REMOVAL MODE: Select only existing obstacles in range
      const toRemove: Obstacle[] = [];
      for (let x = minX; x <= maxX; x++) {
        for (let z = minZ; z <= maxZ; z++) {
          const existing = obstacles.find(obs => obs.x === x && obs.z === z);
          if (existing) {
            toRemove.push(existing);
          }
        }
      }
      
      if (toRemove.length > 0) {
        setPendingMassRemove({ obstaclesToRemove: toRemove });
        setPendingObstacle(null);
        setPendingRemoval(null);
        setPendingMassAdd(null);
        setSelectedAgentInfo(null);
      }

    } else {
      // ADDITION MODE: Select only empty spots in range
      const newObstaclesPosition: {x: number, z: number}[] = [];
      for (let x = minX; x <= maxX; x++) {
        for (let z = minZ; z <= maxZ; z++) {
          const exists = obstacles.some(obs => obs.x === x && obs.z === z);
          if (!exists) {
            newObstaclesPosition.push({ x, z });
          }
        }
      }

      if (newObstaclesPosition.length > 0) {
        setPendingMassAdd({ obstaclesToAdd: newObstaclesPosition });
        setPendingObstacle(null);
        setPendingRemoval(null);
        setPendingMassRemove(null);
        setSelectedAgentInfo(null);
      }
    }
  };

  const confirmAddObstacle = () => {
    if (pendingObstacle) {
      setObstacles(prev => [
        ...prev, 
        { x: pendingObstacle.x, z: pendingObstacle.z, id: `${pendingObstacle.x}-${pendingObstacle.z}` }
      ]);
      setPendingObstacle(null);
    }
  };

  const confirmMassAdd = () => {
    if (pendingMassAdd) {
      const newObs = pendingMassAdd.obstaclesToAdd.map(p => ({
        x: p.x,
        z: p.z,
        id: `${p.x}-${p.z}`
      }));
      setObstacles(prev => [...prev, ...newObs]);
      setPendingMassAdd(null);
    }
  };

  const confirmRemoveObstacle = () => {
    if (pendingRemoval) {
      setObstacles(prev => prev.filter(obs => obs.id !== pendingRemoval.id));
      setPendingRemoval(null);
    }
  };

  const confirmMassRemove = () => {
    if (pendingMassRemove) {
      const idsToRemove = new Set(pendingMassRemove.obstaclesToRemove.map(o => o.id));
      setObstacles(prev => prev.filter(obs => !idsToRemove.has(obs.id)));
      setPendingMassRemove(null);
    }
  };

  const cancelInteraction = () => {
    setPendingObstacle(null);
    setPendingRemoval(null);
    setPendingMassAdd(null);
    setPendingMassRemove(null);
    setSelectedAgentInfo(null);
  };

  const clearAgents = () => {
    setAgents([]);
    setSelectedAgentInfo(null);
  };

  // Clear obstacles when resizing board
  const handleResize = (newSize: number) => {
    setBoardSize(newSize);
    setObstacles([]); 
    setAgents([]);
    cancelInteraction();
  };

  return (
    <div className="relative w-full h-full bg-slate-900">
      {/* 3D Scene Container */}
      <div className="absolute inset-0 z-0">
        <Scene 
          color1={boardColor1} 
          color2={boardColor2} 
          size={boardSize} 
          obstacles={obstacles}
          agents={agents}
          onSelectionEnd={handleSelectionEnd}
          onSquareClick={handleSquareClick} 
          onAgentClick={handleAgentClick}
          showLabels={showLabels}
          isPlacingAgent={!!selectedAgentType}
        />
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <Interface 
          color1={boardColor1} 
          setColor1={setBoardColor1}
          color2={boardColor2} 
          setColor2={setBoardColor2}
          size={boardSize}
          setSize={handleResize}
          
          pendingObstacle={pendingObstacle}
          onConfirmObstacle={confirmAddObstacle}
          
          pendingRemoval={pendingRemoval}
          onConfirmRemove={confirmRemoveObstacle}
          
          pendingMassAdd={pendingMassAdd}
          onConfirmMassAdd={confirmMassAdd}

          pendingMassRemove={pendingMassRemove}
          onConfirmMassRemove={confirmMassRemove}
          
          onCancel={cancelInteraction}

          showLabels={showLabels}
          setShowLabels={setShowLabels}

          selectedAgentType={selectedAgentType}
          onSelectAgentType={setSelectedAgentType}
          onClearAgents={clearAgents}
          agentCount={agents.length}

          selectedAgentInfo={selectedAgentInfo}
          onRemoveAgent={handleRemoveAgent}
        />
      </div>
    </div>
  );
};

export default App;