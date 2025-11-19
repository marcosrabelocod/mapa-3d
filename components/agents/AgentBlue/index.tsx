import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Mesh } from 'three';
import { attributesData } from './attributes';

interface AgentBlueProps {
  position: [number, number, number];
  onClick?: () => void;
}

export const AgentBlue: React.FC<AgentBlueProps> = ({ position, onClick }) => {
  const meshRef = useRef<Mesh>(null);
  
  const name = attributesData.name;

  // Animation
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      
      // Slow rotation
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group 
      position={position} 
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {/* Agent Mesh (Cube) */}
      <mesh 
        ref={meshRef} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial 
          color="#3b82f6" // blue-500
          roughness={0.3}
          metalness={0.5}
          emissive="#1d4ed8"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Floating UI (Name Only) */}
      <group position={[0, 1, 0]}>
        <Text
          position={[0, 0.5, 0]} // Raised higher
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {name}
        </Text>
      </group>
    </group>
  );
};