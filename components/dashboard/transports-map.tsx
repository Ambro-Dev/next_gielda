"use client";

import { Transport } from "@/app/(private)/transport/page";
import CardWithMap from "@/components/CardWithMap";
import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";

const MotionDiv = motion.div as React.FC<HTMLMotionProps<"div"> & { className?: string; children?: React.ReactNode }>;

const TransportsMap = ({ transports }: { transports: Transport[] }) => {
  return (
    <MotionDiv
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {transports &&
        transports.map((item) => (
          <MotionDiv key={item.id} variants={fadeUp}>
            <CardWithMap transport={item} />
          </MotionDiv>
        ))}
    </MotionDiv>
  );
};

export default TransportsMap;
