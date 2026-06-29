"use client";

import React, { useEffect, useRef, useState } from "react";

export const Component = ({ children }: { children?: React.ReactNode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;
    const speed = 0.02;
    const scale = 2;
    const noiseIntensity = 0.8;

    const resizeCanvas = () => {
      // Scale down canvas dimensions to maintain butter-smooth 60fps performance on high-DPI screens
      canvas.width = Math.max(120, Math.ceil(window.innerWidth / 4));
      canvas.height = Math.max(90, Math.ceil(window.innerHeight / 4));
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Simple noise function
    const noise = (x: number, y: number) => {
      const G = 2.71828;
      const rx = G * Math.sin(G * x);
      const ry = G * Math.sin(G * y);
      return (rx * ry * (1 + x)) % 1;
    };

    const animate = () => {
      const { width, height } = canvas;
      if (width === 0 || height === 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      // Create gradient background matching the Project Chakravek dark aesthetic
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#020617");
      gradient.addColorStop(0.5, "#090d1f");
      gradient.addColorStop(1, "#020617");
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Create silk-like pattern
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;

      // Loop with step of 2 for extremely high performance
      for (let x = 0; x < width; x += 2) {
        for (let y = 0; y < height; y += 2) {
          const u = (x / width) * scale;
          const v = (y / height) * scale;
          
          const tOffset = speed * time;
          const tex_x = u;
          const tex_y = v + 0.03 * Math.sin(8.0 * tex_x - tOffset);

          const pattern = 0.6 + 0.4 * Math.sin(
            5.0 * (tex_x + tex_y + 
              Math.cos(3.0 * tex_x + 5.0 * tex_y) + 
              0.02 * tOffset) +
            Math.sin(20.0 * (tex_x + tex_y - 0.1 * tOffset))
          );

          const rnd = noise(x, y);
          const intensity = Math.max(0, pattern - rnd / 15.0 * noiseIntensity);
          
          // Teal-cyan/slate color spectrum matching the secure operations room look
          const r = Math.floor(10 * intensity);
          const g = Math.floor(75 * intensity);
          const b = Math.floor(90 * intensity);
          const a = 140;

          // Write 2x2 pixel blocks to the buffer
          for (let dx = 0; dx < 2 && x + dx < width; dx++) {
            for (let dy = 0; dy < 2 && y + dy < height; dy++) {
              const index = ((y + dy) * width + (x + dx)) * 4;
              if (index < data.length) {
                data[index] = r;
                data[index + 1] = g;
                data[index + 2] = b;
                data[index + 3] = a;
              }
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Add subtle vignette overlay for depth
      const overlayGradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width, height) / 2
      );
      overlayGradient.addColorStop(0, "rgba(0, 0, 0, 0)");
      overlayGradient.addColorStop(1, "rgba(2, 6, 23, 0.8)");
      
      ctx.fillStyle = overlayGradient;
      ctx.fillRect(0, 0, width, height);

      time += 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(2rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUpDelay {
          from {
            opacity: 0;
            transform: translateY(1rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInCorner {
          from {
            opacity: 0;
            transform: translateY(-1rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
        
        .animate-fade-in-up-delay {
          animation: fadeInUpDelay 1s ease-out 0.3s forwards;
        }
        
        .animate-fade-in-corner {
          animation: fadeInCorner 1s ease-out 0.9s forwards;
        }
        
        .silk-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          filter: blur(8px);
          transform: scale(1.05); /* hide blurry edges */
        }
      `}</style>
      
      <div className="relative min-h-screen w-full overflow-x-hidden bg-black flex flex-col">
        {/* Animated Silk Background */}
        <canvas 
          ref={canvasRef}
          className="silk-canvas pointer-events-none"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />

        {/* Content Wrapper */}
        <div className="relative z-20 w-full h-full flex-grow flex flex-col justify-center">
          {children ? (
            children
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center px-8">
                {/* Main Title */}
                <h1 
                  className={`
                    text-6xl sm:text-8xl md:text-9xl lg:text-[12rem] xl:text-[14rem] 
                    font-light tracking-[-0.05em] leading-none
                    text-white mix-blend-difference
                    opacity-0
                    ${isLoaded ? "animate-fade-in-up" : ""}
                  `}
                  style={{ 
                    textShadow: "0 0 40px rgba(255, 255, 255, 0.1)"
                  }}
                >
                  silk
                </h1>

                {/* Subtitle */}
                <div 
                  className={`
                    mt-8 text-lg md:text-xl lg:text-2xl 
                    font-extralight tracking-[0.2em] uppercase
                    text-gray-300/80 mix-blend-overlay
                    opacity-0
                    ${isLoaded ? "animate-fade-in-up-delay" : ""}
                  `}
                >
                  <span className="inline-block">flowing</span>
                  <span className="mx-4 text-gray-500">•</span>
                  <span className="inline-block">texture</span>
                  <span className="mx-4 text-gray-500">•</span>
                  <span className="inline-block">art</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Corner Accent only if not displaying children */}
        {!children && (
          <div 
            className={`
              absolute top-8 left-8 z-30
              text-xs font-light tracking-widest uppercase
              text-gray-500/40 mix-blend-overlay
              opacity-0
              ${isLoaded ? "animate-fade-in-corner" : ""}
            `}
          >
            2025
          </div>
        )}
      </div>
    </>
  );
};
