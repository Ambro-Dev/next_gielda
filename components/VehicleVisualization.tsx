"use client";

import React, { use, useEffect } from "react";

import { Canvas } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  OrbitControls,
  AccumulativeShadows,
  RandomizedLight,
} from "@react-three/drei";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  vehicleSize: [number, number, number];
  VehicleModel: ({
    args,
    ...props
  }: {
    args: [number, number, number];
  }) => React.JSX.Element;
};

export const VehicleVizualization = ({
  className,
  vehicleSize,
  VehicleModel,
}: Props) => {
  const [autoRotate, setAutoRotate] = React.useState(false);
  const [shadow, setShadow] = React.useState("#fff");

  const takeScreenshot = () => {
    // Save the canvas as a *.png
    const link = document.createElement("a");
    link.setAttribute("download", "canvas.png");
    // @ts-ignore
    link.setAttribute(
      "href",
      // @ts-ignore
      document
        .querySelector("canvas")
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream")
    );
    link.click();
  };

  return (
    <Canvas
      shadows
      orthographic
      camera={{ position: [10, 20, 20], zoom: 80, fov: 60 }}
      gl={{ preserveDrawingBuffer: true }}
      className={cn(className, "w-full h-full")}
    >
      <color attach="background" args={["#f3f4f6"]} />
      <VehicleModel args={vehicleSize} />
      <OrbitControls
        autoRotate={true}
        autoRotateSpeed={-0.2}
        zoomSpeed={0.25}
        minZoom={10}
        maxZoom={200}
        enablePan={false}
        dampingFactor={0.05}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
      />
      {/** The environment is just a bunch of shapes emitting light. This is needed for the clear-coat */}
      <Environment resolution={32}>
        <group rotation={[-Math.PI / 4, -0.3, 0]}>
          <Lightformer
            intensity={20}
            rotation-x={Math.PI / 2}
            position={[0, 5, -9]}
            scale={[10, 10, 1]}
          />
          <Lightformer
            intensity={2}
            rotation-y={Math.PI / 2}
            position={[-5, 1, -1]}
            scale={[10, 2, 1]}
          />
          <Lightformer
            intensity={2}
            rotation-y={Math.PI / 2}
            position={[-5, -1, -1]}
            scale={[10, 2, 1]}
          />
          <Lightformer
            intensity={2}
            rotation-y={-Math.PI / 2}
            position={[10, 1, 0]}
            scale={[20, 2, 1]}
          />
          <Lightformer
            type="ring"
            intensity={2}
            rotation-y={Math.PI / 2}
            position={[-0.1, 0, -5]}
            scale={10}
          />
        </group>
      </Environment>
      <AccumulativeShadows
        frames={100}
        color={shadow}
        colorBlend={5}
        toneMapped={true}
        alphaTest={0.9}
        opacity={0.4}
        scale={30}
        position={[0, 0.01, 0]}
      >
        <RandomizedLight
          amount={4}
          radius={10}
          ambient={0.5}
          intensity={1}
          position={[0, 10, -10]}
          size={15}
          mapSize={1024}
          bias={0.0001}
        />
      </AccumulativeShadows>
    </Canvas>
  );
};
