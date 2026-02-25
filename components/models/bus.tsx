"use client";

import React from "react";

import { Center, Box } from "@react-three/drei";
import { Grid } from "./grid";
import { DoubleWheel } from "./shared-parts";

function Bus({ args, ...props }: { args: [number, number, number] }) {
  return (
    <>
      <group>
        <Center scale={[1, 1, 1]} front position={[0, 0, -2]} top {...props}>
          {/* Bus Body */}
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
              <meshPhysicalMaterial
                color="#e2e8f0"
                roughness={0.2}
                metalness={0.1}
                clearcoat={0.5}
              />
            </Box>
            <Box
              args={[args[1], 0.03, args[2]]}
              position={[-args[0] / 2 + 0.02, args[1] / 2, 0]}
              rotation={[0, 0, Math.PI / 2]}
              castShadow
              receiveShadow
            >
              <meshPhysicalMaterial
                color="#e2e8f0"
                roughness={0.2}
                metalness={0.1}
                clearcoat={0.5}
              />
            </Box>
            {/* Roof */}
            <Box
              args={[args[0] - 0.02, 0.03, args[2]]}
              position={[0, args[1] - 0.01, 0]}
              castShadow
              receiveShadow
            >
              <meshPhysicalMaterial
                color="#cbd5e1"
                roughness={0.4}
                metalness={0.1}
                clearcoat={0.2}
              />
            </Box>
            {/* Back Wall */}
            <Box
              args={[args[1], 0.03, args[0] - 0.03]}
              position={[0, args[1] / 2, -args[2] / 2 + 0.02]}
              rotation={[0, Math.PI / 2, Math.PI / 2]}
              castShadow
              receiveShadow
            >
              <meshPhysicalMaterial
                color="#e2e8f0"
                roughness={0.2}
                metalness={0.1}
                clearcoat={0.5}
              />
            </Box>
            {/* Front Wall (Windshield area) */}
            <Box
              args={[args[1], 0.03, args[0] - 0.03]}
              position={[0, args[1] / 2, args[2] / 2 - 0.02]}
              rotation={[0, Math.PI / 2, Math.PI / 2]}
              castShadow
              receiveShadow
            >
              <meshPhysicalMaterial
                color="#94a3b8"
                roughness={0.1}
                metalness={0.8}
                transmission={0.9}
                thickness={0.1}
              />
            </Box>
          </group>

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
          <group position={[0, 0, (-args[2] / 2.2 + 6) / 2]}>
            <DoubleWheel
              side="left"
              args={[0.4, 0.4, 0.4]}
              position={[(args[0] - 0.5) / 2, -0.7, (args[2] - 6.4) / 2]}
            />
            <DoubleWheel
              side="right"
              args={[0.4, 0.4, 0.4]}
              position={[-(args[0] - 0.3) / 2, -0.7, (args[2] - 6.4) / 2]}
            />
          </group>
          {args[2] > 5 && (
            <group position={[0, 0, (-args[2] / 2.2 + 4) / 2]}>
              <DoubleWheel
                side="left"
                args={[0.4, 0.4, 0.4]}
                position={[(args[0] - 0.5) / 2, -0.7, (args[2] - 6.4) / 2]}
              />
              <DoubleWheel
                side="right"
                args={[0.4, 0.4, 0.4]}
                position={[-(args[0] - 0.3) / 2, -0.7, (args[2] - 6.4) / 2]}
              />
            </group>
          )}
        </Center>
        <Grid />
      </group>
    </>
  );
}

export default Bus;
