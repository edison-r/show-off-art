"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

type ParallaxItemProps = {
  src: string;
  alt: string;
  className?: string;
  speed?: number; // Multiplicador de velocidad (default: 1)
  scrollRange?: [number, number]; // Rango de scroll para el efecto
};

const DEFAULT_SCROLL_RANGE: [number, number] = [0, 1000];
const BASE_MOVEMENT = 50; // Movimiento base en píxeles

/**
 * Componente para crear efecto parallax en imágenes
 * 
 * CÓMO FUNCIONA:
 * - Escucha el scroll global de la página
 * - Transforma el valor del scroll en movimiento vertical
 * - A mayor speed, más rápido se mueve el elemento
 * 
 * @param speed - Multiplicador de velocidad (1 = normal, 2 = doble velocidad)
 * @param scrollRange - [inicio, fin] del rango de scroll para el efecto
 */
export default function ParallaxItem({
  src,
  alt,
  className = "",
  speed = 1,
  scrollRange = DEFAULT_SCROLL_RANGE,
}: ParallaxItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Obtener posición de scroll global
  const { scrollY } = useScroll();

  // Transformar scroll en movimiento vertical
  // Ejemplo: scroll de 0→1000px se traduce en movimiento de 0→50px
  const y = useTransform(
    scrollY,
    scrollRange,
    [0, BASE_MOVEMENT * speed]
  );

  return (
    <motion.div
      ref={containerRef}
      style={{ y }}
      className={`transform-gpu ${className}`}
    >
      <div className="relative w-full h-full overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </motion.div>
  );
}