import React, { useRef, useMemo, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

const ASTRONAUT_URL =
  "https://raw.githubusercontent.com/google/model-viewer/master/packages/shared-assets/models/Astronaut.glb";

export function HeroAstronaut({ scale = 1, isMobile = false }) {
  const { scene } = useGLTF(ASTRONAUT_URL);
  const groupRef = useRef(null);
  const innerRef = useRef(null);

  // Clone the scene so it's safe to use in R3F
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    // Traverse and enhance materials for a premium look
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material = child.material.clone();
          child.material.metalness = 0.3;
          child.material.roughness = 0.5;
          child.material.envMapIntensity = 1.5;
        }
      }
    });
    return clone;
  }, [scene]);

  // GSAP entry animation: astronaut drops in from above and settles
  useGSAP(() => {
    if (!groupRef.current) return;

    const tl = gsap.timeline();

    // Entry: drop from sky with rotation
    tl.from(groupRef.current.position, {
      y: 8,
      duration: 2.5,
      ease: "power2.out",
    });
    tl.from(
      groupRef.current.rotation,
      {
        x: -Math.PI * 0.5,
        z: Math.PI * 0.3,
        duration: 3,
        ease: "elastic.out(1, 0.5)",
      },
      "<"
    );
    tl.from(
      groupRef.current.scale,
      {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.5,
        ease: "back.out(2)",
      },
      "<+0.2"
    );

    // Scroll-driven: rotate and fly upward as user scrolls down
    gsap.to(groupRef.current.rotation, {
      y: Math.PI * 2,
      x: -0.3,
      scrollTrigger: {
        trigger: "#home",
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
      },
      ease: "none",
    });

    gsap.to(groupRef.current.position, {
      y: 4,
      z: 3,
      scrollTrigger: {
        trigger: "#home",
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
      },
      ease: "none",
    });

    gsap.to(groupRef.current.scale, {
      x: scale * 0.4,
      y: scale * 0.4,
      z: scale * 0.4,
      scrollTrigger: {
        trigger: "#home",
        start: "center top",
        end: "bottom top",
        scrub: 1.5,
      },
      ease: "none",
    });
  }, [scale]);

  // Continuous subtle floating & breathing animation
  useFrame((state) => {
    if (!innerRef.current) return;
    const t = state.clock.elapsedTime;

    // Gentle bobbing
    innerRef.current.position.y = Math.sin(t * 0.8) * 0.08;
    innerRef.current.position.x = Math.sin(t * 0.5) * 0.03;

    // Subtle sway
    innerRef.current.rotation.z = Math.sin(t * 0.6) * 0.03;
    innerRef.current.rotation.x = Math.cos(t * 0.4) * 0.02;
  });

  const s = isMobile ? scale * 0.55 : scale;

  return (
    <group ref={groupRef} scale={[s, s, s]} position={[0, -0.5, 0]}>
      <group ref={innerRef}>
        <primitive object={clonedScene} />
      </group>
    </group>
  );
}

useGLTF.preload(ASTRONAUT_URL);
