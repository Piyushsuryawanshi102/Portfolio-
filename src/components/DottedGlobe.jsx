import React, { useEffect, useRef, useCallback } from "react";

// Simplified procedural land check using bounding boxes for major continents
function isLandProcedural(lat, lon) {
  // North America
  if (lat > 15 && lat < 72 && lon > -168 && lon < -52) return true;
  // Central America
  if (lat > 7 && lat < 20 && lon > -92 && lon < -77) return true;
  // South America
  if (lat > -56 && lat < 13 && lon > -82 && lon < -34) return true;
  // Europe
  if (lat > 36 && lat < 71 && lon > -10 && lon < 40) return true;
  // Africa
  if (lat > -35 && lat < 37 && lon > -18 && lon < 52) return true;
  // Asia (main)
  if (lat > 10 && lat < 75 && lon > 40 && lon < 145) return true;
  // Middle East
  if (lat > 12 && lat < 42 && lon > 25 && lon < 63) return true;
  // India
  if (lat > 6 && lat < 35 && lon > 68 && lon < 97) return true;
  // Southeast Asia
  if (lat > -10 && lat < 28 && lon > 95 && lon < 140) return true;
  // Australia
  if (lat > -44 && lat < -10 && lon > 113 && lon < 154) return true;
  // Japan
  if (lat > 30 && lat < 46 && lon > 129 && lon < 146) return true;
  // UK / Ireland
  if (lat > 50 && lat < 59 && lon > -11 && lon < 2) return true;
  // Iceland
  if (lat > 63 && lat < 67 && lon > -25 && lon < -13) return true;
  // Greenland
  if (lat > 59 && lat < 84 && lon > -73 && lon < -12) return true;
  // New Zealand
  if (lat > -47 && lat < -34 && lon > 166 && lon < 179) return true;
  // Indonesia
  if (lat > -8 && lat < 5 && lon > 95 && lon < 141) return true;
  // Madagascar
  if (lat > -26 && lat < -12 && lon > 43 && lon < 51) return true;
  // Scandinavia extension
  if (lat > 55 && lat < 71 && lon > 5 && lon < 31) return true;
  return false;
}

// Generate Fibonacci sphere points
function generateFibonacciSphere(numPoints) {
  const points = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < numPoints; i++) {
    const y = 1 - (i / (numPoints - 1)) * 2; // y goes from 1 to -1
    const radius = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;

    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;

    // Convert to lat/lon for land check
    const lat = Math.asin(y) * (180 / Math.PI);
    const lon = Math.atan2(z, x) * (180 / Math.PI);

    points.push({ x, y, z, lat, lon });
  }
  return points;
}

