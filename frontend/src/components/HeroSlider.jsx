import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";

const images = ["/images/background1.webp", "/images/background2.webp"];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[80vh] min-h-[560px] overflow-hidden">
      <div
        className="absolute inset-0 flex w-[200%] transition-all duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 50}%)` }}
      >
        {images.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className="h-full w-1/2 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/50 to-black/55" />

      <div className="absolute bottom-6 right-6 z-10 flex items-center gap-2">
        {images.map((_, index) => (
          <span
            key={`dot-${index}`}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-700 ease-in-out ${
              index === currentSlide ? "bg-white" : "bg-white/35"
            }`}
            aria-hidden="true"
          />
        ))}
      </div>

      <div className="relative mx-auto flex h-full w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl text-left"
        >
          <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
            Empowering Parents Through Real-Time Academic Insights
          </h1>

          <p className="mt-4 text-base leading-relaxed text-white/90 sm:text-lg">
            Securely access your child&apos;s academic progress, attendance,
            CGPA, and important university updates through our intelligent
            Parent Information Chatbot.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/login"
              className="interactive-btn rounded-md bg-primary px-6 py-3 text-center text-sm font-bold text-white transition-all duration-700 ease-in-out hover:bg-[#9f3308]"
            >
              Parent Login
            </Link>
            <Link
              to="/features"
              className="interactive-btn rounded-md border border-white/45 px-6 py-3 text-center text-sm font-bold text-white transition-all duration-700 ease-in-out hover:bg-white/10"
            >
              Explore Features
            </Link>
          </div>
        </Motion.div>
      </div>
    </section>
  );
};

export default HeroSlider;
