const CGPACard = ({ performance }) => {
  const cgpa = performance?.currentCgpa ?? 0;

  return (
    <div className="interactive-card university-card rounded-xl p-5">
      <p className="text-xs font-bold uppercase tracking-[0.08em] text-primary">Current CGPA</p>
      <h3 className="mt-2 text-3xl font-bold text-secondary">{cgpa}</h3>
      <p className="mt-1 text-sm text-slate-600">Cumulative grade performance index</p>
      <p className="mt-4 text-xs text-slate-500">Total Credits: {performance?.totalCredits ?? 0}</p>
    </div>
  );
};

export default CGPACard;
