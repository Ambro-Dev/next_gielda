"use client";

import React, { useEffect } from "react";

import { Canvas } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  ContactShadows,
  PerspectiveCamera,
  Grid,
} from "@react-three/drei";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

import {
  LargeBoxy,
  LargeFlat,
  LargeLow,
  LargeTanker,
} from "@/components/models/large-truck";
import {
  MediumBoxy,
  MediumLow,
  MediumTanker,
  MediumFlat,
} from "@/components/models/medium-truck";
import {
  SmallBoxy,
  SmallFlat,
  SmallLow,
} from "@/components/models/small-truck";
import Bus from "@/components/models/bus";
import { CarTrailerBox, CarTrailerLow } from "@/components/models/car-trailer";

type VehicleModelComponent = ({
  args,
  ...props
}: {
  args: [number, number, number];
}) => React.JSX.Element;

const vehicleModelMap: Record<string, VehicleModelComponent> = {
  large_box: LargeBoxy,
  large_low: LargeLow,
  large_tanker: LargeTanker,
  large_flat: LargeFlat,
  medium_box: MediumBoxy,
  medium_low: MediumLow,
  medium_tanker: MediumTanker,
  medium_flat: MediumFlat,
  small_box: SmallBoxy,
  small_low: SmallLow,
  small_flat: SmallFlat,
  bus: Bus,
  car_trailer_box: CarTrailerBox,
  car_trailer_low: CarTrailerLow,
};

type Props = {
  className?: string;
  vehicleType: string;
  vehicleSize: [number, number, number];
};

export const VehicleVizualization = ({
  className,
  vehicleSize,
  vehicleType,
}: Props) => {
  const [zoom, setZoom] = React.useState(4);
  const [position, setPosition] = React.useState<[number, number, number]>([
    0, 0, 0,
  ]);

  const VehicleModel = vehicleModelMap[vehicleType] || LargeBoxy;

  useEffect(() => {
    setPosition(
      vehicleType.includes("large")
        ? [0, 0, -5]
        : vehicleType.includes("medium")
          ? [0, 0, -2]
          : [0, 0, 0],
    );
    setZoom(
      vehicleType.includes("large")
        ? 2.8
        : vehicleType.includes("medium")
          ? 3.5
          : 4,
    );
  }, [vehicleType]);

  const ZoomControl = () => {
    return (
      <div className="absolute top-2 flex flex-col right-2 gap-2 z-10">
        <Button
          className="rounded-md"
          size="icon"
          onClick={() => setZoom((prev) => prev + 0.1)}
        >
          <Plus />
        </Button>
        <Button
          className="rounded-md"
          size="icon"
          onClick={() => setZoom((prev) => prev - 0.1)}
        >
          <Minus />
        </Button>
      </div>
    );
  };

  return (
    <div className={cn(className, "w-full h-full rounded-md relative")}>
      <ZoomControl />
      <Canvas
        shadows
        orthographic
        gl={{
          preserveDrawingBuffer: true,
          powerPreference: "high-performance",
          antialias: true,
        }}
        className="w-full h-full rounded-md"
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
            console.warn("WebGL Context Lost");
          });
        }}
      >
        <color attach="background" args={["#f8fafc"]} />

        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        <group position={position}>
          <VehicleModel args={vehicleSize} />
        </group>

        <OrbitControls
          autoRotate={true}
          autoRotateSpeed={0.5}
          zoomSpeed={0.5}
          minZoom={10}
          maxZoom={200}
          enablePan={true}
          dampingFactor={0.05}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2 - 0.05}
        />
        <PerspectiveCamera
          makeDefault
          position={[15, 15, 15]}
          fov={45}
          zoom={zoom}
        />

        <Environment preset="city" />

        <ContactShadows
          position={[0, -0.01, 0]}
          opacity={0.6}
          scale={30}
          blur={2}
          far={10}
          resolution={256}
          color="#000000"
        />

        <Grid
          position={[0, -0.02, 0]}
          args={[50, 50]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#e2e8f0"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#cbd5e1"
          fadeDistance={30}
          fadeStrength={1}
        />
      </Canvas>
    </div>
  );
};
