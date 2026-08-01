import React, { useRef } from "react";
import { useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";

export interface EdgarCharacter3DProps {
  height?: number;
  width?: number;
  frame?: number;
  pose?: "idle" | "attack" | "super_vault" | "thumbs_down" | "cross_arms" | "run";
  attackProgress?: number;
  jumpProgress?: number;
  walkCycle?: number;
  rotationY?: number; // 3D Y-axis character rotation (0 = front, Math.PI/2 = side, etc.)
  style?: React.CSSProperties;
}

// Three.js 3D Mesh Component for Edgar
const Edgar3DMesh: React.FC<{
  frame: number;
  pose: string;
  attackProgress: number;
  jumpProgress: number;
  walkCycle: number;
  rotationY: number;
}> = ({ frame, pose, attackProgress, jumpProgress, walkCycle, rotationY }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Jump vault parabola
  const vaultY = jumpProgress > 0 ? Math.sin(jumpProgress * Math.PI) * 4.5 : 0;
  const breath = Math.sin(frame * 0.08) * 0.08;

  // Walk cycle joint angles
  const walk = walkCycle || (pose === "run" ? (frame * 0.2) % 1 : 0);
  const legSin = Math.sin(walk * Math.PI * 2);

  const leftThighRotX = jumpProgress > 0 ? -0.4 : legSin * 0.5;
  const leftShinRotX = jumpProgress > 0 ? 0.8 : Math.max(0, legSin * 0.6);

  const rightThighRotX = jumpProgress > 0 ? 0.4 : -legSin * 0.5;
  const rightShinRotX = jumpProgress > 0 ? 0.6 : Math.max(0, -legSin * 0.6);

  // Scarf punch 3D extension
  const punchExt = attackProgress > 0 ? Math.sin(attackProgress * Math.PI) * 2.2 : (pose === "attack" ? Math.sin(frame * 0.4) * 1.2 : 0);

  return (
    <group ref={groupRef} position={[0, vaultY + breath - 1.2, 0]} rotation={[0, rotationY, 0]}>
      {/* 3D Shadows */}
      <mesh position={[0, -0.05 - vaultY, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.2 * (1 - jumpProgress * 0.4), 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35 * (1 - jumpProgress * 0.4)} />
      </mesh>

      {/* 3D Head & Emo Hair */}
      <group position={[0, 2.6, 0]}>
        {/* Head Base */}
        <mesh castShadow position={[0, 0, 0]}>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshStandardMaterial color="#FFF7ED" roughness={0.4} />
        </mesh>
        {/* Left Eye */}
        <mesh position={[-0.25, 0.05, 0.62]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#09090B" />
        </mesh>
        <mesh position={[-0.27, 0.09, 0.7]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>

        {/* Emo Swept Dark Hair (3D Mesh) */}
        <mesh castShadow position={[0.1, 0.35, 0.15]} rotation={[0.2, 0.1, -0.3]}>
          <boxGeometry args={[1.4, 0.8, 1.3]} />
          <meshStandardMaterial color="#18181B" roughness={0.2} />
        </mesh>
        {/* Front Bang covering right eye */}
        <mesh castShadow position={[0.25, -0.05, 0.6]} rotation={[0.3, -0.2, -0.4]}>
          <coneGeometry args={[0.5, 0.9, 4]} />
          <meshStandardMaterial color="#27272A" roughness={0.2} />
        </mesh>
      </group>

      {/* 3D Scarf (Iconic Living Scarf & 3D Fists) */}
      <group position={[0, 2.05, 0]}>
        {/* Collar Collar */}
        <mesh castShadow>
          <torusGeometry args={[0.65, 0.24, 16, 32]} />
          <meshStandardMaterial color="#581C87" roughness={0.3} />
        </mesh>
        {/* Left Scarf Arm */}
        <mesh castShadow position={[-0.7 - punchExt * 0.5, -0.3, punchExt * 0.8]} rotation={[0.2, 0.4, 0.3]}>
          <cylinderGeometry args={[0.18, 0.22, 1.2 + punchExt, 16]} />
          <meshStandardMaterial color="#4C1D95" roughness={0.3} />
        </mesh>
        <mesh castShadow position={[-0.9 - punchExt, -0.7, 0.2 + punchExt * 0.8]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#581C87" roughness={0.3} />
        </mesh>

        {/* Right Scarf Arm */}
        <mesh castShadow position={[0.7 + punchExt * 0.5, -0.3, punchExt * 0.8]} rotation={[0.2, -0.4, -0.3]}>
          <cylinderGeometry args={[0.18, 0.22, 1.2 + punchExt, 16]} />
          <meshStandardMaterial color="#4C1D95" roughness={0.3} />
        </mesh>
        <mesh castShadow position={[0.9 + punchExt, -0.7, 0.2 + punchExt * 0.8]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#581C87" roughness={0.3} />
        </mesh>
      </group>

      {/* 3D Torso & Red Vest */}
      <group position={[0, 1.45, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.9, 1.0, 0.6]} />
          <meshStandardMaterial color="#27272A" />
        </mesh>
        {/* Red Vest Overlay */}
        <mesh castShadow position={[0, 0, 0.05]}>
          <boxGeometry args={[0.96, 1.02, 0.55]} />
          <meshStandardMaterial color="#DC2626" roughness={0.5} />
        </mesh>
        {/* Spiked Belt */}
        <mesh castShadow position={[0, -0.48, 0]}>
          <boxGeometry args={[1.02, 0.2, 0.65]} />
          <meshStandardMaterial color="#18181B" metalness={0.5} />
        </mesh>
      </group>

      {/* 3D Left Arm & Purple Glove */}
      <group position={[-0.6, 1.7, 0]} rotation={[0, 0, 0.2]}>
        <mesh castShadow position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.6, 16]} />
          <meshStandardMaterial color="#27272A" />
        </mesh>
        {/* Forearm & Glove */}
        <mesh castShadow position={[0, -0.7, 0]}>
          <cylinderGeometry args={[0.16, 0.18, 0.45, 16]} />
          <meshStandardMaterial color="#6B21A8" roughness={0.3} />
        </mesh>
      </group>

      {/* 3D Right Arm & Purple Glove */}
      <group position={[0.6, 1.7, 0]} rotation={[0, 0, -0.2]}>
        <mesh castShadow position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.6, 16]} />
          <meshStandardMaterial color="#27272A" />
        </mesh>
        {/* Forearm & Glove */}
        <mesh castShadow position={[0, -0.7, 0]}>
          <cylinderGeometry args={[0.16, 0.18, 0.45, 16]} />
          <meshStandardMaterial color="#6B21A8" roughness={0.3} />
        </mesh>
      </group>

      {/* 3D Multi-Node Jointed Left Leg */}
      <group position={[-0.28, 0.95, 0]} rotation={[leftThighRotX, 0, 0]}>
        {/* Thigh */}
        <mesh castShadow position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.18, 0.16, 0.6, 16]} />
          <meshStandardMaterial color="#18182B" />
        </mesh>
        {/* Knee Joint -> Shin & Shoe */}
        <group position={[0, -0.6, 0]} rotation={[leftShinRotX, 0, 0]}>
          <mesh castShadow position={[0, -0.28, 0]}>
            <cylinderGeometry args={[0.15, 0.14, 0.55, 16]} />
            <meshStandardMaterial color="#18182B" />
          </mesh>
          {/* Sneaker */}
          <mesh castShadow position={[0, -0.58, 0.1]}>
            <boxGeometry args={[0.34, 0.24, 0.55]} />
            <meshStandardMaterial color="#3B82F6" roughness={0.4} />
          </mesh>
        </group>
      </group>

      {/* 3D Multi-Node Jointed Right Leg */}
      <group position={[0.28, 0.95, 0]} rotation={[rightThighRotX, 0, 0]}>
        {/* Thigh */}
        <mesh castShadow position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.18, 0.16, 0.6, 16]} />
          <meshStandardMaterial color="#18182B" />
        </mesh>
        {/* Knee Joint -> Shin & Shoe */}
        <group position={[0, -0.6, 0]} rotation={[rightShinRotX, 0, 0]}>
          <mesh castShadow position={[0, -0.28, 0]}>
            <cylinderGeometry args={[0.15, 0.14, 0.55, 16]} />
            <meshStandardMaterial color="#18182B" />
          </mesh>
          {/* Sneaker */}
          <mesh castShadow position={[0, -0.58, 0.1]}>
            <boxGeometry args={[0.34, 0.24, 0.55]} />
            <meshStandardMaterial color="#3B82F6" roughness={0.4} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// Remotion 3D Canvas Wrapper Component
