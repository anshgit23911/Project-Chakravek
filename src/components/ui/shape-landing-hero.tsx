"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useTransform, useScroll, useSpring } from "framer-motion";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";


function ElegantShape({
    className,
    delay = 0,
    width = 400,
    height = 100,
    rotate = 0,
    gradient = "from-white/[0.08]",
    mouseX,
    mouseY,
}: {
    className?: string;
    delay?: number;
    width?: number;
    height?: number;
    rotate?: number;
    gradient?: string;
    mouseX?: any;
    mouseY?: any;
}) {
    const [hasLoaded, setHasLoaded] = useState(false);

    // Identify current active color-coded glow schemes
    const isIndigo = gradient.includes("indigo");
    const isRose = gradient.includes("rose");
    const isViolet = gradient.includes("violet");
    const isAmber = gradient.includes("amber");
    const isCyan = gradient.includes("cyan");

    let glowColor = "rgba(165, 180, 252, 0.25)"; // Indigo fallback
    let shadowColor = "rgba(99, 102, 241, 0.15)";
    if (isRose) {
        glowColor = "rgba(251, 113, 133, 0.3)";
        shadowColor = "rgba(244, 63, 94, 0.2)";
    } else if (isViolet) {
        glowColor = "rgba(196, 181, 253, 0.3)";
        shadowColor = "rgba(139, 92, 246, 0.2)";
    } else if (isAmber) {
        glowColor = "rgba(251, 191, 36, 0.3)";
        shadowColor = "rgba(245, 158, 11, 0.18)";
    } else if (isCyan) {
        glowColor = "rgba(34, 211, 238, 0.3)";
        shadowColor = "rgba(6, 182, 212, 0.2)";
    }

    // Scroll-out hook
    const { scrollY } = useScroll();
    const smoothScrollY = useSpring(scrollY, { damping: 50, stiffness: 200 });

    // Custom depth transforms based on size & rotation
    const scrollYOffset = useTransform(smoothScrollY, [0, 800], [0, rotate * 12 - 120]);
    const scrollOpacity = useTransform(smoothScrollY, [0, 500], [1, 0]);
    const scrollScale = useTransform(smoothScrollY, [0, 600], [1, 0.75]);

    // Mouse tracking fallback
    const defaultMouse = useMotionValue(0);
    const activeMouseX = mouseX || defaultMouse;
    const activeMouseY = mouseY || defaultMouse;

    // Movement multiplier based on dimension to convey 3D depth
    const moveXMultiplier = width * 0.08;
    const moveYMultiplier = height * 0.08;

    const mouseMoveX = useTransform(activeMouseX, (val: number) => val * moveXMultiplier);
    const mouseMoveY = useTransform(activeMouseY, (val: number) => val * moveYMultiplier);

    // Subtle 3D rotation tilt
    const mouseTiltX = useTransform(activeMouseY, (val: number) => -val * 12);
    const mouseTiltY = useTransform(activeMouseX, (val: number) => val * 12);

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: -150,
                rotate: rotate - 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
                rotate: rotate,
            }}
            transition={{
                duration: 2.4,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
                opacity: { duration: 1.2 },
            }}
            onAnimationComplete={() => setHasLoaded(true)}
            style={{
                willChange: "transform, opacity",
            }}
            className={cn("absolute", className)}
        >
            {/* Scroll-out transition layer */}
            <motion.div
                style={{
                    y: scrollYOffset,
                    opacity: scrollOpacity,
                    scale: scrollScale,
                    willChange: "transform, opacity",
                }}
            >
                {/* Mouse interaction position and 3D tilting layer */}
                <motion.div
                    style={{
                        x: mouseMoveX,
                        y: mouseMoveY,
                        rotateX: mouseTiltX,
                        rotateY: mouseTiltY,
                        transformStyle: "preserve-3d",
                        perspective: "1200px",
                        willChange: "transform",
                    }}
                >
                    {/* Floating animation layer */}
                    <motion.div
                        animate={hasLoaded ? {
                            y: [0, 15, 0],
                        } : {}}
                        transition={{
                            duration: 12,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        }}
                        style={{
                            width,
                            height,
                            willChange: "transform",
                        }}
                        className="relative"
                    >
                        {/* 1. Immersive Deep Volumetric Drop Shadow (Gives authentic floating 3D height) */}
                        <div
                            style={{
                                filter: "blur(24px)",
                                background: "rgba(0, 0, 0, 0.7)",
                            }}
                            className="absolute inset-x-2 bottom-[-20px] top-[10px] rounded-full pointer-events-none translate-y-4"
                        />

                        {/* 2. Intense Color-Matched Backlight Glow Aura */}
                        <div
                            style={{
                                filter: "blur(40px)",
                                background: `radial-gradient(circle, ${glowColor} 0%, transparent 80%)`,
                            }}
                            className="absolute -inset-10 rounded-full opacity-80 pointer-events-none"
                        />

                        {/* 3. Color Halo Backplate behind the pill border */}
                        <div
                            style={{
                                filter: "blur(12px)",
                                background: `radial-gradient(circle, ${shadowColor} 0%, transparent 70%)`,
                            }}
                            className="absolute -inset-2 rounded-full opacity-60 pointer-events-none"
                        />

                        {/* 4. Top Premium Glass Face (Original Rounded Pill with Enhanced Specular Details) */}
                        <div
                            className={cn(
                                "absolute inset-0 rounded-full",
                                "bg-gradient-to-r to-transparent",
                                gradient,
                                "backdrop-blur-[2px] border-2 border-white/[0.15]",
                                "shadow-[inset_0_2px_12px_rgba(255,255,255,0.15),0_12px_36px_0_rgba(0,0,0,0.5)]",
                                "after:absolute after:inset-0 after:rounded-full",
                                "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.25),transparent_70%)]"
                            )}
                        />
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}

