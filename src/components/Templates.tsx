"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useNavigationHelper } from "../../hooks/useNavigationHelper";

const templates = [
  { id: 1, src: "tpl1.jpg", title: "Modern Portfolio", description: "Clean, flexible, and fast to customize." },
  { id: 2, src: "tpl2.jpg", title: "Creative Studio", description: "Bold design for creative professionals." },
  { id: 3, src: "tpl3.jpg", title: "Minimal Agency", description: "Elegant and sophisticated layout." },
  { id: 4, src: "tpl4.jpg", title: "Brand Showcase", description: "Perfect for showcasing your brand." },
];

export default function Templates() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
  
  const { navigateWithTransition } = useNavigationHelper();

  const infiniteTemplates = [...templates, ...templates, ...templates];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (scrollRef.current) {
      observer.observe(scrollRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const cardWidth = 320 + 24;
      const middlePosition = templates.length * cardWidth;
      container.scrollLeft = middlePosition;
    }
  }, []);

  useEffect(() => {
    if (!isInView || isPaused || isDragging) return;

    const container = scrollRef.current;
    if (!container) return;

    const scroll = () => {
      const cardWidth = 320 + 24;
      const totalWidth = templates.length * cardWidth;
      
      container.scrollLeft += 1;

      if (container.scrollLeft >= totalWidth * 2) {
        container.scrollLeft = totalWidth;
      }
    };

    autoScrollRef.current = setInterval(scroll, 50);

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [isInView, isPaused, isDragging]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const cardWidth = 320 + 24;
      const totalWidth = templates.length * cardWidth;
      const currentScroll = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (currentScroll <= cardWidth) {
        container.scrollLeft = totalWidth + cardWidth;
      }
      else if (currentScroll >= maxScroll - cardWidth) {
        container.scrollLeft = totalWidth - cardWidth;
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => {
    setIsPaused(false);
    setIsDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsPaused(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setTimeout(() => setIsPaused(false), 1000);
  };

  const handleTouchStart = () => setIsPaused(true);
  const handleTouchEnd = () => setTimeout(() => setIsPaused(false), 1000);

  const handleTemplateClick = (templateId: number) => {
    navigateWithTransition(`/template/${templateId}`, {
      direction: 'left',
      color: '#1f2937',
      duration: 1400
    });
  };

  return (
    <section id="work" className="py-8 overflow-hidden">
      <div className="mx-auto mb-2 md:px-16 xl:px-24 mt-6">
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <span>Scroll horizontally or drag</span>
          <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>

      <div
        ref={scrollRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`flex gap-6 overflow-x-auto scrollbar-hide pl-4 md:pl-16 xl:pl-24 pr-4 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {infiniteTemplates.map((template, i) => (
          <article
            key={`${template.id}-${i}`}
            onClick={() => handleTemplateClick(template.id)}
            className="flex-shrink-0 w-[500px] md:w-[550px] bg-white border border-neutral-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={`/${template.src}`}
                alt={template.title}
                fill
                className="object-cover group-hover:scale-102 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
          </article>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}