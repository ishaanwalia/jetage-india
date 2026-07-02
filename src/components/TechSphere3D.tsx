"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Float, MeshDistortMaterial, Environment } from "@react-three/drei";
import * as THREE from "three";

function TechItem({ position, text, color, speed = 1 }: { position: [number, number, number]; text: string; color: string; speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<any>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.1;
      meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime * speed * 0.3) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group position={position}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[0.6, 32, 32]} />
          <MeshDistortMaterial
            color={color}
            transparent
            opacity={0.15}
            distort={0.3}
            speed={2}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>
        <Text
          ref={textRef}
          position={[0, 0, 0.7]}
          fontSize={0.35}
          color="#0f172a"
          font="/fonts/Inter-Bold.woff"
          anchorX="center"
          anchorY="middle"
        >
          {text}
        </Text>
      </group>
    </Float>
  );
}

function OrbitRing({ radius, speed, children }: { radius: number; speed: number; children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * speed * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Orbit ring visualization */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.02, 16, 100]} />
        <meshBasicMaterial color="#0891b2" transparent opacity={0.15} />
      </mesh>
      {children}
    </group>
  );
}

function CenterCore() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.2, 2]} />
        <MeshDistortMaterial
          color="#0891b2"
          transparent
          opacity={0.2}
          distort={0.4}
          speed={3}
          roughness={0.2}
          metalness={0.9}
          emissive="#0891b2"
          emissiveIntensity={0.1}
        />
      </mesh>
      <pointLight color="#22d3ee" intensity={2} distance={10} />
    </Float>
  );
}

function Scene() {
  const items = useMemo(() => [
    { text: "Printers", color: "#0891b2", radius: 3.5, speed: 1, angle: 0 },
    { text: "Laptops", color: "#22d3ee", radius: 3.5, speed: 1, angle: 60 },
    { text: "Desktops", color: "#0e7490", radius: 3.5, speed: 1, angle: 120 },
    { text: "Monitors", color: "#67e8f9", radius: 3.5, speed: 1, angle: 180 },
    { text: "Accessories", color: "#06b6d4", radius: 3.5, speed: 1, angle: 240 },
    { text: "AI PCs", color: "#0891b2", radius: 3.5, speed: 1, angle: 300 },
  ], []);

  const outerItems = useMemo(() => [
    { text: "HP World", color: "#c9a84c", radius: 5.5, speed: -0.7, angle: 30 },
    { text: "Since 1989", color: "#c9a84c", radius: 5.5, speed: -0.7, angle: 90 },
    { text: "Genuine", color: "#c9a84c", radius: 5.5, speed: -0.7, angle: 150 },
    { text: "Trusted", color: "#c9a84c", radius: 5.5, speed: -0.7, angle: 210 },
    { text: "Authorized", color: "#c9a84c", radius: 5.5, speed: -0.7, angle: 270 },
    { text: "Expert", color: "#c9a84c", radius: 5.5, speed: -0.7, angle: 330 },
  ], []);

  const getPosition = (radius: number, angle: number): [number, number, number] => {
    const rad = (angle * Math.PI) / 180;
    return [Math.cos(rad) * radius, Math.sin(rad) * radius * 0.3, Math.sin(rad) * radius];
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="#22d3ee" intensity={0.5} />
      
      <CenterCore />
      
      <OrbitRing radius={3.5} speed={0.5}>
        {items.map((item, i) => (
          <TechItem
            key={i}
            position={getPosition(item.radius, item.angle)}
            text={item.text}
            color={item.color}
            speed={item.speed}
          />
        ))}
      </OrbitRing>
      
      <OrbitRing radius={5.5} speed={-0.3}>
        {outerItems.map((item, i) => (
          <TechItem
            key={i}
            position={getPosition(item.radius, item.angle)}
            text={item.text}
            color={item.color}
            speed={item.speed}
          />
        ))}
      </OrbitRing>
      
      <Environment preset="city" />
    </>
  );
}

export function TechSphere3D() {
  return (
    <div className="w-full h-[500px] lg:h-[600px] relative">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
      </Canvas>
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, transparent 30%, rgba(250,251,252,0.8) 70%)"
        }}
      />
    </div>
  );
}
