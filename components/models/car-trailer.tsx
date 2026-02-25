"use client";

import React from "react";

import { Center, Box, Cylinder } from "@react-three/drei";
import { Grid } from "./grid";
import { Wheel, WheelArch } from "./shared-parts";

function SingleWheelWithArch({
  args,
  position,
  side,
  ...props
}: {
  args?: [number, number, number];
  position: [number, number, number];
  side: "left" | "right";
}) {
  return (
    <group>
      <Wheel
        args={args}
        position={
          side === "right"
            ? [position[0] + 0.04, position[1], position[2]]
            : [position[0] + 0.06, position[1], position[2]]
        }
      />
      <WheelArch position={[position[0] + 0.05, position[1], position[2]]} />
    </group>
  );
}

function Hitch({
  position,
  width,
  ...props
}: {
  position: [number, number, number];
  width: number;
}) {
  return (
    <group>
      <Cylinder
        args={[0.04, 0.04, width]}
        position={position || [0, 0, 0]}
        rotation={[0, Math.PI / 2, Math.PI / 2]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#94a3b8" roughness={0.6} metalness={0.8} />
      </Cylinder>
      <Box
        args={[0.05, 0.05, width / 1.5]}
        position={[
          position[0] / 2 + 0.35,
          position[1],
          position[2] + width / 2 - 0.45,
        ]}
        rotation={[0, Math.PI / 5, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#94a3b8" roughness={0.6} metalness={0.8} />
      </Box>
      <Box
        args={[0.05, 0.05, width / 1.5]}
        position={[
          position[0] / 2 - 0.35,
          position[1],
          position[2] + width / 2 - 0.45,
        ]}
        rotation={[0, -Math.PI / 5, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#94a3b8" roughness={0.6} metalness={0.8} />
      </Box>
      <Box
        args={[0.1, 0.1, 0.2]}
        position={[position[0], position[1], position[2] - width / 2]}
        rotation={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#475569" roughness={0.8} metalness={0.5} />
      </Box>
    </group>
  );
}

function CarTrailerLow({ args, ...props }: { args: [number, number, number] }) {
  return (
    <>
      <group>
        <Center scale={[1, 1, 1]} position={[0, 0, -3]} front top {...props}>
          <group position={[0, -0.57, 0]}>
            {/* Floor */}
            <Box
              args={[args[0] - 0.02, 0.03, args[2]]}
              position={[0, -0.01, 0]}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial color="#475569" roughness={0.8} />
            </Box>
            {/* Side Walls */}
            <Box
              args={[args[1], 0.03, args[2]]}
              position={[args[0] / 2 - 0.02, args[1] / 2, 0]}
              rotation={[0, 0, Math.PI / 2]}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial color="#64748b" roughness={0.7} />
            </Box>
            <Box
              args={[args[1], 0.03, args[2]]}
              position={[-args[0] / 2 + 0.02, args[1] / 2, 0]}
              rotation={[0, 0, Math.PI / 2]}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial color="#64748b" roughness={0.7} />
            </Box>
            {/* Front/Back Walls */}
            <Box
              args={[args[1], 0.03, args[0] - 0.03]}
              position={[0, args[1] / 2, args[2] / 2 - 0.02]}
              rotation={[0, Math.PI / 2, Math.PI / 2]}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial color="#64748b" roughness={0.7} />
            </Box>
            <Box
              args={[args[1], 0.03, args[0] - 0.03]}
              position={[0, args[1] / 2, -args[2] / 2 + 0.02]}
              rotation={[0, Math.PI / 2, Math.PI / 2]}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial color="#64748b" roughness={0.7} />
            </Box>
          </group>
          <Hitch position={[0, -0.65, -args[2] / 2 - 0.9]} width={1.8} />

          {/* Chassis Base */}
          <Box
            args={[args[0], 0.1, args[2]]}
            position={[0, -0.65, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial
              color="#1e293b"
              roughness={0.9}
              metalness={0.5}
            />
          </Box>

          {/* Wheels */}
          <group position={[0, 0, (-args[2] / 1.5 + 6) / 2]}>
            <SingleWheelWithArch
              side="left"
              args={[0.4, 0.4, 0.3]}
              position={[(args[0] + 0.2) / 2, -0.7, (args[2] - 6.4) / 2]}
            />
            <SingleWheelWithArch
              side="right"
              args={[0.4, 0.4, 0.3]}
              position={[-(args[0] + 0.4) / 2, -0.7, (args[2] - 6.4) / 2]}
            />
          </group>
          {args[2] > 5 && (
            <group position={[0, 0, (-args[2] / 1.5 + 4) / 2]}>
              <SingleWheelWithArch
                side="left"
                args={[0.4, 0.4, 0.3]}
                position={[(args[0] + 0.2) / 2, -0.7, (args[2] - 6.4) / 2]}
              />
              <SingleWheelWithArch
                side="right"
                args={[0.4, 0.4, 0.3]}
                position={[-(args[0] + 0.4) / 2, -0.7, (args[2] - 6.4) / 2]}
              />
            </group>
          )}
        </Center>
        <Grid />
      </group>
    </>
  );
}

function CarTrailerBox({ args, ...props }: { args: [number, number, number] }) {
  return (
    <>
      <group>
        <Center scale={[1, 1, 1]} front top position={[0, 0, -3]} {...props}>
          {/* Cargo Box */}
          <Box
            args={[args[0] - 0.02, args[1], args[2]] || [1, 2.48, 1]}
            scale={[1, 1, 1]}
            position={[0, args[1] / 2 - 0.6, 0]}
            castShadow
            receiveShadow
          >
            <meshPhysicalMaterial
              color="#e2e8f0"
              roughness={0.8}
              metalness={0.1}
              clearcoat={0.1}
            />
          </Box>
          <Hitch position={[0, -0.65, -args[2] / 2 - 0.9]} width={1.8} />

          {/* Chassis Base */}
          <Box
            args={[args[0], 0.1, args[2]]}
            position={[0, -0.65, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial
              color="#1e293b"
              roughness={0.9}
              metalness={0.5}
            />
          </Box>

          {/* Wheels */}
          <group position={[0, 0, (-args[2] / 1.5 + 6) / 2]}>
            <SingleWheelWithArch
              side="left"
              args={[0.4, 0.4, 0.3]}
              position={[(args[0] + 0.2) / 2, -0.7, (args[2] - 6.4) / 2]}
            />
            <SingleWheelWithArch
              side="right"
              args={[0.4, 0.4, 0.3]}
              position={[-(args[0] + 0.4) / 2, -0.7, (args[2] - 6.4) / 2]}
            />
          </group>
          {args[2] > 5 && (
            <group position={[0, 0, (-args[2] / 1.5 + 4) / 2]}>
              <SingleWheelWithArch
                side="left"
                args={[0.4, 0.4, 0.3]}
                position={[(args[0] + 0.2) / 2, -0.7, (args[2] - 6.4) / 2]}
              />
              <SingleWheelWithArch
                side="right"
                args={[0.4, 0.4, 0.3]}
                position={[-(args[0] + 0.4) / 2, -0.7, (args[2] - 6.4) / 2]}
              />
            </group>
          )}
        </Center>
        <Grid />
      </group>
    </>
  );
}

export { CarTrailerLow, CarTrailerBox };
