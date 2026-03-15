import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      <div className="absolute inset-0 opacity-25">
        <div className="absolute -left-16 top-20 h-64 w-64 rounded-full bg-accent blur-3xl" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-primary/60 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-left"
        >
          <span className="inline-flex rounded-full bg-white/15 px-4 py-1 text-xs font-semibold tracking-[0.12em] text-white">
            PARENT VERIFICATION PORTAL
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white md:text-5xl">
            Empowering Parents Through Real-Time Academic Insights
          </h1>
          <p className="mt-5 max-w-xl text-base text-white/90 md:text-lg">
            Securely access your child&apos;s academic progress, attendance, CGPA, and important
            university updates through our intelligent Parent Information Chatbot.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/login"
              className="interactive-btn rounded-md bg-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-[#9f3308]"
            >
              Parent Login
            </Link>
            <a
              href="#features"
              className="interactive-btn rounded-md border border-white/40 px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
            >
              Explore Features
            </a>
          </div>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="university-card rounded-2xl p-6"
        >
          <h2 className="text-left text-2xl font-bold text-secondary">How It Works</h2>
          <div className="mt-5 space-y-4 text-left">
            <div className="interactive-card rounded-xl bg-bgsoft p-4">
              <p className="text-sm font-bold text-primary">Step 1</p>
              <p className="text-sm text-secondary">Parent enters Student Registration Number.</p>
            </div>
            <div className="interactive-card rounded-xl bg-bgsoft p-4">
              <p className="text-sm font-bold text-primary">Step 2</p>
              <p className="text-sm text-secondary">Email OTP verification ensures secure access.</p>
            </div>
            <div className="interactive-card rounded-xl bg-bgsoft p-4">
              <p className="text-sm font-bold text-primary">Step 3</p>
              <p className="text-sm text-secondary">
                Parent interacts with the chatbot to retrieve academic information.
              </p>
            </div>
          </div>
        </Motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
