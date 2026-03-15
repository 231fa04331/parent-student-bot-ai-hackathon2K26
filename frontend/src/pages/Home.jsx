import { motion } from "framer-motion";
import HeroSlider from "../components/HeroSlider";
import FeatureCards from "../components/FeatureCards";

const Home = () => {
  return (
    <>
      <HeroSlider />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="university-card rounded-xl p-7 text-left"
        >
          <h2 className="section-title text-3xl font-bold text-secondary">Why Use This System</h2>
          <ul className="mt-4 grid list-disc gap-3 pl-5 text-sm text-slate-700 md:grid-cols-2">
            <li>Real-time academic monitoring</li>
            <li>Transparent student progress tracking</li>
            <li>Instant access to attendance and performance</li>
            <li>Reduced dependency on manual inquiries</li>
          </ul>
        </motion.div>
      </section>

      <FeatureCards />
    </>
  );
};

export default Home;