export const EdgarCharacter3D: React.FC<EdgarCharacter3DProps> = ({
  height = 420,
  width,
  frame: overrideFrame,
  pose = "idle",
  attackProgress = 0,
  jumpProgress = 0,
  walkCycle = 0,
  rotationY = 0,
  style,
}) => {
  const currentFrame = useCurrentFrame();
  const frame = overrideFrame !== undefined ? overrideFrame : currentFrame;
  const calculatedWidth = width || height * 0.85;

  return (
    <div style={{ width: calculatedWidth, height, position: "relative", ...style }}>
      <ThreeCanvas
        width={calculatedWidth}
        height={height}
        camera={{ position: [0, 1.8, 6.5], fov: 45 }}
        style={{ width: "100%", height: "100%" }}
      >
        {/* 3D Lighting Environment */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
        <directionalLight position={[-5, 3, -4]} intensity={0.4} color="#A855F7" />
        <pointLight position={[0, 4, 3]} intensity={0.5} />

        {/* 3D Character Mesh */}
        <Edgar3DMesh
          frame={frame}
          pose={pose}
          attackProgress={attackProgress}
          jumpProgress={jumpProgress}
          walkCycle={walkCycle}
          rotationY={rotationY}
        />
      </ThreeCanvas>
    </div>
  );
};
