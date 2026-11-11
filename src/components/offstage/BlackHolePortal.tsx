import { useEffect, useRef } from "react";

type Star = { x: number; y: number; size: number; alpha: number; phase: number; depth: number };
type Particle = { radius: number; angle: number; speed: number; size: number; alpha: number; hot: boolean };

function seededRandom(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function BlackHolePortal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const random = seededRandom(42);
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let width = 0;
    let height = 0;
    let frame = 0;
    let stars: Star[] = [];
    let colors = { background: "", foreground: "", primary: "", hot: "", cool: "", core: "" };

    const particles: Particle[] = Array.from({ length: 170 }, () => ({
      radius: 0.92 + random() * 1.55,
      angle: random() * Math.PI * 2,
      speed: (0.09 + random() * 0.24) * (random() > 0.12 ? 1 : -1),
      size: 0.35 + random() * 1.65,
      alpha: 0.2 + random() * 0.8,
      hot: random() > 0.68,
    }));

    const readColors = () => {
      const styles = getComputedStyle(canvas);
      colors = {
        background: styles.getPropertyValue("--background").trim(),
        foreground: styles.getPropertyValue("--foreground").trim(),
        primary: styles.getPropertyValue("--primary").trim(),
        hot: styles.getPropertyValue("--portal-hot").trim(),
        cool: styles.getPropertyValue("--portal-cool").trim(),
        core: styles.getPropertyValue("--portal-core").trim(),
      };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      readColors();
      stars = Array.from({ length: Math.min(260, Math.round((width * height) / 6500)) }, () => ({
        x: random(),
        y: random(),
        size: 0.3 + random() * 1.35,
        alpha: 0.15 + random() * 0.65,
        phase: random() * Math.PI * 2,
        depth: 0.25 + random() * 0.75,
      }));
      if (reducedMotion) draw(0);
    };

    const movePointer = (event: PointerEvent) => {
      pointer.targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.targetY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const glow = (x: number, y: number, inner: number, outer: number, color: string, alpha: number) => {
      const gradient = context.createRadialGradient(x, y, inner, x, y, outer);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, "transparent");
      context.save();
      context.globalAlpha = alpha;
      context.fillStyle = gradient;
      context.fillRect(x - outer, y - outer, outer * 2, outer * 2);
      context.restore();
    };

    const diskPoint = (cx: number, cy: number, radius: number, angle: number, rotation: number) => {
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.29;
      return {
        x: cx + x * Math.cos(rotation) - y * Math.sin(rotation),
        y: cy + x * Math.sin(rotation) + y * Math.cos(rotation),
        front: Math.sin(angle) > 0,
      };
    };

    const drawParticles = (time: number, cx: number, cy: number, radius: number, rotation: number, front: boolean) => {
      context.save();
      context.globalCompositeOperation = "lighter";
      for (const particle of particles) {
        const angle = particle.angle + time * particle.speed;
        const point = diskPoint(cx, cy, radius * particle.radius, angle, rotation);
        if (point.front !== front) continue;
        const depth = point.front ? 1 : 0.62;
        context.globalAlpha = particle.alpha * depth * (0.72 + Math.sin(time * 1.8 + particle.angle) * 0.28);
        context.fillStyle = particle.hot ? colors.hot : colors.primary;
        context.beginPath();
        context.arc(point.x, point.y, particle.size * depth, 0, Math.PI * 2);
        context.fill();
      }
      context.restore();
    };

    const drawDisk = (cx: number, cy: number, radius: number, rotation: number, time: number, frontOnly: boolean) => {
      context.save();
      context.translate(cx, cy);
      context.rotate(rotation);
      context.scale(1, 0.29);
      context.globalCompositeOperation = "lighter";

      const rings = [
        { radius: 1.04, width: 0.075, alpha: 0.95, color: colors.hot },
        { radius: 1.16, width: 0.12, alpha: 0.58, color: colors.primary },
        { radius: 1.38, width: 0.2, alpha: 0.23, color: colors.primary },
        { radius: 1.68, width: 0.18, alpha: 0.14, color: colors.cool },
        { radius: 2.02, width: 0.1, alpha: 0.12, color: colors.primary },
        { radius: 2.35, width: 0.035, alpha: 0.18, color: colors.cool },
      ];

      for (const ring of rings) {
        context.beginPath();
        context.arc(0, 0, radius * ring.radius, frontOnly ? 0 : Math.PI, frontOnly ? Math.PI : Math.PI * 2);
        context.strokeStyle = ring.color;
        context.globalAlpha = ring.alpha;
        context.lineWidth = radius * ring.width;
        context.shadowColor = ring.color;
        context.shadowBlur = frontOnly ? radius * 0.18 : radius * 0.08;
        context.stroke();
      }

      context.shadowBlur = radius * 0.12;
      context.lineCap = "round";
      for (let index = 0; index < 18; index += 1) {
        const orbit = 1.1 + (index % 7) * 0.19;
        const start = index * 1.83 + time * (0.11 + (index % 4) * 0.035);
        const isFront = Math.sin(start + 0.35) > 0;
        if (isFront !== frontOnly) continue;
        context.beginPath();
        context.arc(0, 0, radius * orbit, start, start + 0.22 + (index % 3) * 0.15);
        context.strokeStyle = index % 4 === 0 ? colors.hot : colors.primary;
        context.globalAlpha = 0.25 + (index % 5) * 0.11;
        context.lineWidth = Math.max(1, radius * (0.012 + (index % 3) * 0.008));
        context.stroke();
      }
      context.restore();
    };

    const draw = (timestamp: number) => {
      const time = reducedMotion ? 0 : timestamp / 1000;
      pointer.x += (pointer.targetX - pointer.x) * 0.035;
      pointer.y += (pointer.targetY - pointer.y) * 0.035;

      context.clearRect(0, 0, width, height);
      context.fillStyle = colors.background;
      context.fillRect(0, 0, width, height);

      const mobile = width < 768;
      const cx = width * (mobile ? 0.57 : 0.69) + pointer.x * 18;
      const cy = height * (mobile ? 0.29 : 0.35) + pointer.y * 13;
      const radius = Math.min(width * (mobile ? 0.19 : 0.135), height * 0.19);
      const rotation = -0.17 + pointer.x * 0.025;

      glow(cx, cy, 0, radius * 5.4, colors.cool, 0.055);
      glow(cx, cy, radius * 0.6, radius * 3.6, colors.primary, 0.12);

      for (const star of stars) {
        const x = star.x * width + pointer.x * star.depth * 13;
        const y = star.y * height + pointer.y * star.depth * 9;
        const twinkle = reducedMotion ? 1 : 0.72 + Math.sin(time * 0.8 + star.phase) * 0.28;
        context.globalAlpha = star.alpha * twinkle;
        context.fillStyle = star.size > 1.2 ? colors.primary : colors.foreground;
        context.beginPath();
        context.arc(x, y, star.size, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;

      drawParticles(time, cx, cy, radius, rotation, false);
      drawDisk(cx, cy, radius, rotation, time, false);

      context.save();
      context.globalCompositeOperation = "lighter";
      context.strokeStyle = colors.primary;
      context.globalAlpha = 0.24;
      context.lineWidth = Math.max(1, radius * 0.018);
      context.shadowColor = colors.primary;
      context.shadowBlur = radius * 0.22;
      context.beginPath();
      context.arc(cx, cy, radius * 1.03, Math.PI * 1.03, Math.PI * 1.96);
      context.stroke();
      context.restore();

      glow(cx, cy, 0, radius * 1.5, colors.core, 1);
      context.fillStyle = colors.core;
      context.beginPath();
      context.arc(cx, cy, radius * 0.88, 0, Math.PI * 2);
      context.fill();

      context.save();
      context.globalCompositeOperation = "lighter";
      context.strokeStyle = colors.hot;
      context.globalAlpha = 0.7;
      context.lineWidth = Math.max(1.2, radius * 0.018);
      context.shadowColor = colors.primary;
      context.shadowBlur = radius * 0.22;
      context.beginPath();
      context.arc(cx, cy, radius * 0.93, 0, Math.PI * 2);
      context.stroke();
      context.restore();

      drawDisk(cx, cy, radius, rotation, time, true);
      drawParticles(time, cx, cy, radius, rotation, true);

      const horizon = context.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.86);
      horizon.addColorStop(0, colors.core);
      horizon.addColorStop(0.82, colors.core);
      horizon.addColorStop(1, "transparent");
      context.fillStyle = horizon;
      context.beginPath();
      context.arc(cx, cy, radius * 0.86, 0, Math.PI * 2);
      context.fill();

      if (!reducedMotion) frame = requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    if (finePointer && !reducedMotion) window.addEventListener("pointermove", movePointer);
    resize();
    if (!reducedMotion) frame = requestAnimationFrame(draw);

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", movePointer);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
