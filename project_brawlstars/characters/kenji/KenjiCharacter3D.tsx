import React, { useRef } from "react";
import { useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";

export interface KenjiCharacter3DProps {
  height?: number;
  width?: number;
  frame?: number;
  pose?: "idle" | "slash" | "sushi_slice" | "victorious" | "run";
  attackProgress?: number;
  superHosomaki?: number;
  walkCycle?: number;
  rotationY?: number;
  style?: React.CSSProperties;
}

const Kenji3DMesh: React.FC<{
  frame: number;
  pose: string;
  attackProgress: number;
  superHosomaki: number;
  walkCycle: number;
  rotationY: number;
}> = ({ frame, pose, attackProgress, superHosomaki, walkCycle, rotationY }) => {
  const groupRef = useRef<THREE.Group>(null);
  const breath = Math.sin(frame * 0.08) * 0.08;

  // Walk cycle
  const walk = walkCycle || (pose === "run" ? (frame * 0.2) % 1 : 0);
  const legSin = Math.sin(walk * Math.PI * 2);

  const leftThighRotX = legSin * 0.5;
  const leftShinRotX = Math.max(0, legSin * 0.6);

  const rightThighRotX = -legSin * 0.5;
  const rightShinRotX = Math.max(0, -legSin * 0.6);

  // Slash arc rotation
  const slashArc = attackProgress > 0 ? -Math.sin(attackProgress * Math.PI) * 1.8 : (pose === "slash" ? Math.sin(frame * 0.4) * 0.5 : 0);

  return (
    <group ref={groupRef} position={[0, breath - 1.2, 0]} rotation={[0, rotationY, 0]}>
      {/* Shadow */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.2, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} />
      </mesh>

      {/* 3D Katana & Sheath */}
      <group position={[0.4, 2.2, -0.2]} rotation={[0.4, 0.2, -0.6 + slashArc]}>
        {/* Blade */}
        <mesh castShadow position={[0, 0.9, 0]}>
          <boxGeometry args={[0.08, 1.8, 0.15]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Guard */}
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[0.3, 0.08, 0.3]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.7} />
        </mesh>
        {/* Hilt */}
        <mesh castShadow position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.5, 16]} />
          <meshStandardMaterial color="#18181B" />
        </mesh>
      </group>

      {/* 3D Head & Topknot */}
      <group position={[0, 2.6, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.65, 32, 32]} />
          <meshStandardMaterial color="#FDE68A" roughness={0.4} />
        </mesh>

        {/* Green Headband */}
        <mesh castShadow position={[0, 0.15, 0]}>
          <torusGeometry args={[0.66, 0.12, 16, 32]} />
          <meshStandardMaterial color="#4D7C0F" roughness={0.3} />
        </mesh>

        {/* Black Topknot Bun */}
        <mesh castShadow position={[0, 0.75, -0.15]}>
          <sphereGeometry args={[0.38, 16, 16]} />
          <meshStandardMaterial color="#0F172A" roughness={0.2} />
        </mesh>
      </group>

      {/* 3D Red Kimono & Green Apron */}
      <group position={[0, 1.45, 0]}>
        {/* Red Octopus Kimono */}
        <mesh castShadow>
          <boxGeometry args={[1.0, 1.05, 0.65]} />
          <meshStandardMaterial color="#DC2626" roughness={0.4} />
        </mesh>
        {/* White Kimono Flap */}
        <mesh castShadow position={[0.22, 0, 0.04]}>
          <boxGeometry args={[0.55, 1.06, 0.6]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.4} />
        </mesh>
        {/* Green Pleated Apron */}
        <mesh castShadow position={[0, -0.4, 0.05]} rotation={[0.1, 0, 0]}>
          <cylinderGeometry args={[0.58, 0.72, 0.6, 16]} />
          <meshStandardMaterial color="#84CC16" roughness={0.5} />
        </mesh>
      </group>

      {/* 3D Left Leg */}
      <group position={[-0.28, 0.95, 0]} rotation={[leftThighRotX, 0, 0]}>
        <mesh castShadow position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.18, 0.16, 0.6, 16]} />
          <meshStandardMaterial color="#F8FAFC" />
        </mesh>
        <group position={[0, -0.6, 0]} rotation={[leftShinRotX, 0, 0]}>
          <mesh castShadow position={[0, -0.28, 0]}>
            <cylinderGeometry args={[0.15, 0.14, 0.55, 16]} />
            <meshStandardMaterial color="#F8FAFC" />
          </mesh>
          <mesh castShadow position={[0, -0.55, 0.08]}>
            <boxGeometry args={[0.32, 0.18, 0.5]} />
            <meshStandardMaterial color="#18181B" />
          </mesh>
        </group>
      </group>

      {/* 3D Right Leg */}
      <group position={[0.28, 0.95, 0]} rotation={[rightThighRotX, 0, 0]}>
        <mesh castShadow position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.18, 0.16, 0.6, 16]} />
          <meshStandardMaterial color="#F8FAFC" />
        </mesh>
        <group position={[0, -0.6, 0]} rotation={[rightShinRotX, 0, 0]}>
          <mesh castShadow position={[0, -0.28, 0]}>
            <cylinderGeometry args={[0.15, 0.14, 0.55, 16]} />
            <meshStandardMaterial color="#F8FAFC" />
          </mesh>
          <mesh castShadow position={[0, -0.55, 0.08]}>
            <boxGeometry args={[0.32, 0.18, 0.5]} />
            <meshStandardMaterial color="#18181B" />
          </mesh>
        </group>
      </group>
    </group>
  );
};

export const KenjiCharacter3D: React.FC<KenjiCharacter3DProps> = ({
  height = 420,
  width,
  frame: overrideFrame,
  pose = "idle",
  attackProgress = 0,
  superHosomaki = 0,
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
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
        <directionalLight position={[-5, 3, -4]} intensity={0.4} color="#84CC16" />
        <pointLight position={[0, 4, 3]} intensity={0.5} />

        <Kenji3DMesh
          frame={frame}
          pose={pose}
          attackProgress={attackProgress}
          superHosomaki={superHosomaki}
          walkCycle={walkCycle}
          rotationY={rotationY}
        />
      </ThreeCanvas>
    </div>
  );
};
