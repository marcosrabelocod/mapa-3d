import React from 'react';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh } from 'three';

/**
 * ==============================================================================
 * INSTRUÇÕES PARA CRIAÇÃO DE AGENTES (COMPONENTE DE MAPA)
 * ==============================================================================
 * 
 * 1. Estrutura do Componente:
 *    Todo agente deve ser um componente funcional React que aceita props de posicionamento.
 *    Geralmente recebem `position: [x, y, z]` para se localizarem no mundo 3D.
 * 
 * 2. Geometria e Material:
 *    - Para protótipos simples: Use primitivos do Three.js (boxGeometry, sphereGeometry).
 *    - Para modelos complexos: Use o hook `useGLTF` do @react-three/drei para carregar arquivos .glb/.gltf.
 * 
 * 3. Interatividade:
 *    - Adicione eventos como onClick ou onPointerOver na <mesh> se o agente for clicável.
 *    - Use useRef para acessar a malha (mesh) diretamente se precisar de animações manuais.
 * 
 * 4. Animação (Loop de Renderização):
 *    - Use o hook `useFrame((state, delta) => { ... })` para executar lógica a cada frame 
 *      (ex: rotação constante, "respiração", movimento interpolado).
 * 
 * 5. Exemplo de Props Típicas:
 *    interface AgentProps {
 *      position: [number, number, number];
 *      rotation?: [number, number, number];
 *      color?: string;
 *      scale?: number;
 *    }
 * 
 * ==============================================================================
 */

interface AgentBlueProps {
  position: [number, number, number];
}

export const AgentBlue: React.FC<AgentBlueProps> = ({ position }) => {
  const meshRef = useRef<Mesh>(null);

  // Exemplo de animação simples: O cubo flutua levemente e gira
  useFrame((state) => {
    if (meshRef.current) {
      // Oscilação vertical (Levitação)
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      
      // Rotação lenta
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      position={position} 
      castShadow 
      receiveShadow
    >
      {/* Geometria de Cubo 1x1x1 (mesmo tamanho dos obstáculos/quadrados base) */}
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      
      {/* Material Azul Padrão */}
      <meshStandardMaterial 
        color="#3b82f6" // blue-500
        roughness={0.3}
        metalness={0.5}
        emissive="#1d4ed8"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};
