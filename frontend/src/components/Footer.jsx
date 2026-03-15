import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-12 bg-secondary text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <h3 className="mb-3 text-lg font-bold">University</h3>
          <p className="text-sm text-white/85">Vignan&apos;s University</p>
          <p className="text-sm text-white/85">Guntur, Andhra Pradesh</p>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-bold">Quick Links</h3>
          <ul className="space-y-2 text-sm text-white/85">
            <li>
              <Link to="/" className="transition-colors duration-300 hover:text-accent">
                Home
              </Link>
            </li>
            <li>
              <Link to="/login" className="transition-colors duration-300 hover:text-accent">
                Parent Login
              </Link>
            </li>
            <li>
              <Link to="/features" className="transition-colors duration-300 hover:text-accent">
                Features
              </Link>
            </li>
            <li>
              <Link to="/about" className="transition-colors duration-300 hover:text-accent">
                About
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-bold">Resources</h3>
          <ul className="space-y-2 text-sm text-white/85">
            <li>
              <Link to="/about" className="transition-colors duration-300 hover:text-accent">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/about" className="transition-colors duration-300 hover:text-accent">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/about" className="transition-colors duration-300 hover:text-accent">
                Support
              </Link>
            </li>
            <li>
              <Link to="/about" className="transition-colors duration-300 hover:text-accent">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-bold">Contact</h3>
          <p className="text-sm text-white/85">support@vignan.edu</p>
          <p className="text-sm text-white/85">+91-XXXXXXXXXX</p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-white/70 sm:px-6 lg:px-8">
          &copy; 2026 Vignan&apos;s University Parent Academic Portal. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
