import React, { useRef } from "react";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Resume = () => {
  const containerRef = useRef(null);
  const cardRef = useRef(null);

  const experience = [
    {
      role: "Full-Stack Developer",
      company: "Freelance & Open Source",
      duration: "2024 - Present",
      description:
        "Architecting and shipping production-ready web applications. Building fast, responsive, and robust frontends coupled with secure, scalable backend architectures.",
    },
    {
      role: "DevOps & Performance Engineer",
      company: "Independent Projects",
      duration: "2023 - 2024",
      description:
        "Designing CI/CD pipelines, automating deployments using Docker & Linux servers, and tuning performance parameters to achieve lightning-fast loading speeds.",
    },
  ];

  const education = [
    {
      degree: "Computer Science & Engineering",
      institution: "Technical University",
      duration: "2022 - 2026",
      description:
        "Focusing on Software Engineering, Database Systems, Cloud Computing, and Algorithmic Analysis. Applying academic principles to launch high-quality personal projects.",
    },
  ];

  useGSAP(() => {
    // Animate timeline items on scroll
    gsap.from(".timeline-item", {
      opacity: 0,
      y: 80,
      stagger: 0.2,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#resume",
        start: "top 75%",
      },
    });

    // Animate resume card entry
    gsap.from(cardRef.current, {
      opacity: 0,
      scale: 0.95,
      y: 40,
      duration: 1.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: cardRef.current,
        start: "top 80%",
      },
    });
  }, []);

  return (
    <section id="resume" className="w-full bg-[#e5e5e0] text-black pt-16 pb-24">
      <AnimatedHeaderSection
        subTitle={"Curriculum Vitae"}
        title={"Resume"}
        text={"A timeline of technical expertise, continuous learning, and scalable systems."}
        textColor={"text-black"}
        withScrollTrigger={true}
      />

      <div className="px-10 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-16 font-light">
        {/* Timeline (Columns 1-7) */}
        <div className="lg:col-span-7 flex flex-col gap-14">
          <div>
            <h3 className="text-xs font-normal tracking-[0.3em] uppercase text-DarkLava/70 mb-10 flex items-center gap-3">
              <Icon icon="lucide:briefcase" className="text-gold size-5" /> Experience
            </h3>
            <div className="relative pl-6 border-l border-black/20 flex flex-col gap-12">
              {experience.map((item, idx) => (
                <div key={idx} className="timeline-item relative group">
                  {/* Dot */}
                  <div className="absolute -left-[30px] top-[6px] w-2.5 h-2.5 rounded-full bg-[#e5e5e0] border border-gold transition-all duration-300 group-hover:scale-150 group-hover:bg-gold" />
                  
                  <span className="text-xs uppercase tracking-widest text-SageGray font-normal">
                    {item.duration}
                  </span>
                  <h4 className="text-2xl font-normal text-black mt-1 leading-tight">
                    {item.role}
                  </h4>
                  <p className="text-sm italic text-DarkLava/80 mt-1">
                    {item.company}
                  </p>
                  <p className="text-base text-black/70 mt-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-normal tracking-[0.3em] uppercase text-DarkLava/70 mb-10 flex items-center gap-3">
              <Icon icon="lucide:graduation-cap" className="text-gold size-5" /> Education
            </h3>
            <div className="relative pl-6 border-l border-black/20 flex flex-col gap-12">
              {education.map((item, idx) => (
                <div key={idx} className="timeline-item relative group">
                  {/* Dot */}
                  <div className="absolute -left-[30px] top-[6px] w-2.5 h-2.5 rounded-full bg-[#e5e5e0] border border-gold transition-all duration-300 group-hover:scale-150 group-hover:bg-gold" />
                  
                  <span className="text-xs uppercase tracking-widest text-SageGray font-normal">
                    {item.duration}
                  </span>
                  <h4 className="text-2xl font-normal text-black mt-1 leading-tight">
                    {item.degree}
                  </h4>
                  <p className="text-sm italic text-DarkLava/80 mt-1">
                    {item.institution}
                  </p>
                  <p className="text-base text-black/70 mt-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Premium Interactive Resume Card (Columns 8-12) */}
        <div className="lg:col-span-5 flex flex-col justify-start items-center lg:items-end">
          <div
            ref={cardRef}
            className="w-full max-w-sm rounded-3xl border border-black/10 bg-black/[0.03] p-8 backdrop-blur-md shadow-lg flex flex-col justify-between h-[450px] relative overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:border-black/20 hover:-translate-y-2"
          >
            {/* Elegant Background Gradient Blur Accent */}
            <div className="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-gold/15 blur-3xl group-hover:bg-gold/25 transition-all duration-700 pointer-events-none" />
            
            <div>
              <div className="flex justify-between items-start">
                <span className="text-xs tracking-[0.2em] text-SageGray uppercase font-normal">
                  Overview
                </span>
                <Icon icon="lucide:file-text" className="text-gold size-6" />
              </div>
              
              <div className="mt-8">
                <h4 className="text-3xl font-normal tracking-wide text-black">
                  Piyush Suryawanshi
                </h4>
                <p className="text-xs text-gold tracking-[0.15em] uppercase mt-1.5 font-normal">
                  Full-Stack & DevOps Engineer
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-4 text-sm text-black/80">
                <div className="flex items-center gap-3">
                  <Icon icon="lucide:mail" className="text-DarkLava/80 size-4.5" />
                  <span className="tracking-wide">piyushsuryawanshi277@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon icon="lucide:map-pin" className="text-DarkLava/80 size-4.5" />
                  <span className="tracking-wide">India</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon icon="lucide:check-circle" className="text-DarkLava/80 size-4.5" />
                  <span className="tracking-wide">Available for full-time opportunities</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <a
                href="/resume/Piyush resume pdf.pdf"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-black text-white hover:bg-gold hover:text-black transition-colors duration-300 font-normal shadow-md"
              >
                <Icon icon="lucide:external-link" className="size-5" />
                View Full Resume
              </a>
              <a
                href="/resume/Piyush resume pdf.pdf"
                download="Piyush_Suryawanshi_Resume.pdf"
                className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl border border-black/30 hover:border-black bg-transparent text-black hover:bg-black/5 transition-all duration-300 font-normal"
              >
                <Icon icon="lucide:download" className="size-5" />
                Download CV
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resume;
