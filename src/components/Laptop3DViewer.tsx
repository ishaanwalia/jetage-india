"use client";

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import { Suspense } from 'react';

function Model() {
  const { scene } = useGLTF('/models/hp_omen_laptop.glb');
  return <primitive object={scene} scale={5.25} position={[0, -0.85, 0]} rotation={[0, -Math.PI / 6, 0]} />;
}

export function Laptop3DViewer() {
  return (
    <div className="w-full h-[700px] lg:h-[800px] relative flex items-center justify-center overflow-visible">
      <div className="w-full h-full relative">
        <Canvas
          camera={{ position: [0, 1.2, 9.5], fov: 38 }}
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

      <div className="absolute bottom-[42px] left-1/2 -translate-x-1/2 bg-jet-primary/20 text-jet-primary px-6 py-2 rounded-full text-sm backdrop-blur-md border border-jet-primary/30 font-medium whitespace-nowrap">
        Check out our exclusive range of HP products
      </div>
    </div>
  );
}