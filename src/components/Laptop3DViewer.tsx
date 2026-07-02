"use client";

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stage, useGLTF } from '@react-three/drei';
import { Suspense } from 'react';

function Model() {
  const { scene } = useGLTF('/models/hp_omen_laptop.glb');
  return <primitive object={scene} scale={2.8} position={[0, -0.5, 0]} />;
}

export default function Laptop3DViewer() {
  return (
    <div className="w-full h-[600px] rounded-3xl overflow-hidden relative">
      <Canvas
        camera={{ position: [0, 1.5, 7], fov: 40 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <pointLight position={[-5, 3, -5]} intensity={0.5} />

          <Model />

          <OrbitControls
            enableZoom={false}
            autoRotate={true}
            autoRotateSpeed={1.2}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.8}
            enablePan={false}
          />

          <Environment preset="studio" />
        </Suspense>
      </Canvas>

      {/* Subtle interaction hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/40 text-white/60 px-4 py-1.5 rounded-full text-xs backdrop-blur-sm border border-white/10">
        Drag to rotate
      </div>
    </div>
  );
}