import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, ContactShadows, Stars } from '@react-three/drei';
import { MOUSE } from 'three';
import { Board } from './Board';
import { Obstacle, Agent } from '../App';
import { AgentBlue } from './agents/AgentBlue';

// Fix for TypeScript: Augment both React module and global JSX namespace
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      pointLight: any;
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      pointLight: any;
    }
  }
}

interface SceneProps {
  color1: string;
  color2: string;
  size: number;
  obstacles: Obstacle[];
  agents: Agent[];
  onSquareClick: (x: number, z: number) => void;
  onSelectionEnd: (start: {x: number, z: number}, end: {x: number, z: number}) => void;
  showLabels: boolean;
  isPlacingAgent: boolean;
}

export const Scene: React.FC<SceneProps> = ({ color1, color2, size, obstacles, agents, onSquareClick, onSelectionEnd, showLabels, isPlacingAgent }) => {
  
  // Calculate offset to match board logic for agent placement
  const squareSize = 1.5;
  const offset = (size * squareSize) / 2 - squareSize / 2;

  return (
    <Canvas shadows dpr={[1, 2]}>
      <Suspense fallback={null}>
        {/* Camera Configuration */}
        <PerspectiveCamera makeDefault position={[0, size * 1.5, size * 2]} fov={45} />

        {/* Controls: Adjusted mouse buttons */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          mouseButtons={{
            LEFT: undefined, // Remove Zoom/Interact from Left Click to allow Drag Selection
            MIDDLE: MOUSE.PAN, // Middle to Pan
            RIGHT: MOUSE.ROTATE // Right click to Rotate
          }}
          minDistance={2}
          maxDistance={50}
          maxPolarAngle={Math.PI / 2 - 0.1} // Don't go below the board
        />

        {/* Environment & Lighting */}
        <Environment preset="park" />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        {/* The Board 3D Object */}
        <Board 
          color1={color1} 
          color2={color2} 
          size={size} 
          obstacles={obstacles}
          onSquareClick={onSquareClick}
          onSelectionEnd={onSelectionEnd}
          showLabels={showLabels}
          isPlacingAgent={isPlacingAgent}
        />

        {/* Render Agents */}
        {agents.map((agent) => {
          const xPos = agent.x * squareSize - offset;
          const zPos = agent.z * squareSize - offset;
          // Agent sits on top of the board (y=0) + half its height (assuming approx 1 unit height)
          const yPos = 0.25 + 0.4; // 0.25 (half board height) + 0.4 (half agent box height)
          
          return (
             <AgentBlue key={agent.id} position={[xPos, yPos, zPos]} />
          );
        })}

        {/* Floor Shadows */}
        <ContactShadows 
          position={[0, -0.51, 0]} 
          opacity={0.5} 
          scale={size * 3} 
          blur={1.5} 
          far={4.5} 
        />
      </Suspense>
    </Canvas>
  );
};