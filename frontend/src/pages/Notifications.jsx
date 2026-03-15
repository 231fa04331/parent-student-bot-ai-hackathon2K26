import { useEffect, useMemo, useState } from "react";
import { notificationApi } from "../services/api";

const CATEGORY_ATTACHMENT_FALLBACK = {
  exam: "/mock-docs/mock-exam-timetable.pdf",
  assignment: "/mock-docs/mock-assignment-details.pdf",
  calendar: "/mock-docs/mock-academic-calendar.pdf",
};

const categoryBadgeClass = (category) => {
  switch (category) {
    case "exam":
      return "bg-red-100 text-red-700";
    case "assignment":
      return "bg-amber-100 text-amber-700";
    case "calendar":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const { data } = await notificationApi.list();
        setNotifications(Array.isArray(data?.notifications) ? data.notifications : []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load notifications.");
      }
    };

    loadNotifications();
  }, []);

  const filteredNotifications = useMemo(() => {
    if (selectedCategory === "all") {
      return notifications;
    }
    return notifications.filter((item) => String(item.category).toLowerCase() === selectedCategory);
  }, [notifications, selectedCategory]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 text-left">
        <h1 className="text-3xl font-bold text-secondary">Academic Notifications</h1>
        <p className="mt-1 text-sm text-slate-600">
          This page contains full notification details, category filters, and PDF downloads.
        </p>
      </div>

      {error && <p className="mb-4 rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="mb-5 flex flex-wrap gap-2">
        {[
          { label: "All", value: "all" },
          { label: "Exam", value: "exam" },
          { label: "Assignment", value: "assignment" },
          { label: "Calendar", value: "calendar" },
          { label: "General", value: "general" },
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setSelectedCategory(item.value)}
            className={`interactive-btn rounded-full px-3 py-1.5 text-xs font-semibold ${
              selectedCategory === item.value
                ? "bg-primary text-white"
                : "border border-slate-300 bg-white text-secondary"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <section className="university-card rounded-xl p-5">
        <div className="space-y-3">
          {filteredNotifications.length === 0 && (
            <p className="text-sm text-slate-600">No notifications available for this category.</p>
          )}

          {filteredNotifications.map((item) => {
            const attachmentUrl = item.attachmentUrl || CATEGORY_ATTACHMENT_FALLBACK[item.category];
            const formattedDate = item?.date
              ? new Date(item.date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "N/A";

            return (
              <div
                key={`${item.title}-${item.date}`}
                className="interactive-card rounded-lg border border-slate-200 bg-white p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-bold text-secondary">{item.title}</p>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${categoryBadgeClass(item.category)}`}
                  >
                    {item.category}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                <p className="mt-2 text-xs text-slate-500">Date: {formattedDate}</p>

                {attachmentUrl && (
                  <a
                    href={attachmentUrl}
                    download
                    className="interactive-btn mt-3 inline-flex rounded-md bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-[#9f3308]"
                  >
                    Download PDF
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Notifications;
