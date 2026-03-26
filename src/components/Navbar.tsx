import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => { setScrolled(window.scrollY > 50); };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    // With HashRouter, the location.pathname is just "/" even if the URL is /#/gallery
    // So we check if the path is an anchor link
    if (path.includes("#")) {
      const hash = path.split("#")[1];
      
      // If we are already on the "home" part of the hash
      if (location.pathname === "/") {
        e.preventDefault();
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="relative w-full z-50 antialiased">
      <nav className={cn(
        "fixed top-0 left-0 right-0 w-full z-[60] transition-all duration-500 border-b",
        scrolled ? "glass-nav border-[#A30000]/20 py-3 shadow-md" : "bg-white border-black/5 py-4"
      )}>
        <div className="max-w-7xl mx-auto px-6 flex justify-center items-center">
          <ul className="flex items-center space-x-8 md:space-x-14">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link 
                  to={item.path} 
                  onClick={(e) => handleNavClick(e, item.path)}
                  className={cn(
                    "text-[10px] md:text-[11px] uppercase tracking-[0.35em] font-black transition-all duration-300 relative group",
                    // Fix: location.pathname works perfectly with HashRouter without extra prefix
                    location.pathname === item.path ? "text-[#A30000]" : "text-black/40 hover:text-black"
                  )}
                >
                  {item.label}
                  <span className={cn(
                    "absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[#A30000] transition-all duration-300 group-hover:w-full", 
                    location.pathname === item.path && "w-full"
                  )} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="w-full bg-white pt-20 pb-4 border-b border-black/[0.03]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <Link to="/" className="group py-2 flex justify-center transition-all duration-700">
            <img 
              /* Fix: Use a relative path for the logo so HashRouter finds it */
              src="./logo.png" 
              alt="BM Advertiser Logo" 
              className="h-20 md:h-28 w-auto object-contain transition-transform duration-700"
            />
          </Link>

          <div className="flex items-center space-x-6 opacity-20 mt-2">
            <span className="text-[9px] uppercase font-bold tracking-[0.5em]">EST. 2006</span>
          </div>
        </div>
      </div>
    </header>
  );
}