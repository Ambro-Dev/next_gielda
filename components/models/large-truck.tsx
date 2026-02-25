"use client";

import React from "react";

import { Center, Box, Cylinder } from "@react-three/drei";
import { Grid } from "./grid";
import { DimensionLines } from "./dimension-lines";
import { DoubleWheel, Tractor } from "./shared-parts";

function LargeBoxy({ args, ...props }: { args: [number, number, number] }) {
  return (
    <>
      <group>
        <Center scale={[1, 1, 1]} front position={[0, 0, -2]} top {...props}>
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
            args={[args[0], 0.1, args[2]]}
            position={[0, 0.05, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial
              color="#1e293b"
              roughness={0.9}
              metalness={0.5}
            />
          </Box>

          {/* Tractor */}
          <group position={[0, 0, args[2] / 2 + 1.2]}>
            <Tractor width={args[0]} color="#3b82f6" />
          </group>

          {/* Trailer Wheels (3 axles at the rear) */}
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
          {args[2] > 5 && (
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
          {args[2] > 8 && (
            <group position={[0, 0, -args[2] / 2 + 3.9]}>
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

          {/* Dimension Lines */}
          <DimensionLines args={args} position={[0, 0.1, 0]} />
        </Center>
        <Grid />
      </group>
    </>
  );
}

function LargeLow({ args, ...props }: { args: [number, number, number] }) {
  return (
    <>
      <group>
        <Center scale={[1, 1, 1]} front position={[0, 0, -2]} top {...props}>
          {/* Chassis Base */}
          <Box
            args={[args[0], 0.1, args[2]]}
            position={[0, 0.05, 0]}
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

          {/* Tractor */}
          <group position={[0, 0, args[2] / 2 + 1.2]}>
            <Tractor width={args[0]} color="#ef4444" />
          </group>

          {/* Trailer Wheels (3 axles at the rear) */}
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
          {args[2] > 5 && (
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
          {args[2] > 8 && (
            <group position={[0, 0, -args[2] / 2 + 3.9]}>
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

function LargeFlat({ args, ...props }: { args: [number, number, number] }) {
  return (
    <>
      <group>
        <Center scale={[1, 1, 1]} front top position={[0, 0, -2]} {...props}>
          {/* Chassis Base */}
          <Box
            args={[args[0], 0.1, args[2]]}
            position={[0, 0.05, 0]}
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

          {/* Tractor */}
          <group position={[0, 0, args[2] / 2 + 1.2]}>
            <Tractor width={args[0]} color="#10b981" />
          </group>

          {/* Trailer Wheels (3 axles at the rear) */}
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
          {args[2] > 5 && (
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
          {args[2] > 8 && (
            <group position={[0, 0, -args[2] / 2 + 3.9]}>
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

function LargeTanker({ args, ...props }: { args: [number, number, number] }) {
  return (
    <>
      <group>
        <Center scale={[1, 1, 1]} front top position={[0, 0, -2]} {...props}>
          {/* Tank */}
          <Cylinder
            args={[args[1], args[1], args[0]] || [1, 1, 1]}
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
            args={[args[1] + 1.5, 0.2, args[0]]}
            position={[0, 0, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial
              color="#1e293b"
              roughness={0.9}
              metalness={0.5}
            />
          </Box>

          {/* Tractor */}
          <group position={[0, 0, args[0] / 2 + 1.2]}>
            <Tractor width={args[1] + 1.5} color="#f59e0b" />
          </group>

          {/* Trailer Wheels (3 axles at the rear) */}
          <group position={[0, 0, -args[0] / 2 + 1.5]}>
            <DoubleWheel
              side="left"
              args={[0.5, 0.5, 0.3]}
              position={[(args[1] + 1.5 - 0.8) / 2, -0.6, 0]}
            />
            <DoubleWheel
              side="right"
              args={[0.5, 0.5, 0.3]}
              position={[-(args[1] + 1.5 - 0.8) / 2, -0.6, 0]}
            />
          </group>
          {args[0] > 5 && (
            <group position={[0, 0, -args[0] / 2 + 2.7]}>
              <DoubleWheel
                side="left"
                args={[0.5, 0.5, 0.3]}
                position={[(args[1] + 1.5 - 0.8) / 2, -0.6, 0]}
              />
              <DoubleWheel
                side="right"
                args={[0.5, 0.5, 0.3]}
                position={[-(args[1] + 1.5 - 0.8) / 2, -0.6, 0]}
              />
            </group>
          )}
          {args[0] > 8 && (
            <group position={[0, 0, -args[0] / 2 + 3.9]}>
              <DoubleWheel
                side="left"
                args={[0.5, 0.5, 0.3]}
                position={[(args[1] + 1.5 - 0.8) / 2, -0.6, 0]}
              />
              <DoubleWheel
                side="right"
                args={[0.5, 0.5, 0.3]}
                position={[-(args[1] + 1.5 - 0.8) / 2, -0.6, 0]}
              />
            </group>
          )}
        </Center>
        <Grid />
      </group>
    </>
  );
}

export { LargeBoxy, LargeLow, LargeFlat, LargeTanker };
