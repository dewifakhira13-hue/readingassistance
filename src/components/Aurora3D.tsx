import React, { useEffect, useRef } from 'react';

interface Aurora3DProps {
  className?: string;
  intensity?: 'high' | 'subtle';
  interactive?: boolean;
}

export const Aurora3D: React.FC<Aurora3DProps> = ({
  className = '',
  intensity = 'high',
  interactive = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isHigh = intensity === 'high';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Vertical Aurora Pillars & Curtains (Tuned for majestic vertical celestial columns)
    const verticalPillars = [
      {
        baseXRatio: 0.12,
        pillarWidth: 160,
        speed: 0.00007,
        swayAmplitude: 45,
        freq: 0.002,
        colorTop: 'rgba(99, 102, 241, 0.0)',     // Soft Indigo fade at top
        colorUpper: 'rgba(139, 92, 246, 0.35)', // Violet
        colorMid: 'rgba(6, 182, 212, 0.48)',    // Bright Cyan
        colorLower: 'rgba(16, 185, 129, 0.42)', // Emerald Green
        colorBottom: 'rgba(4, 120, 87, 0.0)',
      },
      {
        baseXRatio: 0.28,
        pillarWidth: 200,
        speed: 0.000085,
        swayAmplitude: 60,
        freq: 0.0016,
        colorTop: 'rgba(236, 72, 153, 0.0)',    // Magenta fade
        colorUpper: 'rgba(217, 70, 239, 0.32)', // Fuchsia
        colorMid: 'rgba(16, 185, 129, 0.52)',   // Emerald
        colorLower: 'rgba(6, 182, 212, 0.38)',  // Cyan
        colorBottom: 'rgba(15, 23, 42, 0.0)',
      },
      {
        baseXRatio: 0.48,
        pillarWidth: 230,
        speed: 0.000065,
        swayAmplitude: 50,
        freq: 0.0018,
        colorTop: 'rgba(6, 182, 212, 0.0)',
        colorUpper: 'rgba(20, 184, 166, 0.45)', // Teal
        colorMid: 'rgba(52, 211, 153, 0.55)',   // Mint Emerald
        colorLower: 'rgba(99, 102, 241, 0.35)', // Indigo
        colorBottom: 'rgba(15, 23, 42, 0.0)',
      },
      {
        baseXRatio: 0.70,
        pillarWidth: 210,
        speed: 0.000075,
        swayAmplitude: 55,
        freq: 0.0015,
        colorTop: 'rgba(139, 92, 246, 0.0)',
        colorUpper: 'rgba(6, 182, 212, 0.45)',  // Cyan
        colorMid: 'rgba(16, 185, 129, 0.50)',   // Emerald
        colorLower: 'rgba(147, 51, 234, 0.32)', // Purple
        colorBottom: 'rgba(15, 23, 42, 0.0)',
      },
      {
        baseXRatio: 0.88,
        pillarWidth: 170,
        speed: 0.00009,
        swayAmplitude: 40,
        freq: 0.0022,
        colorTop: 'rgba(16, 185, 129, 0.0)',
        colorUpper: 'rgba(45, 212, 191, 0.42)', // Light Teal
        colorMid: 'rgba(6, 182, 212, 0.46)',    // Cyan
        colorLower: 'rgba(129, 140, 248, 0.30)',// Indigo
        colorBottom: 'rgba(15, 23, 42, 0.0)',
      },
    ];

    let time = 0;

    const render = () => {
      // Advance clock in ultra-slow, peaceful increments
      time += 0.06;
      ctx.clearRect(0, 0, width, height);

      // Deep sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#040814');
      skyGrad.addColorStop(0.5, '#071022');
      skyGrad.addColorStop(1, '#09152e');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      // Draw each Vertical Aurora Pillar / Curtain
      verticalPillars.forEach((pillar, idx) => {
        const baseX = width * pillar.baseXRatio;
        const stepY = 12;
        const leftPoints: { x: number; y: number }[] = [];
        const rightPoints: { x: number; y: number }[] = [];

        // Compute undulating vertical curtain path from top (0) to bottom (height)
        for (let y = 0; y <= height + stepY; y += stepY) {
          // Double sine wave swaying left and right as it flows down
          const sway =
            Math.sin(y * pillar.freq + time * pillar.speed * 1000 + idx) * pillar.swayAmplitude +
            Math.cos(y * pillar.freq * 1.6 - time * pillar.speed * 700) * (pillar.swayAmplitude * 0.4);

          // Variable width along vertical column (narrow at top, expanding in middle, tapering at bottom)
          const widthFactor = Math.sin((y / height) * Math.PI) * 0.5 + 0.6;
          const currentWidth = pillar.pillarWidth * widthFactor;

          const centerX = baseX + sway;
          leftPoints.push({ x: centerX - currentWidth / 2, y });
          rightPoints.push({ x: centerX + currentWidth / 2, y });
        }

        // Create Vertical Linear Gradient from top of curtain to bottom
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, pillar.colorTop);
        grad.addColorStop(0.2, pillar.colorUpper);
        grad.addColorStop(0.52, pillar.colorMid);
        grad.addColorStop(0.82, pillar.colorLower);
        grad.addColorStop(1, pillar.colorBottom);

        // Draw the vertical pillar polygon
        ctx.beginPath();
        ctx.moveTo(leftPoints[0].x, leftPoints[0].y);
        for (let i = 1; i < leftPoints.length; i++) {
          ctx.lineTo(leftPoints[i].x, leftPoints[i].y);
        }
        for (let i = rightPoints.length - 1; i >= 0; i--) {
          ctx.lineTo(rightPoints[i].x, rightPoints[i].y);
        }
        ctx.closePath();

        ctx.fillStyle = grad;
        ctx.filter = isHigh ? 'blur(34px)' : 'blur(46px)';
        ctx.fill();

        // Shimmering Vertical Core Spine Line
        ctx.beginPath();
        for (let i = 0; i < leftPoints.length; i++) {
          const midX = (leftPoints[i].x + rightPoints[i].x) / 2;
          const y = leftPoints[i].y;
          if (i === 0) ctx.moveTo(midX, y);
          else ctx.lineTo(midX, y);
        }
        ctx.strokeStyle = idx % 2 === 0 ? 'rgba(52, 211, 153, 0.35)' : 'rgba(34, 211, 238, 0.3)';
        ctx.lineWidth = 4;
        ctx.filter = 'blur(10px)';
        ctx.stroke();
      });

      // Subtle Vertical Ray Ribs (Dancing vertical curtain folds)
      const rayCount = isHigh ? 16 : 8;
      for (let i = 0; i < rayCount; i++) {
        const rayBaseX = (width / (rayCount + 1)) * (i + 1);
        const raySway = Math.sin(time * 0.0008 + i) * 25;
        const rayX = rayBaseX + raySway;
        const rayWidth = 24 + Math.sin(time * 0.001 + i * 2) * 8;
        const rayTopY = height * 0.05;
        const rayHeight = height * (0.75 + Math.sin(time * 0.0007 + i) * 0.1);

        const rayGrad = ctx.createLinearGradient(0, rayTopY, 0, rayTopY + rayHeight);
        rayGrad.addColorStop(0, 'rgba(0,0,0,0)');
        rayGrad.addColorStop(
          0.3,
          i % 2 === 0 ? 'rgba(16, 185, 129, 0.18)' : 'rgba(6, 182, 212, 0.16)'
        );
        rayGrad.addColorStop(
          0.7,
          i % 3 === 0 ? 'rgba(139, 92, 246, 0.12)' : 'rgba(20, 184, 166, 0.14)'
        );
        rayGrad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = rayGrad;
        ctx.filter = 'blur(20px)';
        ctx.fillRect(rayX - rayWidth / 2, rayTopY, rayWidth, rayHeight);
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHigh]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 w-full h-full ${className}`}
    />
  );
};
