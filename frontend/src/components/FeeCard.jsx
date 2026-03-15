const FeeCard = ({ finance }) => {
  const pending = finance?.finance?.pendingAmount ?? 0;

  return (
    <div className="interactive-card university-card rounded-xl p-5">
      <p className="text-xs font-bold uppercase tracking-[0.08em] text-primary">Fee Status</p>
      <h3 className="mt-2 text-3xl font-bold text-secondary">Rs. {pending.toLocaleString()}</h3>
      <p className="mt-1 text-sm text-slate-600">Pending fee balance</p>
      <div className="mt-4 text-xs text-slate-500">
        <p>Total: Rs. {(finance?.finance?.totalFees ?? 0).toLocaleString()}</p>
        <p>Paid: Rs. {(finance?.finance?.paidAmount ?? 0).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default FeeCard;
