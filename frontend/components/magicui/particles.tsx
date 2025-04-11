"use client";

import { cn } from "@/lib/utils";
import React, {
  ComponentPropsWithoutRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface MousePosition {
  x: number;
  y: number;
}

function useMousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return mousePosition;
}

interface ParticlesProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
}

type Circle = {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
};

function hexToRgb(hex: string): number[] {
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex.split("").map(c => c + c).join("");
  }
  const bigint = parseInt(hex, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

export const Particles: React.FC<ParticlesProps> = ({
  className = "",
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = "#ffffff",
  vx = 0,
  vy = 0,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const rafID = useRef<number | null>(null);
  const resizeTimeout = useRef<NodeJS.Timeout | null>(null);
  const circles = useRef<Circle[]>([]);
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
  const mousePosition = useMousePosition();
  const mouse = useRef({ x: 0, y: 0 });
  const canvasSize = useRef({ w: 0, h: 0 });

  const rgb = hexToRgb(color);

  const clearContext = useCallback(() => {
    if (contextRef.current) {
      contextRef.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);
    }
  }, []);

  const drawCircle = useCallback((circle: Circle, update = false) => {
    if (contextRef.current) {
      const { x, y, translateX, translateY, size, alpha } = circle;
      contextRef.current.translate(translateX, translateY);
      contextRef.current.beginPath();
      contextRef.current.arc(x, y, size, 0, 2 * Math.PI);
      contextRef.current.fillStyle = `rgba(${rgb.join(",")},${alpha})`;
      contextRef.current.fill();
      contextRef.current.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!update) circles.current.push(circle);
    }
  }, [rgb, dpr]);

  const circleParams = useCallback((): Circle => {
    const x = Math.floor(Math.random() * canvasSize.current.w);
    const y = Math.floor(Math.random() * canvasSize.current.h);
    const pSize = Math.floor(Math.random() * 2) + size;
    return {
      x, y, translateX: 0, translateY: 0, size: pSize, alpha: 0,
      targetAlpha: parseFloat((Math.random() * 0.6 + 0.1).toFixed(1)),
      dx: (Math.random() - 0.5) * 0.1,
      dy: (Math.random() - 0.5) * 0.1,
      magnetism: 0.1 + Math.random() * 4,
    };
  }, [size]);

  const drawParticles = useCallback(() => {
    clearContext();
    circles.current = [];
    for (let i = 0; i < quantity; i++) {
      drawCircle(circleParams());
    }
  }, [clearContext, drawCircle, circleParams, quantity]);

  const resizeCanvas = useCallback(() => {
    if (containerRef.current && canvasRef.current && contextRef.current) {
      canvasSize.current.w = containerRef.current.offsetWidth;
      canvasSize.current.h = containerRef.current.offsetHeight;
      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      contextRef.current.scale(dpr, dpr);
      drawParticles();
    }
  }, [drawParticles, dpr]);

  const animate = useCallback(() => {
    clearContext();
    circles.current.forEach((circle, i) => {
      const edge = [
        circle.x + circle.translateX - circle.size,
        canvasSize.current.w - circle.x - circle.translateX - circle.size,
        circle.y + circle.translateY - circle.size,
        canvasSize.current.h - circle.y - circle.translateY - circle.size,
      ];
      const closest = Math.min(...edge);
      const remap = Math.max(((closest - 0) * (1 - 0)) / (20 - 0) + 0, 0);

      circle.alpha = remap > 1 ? Math.min(circle.alpha + 0.02, circle.targetAlpha) : circle.targetAlpha * remap;
      circle.x += circle.dx + vx;
      circle.y += circle.dy + vy;
      circle.translateX += (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) / ease;
      circle.translateY += (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) / ease;

      drawCircle(circle, true);

      if (
        circle.x < -circle.size || circle.x > canvasSize.current.w + circle.size ||
        circle.y < -circle.size || circle.y > canvasSize.current.h + circle.size
      ) {
        circles.current.splice(i, 1);
        drawCircle(circleParams());
      }
    });
    rafID.current = window.requestAnimationFrame(animate);
  }, [clearContext, drawCircle, circleParams, staticity, ease, vx, vy]);

  const onMouseMove = useCallback(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { w, h } = canvasSize.current;
      const x = mousePosition.x - rect.left - w / 2;
      const y = mousePosition.y - rect.top - h / 2;
      if (x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2) {
        mouse.current = { x, y };
      }
    }
  }, [mousePosition]);

  const initCanvas = useCallback(() => {
    resizeCanvas();
    drawParticles();
  }, [resizeCanvas, drawParticles]);

  useEffect(() => {
    contextRef.current = canvasRef.current?.getContext("2d") || null;
    initCanvas();
    animate();

    const handleResize = () => {
      clearTimeout(resizeTimeout.current!);
      resizeTimeout.current = setTimeout(initCanvas, 200);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.cancelAnimationFrame(rafID.current!);
      clearTimeout(resizeTimeout.current!);
      window.removeEventListener("resize", handleResize);
    };
  }, [initCanvas, animate]);

  useEffect(() => {
    onMouseMove();
  }, [onMouseMove]);

  useEffect(() => {
    if (refresh) initCanvas();
  }, [refresh, initCanvas]);

  return (
    <div
      className={cn("pointer-events-none", className)}
      ref={containerRef}
      aria-hidden="true"
      {...props}
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
};
