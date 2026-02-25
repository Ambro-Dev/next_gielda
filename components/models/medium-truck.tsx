"use client";

import React from "react";

import { Center, Box, Cylinder } from "@react-three/drei";
import { Grid } from "./grid";
import { DoubleWheel, Cabin } from "./shared-parts";

function MediumBoxy({ args, ...props }: { args: [number, number, number] }) {
  return (
    <>
      <group>
        <Center scale={[1, 1, 1]} front top position={[0, 0, -2]} {...props}>
          {/* Cargo Box */}
          <Box
            args={args || [1, 2.48, 1]}
            scale={[1, 1, 1]}
            position={[0, args[1] / 2 + 0.1, 0]}
            castShadow
            receiveShadow
          >
            <meshPhysicalMaterial
              color="#e2e8f0"
              roughness={0.8}
              metalness={0.1}
              clearcoat={0.1}
              transparent={false}
            />
          </Box>
          {/* Chassis Base */}
          <Box
            args={[args[0], 0.1, args[2] + 2.4]}
            position={[0, 0.05, 1.2]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial
              color="#1e293b"
              roughness={0.9}
              metalness={0.5}
            />
          </Box>

          {/* Cabin */}
          <group position={[0, 0, args[2] / 2 + 1.2]}>
            <Cabin width={args[0]} height={2.5} depth={2} color="#3b82f6" />
          </group>

          {/* Rear Wheels */}
          <group position={[0, 0, -args[2] / 2 + 1.5]}>
            <DoubleWheel
              side="left"
              args={[0.5, 0.5, 0.3]}
              position={[(args[0] - 0.8) / 2, -0.6, 0]}
            />
            <DoubleWheel
              side="right"
              args={[0.5, 0.5, 0.3]}
              position={[-(args[0] - 0.8) / 2, -0.6, 0]}
            />
          </group>
          {args[2] > 7 && (
            <group position={[0, 0, -args[2] / 2 + 2.7]}>
              <DoubleWheel
                side="left"
                args={[0.5, 0.5, 0.3]}
                position={[(args[0] - 0.8) / 2, -0.6, 0]}
              />
              <DoubleWheel
                side="right"
                args={[0.5, 0.5, 0.3]}
                position={[-(args[0] - 0.8) / 2, -0.6, 0]}
              />
            </group>
          )}
        </Center>
        <Grid />
      </group>
    </>
  );
}

function MediumLow({ args, ...props }: { args: [number, number, number] }) {
  return (
    <>
      <group>
        <Center scale={[1, 1, 1]} front position={[0, 0, -2]} top {...props}>
          {/* Chassis Base */}
          <Box
            args={[args[0], 0.1, args[2] + 2.4]}
            position={[0, 0.05, 1.2]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial
              color="#1e293b"
              roughness={0.9}
              metalness={0.5}
            />
          </Box>
          {/* Floor */}
          <Box
            args={[args[0], 0.1, args[2]]}
            position={[0, 0.15, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#475569" roughness={0.8} />
          </Box>
          {/* Side Walls */}
          <Box
            args={[args[1], 0.1, args[2]]}
            position={[args[0] / 2 - 0.05, args[1] / 2 + 0.2, 0]}
            rotation={[0, 0, Math.PI / 2]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#64748b" roughness={0.7} />
          </Box>
          <Box
            args={[args[1], 0.1, args[2]]}
            position={[-args[0] / 2 + 0.05, args[1] / 2 + 0.2, 0]}
            rotation={[0, 0, Math.PI / 2]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#64748b" roughness={0.7} />
          </Box>
          <Box
            args={[args[1], 0.1, args[0] - 0.1]}
            position={[0, args[1] / 2 + 0.2, args[2] / 2 - 0.05]}
            rotation={[0, Math.PI / 2, Math.PI / 2]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#64748b" roughness={0.7} />
          </Box>
          <Box
            args={[args[1], 0.1, args[0] - 0.1]}
            position={[0, args[1] / 2 + 0.2, -args[2] / 2 + 0.05]}
            rotation={[0, Math.PI / 2, Math.PI / 2]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#64748b" roughness={0.7} />
          </Box>

          {/* Cabin */}
          <group position={[0, 0, args[2] / 2 + 1.2]}>
            <Cabin width={args[0]} height={2.5} depth={2} color="#ef4444" />
          </group>

          {/* Rear Wheels */}
          <group position={[0, 0, -args[2] / 2 + 1.5]}>
            <DoubleWheel
              side="left"
              args={[0.5, 0.5, 0.3]}
              position={[(args[0] - 0.8) / 2, -0.6, 0]}
            />
            <DoubleWheel
              side="right"
              args={[0.5, 0.5, 0.3]}
              position={[-(args[0] - 0.8) / 2, -0.6, 0]}
            />
          </group>
          {args[2] > 7 && (
            <group position={[0, 0, -args[2] / 2 + 2.7]}>
              <DoubleWheel
                side="left"
                args={[0.5, 0.5, 0.3]}
                position={[(args[0] - 0.8) / 2, -0.6, 0]}
              />
              <DoubleWheel
                side="right"
                args={[0.5, 0.5, 0.3]}
                position={[-(args[0] - 0.8) / 2, -0.6, 0]}
              />
            </group>
          )}
        </Center>
        <Grid />
      </group>
    </>
  );
}

function MediumFlat({ args, ...props }: { args: [number, number, number] }) {
  return (
    <>
      <group>
        <Center scale={[1, 1, 1]} front position={[0, 0, -2]} top {...props}>
          {/* Chassis Base */}
          <Box
            args={[args[0], 0.1, args[2] + 2.4]}
            position={[0, 0.05, 1.2]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial
              color="#1e293b"
              roughness={0.9}
              metalness={0.5}
            />
          </Box>
          {/* Floor */}
          <Box
            args={[args[0], 0.1, args[2]]}
            position={[0, 0.15, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#475569" roughness={0.8} />
          </Box>

          {/* Cabin */}
          <group position={[0, 0, args[2] / 2 + 1.2]}>
            <Cabin width={args[0]} height={2.5} depth={2} color="#10b981" />
          </group>

          {/* Rear Wheels */}
          <group position={[0, 0, -args[2] / 2 + 1.5]}>
            <DoubleWheel
              side="left"
              args={[0.5, 0.5, 0.3]}
              position={[(args[0] - 0.8) / 2, -0.6, 0]}
            />
            <DoubleWheel
              side="right"
              args={[0.5, 0.5, 0.3]}
              position={[-(args[0] - 0.8) / 2, -0.6, 0]}
            />
          </group>
          {args[2] > 7 && (
            <group position={[0, 0, -args[2] / 2 + 2.7]}>
              <DoubleWheel
                side="left"
                args={[0.5, 0.5, 0.3]}
                position={[(args[0] - 0.8) / 2, -0.6, 0]}
              />
              <DoubleWheel
                side="right"
                args={[0.5, 0.5, 0.3]}
                position={[-(args[0] - 0.8) / 2, -0.6, 0]}
              />
            </group>
          )}
        </Center>
        <Grid />
      </group>
    </>
  );
}

function MediumTanker({ args, ...props }: { args: [number, number, number] }) {
  return (
    <>
      <group>
        <Center scale={[1, 1, 1]} front position={[0, 0, -2]} top {...props}>
          {/* Tank */}
          <Cylinder
            args={[args[1], args[1], args[2]] || [1, 1, 1]}
            scale={[1, 1, 1]}
            position={[0, args[1] + 0.2, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
            receiveShadow
          >
            <meshPhysicalMaterial
              color="#e2e8f0"
              roughness={0.3}
              metalness={0.8}
              clearcoat={1}
            />
          </Cylinder>
          {/* Chassis Base */}
          <Box
            args={[args[1] + 1.5, 0.2, args[2] + 2.4]}
            position={[0, 0.1, 1.2]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial
              color="#1e293b"
              roughness={0.9}
              metalness={0.5}
            />
          </Box>

          {/* Cabin */}
          <group position={[0, 0, args[2] / 2 + 1.2]}>
            <Cabin
              width={args[1] + 1.5}
              height={2.5}
              depth={2}
              color="#f59e0b"
            />
          </group>

          {/* Rear Wheels */}
          <group position={[0, 0, -args[2] / 2 + 1.5]}>
            <DoubleWheel
              side="left"
              args={[0.5, 0.5, 0.3]}
              position={[args[1] / 2 + 0.25, -0.6, 0]}
            />
            <DoubleWheel
              side="right"
              args={[0.5, 0.5, 0.3]}
              position={[-args[1] / 2 - 0.6, -0.6, 0]}
            />
          </group>
          {args[2] > 7 && (
            <group position={[0, 0, -args[2] / 2 + 2.7]}>
              <DoubleWheel
                side="left"
                args={[0.5, 0.5, 0.3]}
                position={[args[1] / 2 + 0.25, -0.6, 0]}
              />
              <DoubleWheel
                side="right"
                args={[0.5, 0.5, 0.3]}
                position={[-args[1] / 2 - 0.6, -0.6, 0]}
              />
            </group>
          )}
        </Center>
        <Grid />
      </group>
    </>
  );
}

export { MediumBoxy, MediumLow, MediumFlat, MediumTanker };
