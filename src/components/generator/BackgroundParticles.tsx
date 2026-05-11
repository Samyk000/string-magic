import { useEffect, useRef } from "react";

export function BackgroundParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationId: number;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
    };

    window.addEventListener("resize", resize);
    resize();

    // A particle using the brand-accent color with smooth motion
    class Particle {
      x: number;
      y: number;
      size: number;
      baseSize: number;
      speedX: number;
      speedY: number;
      alpha: number;
      maxAlpha: number;
      alphaSpeed: number;
      history: { x: number; y: number }[];
      historyLimit: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseSize = Math.random() * 1.5 + 0.5;
        this.size = this.baseSize;
        this.speedX = Math.random() * 0.3 - 0.15;
        // Upward drift like fire/sparks
        this.speedY = Math.random() * -0.4 - 0.2; 
        this.alpha = Math.random();
        this.maxAlpha = Math.random() * 0.4 + 0.2;
        this.alphaSpeed = Math.random() * 0.01 + 0.005;
        
        // For the soft tail
        this.history = [];
        this.historyLimit = Math.floor(Math.random() * 8) + 4;
      }

      update() {
        this.history.push({ x: this.x, y: this.y });
        if (this.history.length > this.historyLimit) {
          this.history.shift();
        }

        this.x += this.speedX;
        this.y += this.speedY;
        
        // Pulsing size/shine
        this.size = this.baseSize + Math.sin(Date.now() * 0.003 + this.x) * 0.5;

        // Alpha fade cycling
        this.alpha += this.alphaSpeed;
        if (this.alpha > this.maxAlpha || this.alpha < 0) {
          this.alphaSpeed = -this.alphaSpeed;
        }

        // Screen wrap-around
        if (this.y < -10) {
          this.y = height + 10;
          this.x = Math.random() * width;
          this.history = [];
        }
        if (this.x < -10) this.x = width + 10;
        if (this.x > width + 10) this.x = -10;
      }

      draw() {
        if (!ctx) return;
        
        // Draw the smooth tail (line gradient)
        if (this.history.length > 1) {
          ctx.beginPath();
          ctx.moveTo(this.history[0].x, this.history[0].y);
          for (let i = 1; i < this.history.length; i++) {
            ctx.lineTo(this.history[i].x, this.history[i].y);
          }
          ctx.strokeStyle = `rgba(250, 255, 105, ${this.alpha * 0.15})`; // Brand primary faded
          ctx.lineWidth = this.size * 0.6;
          ctx.lineCap = "round";
          ctx.stroke();
        }

        // Draw the glowing head
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        // Radial gradient for the "shine" around them
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
        grad.addColorStop(0, `rgba(250, 255, 105, ${this.alpha})`);
        grad.addColorStop(0.4, `rgba(250, 255, 105, ${this.alpha * 0.4})`);
        grad.addColorStop(1, "rgba(250, 255, 105, 0)");
        
        ctx.fillStyle = grad;
        ctx.fill();
      }
    }

    // Only create few particles for minimal/elegant look
    const particlesArray: Particle[] = [];
    const particleCount = 35; 
    for (let i = 0; i < particleCount; i++) {
      particlesArray.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particlesArray.forEach((p) => {
        p.update();
        p.draw();
      });
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full opacity-70 -z-10"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
