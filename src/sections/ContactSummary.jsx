import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import DottedGlobe from "../components/DottedGlobe";

const ContactSummary = () => {
  const containerRef = useRef(null);
  const [globeSize, setGlobeSize] = useState(800);

  useEffect(() => {
    const handleResize = () => {
      // Set globe size to the window height. 
      // Since it's translated down by 50%, its visible radius will be exactly 50% of the window height!
      // We take max with window.innerWidth to ensure it's wide enough on wide screens, 
      // but multiply innerWidth by a factor so it looks like a nice large arc.
      const optimalSize = Math.max(window.innerHeight, window.innerWidth * 0.8);
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
          “ Let’s build a <br />
          <span className="font-normal">memorable</span> &{" "}
          <span className="italic">inspiring</span> <br />
          web application <span className="text-gold">together</span> “
        </p>
      </div>
      
      {/* Globe is absolutely positioned at the bottom, translating down by 50% so only top half is visible */}
      <div className="absolute bottom-0 translate-y-[45%] flex justify-center w-full z-0">
        <DottedGlobe size={globeSize} />
      </div>
    </section>
  );
};

export default ContactSummary;

