"use client";

import { Transport } from "@/app/(private)/transport/page";
import CardWithMap from "@/components/CardWithMap";
import React from "react";
import { motion, AnimatePresence, type HTMLMotionProps } from "framer-motion";
import { fadeUp, staggerGrid } from "@/lib/motion";

const MotionDiv = motion.div as React.FC<
  HTMLMotionProps<"div"> & { className?: string; children?: React.ReactNode }
>;

const TransportsMap = ({ transports }: { transports: Transport[] }) => {
  return (
    <MotionDiv
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      variants={staggerGrid}
      initial="initial"
      animate="animate"
    >
      <AnimatePresence mode="sync">
        {transports.map((item, index) => (
          <MotionDiv
            key={item.id}
            variants={fadeUp}
            initial="initial"
            animate="animate"
            exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15 } }}
          >
            <CardWithMap transport={item} priority={index < 3} />
          </MotionDiv>
        ))}
      </AnimatePresence>
    </MotionDiv>
  );
};

export default TransportsMap;
