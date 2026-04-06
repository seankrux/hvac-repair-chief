// @ts-nocheck
/* eslint-disable react-hooks/purity */
"use client";

import { Suspense, useRef, useMemo, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ---------- Simple Perlin-like noise ---------- */
function pseudoNoise(x: number, y: number, z: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + z * 45.164) * 43758.5453;
  return (n - Math.floor(n)) * 2 - 1;
}

function smoothNoise(x: number, y: number, z: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iz = Math.floor(z);
  const fx = x - ix;
  const fy = y - iy;
  const fz = z - iz;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const sz = fz * fz * (3 - 2 * fz);

  const n000 = pseudoNoise(ix, iy, iz);
  const n100 = pseudoNoise(ix + 1, iy, iz);
  const n010 = pseudoNoise(ix, iy + 1, iz);
  const n110 = pseudoNoise(ix + 1, iy + 1, iz);
  const n001 = pseudoNoise(ix, iy, iz + 1);
  const n101 = pseudoNoise(ix + 1, iy, iz + 1);
  const n011 = pseudoNoise(ix, iy + 1, iz + 1);
  const n111 = pseudoNoise(ix + 1, iy + 1, iz + 1);

  const nx00 = n000 + sx * (n100 - n000);
  const nx10 = n010 + sx * (n110 - n010);
  const nx01 = n001 + sx * (n101 - n001);
  const nx11 = n011 + sx * (n111 - n011);
  const nxy0 = nx00 + sy * (nx10 - nx00);
  const nxy1 = nx01 + sy * (nx11 - nx01);
  return nxy0 + sz * (nxy1 - nxy0);
}

/* ---------- Particle system ---------- */
const PARTICLE_COUNT = 200;

function Particles({ paused }: { paused: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const mousePos = useRef(new THREE.Vector2(9999, 9999));
  const { size } = useThree();

  // Initialize positions and velocities
  const { positions, colors, seeds } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);
    const sd = new Float32Array(PARTICLE_COUNT);

    const steelBlue = new THREE.Color("oklch(0.62 0.04 200)");
    const warmGold = new THREE.Color("oklch(0.66 0.12 60)");

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 10;
      pos[i3 + 1] = (Math.random() - 0.5) * 6;
      pos[i3 + 2] = (Math.random() - 0.5) * 2;
      sd[i] = Math.random() * 100;

      // Mix colors: 60% steel blue, 40% warm gold
      const t = Math.random();
      const c = t < 0.6 ? steelBlue : warmGold;
      col[i3] = c.r;
      col[i3 + 1] = c.g;
      col[i3 + 2] = c.b;
    }

    return { positions: pos, colors: col, seeds: sd };
  }, []);

  // Mouse tracking
  const handlePointerMove = useCallback((e: PointerEvent) => {
    mousePos.current.set(
      (e.clientX / size.width) * 2 - 1,
      -(e.clientY / size.height) * 2 + 1
    );
  }, [size]);

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [handlePointerMove]);

  useFrame((state) => {
    if (paused || !pointsRef.current) return;

    const posAttr = pointsRef.current.geometry.attributes.position;
    const posArray = posAttr.array as Float32Array;
    const time = state.clock.elapsedTime * 0.3;

    // Mouse world position (approximate)
    const mouseWorld = new THREE.Vector3(
      mousePos.current.x * 5,
      mousePos.current.y * 3,
      0
    );

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      let x = posArray[i3];
      let y = posArray[i3 + 1];
      const z = posArray[i3 + 2];

      // Perlin flow
      const noiseX = smoothNoise(x * 0.3 + time, y * 0.3, seeds[i] * 0.01) * 0.02;
      const noiseY = smoothNoise(x * 0.3, y * 0.3 + time, seeds[i] * 0.01 + 50) * 0.015;

      // Left-to-right drift
      x += 0.012 + noiseX;
      y += noiseY;

      // Mouse attractor (150px ~ 1.5 world units)
      const dx = mouseWorld.x - x;
      const dy = mouseWorld.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 1.5 && dist > 0.01) {
        const force = (1 - dist / 1.5) * 0.03;
        x += dx * force;
        y += dy * force;
      }

      // Wrap around
      if (x > 5.5) x = -5.5;
      if (x < -5.5) x = 5.5;
      if (y > 3.5) y = -3.5;
      if (y < -3.5) y = 3.5;

      posArray[i3] = x;
      posArray[i3 + 1] = y;
      posArray[i3 + 2] = z;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={PARTICLE_COUNT}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={PARTICLE_COUNT}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ---------- Export ---------- */
export function AirflowParticles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPaused(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 overflow-hidden">
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          dpr={[1, 1]}
          gl={{ antialias: false, alpha: true }}
          style={{ background: "transparent" }}
        >
          <Particles paused={paused} />
        </Canvas>
      </Suspense>
    </div>
  );
}
