"use client";

import React, { useEffect, useRef } from "react";

export const EffectsOverlay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Dynamic resize handler
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Mouse movement track for trail and avoidance
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;

      // Add mouse trail sparkles on mouse move
      if (Math.random() < 0.4) {
        sparkles.push(new Sparkle(e.clientX, e.clientY));
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // ----------------------------------------------------
    // Sparkle Mouse Trail Class
    // ----------------------------------------------------
    class Sparkle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;
      decay: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1.5;
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = (Math.random() - 0.5) * 1.5;
        // Luxury gold / rose-gold colors
        const colors = ["#D4AF37", "#B76E79", "#FFF0F0", "#F8C3CD"];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.01;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= this.decay;
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.globalAlpha = this.alpha;
        c.fillStyle = this.color;
        c.shadowBlur = 8;
        c.shadowColor = this.color;
        
        // Draw starburst sparkle
        c.beginPath();
        c.moveTo(this.x, this.y - this.size);
        c.quadraticCurveTo(this.x, this.y, this.x + this.size, this.y);
        c.quadraticCurveTo(this.x, this.y, this.x, this.y + this.size);
        c.quadraticCurveTo(this.x, this.y, this.x - this.size, this.y);
        c.quadraticCurveTo(this.x, this.y, this.x, this.y - this.size);
        c.closePath();
        c.fill();
        
        c.restore();
      }
    }

    // ----------------------------------------------------
    // Flower Petals Falling Class
    // ----------------------------------------------------
    class Petal {
      x!: number;
      y!: number;
      size!: number;
      speedY!: number;
      speedX!: number;
      angle!: number;
      spinSpeed!: number;
      color!: string;

      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * width;
        this.y = init ? Math.random() * height : -20;
        this.size = Math.random() * 8 + 6;
        this.speedY = Math.random() * 0.8 + 0.5;
        this.speedX = (Math.random() - 0.2) * 0.5; // Drift slightly to right
        this.angle = Math.random() * Math.PI * 2;
        this.spinSpeed = (Math.random() - 0.5) * 0.02;
        // Soft blush pinks and peach shades
        const colors = [
          "rgba(248, 195, 205, 0.6)", // blush pink
          "rgba(255, 240, 240, 0.5)", // soft cream pink
          "rgba(230, 230, 250, 0.4)", // lavender
          "rgba(255, 218, 185, 0.5)"  // peach
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y * 0.01) * 0.3; // Swaying motion
        this.angle += this.spinSpeed;

        if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
          this.reset(false);
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.angle);
        c.fillStyle = this.color;
        
        // Draw elegant petal leaf path
        c.beginPath();
        c.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
        c.closePath();
        c.fill();
        c.restore();
      }
    }

    // ----------------------------------------------------
    // Fluttering Butterflies Class (with cursor evasion!)
    // ----------------------------------------------------
    class Butterfly {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      flapSpeed: number;
      flapAngle: number;
      color: string;
      targetX: number;
      targetY: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 5 + 4;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.flapSpeed = Math.random() * 0.15 + 0.1;
        this.flapAngle = 0;
        // Soft pastels + golden edges
        const colors = ["#F8C3CD", "#E6E6FA", "#FFF0F0", "#FFDAB9"];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.targetX = Math.random() * width;
        this.targetY = Math.random() * height;
      }

      update() {
        // Change targets occasionally
        if (Math.random() < 0.005) {
          this.targetX = Math.random() * width;
          this.targetY = Math.random() * height;
        }

        // Steer towards target
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        this.vx += dx * 0.0002;
        this.vy += dy * 0.0002;

        // Evasion behavior: get away from cursor
        if (mouseRef.current.active) {
          const mdx = this.x - mouseRef.current.x;
          const mdy = this.y - mouseRef.current.y;
          const dist = Math.sqrt(mdx * mdx + mdy * mdy);
          
          if (dist < 100) {
            // Evasion force
            const force = (100 - dist) / 100;
            this.vx += (mdx / dist) * force * 0.8;
            this.vy += (mdy / dist) * force * 0.8;
          }
        }

        // Limit velocity
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const maxSpeed = 2;
        if (speed > maxSpeed) {
          this.vx = (this.vx / speed) * maxSpeed;
          this.vy = (this.vy / speed) * maxSpeed;
        }

        this.x += this.vx;
        this.y += this.vy;

        // Boundary checks
        if (this.x < 10) this.vx += 0.1;
        if (this.x > width - 10) this.vx -= 0.1;
        if (this.y < 10) this.vy += 0.1;
        if (this.y > height - 10) this.vy -= 0.1;

        // Flapping wings animation
        this.flapAngle += this.flapSpeed;
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.translate(this.x, this.y);
        
        // Rotate towards flight direction
        const angle = Math.atan2(this.vy, this.vx);
        c.rotate(angle);

        // Flap multiplier (simulate wing flapping)
        const flapWidth = Math.abs(Math.sin(this.flapAngle));

        c.shadowBlur = 4;
        c.shadowColor = this.color;
        
        // Draw Butterfly wings
        c.fillStyle = this.color;

        // Top-left wing
        c.beginPath();
        c.ellipse(-1, -this.size / 2, this.size * flapWidth, this.size * 0.8, -Math.PI / 4, 0, Math.PI * 2);
        c.fill();

        // Bottom-left wing
        c.beginPath();
        c.ellipse(-1, this.size / 2, this.size * 0.7 * flapWidth, this.size * 0.5, Math.PI / 4, 0, Math.PI * 2);
        c.fill();

        // Gold outline details
        c.strokeStyle = "rgba(212, 175, 55, 0.4)";
        c.lineWidth = 0.5;
        c.stroke();

        // Antennae
        c.strokeStyle = "rgba(0, 0, 0, 0.2)";
        c.beginPath();
        c.moveTo(this.size * 0.5, -1);
        c.quadraticCurveTo(this.size, -3, this.size * 1.2, -4);
        c.moveTo(this.size * 0.5, 1);
        c.quadraticCurveTo(this.size, 3, this.size * 1.2, 4);
        c.stroke();

        c.restore();
      }
    }

    // Initialize arrays
    const sparkles: Sparkle[] = [];
    const petals: Petal[] = Array.from({ length: 45 }, () => new Petal());
    const butterflies: Butterfly[] = Array.from({ length: 8 }, () => new Butterfly());

    // ----------------------------------------------------
    // Animation loop (60fps)
    // ----------------------------------------------------
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Process Sparkles
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        s.update();
        if (s.alpha <= 0) {
          sparkles.splice(i, 1);
        } else {
          s.draw(ctx);
        }
      }

      // 2. Process Falling Petals
      petals.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      // 3. Process Butterflies
      butterflies.forEach((b) => {
        b.update();
        b.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Start loop
    animate();

    // Cleanups
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 w-full h-full"
      style={{ mixBlendMode: "screen" }}
    />
  );
};
