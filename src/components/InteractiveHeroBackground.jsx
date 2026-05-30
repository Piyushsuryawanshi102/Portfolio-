import React, { useEffect, useRef } from "react";

const InteractiveHeroBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const celestialBodies = [];
    const stars = [];
    const mouse = { x: null, y: null, targetX: null, targetY: null, radius: 180 };

    // Handle Resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Track Mouse
    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.targetX = null;
      mouse.targetY = null;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    // 1. Star Class (Beautiful twinkling background stars)
    class TwinkleStar {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random() * 0.5 + 0.3;
        this.twinkleSpeed = Math.random() * 0.015 + 0.005;
        this.twinkleDir = Math.random() > 0.5 ? 1 : -1;
      }

      update() {
        this.alpha += this.twinkleSpeed * this.twinkleDir;
        if (this.alpha > 0.85 || this.alpha < 0.2) {
          this.twinkleDir *= -1;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.fill();
      }
    }

    // 2. Custom Celestial Body Class (Earth, Moon, Mars, Sun, Jupiter, Saturn)
    class CelestialBody {
      constructor(type, x, y, size) {
        this.type = type; // 'sun', 'earth', 'moon', 'mars', 'jupiter', 'saturn'
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.size = size;
        this.angle = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() * 0.005 + 0.002) * (Math.random() > 0.5 ? 1 : -1);
        this.driftX = (Math.random() - 0.5) * 0.15;
        this.driftY = (Math.random() - 0.5) * 0.15;

        // Interactive mouse-hover gravity offset
        this.offsetX = 0;
        this.offsetY = 0;

        // Pulse timer (mainly for Sun flares)
        this.pulse = 0;
      }

      update() {
        // Slow constant drift
        this.x += this.driftX;
        this.y += this.driftY;

        // Wrap around boundaries
        if (this.x < -100) this.x = width + 100;
        if (this.x > width + 100) this.x = -100;
        if (this.y < -100) this.y = height + 100;
        if (this.y > height + 100) this.y = -100;

        this.angle += this.rotationSpeed;
        this.pulse += 0.05;

        // Mouse interaction: gravitate towards the mouse if close
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const pull = (mouse.radius - dist) / mouse.radius;
            this.offsetX += (dx * pull * 0.08 - this.offsetX) * 0.05;
            this.offsetY += (dy * pull * 0.08 - this.offsetY) * 0.05;
          } else {
            this.offsetX += (0 - this.offsetX) * 0.05;
            this.offsetY += (0 - this.offsetY) * 0.05;
          }
        } else {
          this.offsetX += (0 - this.offsetX) * 0.05;
          this.offsetY += (0 - this.offsetY) * 0.05;
        }
      }

      draw() {
        const renderX = this.x + this.offsetX;
        const renderY = this.y + this.offsetY;
        const r = this.size;

        ctx.save();
        ctx.translate(renderX, renderY);

        switch (this.type) {
          case "sun":
            // Fiery glowing sun with pulsating plasma aura
            ctx.save();
            const sunGlow = ctx.createRadialGradient(0, 0, r * 0.5, 0, 0, r * 2.5);
            sunGlow.addColorStop(0, "rgba(255, 235, 59, 1)"); // Golden core
            sunGlow.addColorStop(0.2, "rgba(255, 152, 0, 0.8)"); // Orange flare
            sunGlow.addColorStop(0.5, "rgba(244, 67, 54, 0.3)"); // Red corona
            sunGlow.addColorStop(1, "rgba(244, 67, 54, 0)");
            ctx.fillStyle = sunGlow;
            ctx.beginPath();
            ctx.arc(0, 0, r * 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Core sphere
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            const sunGrad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 2, 0, 0, r);
            sunGrad.addColorStop(0, "#ffffff");
            sunGrad.addColorStop(0.5, "#ffcc00");
            sunGrad.addColorStop(1, "#ff6600");
            ctx.fillStyle = sunGrad;
            ctx.fill();
            break;

          case "earth":
            // Gorgeous Earth with atmosphere glow, blue oceans and green continent continents
            ctx.save();
            // Outer blue atmosphere glow
            ctx.beginPath();
            ctx.arc(0, 0, r * 1.25, 0, Math.PI * 2);
            const earthAtmo = ctx.createRadialGradient(0, 0, r, 0, 0, r * 1.25);
            earthAtmo.addColorStop(0, "rgba(0, 150, 255, 0.4)");
            earthAtmo.addColorStop(1, "rgba(0, 150, 255, 0)");
            ctx.fillStyle = earthAtmo;
            ctx.fill();

            // Earth body
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.clip(); // Clip everything else to the planet shape

            // Ocean background
            ctx.fillStyle = "#0d47a1";
            ctx.fillRect(-r, -r, r * 2, r * 2);

            // Continent continents (drawn dynamically using rotated landmass blobs)
            ctx.rotate(this.angle);
            ctx.fillStyle = "#4caf50";
            
            // Landmass 1 (Americas-like)
            ctx.beginPath();
            ctx.arc(-r * 0.3, -r * 0.2, r * 0.6, 0, Math.PI * 2);
            ctx.arc(-r * 0.1, r * 0.3, r * 0.5, 0, Math.PI * 2);
            ctx.fill();

            // Landmass 2 (Eurasia/Africa-like)
            ctx.fillStyle = "#388e3c";
            ctx.beginPath();
            ctx.arc(r * 0.4, -r * 0.3, r * 0.5, 0, Math.PI * 2);
            ctx.arc(r * 0.3, r * 0.2, r * 0.6, 0, Math.PI * 2);
            ctx.fill();

            // White cloud layer swirls
            ctx.rotate(this.angle * 0.5);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
            ctx.lineWidth = r * 0.15;
            ctx.beginPath();
            ctx.arc(-r * 0.2, -r * 0.1, r * 0.8, 0, Math.PI);
            ctx.stroke();

            ctx.restore();

            // Spherical overlay shadow (creates 3D volume)
            ctx.save();
            const earthShadow = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 0, 0, 0, r);
            earthShadow.addColorStop(0, "rgba(255, 255, 255, 0.15)");
            earthShadow.addColorStop(0.8, "rgba(0, 0, 0, 0.3)");
            earthShadow.addColorStop(1, "rgba(0, 0, 0, 0.85)");
            ctx.fillStyle = earthShadow;
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            break;

          case "moon":
            // Silver Moon with crater outlines
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            const moonGrad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 2, 0, 0, r);
            moonGrad.addColorStop(0, "#eceff1"); // Light silver
            moonGrad.addColorStop(0.7, "#cfd8dc"); // Main body
            moonGrad.addColorStop(1, "#37474f"); // Dark shadow
            ctx.fillStyle = moonGrad;
            ctx.fill();

            // Dark craters
            ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
            ctx.beginPath();
            ctx.arc(-r * 0.3, r * 0.2, r * 0.2, 0, Math.PI * 2);
            ctx.arc(r * 0.4, -r * 0.1, r * 0.25, 0, Math.PI * 2);
            ctx.arc(0, -r * 0.4, r * 0.15, 0, Math.PI * 2);
            ctx.arc(r * 0.1, r * 0.4, r * 0.18, 0, Math.PI * 2);
            ctx.fill();
            break;

          case "mars":
            // Rust red Mars with polar ice caps and surface patterns
            ctx.save();
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.clip();

            // Red body
            const marsGrad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 2, 0, 0, r);
            marsGrad.addColorStop(0, "#ff7043"); // Orange-red rust
            marsGrad.addColorStop(0.7, "#d84315");
            marsGrad.addColorStop(1, "#210800"); // Shadow
            ctx.fillStyle = marsGrad;
            ctx.fill();

            // Dark surface channels / markings
            ctx.rotate(this.angle);
            ctx.fillStyle = "rgba(78, 20, 0, 0.25)";
            ctx.beginPath();
            ctx.arc(-r * 0.2, 0, r * 0.6, 0, Math.PI * 2);
            ctx.arc(r * 0.4, r * 0.3, r * 0.4, 0, Math.PI * 2);
            ctx.fill();

            // White polar ice caps
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(0, -r * 0.95, r * 0.2, 0, Math.PI * 2);
            ctx.arc(0, r * 0.95, r * 0.15, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            break;

          case "jupiter":
            // Gaseous Jupiter with beautiful bands and the Great Red Spot
            ctx.save();
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.clip();

            // Base spherical shade
            const jupGrad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 2, 0, 0, r);
            jupGrad.addColorStop(0, "#ffecb3"); // Warm tan cream
            jupGrad.addColorStop(0.7, "#ffe082");
            jupGrad.addColorStop(1, "#3e2723");
            ctx.fillStyle = jupGrad;
            ctx.fillRect(-r, -r, r * 2, r * 2);

            // Horizontal gaseous atmospheric bands
            ctx.fillStyle = "rgba(141, 110, 99, 0.45)"; // Dark brown band
            ctx.fillRect(-r, -r * 0.5, r * 2, r * 0.25);
            ctx.fillStyle = "rgba(216, 67, 21, 0.35)"; // Orange band
            ctx.fillRect(-r, r * 0.1, r * 2, r * 0.2);
            ctx.fillStyle = "rgba(141, 110, 99, 0.3)";
            ctx.fillRect(-r, r * 0.45, r * 2, r * 0.15);

            // Great Red Spot
            ctx.fillStyle = "#c62828";
            ctx.beginPath();
            ctx.ellipse(r * 0.3, r * 0.25, r * 0.3, r * 0.2, 0, 0, Math.PI * 2);
            ctx.fill();

            // Spherical overlay shadow
            const jupShadow = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 0, 0, 0, r);
            jupShadow.addColorStop(0, "rgba(255,255,255,0.1)");
            jupShadow.addColorStop(0.7, "rgba(0,0,0,0.15)");
            jupShadow.addColorStop(1, "rgba(0,0,0,0.8)");
            ctx.fillStyle = jupShadow;
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
            break;

          case "saturn":
            // Saturn with gorgeous front/back rings
            const ringAngle = -Math.PI / 10;

            // Draw back ring first
            ctx.save();
            ctx.rotate(ringAngle);
            ctx.beginPath();
            ctx.ellipse(0, 0, r * 1.9, r * 0.4, 0, Math.PI, 0); // Back arc
            ctx.strokeStyle = "rgba(255, 224, 130, 0.5)";
            ctx.lineWidth = r * 0.25;
            ctx.stroke();
            ctx.restore();

            // Core sphere
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            const satGrad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 2, 0, 0, r);
            satGrad.addColorStop(0, "#ffe082"); // Golden sand
            satGrad.addColorStop(0.7, "#ffb300");
            satGrad.addColorStop(1, "#4e342e");
            ctx.fillStyle = satGrad;
            ctx.fill();

            // Draw front ring
            ctx.save();
            ctx.rotate(ringAngle);
            ctx.beginPath();
            ctx.ellipse(0, 0, r * 1.9, r * 0.4, 0, 0, Math.PI); // Front arc
            ctx.strokeStyle = "rgba(255, 224, 130, 0.5)";
            ctx.lineWidth = r * 0.25;
            ctx.stroke();
            ctx.restore();
            break;
        }

        ctx.restore();
      }
    }

    // Initialize background stars
    const starCount = Math.min(80, Math.floor((width * height) / 15000));
    for (let i = 0; i < starCount; i++) {
      stars.push(new TwinkleStar());
    }

    // Populate space with gorgeous small planet versions of the Sun, Earth, Moon, Mars, Jupiter, Saturn
    const planetTypes = ["earth", "mars", "jupiter", "saturn", "moon", "sun"];
    const planetSizes = {
      sun: 22,
      earth: 16,
      jupiter: 24,
      saturn: 18,
      mars: 14,
      moon: 10,
    };

    // Calculate elegant initial positions that don't block center text completely but float beautifully
    const cols = 4;
    const rows = 2;
    let typeIndex = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const type = planetTypes[typeIndex % planetTypes.length];
        typeIndex++;

        // Scatter grid coordinates slightly
        const x = (width / cols) * (c + 0.3 + Math.random() * 0.4);
        const y = (height / rows) * (r + 0.3 + Math.random() * 0.4);
        const size = planetSizes[type] * (Math.random() * 0.3 + 0.85);

        celestialBodies.push(new CelestialBody(type, x, y, size));
      }
    }

    // Animation Loop
    const animate = () => {
      // 1. Deep space indigo gradient backdrop
      const spaceGrad = ctx.createLinearGradient(0, 0, width, height);
      spaceGrad.addColorStop(0, "#02020a"); // Space indigo
      spaceGrad.addColorStop(0.5, "#04040e");
      spaceGrad.addColorStop(1, "#070716");
      ctx.fillStyle = spaceGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Smoothly track mouse
      if (mouse.targetX !== null && mouse.targetY !== null) {
        if (mouse.x === null) {
          mouse.x = mouse.targetX;
          mouse.y = mouse.targetY;
        } else {
          mouse.x += (mouse.targetX - mouse.x) * 0.1;
          mouse.y += (mouse.targetY - mouse.y) * 0.1;
        }
      } else {
        mouse.x = null;
        mouse.y = null;
      }

      // 3. Draw stars
      for (let i = 0; i < stars.length; i++) {
        stars[i].update();
        stars[i].draw();
      }

      // 4. Update and Draw gorgeous planets
      for (let i = 0; i < celestialBodies.length; i++) {
        celestialBodies[i].update();
        celestialBodies[i].draw();
      }

      // 5. Draw mouse gravity pull ripple
      if (mouse.x !== null && mouse.y !== null) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.beginPath();
        const radGrad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          mouse.radius
        );
        radGrad.addColorStop(0, "rgba(255, 255, 255, 0.07)");
        radGrad.addColorStop(0.5, "rgba(207, 163, 85, 0.02)");
        radGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = radGrad;
        ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        zIndex: 1,
      }}
    />
  );
};

export default InteractiveHeroBackground;
