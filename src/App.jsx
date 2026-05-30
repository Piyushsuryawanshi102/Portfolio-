import React from "react";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import ServiceSummary from "./sections/ServiceSummary";
import Services from "./sections/Services";
import ReactLenis from "lenis/react";
import About from "./sections/About";
import Resume from "./sections/Resume";
import Works from "./sections/Works";
import ContactSummary from "./sections/ContactSummary";
import Contact from "./sections/Contact";
import MusicToggle from "./components/MusicToggle";

const App = () => {
  return (
    <>
      <MusicToggle />
      <ReactLenis root className="relative w-screen min-h-screen overflow-x-auto">
        <Navbar />
        <Hero />
        <ServiceSummary />
        <Services />
        <About />
        <Resume />
        <Works />
        <ContactSummary />
        <Contact />
      </ReactLenis>
    </>
  );
};

export default App;
