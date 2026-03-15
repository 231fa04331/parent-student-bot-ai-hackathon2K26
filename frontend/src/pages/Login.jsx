import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { authApi } from "../services/api";

const Login = () => {
  const [studentId, setStudentId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("");
    setLoading(true);

    try {
      await authApi.verifyStudent({ studentId, mobileNumber });
      await authApi.sendOtp({ studentId });
      sessionStorage.setItem("pendingStudentId", studentId);
      setStatus("OTP sent successfully. Please verify to continue.");
      navigate("/verify-otp", { state: { studentId, mobileNumber } });
    } catch (error) {
      const message = error?.response?.data?.message || "Unable to send OTP.";
      setStatus(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-7xl items-center px-4 py-14 sm:px-6 lg:px-8">
      <Motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto w-full max-w-lg university-card rounded-2xl p-8"
      >
        <h1 className="text-3xl font-bold text-secondary">Parent Login</h1>
        <p className="mt-2 text-sm text-slate-600">
          Enter student registration number and registered mobile number to receive OTP on email.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-secondary">Student Registration Number</label>
            <input
              value={studentId}
              onChange={(event) => setStudentId(event.target.value.toUpperCase())}
              required
              className="w-full rounded-md border border-slate-300 px-4 py-3 text-sm outline-none ring-primary focus:ring-2"
              placeholder="STU101"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-secondary">Registered Mobile Number</label>
            <input
              value={mobileNumber}
              onChange={(event) => setMobileNumber(event.target.value)}
              required
              className="w-full rounded-md border border-slate-300 px-4 py-3 text-sm outline-none ring-primary focus:ring-2"
              placeholder="9876543210"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-3 text-sm font-bold text-white hover:bg-[#9f3308] disabled:opacity-60"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        {status && <p className="mt-4 text-sm text-secondary">{status}</p>}
      </Motion.div>
    </div>
  );
};

export default Login;
