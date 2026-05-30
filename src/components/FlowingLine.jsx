import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const FlowingLine = () => {
  const pathRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    const dot = dotRef.current;
    if (!path || !dot) return;

    const pathLength = path.getTotalLength();

    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });
    gsap.set(dot, { opacity: 0 });

    // Draw line on scroll — only during the About section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#about",
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
      },
    });

    tl.to(path, {
      strokeDashoffset: 0,
      duration: 1,
      ease: "none",
    });

    tl.to(dot, { opacity: 1, duration: 0.02 }, 0);

    // Move dot along the path tip
    const updateDot = () => {
      if (!path || !dot) return;
      const offset = parseFloat(gsap.getProperty(path, "strokeDashoffset"));
      const drawn = pathLength - offset;
      const ratio = Math.max(0, Math.min(1, drawn / pathLength));
      const pt = path.getPointAtLength(ratio * pathLength);
      dot.setAttribute("cx", pt.x);
      dot.setAttribute("cy", pt.y);
    };

    gsap.ticker.add(updateDot);

    return () => {
      gsap.ticker.remove(updateDot);
      tl.kill();
    };
  }, []);

  return (
    <svg
      className="absolute top-0 left-0 w-full pointer-events-none"
      style={{ height: "100%", zIndex: 1 }}
      viewBox="0 0 1440 1000"
      preserveAspectRatio="none"
      fill="none"
    >
      {/* Path that wraps around the About image area and ends before Resume */}
      <path
        ref={pathRef}
        d="
          M 1400,0
          C 1250,60 1000,100 800,180
          C 600,260 420,340 320,440
          C 220,540 160,600 140,680
          C 120,760 160,820 300,840
          C 440,860 540,830 540,790
          C 540,750 460,720 360,730
          C 260,740 160,790 140,860
          C 120,930 200,970 360,990
          L 500,1000
        "
        stroke="#4747FF"
        strokeWidth="22"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      <circle
        ref={dotRef}
        cx="1400"
        cy="0"
        r="14"
        fill="#4747FF"
      />
    </svg>
  );
};

export default FlowingLine;
