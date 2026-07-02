"use client";

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import { Suspense } from 'react';

function Model() {
  const { scene } = useGLTF('/models/hp_omen_laptop.glb');
  // Much bigger scale, centered position
  return <primitive object={scene} scale={4.5} position={[0, -0.2, 0]} rotation={[0, -Math.PI / 6, 0]} />;
}

export default function Laptop3DViewer() {
  return (
    <div className="w-full h-[700px] lg:h-[800px] relative">
      <Canvas
        camera={{ position: [0, 1, 5], fov: 35 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1.0} />
          <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
          <directionalLight position={[-5, 3, -5]} intensity={0.8} />
          <pointLight position={[0, 5, 0]} intensity={0.6} />

          <Model />

          <OrbitControls
            enableZoom={false}
            autoRotate={true}
            autoRotateSpeed={1.5}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 2}
            enablePan={false}
            target={[0, 0, 0]}
          />

          <Environment preset="studio" />
        </Suspense>
      </Canvas>

      {/* Subtle interaction hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/30 text-white/50 px-4 py-1.5 rounded-full text-xs backdrop-blur-sm border border-white/5">
        Drag to rotate
      </div>
    </div>
  );
}