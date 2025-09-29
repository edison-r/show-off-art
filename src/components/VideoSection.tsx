"use client";

import { forwardRef } from "react";

const VideoSection = forwardRef<HTMLElement>(function VideoSection(_, ref) {
  return (
    <section
      ref={ref}
      className="relative w-full h-screen mt-24 mb-16 overflow-hidden"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="/demo.mp4" type="video/mp4" />
        <source src="/demo.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay para oscurecer */}
      <div className="absolute inset-0 bg-black/30" />
    </section>
  );
});

export default VideoSection;
