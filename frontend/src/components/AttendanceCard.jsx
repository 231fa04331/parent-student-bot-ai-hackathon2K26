const AttendanceCard = ({ attendance }) => {
  const value = attendance?.summary?.overallAttendance ?? 0;

  return (
    <div className="interactive-card university-card rounded-xl p-5">
      <p className="text-xs font-bold uppercase tracking-[0.08em] text-primary">Attendance Summary</p>
      <h3 className="mt-2 text-3xl font-bold text-secondary">{value}%</h3>
      <p className="mt-1 text-sm text-slate-600">Overall attendance percentage</p>
      <div className="mt-4 h-2 rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
    </div>
  );
};

export default AttendanceCard;
