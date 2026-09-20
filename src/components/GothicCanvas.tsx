import { useEffect, useRef } from 'react';

interface GothicCanvasProps {
  night: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  isBlood: boolean;
}

interface Bat {
  x: number;
  y: number;
  vx: number;
  vy: number;
  wingPhase: number;
  size: number;
}

export function GothicCanvas({ night }: GothicCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isBloodMoon = night >= 90 || night === 25 || night === 50 || night === 75;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initialize mist particles
    const particles: Particle[] = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.2 - Math.random() * 0.3,
      radius: 1.5 + Math.random() * 2.5,
      alpha: 0.15 + Math.random() * 0.3,
      isBlood: Math.random() < 0.25
    }));

    // Initialize bats
    const bats: Bat[] = Array.from({ length: 4 }, () => ({
      x: -50 - Math.random() * 200,
      y: 80 + Math.random() * 240,
      vx: 1.5 + Math.random() * 1.5,
      vy: (Math.random() - 0.5) * 0.6,
      wingPhase: Math.random() * Math.PI * 2,
      size: 10 + Math.random() * 6
    }));

    const render = () => {
      // Clear base
      ctx.fillStyle = '#07070a';
      ctx.fillRect(0, 0, width, height);

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.6);
      if (isBloodMoon) {
        skyGrad.addColorStop(0, 'rgba(50, 10, 18, 0.95)');
        skyGrad.addColorStop(0.5, 'rgba(28, 8, 14, 0.8)');
        skyGrad.addColorStop(1, '#07070a');
      } else {
        skyGrad.addColorStop(0, 'rgba(15, 18, 28, 0.9)');
        skyGrad.addColorStop(0.5, 'rgba(10, 12, 18, 0.8)');
        skyGrad.addColorStop(1, '#07070a');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Moon position & glow
      const moonX = width - Math.min(180, width * 0.18);
      const moonY = 130;
      const moonRadius = Math.min(52, width * 0.05 + 20);

      // Outer moon halo glow
      const moonGlow = ctx.createRadialGradient(moonX, moonY, moonRadius * 0.5, moonX, moonY, moonRadius * 2.4);
      if (isBloodMoon) {
        moonGlow.addColorStop(0, 'rgba(220, 38, 38, 0.45)');
        moonGlow.addColorStop(0.6, 'rgba(180, 20, 30, 0.15)');
        moonGlow.addColorStop(1, 'rgba(0,0,0,0)');
      } else {
        moonGlow.addColorStop(0, 'rgba(210, 225, 255, 0.35)');
        moonGlow.addColorStop(0.6, 'rgba(160, 185, 230, 0.1)');
        moonGlow.addColorStop(1, 'rgba(0,0,0,0)');
      }
      ctx.fillStyle = moonGlow;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius * 2.4, 0, Math.PI * 2);
      ctx.fill();

      // Moon body
      ctx.fillStyle = isBloodMoon ? '#b91c1c' : '#e2e8f0';
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
      ctx.fill();

      // Moon craters
      ctx.fillStyle = isBloodMoon ? '#7f1d1d' : '#cbd5e1';
      ctx.beginPath();
      ctx.arc(moonX - moonRadius * 0.25, moonY - moonRadius * 0.15, moonRadius * 0.22, 0, Math.PI * 2);
      ctx.arc(moonX + moonRadius * 0.3, moonY + moonRadius * 0.25, moonRadius * 0.16, 0, Math.PI * 2);
      ctx.arc(moonX - moonRadius * 0.1, moonY + moonRadius * 0.35, moonRadius * 0.12, 0, Math.PI * 2);
      ctx.fill();

      // Distant Cathedral Spires Silhouette
      ctx.fillStyle = '#0b0b10';
      ctx.beginPath();
      ctx.moveTo(0, height);
      const points = [
        [0, height * 0.72],
        [width * 0.08, height * 0.68],
        [width * 0.12, height * 0.52], // spire
        [width * 0.16, height * 0.69],
        [width * 0.24, height * 0.73],
        [width * 0.32, height * 0.62],
        [width * 0.35, height * 0.5], // spire
        [width * 0.38, height * 0.64],
        [width * 0.48, height * 0.72],
        [width * 0.62, height * 0.65],
        [width * 0.66, height * 0.48], // grand tower
        [width * 0.7, height * 0.66],
        [width * 0.82, height * 0.72],
        [width * 0.9, height * 0.58], // church bell tower
        [width, height * 0.69],
        [width, height]
      ];
      points.forEach(([px, py], i) => {
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();
      ctx.fill();

      // Update & draw bats
      bats.forEach((bat) => {
        bat.x += bat.vx;
        bat.y += bat.vy;
        bat.wingPhase += 0.25;

        // Wrap around
        if (bat.x > width + 50) {
          bat.x = -40;
          bat.y = 80 + Math.random() * 240;
        }

        // Draw bat
        const wingSpan = Math.sin(bat.wingPhase) * (bat.size * 0.7);
        ctx.fillStyle = 'rgba(10, 10, 15, 0.85)';
        ctx.beginPath();
        ctx.moveTo(bat.x, bat.y);
        ctx.lineTo(bat.x - bat.size, bat.y - wingSpan);
        ctx.lineTo(bat.x - bat.size * 0.4, bat.y + bat.size * 0.2);
        ctx.lineTo(bat.x, bat.y + bat.size * 0.3);
        ctx.lineTo(bat.x + bat.size * 0.4, bat.y + bat.size * 0.2);
        ctx.lineTo(bat.x + bat.size, bat.y - wingSpan);
        ctx.closePath();
        ctx.fill();
      });

      // Update & draw mist particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.fillStyle = p.isBlood
          ? `rgba(185, 28, 28, ${p.alpha * 0.7})`
          : `rgba(148, 163, 184, ${p.alpha * 0.4})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [night, isBloodMoon]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 w-full h-full" />;
}
