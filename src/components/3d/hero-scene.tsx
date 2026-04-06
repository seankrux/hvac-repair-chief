// @ts-nocheck
"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import Image from "next/image";

/* ---------- HVAC Condenser Unit (geometric) ---------- */
function CondenserUnit() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  const steelBlue = new THREE.Color("oklch(0.62 0.04 200)");
  const warmGold = new THREE.Color("oklch(0.66 0.12 60)");

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Main housing — rectangular box */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.2, 2.4, 2.2]} />
        <meshStandardMaterial
          color={steelBlue}
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>

      {/* Top grill ring */}
      <mesh position={[0, 1.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.8, 0.08, 8, 32]} />
        <meshStandardMaterial
          color={warmGold}
          metalness={0.85}
          roughness={0.15}
        />
      </mesh>

      {/* Fan blade hub */}
      <mesh position={[0, 1.35, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.12, 16]} />
        <meshStandardMaterial color={warmGold} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Fan blades */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[0, 1.35, 0]}
          rotation={[0, (i * Math.PI) / 2, Math.PI / 2]}
        >
          <boxGeometry args={[0.6, 0.02, 0.15]} />
          <meshStandardMaterial
            color="#c0c8d0"
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* Side grille lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`grille-${i}`} position={[1.11, -0.8 + i * 0.25, 0]}>
          <boxGeometry args={[0.02, 0.04, 2.0]} />
          <meshStandardMaterial color="#7a8fa0" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}

      {/* Copper refrigerant pipes */}
      <mesh position={[-0.6, -1.3, 1.15]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.6, 12]} />
        <meshStandardMaterial color={warmGold} metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[-0.3, -1.3, 1.15]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.6, 12]} />
        <meshStandardMaterial color={warmGold} metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Base pad */}
      <mesh position={[0, -1.35, 0]}>
        <boxGeometry args={[2.6, 0.15, 2.6]} />
        <meshStandardMaterial color="#8a9aaa" metalness={0.3} roughness={0.6} />
      </mesh>
    </group>
  );
}

/* ---------- Floating readouts ---------- */
function FloatingReadouts() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    }
  });

  const readouts = [
    { label: "72\u00b0F", x: -2.2, y: 1.2, z: 0 },
    { label: "45% Humidity", x: 2.2, y: 0.4, z: 0.5 },
    { label: "SEER 24", x: -1.8, y: -0.6, z: 1.0 },
  ];

  return (
    <group ref={groupRef}>
      {readouts.map((r) => (
        <Html
          key={r.label}
          position={[r.x, r.y, r.z]}
          center
          distanceFactor={6}
          style={{ pointerEvents: "none" }}
        >
          <div className="whitespace-nowrap rounded-md border border-white/20 bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-lg backdrop-blur-sm">
            {r.label}
          </div>
        </Html>
      ))}
    </group>
  );
}

/* ---------- Scene ---------- */
function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-3, 4, -2]} intensity={0.4} />
      <Environment preset="city" />

      <CondenserUnit />
      <FloatingReadouts />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        dampingFactor={0.05}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 4}
      />
    </>
  );
}

/* ---------- Fallback ---------- */
function HeroFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[oklch(0.62_0.04_200/0.1)] to-[oklch(0.66_0.12_60/0.1)]">
      <Image
        src="/images/hero-hvac-technician.png"
        alt="HVAC condenser unit"
        width={400}
        height={400}
        className="rounded-md object-cover opacity-80"
      />
    </div>
  );
}

/* ---------- Export ---------- */
export function HeroScene() {
  return (
    <div className="h-[400px] w-full lg:h-[500px]">
      <Suspense fallback={<HeroFallback />}>
        <Canvas
          camera={{ position: [4, 3, 5], fov: 40 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}
