"use client";

import React from "react";
import { Line, Text } from "@react-three/drei";

type DimensionLinesProps = {
  args: [number, number, number]; // [width, height, length]
  position?: [number, number, number];
};

export function DimensionLines({
  args,
  position = [0, 0, 0],
}: DimensionLinesProps) {
  const [width, height, length] = args;
  const color = "#ef4444"; // red-500
  const lineWidth = 2;
  const offset = 0.5; // Distance from the box

  // Calculate positions relative to the box center
  // Assuming the box is centered at [0, height/2, 0] relative to its local group
  const boxCenterY = height / 2;

  return (
    <group position={position}>
      {/* Length Line (Z-axis) */}
      <group position={[width / 2 + offset, 0, 0]}>
        <Line
          points={[
            [0, 0, -length / 2],
            [0, 0, length / 2],
          ]}
          color={color}
          lineWidth={lineWidth}
        />
        {/* End markers */}
        <Line
          points={[
            [-0.2, 0, -length / 2],
            [0.2, 0, -length / 2],
          ]}
          color={color}
          lineWidth={lineWidth}
        />
        <Line
          points={[
            [-0.2, 0, length / 2],
            [0.2, 0, length / 2],
          ]}
          color={color}
          lineWidth={lineWidth}
        />
        <Text
          position={[0.3, 0, 0]}
          rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
          fontSize={0.4}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          {`${length.toFixed(2)}m`}
        </Text>
      </group>

      {/* Width Line (X-axis) */}
      <group position={[0, 0, length / 2 + offset]}>
        <Line
          points={[
            [-width / 2, 0, 0],
            [width / 2, 0, 0],
          ]}
          color={color}
          lineWidth={lineWidth}
        />
        {/* End markers */}
        <Line
          points={[
            [-width / 2, 0, -0.2],
            [-width / 2, 0, 0.2],
          ]}
          color={color}
          lineWidth={lineWidth}
        />
        <Line
          points={[
            [width / 2, 0, -0.2],
            [width / 2, 0, 0.2],
          ]}
          color={color}
          lineWidth={lineWidth}
        />
        <Text
          position={[0, 0, 0.3]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.4}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          {`${width.toFixed(2)}m`}
        </Text>
      </group>

      {/* Height Line (Y-axis) */}
      <group position={[-width / 2 - offset, boxCenterY, length / 2]}>
        <Line
          points={[
            [0, -height / 2, 0],
            [0, height / 2, 0],
          ]}
          color={color}
          lineWidth={lineWidth}
        />
        {/* End markers */}
        <Line
          points={[
            [-0.2, -height / 2, 0],
            [0.2, -height / 2, 0],
          ]}
          color={color}
          lineWidth={lineWidth}
        />
        <Line
          points={[
            [-0.2, height / 2, 0],
            [0.2, height / 2, 0],
          ]}
          color={color}
          lineWidth={lineWidth}
        />
        <Text
          position={[-0.3, 0, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          fontSize={0.4}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          {`${height.toFixed(2)}m`}
        </Text>
      </group>
    </group>
  );
}
