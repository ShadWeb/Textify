import React from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import HeroSection from "../components/Sections/HeroSection";
import FeaturesSection from "@/components/Sections/FeaturesSection";
import HowItWorks from "@/components/Sections/HowItWorks";
import FAQSection from "@/components/Sections/FAQSection";
import AboutSection from "@/components/Sections/AboutSection";

const HomePage: React.FC = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <Header />
      <main className="flex-grow">
        <HeroSection />

        <FeaturesSection />
        <HowItWorks />
        <FAQSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
