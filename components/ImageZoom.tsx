"use client";

import { useState } from 'react';
import Image from 'next/image';

interface ImageZoomProps {
  src: string;
  alt: string;
}

export default function ImageZoom({ src, alt }: ImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div 
      className="relative aspect-square w-full rounded-2xl overflow-hidden bg-custom-parchment border border-gray-200 cursor-crosshair group shadow-sm"
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 z-10 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex justify-center items-end">
        <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-custom-forest border border-gray-200 shadow-sm">
          🔍 Hover to Zoom Image
        </span>
      </div>

      <div 
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{
          transform: isZoomed ? 'scale(2)' : 'scale(1)',
          transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
    </div>
  );
}
