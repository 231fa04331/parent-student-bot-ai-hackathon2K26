import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import OTPVerification from "./pages/OTPVerification";
import Dashboard from "./pages/Dashboard";
import ChatbotPage from "./pages/ChatbotPage";
import Notifications from "./pages/Notifications";
import Features from "./pages/Features";
import About from "./pages/About";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <p className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
          Checking authentication...
        </p>
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <div className="min-h-screen text-secondary">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<OTPVerification />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chatbot"
            element={
              <ProtectedRoute>
                <ChatbotPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
