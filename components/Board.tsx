import React, { useMemo, useState, useEffect } from 'react';
import { RoundedBox, Text } from '@react-three/drei';
import { Obstacle } from '../App';

// Fix for TypeScript: Augment both React module and global JSX namespace
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      meshStandardMaterial: any;
      mesh: any;
      boxGeometry: any;
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      meshStandardMaterial: any;
      mesh: any;
      boxGeometry: any;
    }
  }
}

interface BoardProps {
  color1: string;
  color2: string;
  size: number;
  obstacles: Obstacle[];
  onSquareClick: (x: number, z: number) => void;
  onSelectionEnd: (start: {x: number, z: number}, end: {x: number, z: number}) => void;
  showLabels: boolean;
  isPlacingAgent: boolean;
}

export const Board: React.FC<BoardProps> = ({ color1, color2, size, obstacles, onSquareClick, onSelectionEnd, showLabels, isPlacingAgent }) => {
  const squareSize = 1.5;
  const height = 0.5;
  const offset = (size * squareSize) / 2 - squareSize / 2;

  // Selection State
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{x: number, z: number} | null>(null);
  const [dragEnd, setDragEnd] = useState<{x: number, z: number} | null>(null);

  // Determine Selection Mode based on the start block
  const selectionMode = useMemo(() => {
    if (!dragStart) return 'none';
    const startHasObstacle = obstacles.some(o => o.x === dragStart.x && o.z === dragStart.z);
    return startHasObstacle ? 'remove' : 'add';
  }, [dragStart, obstacles]);

  // Global mouse up handler to finish dragging even if mouse leaves squares
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging && dragStart && dragEnd) {
        setIsDragging(false);
        onSelectionEnd(dragStart, dragEnd);
        setDragStart(null);
        setDragEnd(null);
      } else if (isDragging) {
        // Cancel drag if invalid
        setIsDragging(false);
        setDragStart(null);
        setDragEnd(null);
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragging, dragStart, dragEnd, onSelectionEnd]);
  
  // Generate grid positions and colors
  const squares = useMemo(() => {
    const grid = [];

    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++) {
        const isBlack = (x + z) % 2 === 1;
        const tileColor = isBlack ? color2 : color1;
        const labelColor = isBlack ? color1 : color2; 

        grid.push({
          x,
          z,
          position: [x * squareSize - offset, 0, z * squareSize - offset] as [number, number, number],
          color: tileColor,
          labelColor: labelColor,
          key: `${x}-${z}`,
          coord: `${String.fromCharCode(65 + x)}${z + 1}`
        });
      }
    }
    return grid;
  }, [color1, color2, size, offset]);

  const isSquareInSelection = (x: number, z: number) => {
    if (!isDragging || !dragStart || !dragEnd) return false;
    const minX = Math.min(dragStart.x, dragEnd.x);
    const maxX = Math.max(dragStart.x, dragEnd.x);
    const minZ = Math.min(dragStart.z, dragEnd.z);
    const maxZ = Math.max(dragStart.z, dragEnd.z);
    return x >= minX && x <= maxX && z >= minZ && z <= maxZ;
  };

  return (
    <group>
      {/* The squares */}
      {squares.map((square) => {
        const inSelection = isSquareInSelection(square.x, square.z);
        const hasObstacle = obstacles.some(o => o.x === square.x && o.z === square.z);
        
        // Determine highlighting logic
        let isHighlighted = false;
        let highlightColor = "#000000";

        if (inSelection) {
            if (selectionMode === 'add' && !hasObstacle) {
                isHighlighted = true;
                highlightColor = "#4f46e5"; // Blue for add
            } else if (selectionMode === 'remove' && hasObstacle) {
                isHighlighted = true;
                highlightColor = "#ef4444"; // Red for remove
            }
        }
        
        return (
          <group 
            key={square.key} 
            position={square.position}
            onClick={(e) => {
              e.stopPropagation();
              // Always trigger click logic (which handles single placement)
              onSquareClick(square.x, square.z);
            }}
            onPointerDown={(e) => {
              e.stopPropagation(); 
              // Disable dragging start if placing agent
              if (isPlacingAgent) return;

              if (e.button === 0) { // Left click only
                setIsDragging(true);
                setDragStart({ x: square.x, z: square.z });
                setDragEnd({ x: square.x, z: square.z });
              }
            }}
            onPointerEnter={(e) => {
              if (isDragging) {
                setDragEnd({ x: square.x, z: square.z });
              }
            }}
          >
            <RoundedBox
              args={[squareSize, height, squareSize]}
              radius={0.05}
              smoothness={4}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial 
                color={square.color} 
                roughness={1} 
                metalness={0.0}
                emissive={highlightColor}
                emissiveIntensity={isHighlighted ? 0.5 : 0}
              />
            </RoundedBox>

            {/* Coordinates Text */}
            {showLabels && (
               <Text
               position={[0, height / 2 + 0.01, 0]}
               rotation={[-Math.PI / 2, 0, 0]}
               fontSize={squareSize * 0.4}
               color={square.labelColor}
               font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
               anchorX="center"
               anchorY="middle"
             >
               {square.coord}
             </Text>
            )}
          </group>
        );
      })}

      {/* The Obstacles */}
      {obstacles.map((obs) => {
        const xPos = obs.x * squareSize - offset;
        const zPos = obs.z * squareSize - offset;
        const obstacleSize = squareSize;
        const yPos = (height / 2) + (obstacleSize / 2); 

        return (
          <mesh 
            key={obs.id} 
            position={[xPos, yPos, zPos]} 
            castShadow 
            receiveShadow
            onClick={(e) => {
              e.stopPropagation();
              // Allow starting drag on obstacle if not placing agent
              // But also allow clicking to remove logic if implemented in App.tsx
              onSquareClick(obs.x, obs.z); 
            }}
            onPointerEnter={(e) => {
               // Allow drag over obstacle to update end position
               if (isDragging) {
                 e.stopPropagation();
                 setDragEnd({ x: obs.x, z: obs.z });
               }
            }}
            onPointerDown={(e) => {
                e.stopPropagation();
                if (isPlacingAgent) return;
                
                if (e.button === 0) {
                    setIsDragging(true);
                    setDragStart({ x: obs.x, z: obs.z });
                    setDragEnd({ x: obs.x, z: obs.z });
                }
            }}
          >
            <boxGeometry args={[obstacleSize, obstacleSize, obstacleSize]} />
            <meshStandardMaterial 
              color="#8B4513" 
              roughness={0.8}
              metalness={0.1}
            />
          </mesh>
        );
      })}
    </group>
  );
};