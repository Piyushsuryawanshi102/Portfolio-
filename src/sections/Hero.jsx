import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import InteractiveHeroBackground from "../components/InteractiveHeroBackground";

const Hero = () => {
  const text = `I help growing brands and startups gain an
unfair advantage through premium
results driven webs/apps`;

  return (
    <section id="home" className="relative flex flex-col justify-end min-h-screen overflow-hidden bg-black z-0">
      {/* Deep dark infinite space background canvas positioned between bg-black and text */}
      <InteractiveHeroBackground />

      <div className="relative z-10">
        <AnimatedHeaderSection
          subTitle={"tech enthuistic "}
          title={"Piyush Suryawanshi"}
          text={text}
          textColor={"text-white"}
        />
      </div>
    </section>
  );
};

export default Hero;
