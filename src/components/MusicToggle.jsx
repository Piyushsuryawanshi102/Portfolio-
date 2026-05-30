import React, { useRef, useState, useCallback } from "react";
import gsap from "gsap";

const MusicToggle = () => {
  const audioRef = useRef(null);
  const barsRef = useRef([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const animateBars = useCallback((playing) => {
    barsRef.current.forEach((bar, i) => {
      if (!bar) return;
      if (playing) {
        gsap.to(bar, {
          scaleY: () => 0.3 + Math.random() * 0.7,
          duration: 0.3 + Math.random() * 0.3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.08,
        });
      } else {
        gsap.killTweensOf(bar);
        gsap.to(bar, {
          scaleY: 0.3,
          duration: 0.4,
          ease: "power2.out",
        });
      }
    });
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      animateBars(false);
    } else {
      audio.volume = 0.35;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            animateBars(true);
          })
          .catch((err) => {
            console.warn("Audio play blocked:", err);
          });
      }
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/music/openmindaudio-podcast-intro-smooth-professional-theme-464770.mp3"
        loop
        preload="auto"
      />

      <button
        onClick={toggle}
        aria-label={isPlaying ? "Mute music" : "Play music"}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 9999,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: "3px",
          width: "48px",
          height: "48px",
          paddingBottom: "14px",
          borderRadius: "50%",
          backgroundColor: "#000",
          border: "2px solid rgba(255,255,255,0.15)",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {[...Array(4)].map((_, i) => (
          <span
            key={i}
            ref={(el) => (barsRef.current[i] = el)}
            style={{
              display: "block",
              width: "3px",
              height: "16px",
              borderRadius: "2px",
              backgroundColor: "#fff",
              transformOrigin: "bottom",
              transform: "scaleY(0.3)",
            }}
          />
        ))}
      </button>
    </>
  );
};

export default MusicToggle;
