"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import {
  LID_OPEN_RADIANS,
  RIGGED_MODEL_URL,
  type LaptopVariant,
} from "@/lib/laptop-variants";
import { createScreenTexture } from "./screen-texture";

const DRACO_PATH = "/draco/";
/** Longest edge the model is normalised to, so camera distances are meaningful. */
const FIT = 3;

useGLTF.preload(RIGGED_MODEL_URL, DRACO_PATH);

type Stop = [at: number, value: number];

/** Piecewise smoothstep through keyframes — one helper drives every channel. */
function ramp(p: number, stops: Stop[]) {
  if (p <= stops[0][0]) return stops[0][1];
  for (let i = 1; i < stops.length; i++) {
    const [a, va] = stops[i - 1];
    const [b, vb] = stops[i];
    if (p <= b) {
      const t = (p - a) / (b - a);
      return va + (vb - va) * (t * t * (3 - 2 * t));
    }
  }
  return stops[stops.length - 1][1];
}

const OPEN = (p: number) => ramp(p, [[0.06, 0], [0.36, 1]]);
const SCREEN_ON = (p: number) => ramp(p, [[0.3, 0], [0.48, 1]]);
const AZIMUTH: Stop[] = [[0, -0.62], [0.4, 0.06], [0.72, 0.95], [1, -0.3]];
const RADIUS: Stop[] = [[0, 6.4], [0.4, 5.0], [0.72, 4.7], [1, 6.0]];
const HEIGHT: Stop[] = [[0, 2.6], [0.4, 1.5], [0.72, 1.1], [1, 2.3]];
const LOOK_Y: Stop[] = [[0, 0.3], [0.4, 0.55], [1, 0.4]];

/**
 * Slide the subject into the right-hand half on landscape viewports so the
 * headline column stays clear. Done by dollying the camera sideways after
 * lookAt, which shifts the framing without bending the orbit.
 */
function screenShift(aspect: number) {
  if (aspect < 1.1) return 0; // portrait: centre it, copy stacks above
  return THREE.MathUtils.lerp(0.4, 1.5, THREE.MathUtils.clamp((aspect - 1.1) / 0.9, 0, 1));
}

/** Where the scene rests when motion is suppressed: open, three-quarter view. */
const STILL = { p: 0.45, open: 1 };

type SceneProps = {
  progress: RefObject<number>;
  spin: RefObject<number>;
  variant: LaptopVariant;
  reducedMotion: boolean;
};