const DottedGlobe = ({ size = 420 }) => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const rotationRef = useRef({ x: 0.3, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0.003 });
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const landMapRef = useRef(null);
  const pointsRef = useRef(null);

  // Try to load world map image for accurate land detection
  const loadWorldMap = useCallback(() => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const offscreen = document.createElement("canvas");
        offscreen.width = img.width;
        offscreen.height = img.height;
        const octx = offscreen.getContext("2d");
        octx.drawImage(img, 0, 0);
        try {
          const imageData = octx.getImageData(0, 0, offscreen.width, offscreen.height);
          resolve({ data: imageData.data, width: offscreen.width, height: offscreen.height });
        } catch (e) {
          // CORS tainted — fallback
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      // High-contrast equirectangular world map from Wikimedia (public domain)
      img.src =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/1280px-World_map_blank_without_borders.svg.png";
      // Timeout fallback
      setTimeout(() => resolve(null), 4000);
    });
  }, []);

  // Check if a lat/lon coordinate is land using the loaded image data
  const isLandFromImage = useCallback((lat, lon, mapData) => {
    if (!mapData) return isLandProcedural(lat, lon);
    const { data, width, height } = mapData;

    // Convert lat/lon to pixel coordinates on equirectangular projection
    const px = Math.floor(((lon + 180) / 360) * width);
    const py = Math.floor(((90 - lat) / 180) * height);

    const clampedPx = Math.max(0, Math.min(width - 1, px));
    const clampedPy = Math.max(0, Math.min(height - 1, py));

    const idx = (clampedPy * width + clampedPx) * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];

    // Land is darker in the blank world map (gray/dark), ocean is white/light
    const brightness = (r + g + b) / 3;
    return brightness < 200; // land pixels are darker
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const displaySize = size;

    canvas.width = displaySize * dpr;
    canvas.height = displaySize * dpr;
    canvas.style.width = displaySize + "px";
    canvas.style.height = displaySize + "px";
    ctx.scale(dpr, dpr);

    const cx = displaySize / 2;
    const cy = displaySize / 2;
    const globeRadius = displaySize * 0.38;

    // Generate points
    const NUM_POINTS = 3200;
    const allPoints = generateFibonacciSphere(NUM_POINTS);

    // Load map and filter points
    const init = async () => {
      const mapData = await loadWorldMap();
      landMapRef.current = mapData;

      // Filter to land-only dots
      const landPoints = allPoints.filter((p) =>
        isLandFromImage(p.lat, p.lon, mapData)
      );

      // Also keep a sparse set of ocean dots for the grid effect
      const oceanPoints = allPoints.filter(
        (p, i) => !isLandFromImage(p.lat, p.lon, mapData) && i % 5 === 0
      );

      pointsRef.current = { land: landPoints, ocean: oceanPoints };
    };

    init();

    // Mouse/touch interaction handlers
    const handlePointerDown = (e) => {
      isDraggingRef.current = true;
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      lastMouseRef.current = { x: clientX - rect.left, y: clientY - rect.top };
      velocityRef.current = { x: 0, y: 0 };
    };

    const handlePointerMove = (e) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const mx = clientX - rect.left;
      const my = clientY - rect.top;

      const dx = mx - lastMouseRef.current.x;
      const dy = my - lastMouseRef.current.y;

      velocityRef.current.y = dx * 0.004;
      velocityRef.current.x = dy * 0.004;

      rotationRef.current.y += dx * 0.004;
      rotationRef.current.x += dy * 0.004;
      // Clamp vertical rotation
      rotationRef.current.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, rotationRef.current.x)
      );

      lastMouseRef.current = { x: mx, y: my };
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    canvas.addEventListener("mousedown", handlePointerDown);
    canvas.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    canvas.addEventListener("touchstart", handlePointerDown, { passive: false });
    canvas.addEventListener("touchmove", handlePointerMove, { passive: false });
    window.addEventListener("touchend", handlePointerUp);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, displaySize, displaySize);

      // Auto-rotate when not dragging
      if (!isDraggingRef.current) {
        rotationRef.current.y += 0.004;
        // Smoothly decay any fling velocity
        velocityRef.current.x *= 0.95;
        velocityRef.current.y *= 0.95;
        rotationRef.current.x += velocityRef.current.x;
        rotationRef.current.y += velocityRef.current.y;
      }

      const rotX = rotationRef.current.x;
      const rotY = rotationRef.current.y;

      // Draw outer atmospheric glow
      const atmosphereGrad = ctx.createRadialGradient(
        cx,
        cy,
        globeRadius * 0.85,
        cx,
        cy,
        globeRadius * 1.4
      );
      atmosphereGrad.addColorStop(0, "rgba(80, 180, 255, 0.15)");
      atmosphereGrad.addColorStop(0.5, "rgba(60, 140, 220, 0.08)");
      atmosphereGrad.addColorStop(1, "rgba(30, 80, 160, 0)");
      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius * 1.4, 0, Math.PI * 2);
      ctx.fillStyle = atmosphereGrad;
      ctx.fill();

      // Draw globe background circle (subtle)
      const globeBg = ctx.createRadialGradient(
        cx - globeRadius * 0.25,
        cy - globeRadius * 0.25,
        globeRadius * 0.1,
        cx,
        cy,
        globeRadius
      );
      globeBg.addColorStop(0, "rgba(120, 200, 255, 0.15)");
      globeBg.addColorStop(0.5, "rgba(40, 100, 180, 0.08)");
      globeBg.addColorStop(1, "rgba(10, 30, 60, 0.05)");
      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius, 0, Math.PI * 2);
      ctx.fillStyle = globeBg;
      ctx.fill();

      // Rotation matrices
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const transformPoint = (p) => {
        // Rotate around Y axis
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.x * sinY + p.z * cosY;
        let y1 = p.y;

        // Rotate around X axis
        let y2 = y1 * cosX - z1 * sinX;
        let z2 = y1 * sinX + z1 * cosX;

        return { x: x1, y: y2, z: z2 };
      };

      // Draw ocean dots (faint grid)
      if (pointsRef.current) {
        const { ocean, land } = pointsRef.current;

        // Sort by z-depth for proper layering
        const allDots = [
          ...ocean.map((p) => ({ ...p, type: "ocean" })),
          ...land.map((p) => ({ ...p, type: "land" })),
        ];

        const transformed = allDots.map((p) => {
          const t = transformPoint(p);
          return { ...t, type: p.type };
        });

        // Sort back-to-front
        transformed.sort((a, b) => a.z - b.z);

        for (const dot of transformed) {
          // Only draw front-facing dots
          if (dot.z < -0.05) continue;

          const screenX = cx + dot.x * globeRadius;
          const screenY = cy - dot.y * globeRadius;

          // Depth-based scaling and opacity
          const depthFactor = (dot.z + 1) / 2; // 0 (back) to 1 (front)

          if (dot.type === "land") {
            const dotSize = 1.5 + depthFactor * 2.0;
            const alpha = 0.3 + depthFactor * 0.7;

            ctx.beginPath();
            ctx.arc(screenX, screenY, dotSize, 0, Math.PI * 2);

            // Cyan-white gradient for land dots
            const r = Math.floor(180 + depthFactor * 75);
            const g = Math.floor(220 + depthFactor * 35);
            const b = 255;
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            ctx.fill();
          } else {
            // Ocean dots: very subtle
            const dotSize = 0.8 + depthFactor * 0.7;
            const alpha = 0.08 + depthFactor * 0.12;
            ctx.beginPath();
            ctx.arc(screenX, screenY, dotSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(100, 160, 220, ${alpha})`;
            ctx.fill();
          }
        }
      }

      // Draw a subtle highlight arc at the top-left
      const highlightGrad = ctx.createRadialGradient(
        cx - globeRadius * 0.3,
        cy - globeRadius * 0.3,
        0,
        cx,
        cy,
        globeRadius
      );
      highlightGrad.addColorStop(0, "rgba(255, 255, 255, 0.1)");
      highlightGrad.addColorStop(0.4, "rgba(255, 255, 255, 0)");
      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius, 0, Math.PI * 2);
      ctx.fillStyle = highlightGrad;
      ctx.fill();

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener("mousedown", handlePointerDown);
      canvas.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      canvas.removeEventListener("touchstart", handlePointerDown);
      canvas.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
    };
  }, [size, loadWorldMap, isLandFromImage]);

  return (
    <div
      className="flex items-center justify-center"
      style={{ width: size, height: size, cursor: "grab" }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: size,
          height: size,
          display: "block",
        }}
      />
    </div>
  );
};

export default DottedGlobe;
