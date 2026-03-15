import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const linkStyle = ({ isActive }) =>
  `interactive-link px-3 py-2 rounded-md text-sm font-semibold ${
    isActive ? "bg-accent text-primary" : "text-white/90 hover:bg-white/15 hover:text-white"
  }`;

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Motion.nav
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="sticky top-0 z-40 border-b border-white/10 bg-secondary shadow-soft"
    >
      <div className="flex w-full items-center justify-between pl-3 pr-4 py-3 sm:pl-4 sm:pr-5 lg:pl-5 lg:pr-8">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/images/logo.svg"
            alt="Vignan University Logo"
            className="h-[56px] max-w-[230px] w-auto object-contain"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
          <div className="text-left leading-tight text-white">
            <p className="text-base font-bold tracking-wide">Vignan&apos;s University</p>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/80">
              Parent Academic Portal
            </p>
          </div>
        </Link>

        <button
          type="button"
          className="rounded-md border border-white/25 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white md:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </button>

        <div className="hidden items-center gap-2 md:flex">
          <NavLink to="/" className={linkStyle}>
            Home
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/dashboard" className={linkStyle}>
                Dashboard
              </NavLink>
              <NavLink to="/chatbot" className={linkStyle}>
                Chatbot
              </NavLink>
              <NavLink to="/notifications" className={linkStyle}>
                Notifications
              </NavLink>
            </>
          )}
          {!isAuthenticated ? (
            <NavLink to="/login" className={linkStyle}>
              Login
            </NavLink>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              className="interactive-btn rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-[#982f08]"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {open && (
        <div className="border-t border-white/10 px-4 pb-3 pt-2 md:hidden">
          <div className="flex flex-col gap-2">
            <NavLink to="/" className={linkStyle} onClick={() => setOpen(false)}>
              Home
            </NavLink>
            {isAuthenticated && (
              <>
                <NavLink to="/dashboard" className={linkStyle} onClick={() => setOpen(false)}>
                  Dashboard
                </NavLink>
                <NavLink to="/chatbot" className={linkStyle} onClick={() => setOpen(false)}>
                  Chatbot
                </NavLink>
                <NavLink to="/notifications" className={linkStyle} onClick={() => setOpen(false)}>
                  Notifications
                </NavLink>
              </>
            )}
            {!isAuthenticated ? (
              <NavLink to="/login" className={linkStyle} onClick={() => setOpen(false)}>
                Login
              </NavLink>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="interactive-btn rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </Motion.nav>
  );
};

export default Navbar;
