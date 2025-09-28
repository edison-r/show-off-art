"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

type ParallaxItemProps = {
  src: string;
  alt: string;
  className?: string; 
  speed?: number;
};

export default function ParallaxItem({
  src,
  alt,
  className = "",
  speed = 1,
}: ParallaxItemProps) {
    const ref = useRef<HTMLDivElement>(null);

    const { scrollY } = useScroll();

    const y = useTransform(scrollY, [0, 800], [0, 40 * speed]);

    return (
        <motion.div ref={ref} style={{ y }} className={className}>
        <div className="relative w-full h-full rounded overflow-hidden">
            <Image src={src} alt={alt} fill className="object-cover" />
        </div>
        </motion.div>
    );
}
