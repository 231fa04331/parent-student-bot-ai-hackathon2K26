import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { authApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { completeLogin } = useAuth();

  const studentId = location.state?.studentId || sessionStorage.getItem("pendingStudentId") || "";

  if (!studentId) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-7xl items-center px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-lg university-card rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-secondary">OTP Verification</h1>
          <p className="mt-2 text-sm text-slate-600">
            Session expired. Please go back to login and request a new OTP.
          </p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-5 w-full rounded-md bg-primary px-4 py-3 text-sm font-bold text-white hover:bg-[#9f3308]"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("");
    setLoading(true);

    try {
      const verifyResponse = await authApi.verifyOtp({ studentId, otp });
      const token = verifyResponse?.data?.token;

      if (!token) {
        setStatus("OTP verification succeeded but token was not returned.");
        return;
      }

      completeLogin({ token, studentId });
      navigate("/dashboard");
    } catch (error) {
      const message = error?.response?.data?.message || "OTP verification failed.";
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
        <h1 className="text-3xl font-bold text-secondary">OTP Verification</h1>
        <p className="mt-2 text-sm text-slate-600">Verify the OTP sent to the student's registered email.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-secondary">OTP</label>
            <input
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              required
              className="w-full rounded-md border border-slate-300 px-4 py-3 text-sm outline-none ring-primary focus:ring-2"
              placeholder="Enter OTP"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-3 text-sm font-bold text-white hover:bg-[#9f3308] disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {status && <p className="mt-4 text-sm text-secondary">{status}</p>}
      </Motion.div>
    </div>
  );
};

export default OTPVerification;
