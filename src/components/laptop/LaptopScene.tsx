"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, useGLTF } from "@react-three/drei";
import { Suspense, useCallback, useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import {
  LAPTOP_VARIANTS,
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

// The whole story on one scrubbed clock, read from scroll position:
//   0.00-0.06  settle, lid shut, held in the empty right-hand half
//   0.06-0.22  lid opens — still clear of the headline column
//   0.22-0.36  breathe: the reader gets to actually read the hero
//   0.36-0.54  copy clears, laptop walks to centre and squares up
//   0.52-0.62  the display grows to fill the frame; the panel staggers in
//   0.62-0.70  the laptop dissolves, but only once the panel already covers
//   0.70-0.80  HOLD — nothing moves, the advantages are readable
//   0.80-0.86  pull back out; the laptop fades in again
//   0.84-0.90  it tumbles through upside-down as the lid folds shut
//   0.90-1.00  the closing parade: four finishes, a beat each
/** Lid opens for the approach, then folds shut again during the flip. */
const OPEN = (p: number) => ramp(p, [[0.06, 0], [0.22, 1], [0.84, 1], [0.9, 0]]);
const SCREEN_ON = (p: number) => ramp(p, [[0.18, 0], [0.36, 1], [0.84, 1], [0.89, 0]]);
/** How far the camera has abandoned the orbit for a head-on approach. */
const ALIGN = (p: number) => ramp(p, [[0.38, 0], [0.56, 1], [0.8, 1], [0.86, 0]]);
/** Distance in front of the display once aligned — this is the push-in. */
const DOLLY = (p: number) => ramp(p, [[0.38, 4.6], [0.6, 0.95], [0.8, 0.95], [0.86, 3.4]]);
/** The panel behind the glass fades up, holds through the pause, then goes. */
const PANEL_IN = (p: number) => ramp(p, [[0.52, 0], [0.62, 1], [0.8, 1], [0.85, 0]]);
/**
 * The laptop dissolves for the pause, then comes back for the flip. Starts
 * late on purpose: fading it while the panel is still smaller than the frame
 * leaves a half-transparent laptop washed out against the white page.
 */
const LAPTOP_OUT = (p: number) => ramp(p, [[0.63, 0], [0.7, 1], [0.8, 1], [0.86, 0]]);
/**
 * Unwinds the hero's right-hand offset. Runs ahead of ALIGN so the laptop has
 * already walked back to centre by the time the panel is readable — the display
 * opens in the middle of the frame, not off to one side — and stays centred.
 */
const CENTRE = (p: number) => ramp(p, [[0.36, 0], [0.54, 1]]);
/** A full tumble as the lid shuts: passes through upside-down, lands upright. */
const FLIP = (p: number) => ramp(p, [[0.83, 0], [0.9, 1]]);
/** Drives the closing colourway parade. */
const SHOWCASE = (p: number) => ramp(p, [[0.9, 0], [1, 1]]);

const AZIMUTH: Stop[] = [[0, -0.55], [0.26, -0.34], [0.54, 0], [1, 0]];
const RADIUS: Stop[] = [[0, 6.2], [0.26, 5.9], [0.54, 5.8], [0.86, 5.6], [0.93, 4.4], [1, 4.4]];
const HEIGHT: Stop[] = [[0, 2.2], [0.26, 1.9], [0.54, 1.75], [0.86, 1.9], [0.93, 2.1], [1, 2.1]];
const LOOK_Y: Stop[] = [[0, 0.78], [0.4, 0.88], [0.86, 0.7], [0.93, 0.22], [1, 0.22]];

/**
 * Slide the subject into the right-hand half on landscape viewports so the
 * headline column stays clear. Done by dollying the camera sideways after
 * lookAt, which shifts the framing without bending the orbit. It has to unwind
 * to zero as the display takes over, or the portal would open off-centre.
 */
function screenShift(aspect: number) {
  if (aspect < 1.1) return 0; // portrait: centre it, copy stacks above
  return THREE.MathUtils.lerp(0.5, 1.65, THREE.MathUtils.clamp((aspect - 1.1) / 0.9, 0, 1));
}

/** Where the scene rests when motion is suppressed: open, three-quarter view. */
const STILL = { p: 0.4, open: 1 };

type SceneProps = {
  spin: RefObject<number>;
  variant: LaptopVariant;
  reducedMotion: boolean;
  /** The tall wrapper whose scroll position IS the timeline. */
  wrapRef: RefObject<HTMLDivElement | null>;
  /** The DOM panel that has to end up sitting exactly where the display is. */
  portalRef: RefObject<HTMLDivElement | null>;
  /** Hero copy and scroll hint, faded from the same clock as the 3D. */
  copyRef: RefObject<HTMLDivElement | null>;
  hintRef: RefObject<HTMLDivElement | null>;
};

/**
 * Bounds of a subtree in its OWN local space.
 *
 * Box3.setFromObject walks matrixWorld, so once this scene has been parented to
 * the scaled group even once, it measures itself already multiplied by that
 * scale — and useGLTF caches the scene across remounts. Fitting off that gives
 * FIT/(size*scale), collapsing the next scale to ~1 and rendering a miniature
 * laptop. Composing local matrices from the root makes the fit reproducible.
 */
function localBounds(root: THREE.Object3D) {
  const box = new THREE.Box3();
  const stack: Array<[THREE.Object3D, THREE.Matrix4]> = root.children.map((c) => [
    c,
    new THREE.Matrix4(),
  ]);
  while (stack.length) {
    const [obj, parentMatrix] = stack.pop()!;
    obj.updateMatrix();
    const matrix = new THREE.Matrix4().multiplyMatrices(parentMatrix, obj.matrix);
    const mesh = obj as THREE.Mesh;
    if (mesh.isMesh && mesh.geometry) {
      if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
      box.union(mesh.geometry.boundingBox!.clone().applyMatrix4(matrix));
    }
    for (const child of obj.children) stack.push([child, matrix]);
  }
  return box;
}

/**
 * Scroll position of the pinned wrapper, 0-1.
 *
 * Read straight from layout rather than pushed in by ScrollTrigger: the whole
 * act runs off one number, and taking it here means the 3D, the copy and the
 * portal are all reading the same value in the same frame — no scrub lag and
 * nothing to fall out of sync.
 */
function readProgress(el: HTMLDivElement | null) {
  if (!el) return 0;
  const r = el.getBoundingClientRect();
  const span = r.height - window.innerHeight;
  return span > 0 ? THREE.MathUtils.clamp(-r.top / span, 0, 1) : 0;
}

function Laptop({
  spin,
  variant,
  reducedMotion,
  wrapRef,
  portalRef,
  copyRef,
  hintRef,
}: SceneProps) {
  const { scene } = useGLTF(RIGGED_MODEL_URL, DRACO_PATH);
  const { camera, size } = useThree();
  const group = useRef<THREE.Group>(null);

  // The rig ships two nodes: Base, and Lid whose origin sits on the hinge with
  // the closed pose as its rest. Everything below leans on that contract.
  const parts = useMemo(() => {
    const lid = scene.getObjectByName("Lid") ?? null;
    const chassis: THREE.MeshStandardMaterial[] = [];
    const backlight: THREE.MeshStandardMaterial[] = [];
    const all: THREE.MeshStandardMaterial[] = [];
    const plate: THREE.MeshStandardMaterial[] = [];
    const mark: THREE.MeshStandardMaterial[] = [];
    let screen: THREE.MeshStandardMaterial | null = null;
    let screenMesh: THREE.Mesh | null = null;

    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      for (const raw of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
        const mat = raw as THREE.MeshStandardMaterial;
        all.push(mat);
        if (mat.name.startsWith("OmenMark")) mark.push(mat);
        else if (mat.name.startsWith("PaletteMaterial001")) chassis.push(mat);
        else if (mat.name.startsWith("PaletteMaterial003")) backlight.push(mat);
        // A blank decal square dead centre on the lid. It cannot simply be
        // removed — it plugs a cutout in the lid shell, and deleting it opens a
        // hole you can see the screen through. So it stays, painted to match.
        else if (mat.name.startsWith("PaletteMaterial002")) plate.push(mat);
        else if (mat.name.startsWith("PaletteMaterial004")) {
          screen = mat;
          screenMesh = mesh;
        }
      }
    });

    // Sketchfab baked these as "palette" materials: the baseColour map is a
    // ~176-byte swatch atlas, so dropping it costs no detail and buys exact
    // colour control. The metallic/roughness maps stay — they do the shading.
    for (const mat of [...chassis, ...plate, ...mark]) mat.map = null;

    return {
      lid,
      chassis,
      backlight,
      plate,
      mark,
      all,
      screen: screen as THREE.MeshStandardMaterial | null,
      screenMesh: screenMesh as THREE.Mesh | null,
    };
  }, [scene]);

  // The display is a single quad; its four corners are all the portal needs.
  const corners = useMemo(() => {
    const mesh = parts.screenMesh;
    if (!mesh) return [];
    const pos = mesh.geometry.attributes.position;
    return Array.from({ length: pos.count }, (_, i) =>
      new THREE.Vector3().fromBufferAttribute(pos, i)
    );
  }, [parts.screenMesh]);

  // Normalise once, from the CLOSED rest pose, so the fit doesn't change as the
  // lid swings. Centre on X/Z and sit the base on y=0.
  const fit = useMemo(() => {
    // Measure the CLOSED rest pose: useFrame leaves the lid wherever the last
    // frame put it, and the fit must not depend on that.
    const lid = scene.getObjectByName("Lid");
    const held = lid ? lid.rotation.x : 0;
    if (lid) lid.rotation.x = 0;
    const box = localBounds(scene);
    if (lid) lid.rotation.x = held;

    const s = box.getSize(new THREE.Vector3());
    const c = box.getCenter(new THREE.Vector3());
    const scale = FIT / Math.max(s.x, s.y, s.z);
    return {
      scale,
      // Inner offset centres the model on the pivot group's origin, so the
      // flip tumbles it about its own middle rather than hinging off the desk.
      inner: new THREE.Vector3(-c.x * scale, -c.y * scale, -c.z * scale),
      // Outer lift then sets it back down on y=0 for the contact shadow.
      lift: (s.y / 2) * scale,
    };
  }, [scene]);

  const screenTex = useMemo(() => createScreenTexture(variant), []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => screenTex.texture.dispose(), [screenTex]);

  // Applied imperatively rather than through render, because the closing
  // colourway parade is driven by scroll inside useFrame — putting that through
  // React state would re-render the tree mid-scroll for no benefit.
  const applyLook = useCallback(
    (v: LaptopVariant) => {
      for (const mat of parts.chassis) {
        mat.color.set(v.chassis);
        mat.needsUpdate = true;
      }
      // The OMEN wordmark etched into the chin. It shares the shell's material
      // in the source, so recolouring the chassis painted it the identical
      // colour and it vanished. Etched marks read by CONTRAST, not hue, so it
      // is pushed away from whatever the shell is wearing.
      for (const mat of parts.mark) {
        const shell = new THREE.Color(v.chassis);
        const lum = 0.2126 * shell.r + 0.7152 * shell.g + 0.0722 * shell.b;
        mat.color
          .copy(shell)
          .lerp(new THREE.Color(lum > 0.3 ? "#0d1116" : "#e8eef4"), 0.8);
        mat.metalness = 0.55;
        mat.roughness = 0.3;
        mat.needsUpdate = true;
      }

      // Same paint as the shell, and dialled off full metal — glTF defaults
      // metalness to 1 when unspecified, which rendered this plate solid black.
      for (const mat of parts.plate) {
        mat.color.set(v.chassis);
        mat.metalness = 0.5;
        mat.roughness = 0.5;
        mat.emissive.set("#000000");
        mat.emissiveIntensity = 0;
        mat.needsUpdate = true;
      }
      for (const mat of parts.backlight) {
        mat.emissive.set(v.backlight);
        mat.emissiveIntensity = 1.6;
        mat.needsUpdate = true;
      }
      screenTex.repaint(v);
      const screen = parts.screen;
      if (screen) {
        screen.map = screenTex.texture;
        screen.emissiveMap = screenTex.texture;
        screen.emissive.set("#ffffff");
        screen.toneMapped = true;
        screen.needsUpdate = true;
      }
    },
    [parts, screenTex]
  );

  const applied = useRef<string | null>(null);
  useEffect(() => {
    applyLook(variant);
    applied.current = variant.id;
  }, [applyLook, variant]);

  // Scratch vectors, reused every frame so the loop allocates nothing.
  const rig = useRef(new THREE.Vector3(-2, 2.6, 6));
  const look = useRef(new THREE.Vector3(0, 0.3, 0));
  const v = useMemo(() => new THREE.Vector3(), []);
  const centre = useMemo(() => new THREE.Vector3(), []);
  const normal = useMemo(() => new THREE.Vector3(), []);
  const edgeA = useMemo(() => new THREE.Vector3(), []);
  const edgeB = useMemo(() => new THREE.Vector3(), []);
  const orbit = useMemo(() => new THREE.Vector3(), []);
  const aligned = useMemo(() => new THREE.Vector3(), []);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const p = reducedMotion ? STILL.p : readProgress(wrapRef.current);

    if (parts.lid) {
      parts.lid.rotation.x = -LID_OPEN_RADIANS * (reducedMotion ? STILL.open : OPEN(p));
    }
    if (parts.screen) {
      // Ramp the backlight rather than switching it, so it reads as waking up.
      parts.screen.emissiveIntensity = 0.05 + 1.35 * (reducedMotion ? 1 : SCREEN_ON(p));
    }
    if (group.current) {
      group.current.rotation.y = spin.current;
      // A full tumble about the model's own centre as the lid shuts.
      group.current.rotation.x = reducedMotion ? 0 : FLIP(p) * Math.PI * 2;
      group.current.position.y =
        fit.lift + (reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.7) * 0.02);
      group.current.updateWorldMatrix(true, true);
    }

    // Closing parade. Each finish owns one beat: the colour changes at the top
    // of it, the laptop turns a full 360 through the first two thirds, then
    // holds still for the rest so the finish is actually looked at rather than
    // glimpsed mid-spin. One swipe, one turn, one pause.
    if (!reducedMotion) {
      const show = SHOWCASE(p);
      const count = LAPTOP_VARIANTS.length;
      const slot = show * count;
      const index = Math.min(count - 1, Math.floor(slot));
      const next = show > 0 ? LAPTOP_VARIANTS[index] : variant;
      if (applied.current !== next.id) {
        applyLook(next);
        applied.current = next.id;
      }
      if (group.current && show > 0) {
        const local = slot - index;
        const t = Math.min(local / 0.66, 1);
        const turns = index + t * t * (3 - 2 * t);
        group.current.rotation.y = spin.current + turns * Math.PI * 2;
        // A small settle as each finish lands, decaying across the beat.
        group.current.scale.setScalar(1 + Math.exp(-local * 6) * 0.045);
      } else if (group.current) {
        group.current.scale.setScalar(1);
      }
    }

    // --- Where is the display right now, in world space? -------------------
    const mesh = parts.screenMesh;
    let haveScreen = false;
    if (mesh && corners.length >= 3) {
      centre.set(0, 0, 0);
      for (const c of corners) centre.add(v.copy(c).applyMatrix4(mesh.matrixWorld));
      centre.multiplyScalar(1 / corners.length);

      edgeA.copy(corners[1]).applyMatrix4(mesh.matrixWorld).sub(
        v.copy(corners[0]).applyMatrix4(mesh.matrixWorld)
      );
      edgeB.copy(corners[2]).applyMatrix4(mesh.matrixWorld).sub(
        v.copy(corners[0]).applyMatrix4(mesh.matrixWorld)
      );
      normal.crossVectors(edgeA, edgeB).normalize();
      // Face the side the viewer is on, whichever winding the quad has.
      if (normal.dot(v.copy(camera.position).sub(centre)) < 0) normal.negate();
      haveScreen = true;
    }

    // --- Camera: orbit early, square-on to the display late ----------------
    const align = reducedMotion ? 0 : ALIGN(p);
    const a = ramp(p, AZIMUTH);
    const r = ramp(p, RADIUS);
    orbit.set(Math.sin(a) * r, ramp(p, HEIGHT), Math.cos(a) * r);
    lookTarget.set(0, ramp(p, LOOK_Y), 0);

    if (haveScreen && align > 0) {
      aligned.copy(normal).multiplyScalar(DOLLY(p)).add(centre);
      orbit.lerp(aligned, align);
      lookTarget.lerp(centre, align);
    }

    const k = 1 - Math.pow(0.0015, delta);
    rig.current.lerp(orbit, k);
    look.current.lerp(lookTarget, k);
    camera.position.copy(rig.current);
    camera.lookAt(look.current);
    // Unwind the hero offset before the display squares up, or the portal opens
    // off-centre and the handoff misses the viewport.
    camera.translateX(-screenShift(size.width / size.height) * (1 - CENTRE(p)));
    camera.updateMatrixWorld();

    // --- Drive the DOM panel onto the display ------------------------------
    const panel = portalRef.current;
    if (panel && haveScreen) {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const c of corners) {
        v.copy(c).applyMatrix4(mesh!.matrixWorld).project(camera);
        const x = (v.x * 0.5 + 0.5) * size.width;
        const y = (-v.y * 0.5 + 0.5) * size.height;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
      // The panel is authored at viewport size, so one uniform scale puts it on
      // the glass. Past the point where the display outgrows the viewport there
      // is nothing left to track — the bezel is off-frame — so it locks to a
      // dead-centre, 1:1 viewport instead of magnifying to 2x and beyond.
      const raw = Math.max((maxX - minX) / size.width, (maxY - minY) / size.height);
      const lock = THREE.MathUtils.clamp((raw - 1) / 0.35, 0, 1);
      const scale = Math.min(raw, 1);
      const dx = ((minX + maxX) / 2 - size.width / 2) * (1 - lock);
      const dy = ((minY + maxY) / 2 - size.height / 2) * (1 - lock);
      const shown = reducedMotion ? 0 : PANEL_IN(p);
      panel.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${scale})`;
      panel.style.opacity = String(shown);
      panel.style.setProperty('--panel-in', String(shown));
      // Only clickable once it has actually arrived — otherwise an invisible
      // full-bleed panel sits over the hero and eats every button press.
      panel.style.pointerEvents = shown > 0.9 ? "auto" : "none";
    }

    // Hero copy clears out before the display swallows the frame, and the
    // scroll cue goes as soon as the reader has taken the hint.
    const copy = copyRef.current;
    if (copy && !reducedMotion) {
      const f = ramp(p, [[0.3, 0], [0.46, 1]]);
      copy.style.opacity = String(1 - f);
      copy.style.transform = `translateY(${-46 * f}px)`;
      copy.style.pointerEvents = f > 0.6 ? "none" : "";
    }
    if (hintRef.current && !reducedMotion) {
      hintRef.current.style.opacity = String(1 - ramp(p, [[0.02, 0], [0.12, 1]]));
    }


    // The laptop dissolves once the page underneath is carrying the frame.
    const fade = reducedMotion ? 0 : LAPTOP_OUT(p);
    if (group.current) group.current.visible = fade < 1;
    for (const mat of parts.all) {
      mat.transparent = fade > 0;
      mat.opacity = 1 - fade;
    }
  });

  return (
    <group ref={group} position={[0, fit.lift, 0]}>
      <group position={fit.inner} scale={fit.scale}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

export function LaptopScene(props: SceneProps) {
  return (
    <Canvas
      camera={{ position: [-2, 2.6, 6], fov: 34 }}
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
    </Canvas>
  );
}
