"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import type { Mesh } from "three";

function NadinPlaceholder() {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.6;
    ref.current.rotation.x += delta * 0.2;
  });
  return (
    <mesh ref={ref} position={[0, 0.5, 0]} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#f97316" />
    </mesh>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#bae6fd" />
    </mesh>
  );
}

export default function HelloScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [3, 2.5, 4], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        touchAction: "none",
      }}
    >
      <color attach="background" args={["#e0f2fe"]} />
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 6, 3]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <Suspense fallback={null}>
        <NadinPlaceholder />
        <Ground />
      </Suspense>
    </Canvas>
  );
}
