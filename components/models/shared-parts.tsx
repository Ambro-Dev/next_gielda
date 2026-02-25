"use client";

import React from "react";
import { Box, Cylinder } from "@react-three/drei";

export function WheelArch({
  position,
  ...props
}: {
  position?: [number, number, number];
}) {
  return (
    <Cylinder
      args={[0.6, 0.6, 0.7, 16, 1, true, 0, 3.05]}
      scale={[1, 1, 1]}
      position={position || [0, 0, 0]}
      rotation={[0, 0, Math.PI / 2]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color="#334155" roughness={0.9} side={2} />
    </Cylinder>
  );
}

export function Wheel({
  args,
  position,
  ...props
}: {
  args?: [number, number, number];
  position?: [number, number, number];
}) {
  return (
    <group
      position={position || [0, 0, 0]}
      rotation={[Math.PI / 2, 0, Math.PI / 2]}
    >
      {/* Tire */}
      <Cylinder args={args || [1, 1, 1]} castShadow receiveShadow>
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </Cylinder>
      {/* Rim */}
      <Cylinder
        args={[
          (args?.[0] || 1) * 0.6,
          (args?.[1] || 1) * 0.6,
          (args?.[2] || 1) + 0.02,
        ]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#94a3b8" roughness={0.4} metalness={0.6} />
      </Cylinder>
    </group>
  );
}

export function SingleWheelWithArch({
  args,
  position,
  side = "left",
  ...props
}: {
  args?: [number, number, number];
  position: [number, number, number];
  side?: "left" | "right";
}) {
  const archOffset = side === "left" ? 0.18 : -0.18;
  return (
    <group>
      <Wheel args={args} position={position} />
      <WheelArch
        position={[position[0] + archOffset, position[1], position[2]]}
      />
    </group>
  );
}

export function DoubleWheel({
  args,
  position,
  side = "left",
  ...props
}: {
  args?: [number, number, number];
  position: [number, number, number];
  side?: "left" | "right";
}) {
  const offset = side === "left" ? 0.36 : -0.36;
  const archOffset = side === "left" ? 0.18 : -0.18;
  return (
    <group>
      <Wheel args={args} position={position} />
      <Wheel
        args={args}
        position={[position[0] + offset, position[1], position[2]]}
      />
      <WheelArch
        position={[position[0] + archOffset, position[1], position[2]]}
      />
    </group>
  );
}

export function Cabin({
  width,
  height = 2.5,
  depth = 2,
  color = "#3b82f6",
  wheelArgs = [0.5, 0.5, 0.3],
}: {
  width: number;
  height?: number;
  depth?: number;
  color?: string;
  wheelArgs?: [number, number, number];
}) {
  return (
    <group>
      {/* Main Cabin Body */}
      <Box
        args={[width, height, depth]}
        position={[0, height / 2 + 0.05, 0]}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color={color}
          roughness={0.2}
          metalness={0.8}
          clearcoat={1}
        />
      </Box>
      {/* Windshield */}
      <Box
        args={[width - 0.2, height * 0.4, 0.1]}
        position={[0, height * 0.7, depth / 2 + 0.01]}
        castShadow
      >
        <meshPhysicalMaterial
          color="#0f172a"
          roughness={0.1}
          metalness={0.9}
          transmission={0.9}
          thickness={0.5}
        />
      </Box>
      {/* Front Bumper */}
      <Box
        args={[width, 0.4, 0.3]}
        position={[0, 0.2, depth / 2 + 0.1]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </Box>
      {/* Front Wheels */}
      <SingleWheelWithArch
        side="left"
        args={wheelArgs}
        position={[(width - 0.5) / 2, -0.6, depth / 4]}
      />
      <SingleWheelWithArch
        side="right"
        args={wheelArgs}
        position={[-(width - 0.5) / 2, -0.6, depth / 4]}
      />
    </group>
  );
}

export function Tractor({
  width,
  color = "#3b82f6",
}: {
  width: number;
  color?: string;
}) {
  return (
    <group>
      {/* Cabin */}
      <Cabin width={width} height={2.5} depth={2} color={color} />

      {/* Tractor Chassis */}
      <Box
        args={[width - 0.2, 0.1, 3.5]}
        position={[0, 0.0, -1.75]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#1e293b" roughness={0.9} metalness={0.5} />
      </Box>

      {/* Fifth Wheel (Siodło) */}
      <Cylinder
        args={[0.6, 0.6, 0.05]}
        position={[0, 0.075, -2.0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#475569" roughness={0.8} />
      </Cylinder>

      {/* Tractor Rear Wheels (2 axles) */}
      <DoubleWheel
        side="left"
        args={[0.5, 0.5, 0.3]}
        position={[(width - 0.5) / 2, -0.6, -1.5]}
      />
      <DoubleWheel
        side="right"
        args={[0.5, 0.5, 0.3]}
        position={[-(width - 0.5) / 2, -0.6, -1.5]}
      />

      <DoubleWheel
        side="left"
        args={[0.5, 0.5, 0.3]}
        position={[(width - 0.5) / 2, -0.6, -2.7]}
      />
      <DoubleWheel
        side="right"
        args={[0.5, 0.5, 0.3]}
        position={[-(width - 0.5) / 2, -0.6, -2.7]}
      />
    </group>
  );
}
