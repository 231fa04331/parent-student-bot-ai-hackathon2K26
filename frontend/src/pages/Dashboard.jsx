import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { attendanceApi, financeApi, notificationApi, performanceApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import AttendanceCard from "../components/AttendanceCard";
import CGPACard from "../components/CGPACard";
import FeeCard from "../components/FeeCard";

const Dashboard = () => {
  const { studentId } = useAuth();
  const [attendance, setAttendance] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [finance, setFinance] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      if (!studentId) return;

      try {
        const [attendanceRes, cgpaRes, financeRes, notifyRes] = await Promise.all([
          attendanceApi.overall(studentId),
          performanceApi.cgpa(studentId),
          financeApi.status(studentId),
          notificationApi.list(),
        ]);

        setAttendance(attendanceRes.data);
        setPerformance(cgpaRes.data);
        setFinance(financeRes.data);
        setNotifications(notifyRes.data.notifications || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load dashboard data.");
      }
    };

    loadData();
  }, [studentId]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 text-left">
        <h1 className="text-3xl font-bold text-secondary">Parent Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Quick academic overview for student {studentId || "-"}</p>
      </div>

      {error && <p className="mb-4 rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="grid gap-5 md:grid-cols-3">
        <AttendanceCard attendance={attendance} />
        <CGPACard performance={performance} />
        <FeeCard finance={finance} />
      </div>

      <section className="mt-8 university-card rounded-xl p-5" id="notifications-section">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-secondary">Dashboard Snapshot</h2>
            <p className="mt-1 text-sm text-slate-600">
              Dashboard shows only a quick preview. Open Notifications for full details and downloads.
            </p>
          </div>
          <Link
            to="/notifications"
            className="interactive-btn rounded-md bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-[#9f3308]"
          >
            Open Notifications Center
          </Link>
        </div>

        <div className="mt-4 space-y-3">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Attendance Alert</p>
              <p className="mt-2 text-sm font-bold text-secondary">
                {attendance?.summary?.lowAttendanceCount > 0
                  ? `${attendance.summary.lowAttendanceCount} low-attendance subject(s)`
                  : "No low-attendance alerts"}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Fee Alert</p>
              <p className="mt-2 text-sm font-bold text-secondary">
                {finance?.finance?.pendingAmount > 0
                  ? `Pending: INR ${Number(finance.finance.pendingAmount).toLocaleString("en-IN")}`
                  : "No pending fees"}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total Notifications</p>
              <p className="mt-2 text-sm font-bold text-secondary">{notifications.length}</p>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-secondary">Recent Headlines</p>
            {notifications.length === 0 ? (
              <p className="mt-2 text-sm text-slate-600">No notifications available.</p>
            ) : (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                {notifications.slice(0, 2).map((item) => (
                  <li key={`${item.title}-${item.date}`}>{item.title}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
