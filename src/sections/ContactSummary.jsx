import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import DottedGlobe from "../components/DottedGlobe";

const ContactSummary = () => {
  const containerRef = useRef(null);
  const [globeSize, setGlobeSize] = useState(800);

  useEffect(() => {
    const handleResize = () => {
      // Make globe large enough to form a wide arc across the bottom
      // Use max of viewport height and width to ensure coverage
      const optimalSize = Math.max(window.innerHeight * 1.2, window.innerWidth * 0.9);
      setGlobeSize(optimalSize);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useGSAP(() => {
    gsap.to(containerRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
        markers: false,
      },
    });
  }, []);
  
  return (
    <section
      ref={containerRef}
      className="flex flex-col items-center justify-center min-h-screen mt-16 relative overflow-hidden"
    >
      <div className="font-light text-center contact-text-responsive z-10 mb-32">
        <p>
          &ldquo; Let&rsquo;s build a <br />
          <span className="font-normal">memorable</span> &{" "}
          <span className="italic">inspiring</span> <br />
          web application <span className="text-gold">together</span> &rdquo;
        </p>
      </div>
      
      {/* Globe positioned at the very bottom, showing the top ~55% of the globe */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%) translateY(50%)",
          width: globeSize,
          height: globeSize,
          zIndex: 0,
        }}
      >
        <DottedGlobe size={globeSize} />
      </div>
    </section>
  );
};

export default ContactSummary;
