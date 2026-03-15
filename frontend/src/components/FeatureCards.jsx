import { motion as Motion } from "framer-motion";

const features = [
  {
    title: "Academic Monitoring",
    description: "Track student progression with authenticated, real-time institutional data.",
  },
  {
    title: "Attendance Reports",
    description: "Access overall, subject-wise, and semester attendance insights instantly.",
  },
  {
    title: "Academic Performance",
    description: "Review CGPA trends, subject marks, and performance-based suggestions.",
  },
  {
    title: "Fee Information",
    description: "Check payment status, pending balances, and complete transaction history.",
  },
  {
    title: "Faculty Contacts",
    description: "Find faculty and advisor contacts for transparent parent communication.",
  },
  {
    title: "Academic Notifications",
    description: "Stay updated on exams, assignments, and university academic announcements.",
  },
];

const FeatureCards = () => {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 text-left">
        <h2 className="section-title text-3xl font-bold text-secondary">Key Features</h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Motion.article
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="interactive-card university-card rounded-xl p-5"
          >
            <h3 className="text-lg font-bold text-secondary">{feature.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.description}</p>
          </Motion.article>
        ))}
      </div>
    </section>
  );
};

export default FeatureCards;