function HeroGeometric({
    badge = "Design Collective",
    title1 = "Elevate Your Digital Vision",
    title2 = "Crafting Exceptional Websites",
    description = "Crafting exceptional digital experiences through innovative design and cutting-edge technology.",
    children,
}: {
    badge?: string;
    title1?: string;
    title2?: string;
    description?: string | React.ReactNode;
    children?: React.ReactNode;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 45, stiffness: 120, mass: 0.6 };
    const smoothMouseX = useSpring(mouseX, springConfig);
    const smoothMouseY = useSpring(mouseY, springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    const fadeUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                delay: 0.5 + i * 0.2,
                ease: [0.25, 0.4, 0.25, 1],
            },
        }),
    };

    return (
        <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative min-h-screen w-full flex items-center justify-center overflow-x-hidden bg-[#030303] border-b border-cyber-border select-none"
        >
            {/* Ambient Background Aura */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.1] via-transparent to-rose-500/[0.1] blur-3xl pointer-events-none" />
            
            {/* Cybernetic Tech Matrix Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <ElegantShape
                    delay={0.3}
                    width={600}
                    height={140}
                    rotate={12}
                    gradient="from-indigo-500/[0.15]"
                    className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
                    mouseX={smoothMouseX}
                    mouseY={smoothMouseY}
                />

                <ElegantShape
                    delay={0.5}
                    width={500}
                    height={120}
                    rotate={-15}
                    gradient="from-rose-500/[0.15]"
                    className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
                    mouseX={smoothMouseX}
                    mouseY={smoothMouseY}
                />

                <ElegantShape
                    delay={0.4}
                    width={300}
                    height={80}
                    rotate={-8}
                    gradient="from-violet-500/[0.15]"
                    className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
                    mouseX={smoothMouseX}
                    mouseY={smoothMouseY}
                />

                <ElegantShape
                    delay={0.6}
                    width={200}
                    height={60}
                    rotate={20}
                    gradient="from-amber-500/[0.15]"
                    className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
                    mouseX={smoothMouseX}
                    mouseY={smoothMouseY}
                />

                <ElegantShape
                    delay={0.7}
                    width={150}
                    height={40}
                    rotate={-25}
                    gradient="from-cyan-500/[0.15]"
                    className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
                    mouseX={smoothMouseX}
                    mouseY={smoothMouseY}
                />
            </div>

            <div className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        custom={0}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-6 md:mb-8"
                    >
                        <Circle className="h-2 w-2 fill-rose-500/80 animate-pulse" />
                        <span className="text-xs text-white/60 tracking-wide uppercase font-mono">
                            {badge}
                        </span>
                    </motion.div>

                    <motion.div
                        custom={1}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-4 md:mb-6 tracking-tight leading-none">
                            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                                {title1}
                            </span>
                            <br />
                            <span
                                className={cn(
                                    "bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300"
                                )}
                            >
                                {title2}
                            </span>
                        </h1>
                    </motion.div>

                    <motion.div
                        custom={2}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="text-sm sm:text-base md:text-lg text-white/40 mb-8 leading-relaxed font-light max-w-2xl mx-auto px-4">
                            {typeof description === "string" ? (
                                <p>{description}</p>
                            ) : (
                                description
                            )}
                        </div>
                    </motion.div>

                    {children && (
                        <motion.div
                            custom={3}
                            variants={fadeUpVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {children}
                        </motion.div>
                    )}
                </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />
        </div>
    );
}

export { HeroGeometric };
