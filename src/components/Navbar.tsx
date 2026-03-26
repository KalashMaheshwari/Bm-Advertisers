import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "../lib/utils";

const NAV_ITEMS = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/#about" },
  { label: "Services", path: "/#services" },
  { label: "Gallery", path: "/gallery" },
  { label: "Magazines", path: "/magazines" },
  { label: "Contact Us", path: "/#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => { setScrolled(window.scrollY > 20); };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (path: string) => {
    setIsOpen(false);
    if (path.includes("#")) {
      const hash = path.split("#")[1];
      if (location.pathname === "/") {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="relative w-full z-[100] antialiased">
      {/* 1. THE STICKY NAV CONTAINER */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 w-full z-[110] transition-all duration-700 ease-in-out",
        scrolled
          ? "py-3 bg-white/80 backdrop-blur-xl border-b border-black/[0.05] shadow-[0_2px_20px_rgba(0,0,0,0.02)]"
          : "py-6 bg-transparent border-b border-transparent"
      )}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">

          {/* LEFT: Subtle Logo (Appears only on scroll or mobile) */}
          <Link to="/" className={cn(
            "transition-all duration-500",
            scrolled || isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 md:pointer-events-none"
          )}>
            <img src="./logo.png" alt="BM Logo" className="h-8 md:h-10 w-auto object-contain" />
          </Link>

          {/* CENTER: Desktop Menu */}
          <ul className="hidden md:flex items-center space-x-12">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={cn(
                    "text-[10px] uppercase tracking-[0.4em] font-bold transition-all duration-300 relative group py-2",
                    location.pathname === item.path ? "text-[#A30000]" : "text-black/40 hover:text-black"
                  )}
                >
                  {item.label}
                  <span className={cn(
                    "absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-[#A30000] transition-all duration-500 group-hover:w-full",
                    location.pathname === item.path && "w-8"
                  )} />
                </Link>
              </li>
            ))}
          </ul>

          {/* RIGHT: Mobile Toggle & Desktop CTA */}
          <div className="flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-black transition-transform active:scale-90"
            >
              <AnimatePresence mode="wait">
                {isOpen ? <X key="close" size={24} /> : <Menu key="menu" size={24} />}
              </AnimatePresence>
            </button>

            {/* Desktop "Get in Touch" - High Quality Detail */}
            <Link
              to="/#contact"
              onClick={(e) => handleNavClick("/#contact")}
              className="hidden md:block text-[9px] font-black uppercase tracking-[0.3em] border border-black/10 px-6 py-2.5 rounded-full hover:bg-[#A30000] hover:border-[#A30000] hover:text-white transition-all duration-500 shadow-[0_10px_20px_rgba(0,0,0,0.02)]"
            >
              Inquiry —
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. MODERN OVERLAY: Full Screen with Cinematic Easing */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[105] bg-white/95 backdrop-blur-2xl flex flex-col items-center justify-center md:hidden"
          >
            <div className="flex flex-col items-center space-y-10">
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={cn(
                      "text-4xl font-serif tracking-tighter transition-all",
                      location.pathname === item.path ? "text-[#A30000] italic" : "text-black"
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. MAIN BRANDING HUB: Refined Header */}
      <div className="w-full bg-white pt-32 pb-12 border-b border-black/[0.02]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <Link to="/" className="group block relative">
              <img
                src="./logo.png"
                alt="BM Advertiser Logo"
                className="h-20 md:h-32 w-auto object-contain transition-all duration-1000 group-hover:brightness-110"
              />
              {/* Subtle Red Shadow Glow */}
              <div className="absolute -inset-4 bg-[#A30000]/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            </Link>
          </motion.div>

          <div className="mt-6 flex flex-col items-center space-y-2">
            <div className="h-[1px] w-8 bg-[#A30000]/40" />
            <span className="text-[10px] uppercase font-black tracking-[0.6em] text-black/20">
              Established 2006
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}