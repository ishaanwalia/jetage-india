"use client";

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import { Suspense } from 'react';

function Model() {
  const { scene } = useGLTF('/models/hp_omen_laptop.glb');
  // 20% bigger: 3.5 * 1.2 = 4.2
  return <primitive object={scene} scale={4.2} position={[0, -0.7, 0]} rotation={[0, -Math.PI / 6, 0]} />;
}

export function Laptop3DViewer() {
  return (
    <div className="w-full h-[650px] lg:h-[750px] relative flex items-center justify-center overflow-visible">
      <div className="w-full h-full relative">
        <Canvas
          camera={{ position: [0, 1, 8], fov: 38 }}
          style={{ background: 'transparent' }}
          gl={{ alpha: true, antialias: true }}
          className="w-full h-full"
        >
          <Suspense fallback={null}>
            <ambientLight intensity={1.0} />
            <directionalLight position={[5, 8, 5]} intensity={1.3} castShadow />
            <directionalLight position={[-5, 3, -5]} intensity={0.7} />
            <pointLight position={[0, 5, 0]} intensity={0.5} />

            <Model />

            <OrbitControls
              enableZoom={false}
              autoRotate={true}
              autoRotateSpeed={1.2}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 2}
              enablePan={false}
              target={[0, 0, 0]}
            />

            <Environment preset="studio" />
          </Suspense>
        </Canvas>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/30 text-white/50 px-4 py-1.5 rounded-full text-xs backdrop-blur-sm border border-white/5">
        Drag to rotate
      </div>
    </div>
  );
}