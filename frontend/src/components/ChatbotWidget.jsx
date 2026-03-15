import { useEffect, useMemo, useRef, useState } from "react";
import { motion as Motion } from "framer-motion";
import jsPDF from "jspdf";
import { chatbotApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import SpeakButton from "./SpeakButton";

const SUGGESTED_QUERIES = [
  "What is my child's attendance?",
  "Show subject marks",
  "What is current CGPA?",
  "Show faculty details",
  "Show exam timetable",
  "Show academic calendar",
  "Help",
];

const formatTime = (dateString) =>
  new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const escapeCsvValue = (value) => {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

const buildCsv = (headers, rows) => {
  const headerLine = headers.map(escapeCsvValue).join(",");
  const bodyLines = rows.map((row) => row.map(escapeCsvValue).join(","));
  return [headerLine, ...bodyLines].join("\n");
};

const appendCsvAndPdfDownloads = ({ downloads, labelBase, fileBase, title, headers, rows }) => {
  if (!Array.isArray(rows) || rows.length === 0) {
    return;
  }

  downloads.push({
    label: `${labelBase} (CSV)`,
    fileName: `${fileBase}.csv`,
    mimeType: "text/csv;charset=utf-8",
    format: "csv",
    content: buildCsv(headers, rows),
  });

  downloads.push({
    label: `${labelBase} (PDF)`,
    fileName: `${fileBase}.pdf`,
    format: "pdf",
    pdfTitle: title,
    headers,
    rows,
  });
};

const buildChatDownloads = (payload, fallbackStudentId) => {
  if (!payload || typeof payload !== "object") return [];

  const intent = String(payload.intent || "").toLowerCase();
  const studentLabel = String(payload?.student?.studentId || fallbackStudentId || "student").toLowerCase();
  const downloads = [];

  if (intent === "attendance") {
    const subjectRows = Array.isArray(payload?.data?.subjectWiseAttendance)
      ? payload.data.subjectWiseAttendance
      : [];
    const semesterRows = Array.isArray(payload?.data?.semesterWiseAttendance)
      ? payload.data.semesterWiseAttendance
      : [];

    if (subjectRows.length > 0) {
      appendCsvAndPdfDownloads({
        downloads,
        labelBase: "Download Attendance (Subject-wise)",
        fileBase: `attendance_subject_wise_${studentLabel}`,
        title: "Subject-wise Attendance Report",
        headers: ["Subject", "Semester", "Attended Classes", "Total Classes", "Percentage"],
        rows: subjectRows.map((item) => [
          item.subject,
          item.semester,
          item.attendedClasses,
          item.totalClasses,
          `${item.percentage}%`,
        ]),
      });
    }

    if (semesterRows.length > 0) {
      appendCsvAndPdfDownloads({
        downloads,
        labelBase: "Download Attendance (Semester-wise)",
        fileBase: `attendance_semester_wise_${studentLabel}`,
        title: "Semester-wise Attendance Report",
        headers: ["Semester", "Attended Classes", "Total Classes", "Percentage"],
        rows: semesterRows.map((item) => [
          item.semester,
          item.attendedClasses,
          item.totalClasses,
          `${item.percentage}%`,
        ]),
      });
    }
  }

  if (intent === "marks" || intent === "cgpa") {
    const marksRows = Array.isArray(payload?.data?.subjects)
      ? payload.data.subjects
      : Array.isArray(payload?.data?.subjectWiseMarks)
        ? payload.data.subjectWiseMarks
        : [];

    if (marksRows.length > 0) {
      appendCsvAndPdfDownloads({
        downloads,
        labelBase: "Download Marks Report",
        fileBase: `marks_report_${studentLabel}`,
        title: "Subject-wise Marks Report",
        headers: ["Subject", "Semester", "Marks", "Grade", "Attempt"],
        rows: marksRows.map((item) => [
          item.subject,
          item.semester ?? "",
          item.marks ?? "",
          item.grade ?? "",
          item.attempt ?? "",
        ]),
      });
    }

    if (intent === "cgpa") {
      const yearWise = Array.isArray(payload?.data?.yearWiseCgpa) ? payload.data.yearWiseCgpa : [];
      const semesterWise = Array.isArray(payload?.data?.semesterWiseCgpa)
        ? payload.data.semesterWiseCgpa
        : [];

      if (yearWise.length > 0 || semesterWise.length > 0) {
        const cgpaRows = [];
        yearWise.forEach((item) => {
          cgpaRows.push(["Year", item.year, item.cgpa, item.totalCredits]);
        });
        semesterWise.forEach((item) => {
          cgpaRows.push(["Semester", item.semester, item.cgpa, item.totalCredits]);
        });

        appendCsvAndPdfDownloads({
          downloads,
          labelBase: "Download CGPA Progress",
          fileBase: `cgpa_progress_${studentLabel}`,
          title: "CGPA Progress Report",
          headers: ["Type", "Period", "CGPA", "Total Credits"],
          rows: cgpaRows,
        });
      }
    }
  }

  if (intent === "academic_status") {
    const backlogSubjects = Array.isArray(payload?.data?.backlogSubjects) ? payload.data.backlogSubjects : [];
    const repeatedSubjects = Array.isArray(payload?.data?.repeatedSubjects) ? payload.data.repeatedSubjects : [];
    const incompleteSubjects = Array.isArray(payload?.data?.incompleteSubjects)
      ? payload.data.incompleteSubjects
      : [];

    const statusRows = [
      ["Backlog Count", payload?.data?.backlogCount ?? 0],
      ["Course Completion Status", payload?.data?.courseCompletionStatus ?? "unknown"],
      [
        "Completion Percentage",
        payload?.data?.completionPercentage === null || payload?.data?.completionPercentage === undefined
          ? "N/A"
          : `${payload.data.completionPercentage}%`,
      ],
      ["Backlog Subjects", backlogSubjects.length ? backlogSubjects.join(" | ") : "None"],
      [
        "Repeated Subjects",
        repeatedSubjects.length
          ? repeatedSubjects.map((item) => `${item.subject} (${item.attempts})`).join(" | ")
          : "None",
      ],
      ["Incomplete Subjects", incompleteSubjects.length ? incompleteSubjects.join(" | ") : "None"],
    ];

    appendCsvAndPdfDownloads({
      downloads,
      labelBase: "Download Academic Status",
      fileBase: `academic_status_${studentLabel}`,
      title: "Academic Status Report",
      headers: ["Metric", "Value"],
      rows: statusRows,
    });
  }

  if (intent === "finance") {
    const history = Array.isArray(payload?.data?.paymentHistory) ? payload.data.paymentHistory : [];

    const summaryRows = [
      ["Fee Payment Status", payload?.data?.paymentStatus ?? "N/A"],
      ["Total Fees", payload?.data?.totalFees ?? 0],
      ["Paid Amount", payload?.data?.paidAmount ?? 0],
      ["Scholarship Amount", payload?.data?.scholarshipAmount ?? 0],
      ["Pending Amount", payload?.data?.pendingAmount ?? 0],
      ["Transaction Count", history.length],
    ];

    appendCsvAndPdfDownloads({
      downloads,
      labelBase: "Download Fee Statement",
      fileBase: `fee_statement_${studentLabel}`,
      title: "Fee Statement",
      headers: ["Metric", "Value"],
      rows: summaryRows,
    });

    if (history.length > 0) {
      appendCsvAndPdfDownloads({
        downloads,
        labelBase: "Download Payment History",
        fileBase: `payment_history_${studentLabel}`,
        title: "Payment History",
        headers: ["Amount", "Date", "Method", "Reference", "Status"],
        rows: history.map((item) => [
          item.amount ?? "",
          item.date ? new Date(item.date).toISOString() : "",
          item.method ?? "",
          item.reference ?? "",
          item.status ?? "",
        ]),
      });
    }
  }

  return downloads;
};

const makeMessage = (role, text, isError = false, meta = null) => ({
  id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  role,
  text,
  isError,
  meta,
  timestamp: new Date().toISOString(),
});

const toUiText = (payload) => {
  if (!payload || typeof payload !== "object") {
    return "No response data available.";
  }

  if (payload.responseText) {
    return payload.responseText;
  }

  if (payload.message) {
    return payload.message;
  }

  if (typeof payload === "string") {
    return payload;
  }

  return "I received your request, but could not format the response.";
};

const getSpeechRecognition = () => {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};

const SPEECH_CHANGED_EVENT = "chatbot-speech-changed";

const ChatbotWidget = () => {
  const { studentId } = useAuth();
  const historyKey = useMemo(() => `chat-history-${studentId || "guest"}`, [studentId]);
  const chatContainerRef = useRef(null);

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(historyKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Ignore parse issues and fallback to default greeting.
      }
    }

    return [
      makeMessage(
        "assistant",
        "Hello! I can help with attendance, marks, CGPA, subjects, faculty, exam timetable, and academic calendar."
      ),
    ];
  });
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechLanguage, setSpeechLanguage] = useState("en");

  const handleDownloadReport = (downloadItem) => {
    if (!downloadItem?.fileName) return;

    if (downloadItem.format === "pdf") {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const margin = 40;
      const maxWidth = 515;
      let y = 50;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(String(downloadItem.pdfTitle || "Report"), margin, y);
      y += 24;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const headerText = Array.isArray(downloadItem.headers) ? downloadItem.headers.join(" | ") : "";
      if (headerText) {
        const wrappedHeaders = doc.splitTextToSize(headerText, maxWidth);
        doc.text(wrappedHeaders, margin, y);
        y += wrappedHeaders.length * 14 + 8;
      }

      const rows = Array.isArray(downloadItem.rows) ? downloadItem.rows : [];
      rows.forEach((row, index) => {
        const rowText = `${index + 1}. ${Array.isArray(row) ? row.join(" | ") : String(row)}`;
        const wrapped = doc.splitTextToSize(rowText, maxWidth);
        if (y + wrapped.length * 14 > 790) {
          doc.addPage();
          y = 50;
        }
        doc.text(wrapped, margin, y);
        y += wrapped.length * 14 + 4;
      });

      doc.save(downloadItem.fileName);
      return;
    }

    if (downloadItem.format === "csv" && downloadItem.content) {
      const blob = new Blob([downloadItem.content], {
        type: downloadItem.mimeType || "text/plain;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = downloadItem.fileName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    }
  };

  useEffect(() => {
    localStorage.setItem(historyKey, JSON.stringify(messages));
  }, [historyKey, messages]);

  useEffect(() => {
    if (!chatContainerRef.current) return;
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages, loading]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "assistant" && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      window.dispatchEvent(new CustomEvent(SPEECH_CHANGED_EVENT, { detail: { speechId: null } }));
    }
  }, [messages]);

  useEffect(() => {
    const saved = localStorage.getItem(historyKey);
    if (!saved) {
      setMessages([
        makeMessage(
          "assistant",
          "Hello! I can help with attendance, marks, CGPA, subjects, faculty, exam timetable, and academic calendar."
        ),
      ]);
      return;
    }

    try {
      setMessages(JSON.parse(saved));
    } catch {
      setMessages([
        makeMessage(
          "assistant",
          "Hello! I can help with attendance, marks, CGPA, subjects, faculty, exam timetable, and academic calendar."
        ),
      ]);
    }
  }, [historyKey]);

  const sendQueryText = async (text) => {
    const trimmed = String(text || "").trim();
    if (!trimmed) return;

    const userMessage = makeMessage("user", trimmed);
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setLoading(true);

    try {
      const { data } = await chatbotApi.query({ query: trimmed, studentId });
      const rendered = toUiText(data);
      const downloads = buildChatDownloads(data, studentId);
      setMessages((prev) => [...prev, makeMessage("assistant", rendered, false, { downloads })]);
    } catch (error) {
      const textMessage = error?.response?.data?.message || "Failed to fetch chatbot response.";
      setMessages((prev) => [...prev, makeMessage("assistant", textMessage, true)]);
    } finally {
      setLoading(false);
    }
  };

  const sendQuery = async (event) => {
    event.preventDefault();
    await sendQueryText(query);
  };

  const handleSuggestedQuery = async (suggestedText) => {
    await sendQueryText(suggestedText);
  };

  const clearChat = () => {
    const greeting = makeMessage(
      "assistant",
      "Chat cleared. Ask a fresh question about your child's academics."
    );
    setMessages([greeting]);
  };

  const startVoiceInput = () => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      setMessages((prev) => [...prev, makeMessage("assistant", "Voice input is not supported in this browser.")]);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      setQuery((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };

    recognition.onerror = () => {
      setMessages((prev) => [...prev, makeMessage("assistant", "Voice recognition failed. Please type your query.", true)]);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div
      className={`university-card rounded-2xl p-4 transition-colors md:p-6 ${
        isDarkMode ? "bg-slate-900 text-slate-100" : ""
      }`}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setIsDarkMode((prev) => !prev)}
            className="interactive-btn rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold"
          >
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <button
            type="button"
            onClick={clearChat}
            className="interactive-btn rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold"
          >
            Clear Chat
          </button>
          <select
            value={speechLanguage}
            onChange={(event) => setSpeechLanguage(event.target.value)}
            className="interactive-btn rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-secondary"
            aria-label="Speech language"
            title="Speech language"
          >
            <option value="en">English</option>
            <option value="te">Telugu</option>
            <option value="hi">Hindi</option>
            <option value="ta">Tamil</option>
          </select>
        </div>
        <button
          type="button"
          onClick={startVoiceInput}
          className="interactive-btn rounded-md bg-secondary px-3 py-1.5 text-xs font-semibold text-white"
        >
          {isListening ? "Listening..." : "Voice Input"}
        </button>
      </div>

      <div
        ref={chatContainerRef}
        className={`h-[460px] overflow-y-auto rounded-xl p-4 ${
          isDarkMode ? "bg-slate-800" : "bg-bgsoft"
        }`}
      >
        <div className="space-y-3">
          {messages.map((message, index) => (
            <Motion.div
              key={message.id || `${message.role}-${index}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`max-w-[88%] rounded-xl px-4 py-3 text-left text-sm ${
                message.role === "user"
                  ? "interactive-card ml-auto bg-primary text-white"
                  : isDarkMode
                    ? `interactive-card border ${
                        message.isError
                          ? "border-red-400 bg-red-950/60 text-red-100"
                          : "border-slate-600 bg-slate-700 text-slate-100"
                      }`
                    : `interactive-card border ${
                        message.isError
                          ? "border-red-200 bg-red-50 text-red-700"
                          : "border-slate-200 bg-white text-secondary"
                      }`
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans">{message.text}</pre>
              {message.role === "assistant" && (
                <div className="mt-2">
                  <SpeakButton speechId={message.id} text={message.text} language={speechLanguage} />
                </div>
              )}
              {message.role === "assistant" && Array.isArray(message?.meta?.downloads) && message.meta.downloads.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {message.meta.downloads.map((item) => (
                    <button
                      key={`${message.id}-${item.fileName}`}
                      type="button"
                      onClick={() => handleDownloadReport(item)}
                      className="interactive-btn rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#9f3308]"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
              <p className={`mt-2 text-[11px] ${message.role === "user" ? "text-white/75" : "text-slate-400"}`}>
                {formatTime(message.timestamp || new Date().toISOString())}
              </p>
            </Motion.div>
          ))}

          {loading && (
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
            >
              <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.2s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.1s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
              <span className="ml-1 text-slate-600">Thinking...</span>
            </Motion.div>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTED_QUERIES.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => handleSuggestedQuery(item)}
            className="interactive-btn rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-secondary"
          >
            {item}
          </button>
        ))}
      </div>

      <form onSubmit={sendQuery} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ask: What is my child's attendance?"
          className={`flex-1 rounded-md border px-4 py-3 text-sm outline-none ring-primary focus:ring-2 ${
            isDarkMode
              ? "border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-400"
              : "border-slate-300 bg-white"
          }`}
        />
        <button
          type="submit"
          disabled={loading}
          className="interactive-btn rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatbotWidget;
