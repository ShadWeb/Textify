import React from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import HeroSection from "../components/Sections/HeroSection";
import FeaturesSection from "@/components/Sections/FeaturesSection";
import HowItWorks from "@/components/Sections/HowItWorks";
import FAQSection from "@/components/Sections/FAQSection";
import AboutSection from "@/components/Sections/AboutSection";
import BackToTopButton from "@/components/UI/BackToTopButton";

const HomePage: React.FC = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <Header />
      <main className="flex-grow">
        <HeroSection />

        <AboutSection />
        <FeaturesSection />
        <HowItWorks />
        <FAQSection />
      </main>

      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default HomePage;
