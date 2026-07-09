"use client";

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

const MODEL_URL = '/models/hp_omen_laptop.glb';

// Start downloading the model as soon as this module loads,
// instead of waiting for the Canvas to mount.
useGLTF.preload(MODEL_URL);

function Model() {
  const { scene } = useGLTF(MODEL_URL);

  // The source asset uses KHR_materials_transmission, which three.js renders
  // as glass-like translucency. Force every material fully opaque.
  useMemo(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach((mat) => {
          const m = mat as THREE.MeshPhysicalMaterial;
          if (m.transmission !== undefined) m.transmission = 0;
          m.transparent = false;
          m.opacity = 1;
          m.depthWrite = true;
          m.needsUpdate = true;
        });
      }
    });
  }, [scene]);

  return <primitive object={scene} scale={6.5} position={[0, -1.05, 0]} rotation={[0, -Math.PI / 6, 0]} />;
}

export function Laptop3DViewer() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  // Stop the render loop entirely once the hero is scrolled out of view.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className="w-full h-[380px] sm:h-[480px] lg:h-[640px] relative flex items-center justify-center">
      <Canvas
        camera={{ position: [0, 1.2, 9.5], fov: 38 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
        frameloop={inView ? 'always' : 'never'}
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

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-jet-primary/10 text-jet-primary px-5 py-2 rounded-full text-xs sm:text-sm backdrop-blur-md border border-jet-primary/30 font-medium whitespace-nowrap">
        Drag to rotate — explore in 3D
      </div>
    </div>
  );
}