function Laptop({ progress, spin, variant, reducedMotion }: SceneProps) {
  const { scene } = useGLTF(RIGGED_MODEL_URL, DRACO_PATH);
  const group = useRef<THREE.Group>(null);

  // The rig ships two nodes: Base, and Lid whose origin sits on the hinge with
  // the closed pose as its rest. Everything below leans on that contract.
  const parts = useMemo(() => {
    const lid = scene.getObjectByName("Lid") ?? null;
    const chassis: THREE.MeshStandardMaterial[] = [];
    const backlight: THREE.MeshStandardMaterial[] = [];
    let screen: THREE.MeshStandardMaterial | null = null;

    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      for (const raw of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
        const mat = raw as THREE.MeshStandardMaterial;
        if (mat.name.startsWith("PaletteMaterial001")) chassis.push(mat);
        else if (mat.name.startsWith("PaletteMaterial003")) backlight.push(mat);
        // A blank decal square the source model leaves dead centre on the lid.
        // A real OMEN carries no badge there, so drop it rather than invent one.
        else if (mat.name.startsWith("PaletteMaterial002")) mesh.visible = false;
        else if (mat.name.startsWith("PaletteMaterial004")) screen = mat;
      }
    });

    // Sketchfab baked these as "palette" materials: the baseColour map is a
    // ~176-byte swatch atlas, so dropping it costs no detail and buys exact
    // colour control. The metallic/roughness maps stay — they do the shading.
    for (const mat of chassis) mat.map = null;

    return {
      lid,
      chassis,
      backlight,
      screen: screen as THREE.MeshStandardMaterial | null,
    };
  }, [scene]);

  // Normalise once, from the CLOSED rest pose, so the fit doesn't change as the
  // lid swings. Centre on X/Z and sit the base on y=0.
  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const centre = box.getCenter(new THREE.Vector3());
    const scale = FIT / Math.max(size.x, size.y, size.z);
    return {
      scale,
      offset: new THREE.Vector3(-centre.x * scale, -box.min.y * scale, -centre.z * scale),
    };
  }, [scene]);

  const screenTex = useMemo(() => createScreenTexture(variant), []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => screenTex.texture.dispose(), [screenTex]);

  useEffect(() => {
    for (const mat of parts.chassis) {
      mat.color.set(variant.chassis);
      mat.needsUpdate = true;
    }
    for (const mat of parts.backlight) {
      mat.emissive.set(variant.backlight);
      mat.emissiveIntensity = 1.6;
      mat.needsUpdate = true;
    }
    screenTex.repaint(variant);
    const screen = parts.screen;
    if (screen) {
      screen.map = screenTex.texture;
      screen.emissiveMap = screenTex.texture;
      screen.emissive.set("#ffffff");
      screen.toneMapped = true;
      screen.needsUpdate = true;
    }
  }, [parts, variant, screenTex]);

  useFrame((state) => {
    const p = reducedMotion ? STILL.p : progress.current;
    if (parts.lid) {
      parts.lid.rotation.x = -LID_OPEN_RADIANS * (reducedMotion ? STILL.open : OPEN(p));
    }
    if (parts.screen) {
      // Ramp the backlight rather than switching it, so it reads as waking up.
      parts.screen.emissiveIntensity = 0.05 + 1.35 * (reducedMotion ? 1 : SCREEN_ON(p));
    }
    if (group.current) {
      group.current.rotation.y = spin.current;
      // A breath of idle motion so the shot is never completely dead.
      group.current.position.y =
        fit.offset.y + (reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.7) * 0.02);
    }
  });

  return (
    <group ref={group} position={fit.offset} scale={fit.scale}>
      <primitive object={scene} />
    </group>
  );
}

function CameraRig({ progress, reducedMotion }: Pick<SceneProps, "progress" | "reducedMotion">) {
  const { camera, size } = useThree();
  // The orbit position is tracked separately from camera.position: the sideways
  // dolly below is applied fresh each frame, so it must never be lerped from.
  const rig = useRef(new THREE.Vector3(-2, 2.6, 6));
  const look = useRef(new THREE.Vector3(0, 0.3, 0));
  const target = useMemo(() => new THREE.Vector3(), []);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const p = reducedMotion ? STILL.p : progress.current;
    const a = ramp(p, AZIMUTH);
    const r = ramp(p, RADIUS);
    target.set(Math.sin(a) * r, ramp(p, HEIGHT), Math.cos(a) * r);
    lookTarget.set(0, ramp(p, LOOK_Y), 0);

    // Damped follow: scrub arrives in steps, this turns it into a glide.
    const k = 1 - Math.pow(0.0015, delta);
    rig.current.lerp(target, k);
    look.current.lerp(lookTarget, k);

    camera.position.copy(rig.current);
    camera.lookAt(look.current);
    camera.translateX(-screenShift(size.width / size.height));
  });

  return null;
}

export function LaptopScene(props: SceneProps) {
  return (
    <Canvas
      camera={{ position: [-2, 1.45, 2.9], fov: 34 }}
      gl={{
        alpha: true,
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      dpr={[1, 2]}
      style={{ background: "transparent" }}
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        {/* Key / fill / rim — the rim picks up the variant accent along the lid edge. */}
        <directionalLight position={[4, 6, 4]} intensity={2.4} />
        <directionalLight position={[-5, 2, -3]} intensity={0.9} color={props.variant.accent} />
        <ambientLight intensity={0.35} />

        <Laptop {...props} />

        <ContactShadows
          position={[0, 0.001, 0]}
          opacity={0.5}
          scale={9}
          blur={2.6}
          far={4}
          resolution={512}
        />
      </Suspense>

      {/* Its own boundary so the HDRI never holds up the model. */}
      <Suspense fallback={null}>
        <Environment files="/hdri/studio_small_03_1k.hdr" environmentIntensity={0.7} />
      </Suspense>

      <CameraRig progress={props.progress} reducedMotion={props.reducedMotion} />
    </Canvas>
  );
}
