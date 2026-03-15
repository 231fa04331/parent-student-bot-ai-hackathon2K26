import FeatureCards from "../components/FeatureCards";

const Features = () => {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 text-left">
        <h1 className="text-3xl font-bold text-secondary">Portal Features</h1>
        <p className="mt-2 text-sm text-slate-600">
          Explore all capabilities available for secure parent access and academic tracking.
        </p>
      </div>
      <FeatureCards />
    </div>
  );
};

export default Features;
