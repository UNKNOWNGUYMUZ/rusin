import { Link, useLocation } from "react-router-dom";
import { MapPin, BookMarked, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isHome = location.pathname === "/";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHome
          ? "bg-white shadow-sm border-b border-slate-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span
              className={`font-display text-xl font-semibold transition-colors ${
                scrolled || !isHome ? "text-slate-900" : "text-white"
              }`}
            >
              RUseen
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/planner"
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                scrolled || !isHome ? "text-slate-700" : "text-white/90 hover:text-white"
              }`}
            >
              Планировщик
            </Link>
            <Link
              to="/saved-trips"
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-blue-600 ${
                scrolled || !isHome ? "text-slate-700" : "text-white/90 hover:text-white"
              }`}
            >
              <BookMarked className="w-4 h-4" />
              Мои поездки
            </Link>
            <Link
              to="/planner"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Начать планирование
            </Link>
          </nav>

          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled || !isHome ? "text-slate-700 hover:bg-slate-100" : "text-white hover:bg-white/10"
            }`}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100"
          >
            <nav className="px-4 py-4 flex flex-col gap-3">
              <Link
                to="/planner"
                className="text-sm font-medium text-slate-700 hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                Планировщик
              </Link>
              <Link
                to="/saved-trips"
                className="text-sm font-medium text-slate-700 hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                Мои поездки
              </Link>
              <Link
                to="/planner"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors text-center"
                onClick={() => setMenuOpen(false)}
              >
                Начать планирование
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
