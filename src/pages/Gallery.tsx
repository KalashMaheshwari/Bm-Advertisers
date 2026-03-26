import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

// 1. DATA GENERATION: 124 Images / Windows Naming Logic
const TOTAL_IMAGES = 124;
const ALL_IMAGES = Array.from({ length: TOTAL_IMAGES }, (_, i) => ({
  id: i + 1,
  url: `./gallery/all/img (${i + 1}).jpg`,
}));

export default function Gallery() {
  const [index, setIndex] = useState<number | null>(null);
  const [showTop, setShowTop] = useState(false);

  // 2. EVENT LISTENERS: Keyboard & Scroll Sensor (Lightweight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (index === null) return;
      if (e.key === "ArrowRight") setIndex((prev) => (prev! + 1) % TOTAL_IMAGES);
      if (e.key === "ArrowLeft") setIndex((prev) => (prev! - 1 + TOTAL_IMAGES) % TOTAL_IMAGES);
      if (e.key === "Escape") setIndex(null);
    };
    const handleScroll = () => setShowTop(window.scrollY > 800);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [index]);

  return (
    <div className="min-h-screen bg-white selection:bg-[#A30000] selection:text-white">

      {/* 3. HEADER — ARCHITECTURAL ASSETS */}
      <header className="pt-12 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-12 w-[1px] h-full bg-black/5 -z-10" />
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center space-x-6 mb-10">
            <div className="w-16 h-[1.5px] bg-[#A30000]" />
            <span className="text-[10px] font-bold tracking-[0.6em] text-black/40 uppercase">Archive</span>
          </div>
          <div className="grid lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8 text-left">
              <h1 className="font-serif text-[clamp(4rem,12vw,10rem)] text-black tracking-tighter leading-[0.8]">
                Visual <span className="italic text-[#A30000]">Legacy.</span>
              </h1>
            </div>
            <div className="lg:col-span-4 border-l border-black/10 pl-8 pb-4">
              <p className="text-[11px] font-bold text-black/40 uppercase tracking-[0.4em] leading-relaxed text-left">
                A non-linear journey through artifacts of prestige branding and high-impact storytelling.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 4. GRID — PINTEREST MASONRY (NATIVE PERFORMANCE) */}
      <main className="px-3 pt-8 pb-24">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {ALL_IMAGES.map((img, i) => (
            <GalleryImage key={img.id} img={img} index={i} setIndex={setIndex} />
          ))}
        </div>
      </main>

      {/* 6. DROPLET TOP BUTTON — BOLD WHITE ARROW */}
      <AnimatePresence>
        {showTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-10 right-10 z-[150] w-12 h-12 flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full cursor-pointer hover:bg-black/60 transition-all group shadow-xl"
          >
            <svg className="w-4 h-4 text-white transition-transform group-hover:-translate-y-1" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. LIGHTBOX — KEYBOARD DRIVEN */}
      <AnimatePresence>
        {index !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIndex(null)}
            className="fixed inset-0 z-[400] bg-black/95 flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
          >
            <motion.img
              key={index}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              src={ALL_IMAGES[index].url}
              className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-lg"
            />

            <div className="absolute top-8 right-8 flex items-center space-x-3 text-white/50 hover:text-white transition-colors cursor-pointer group">
              <span className="text-[9px] font-black tracking-[0.4em] uppercase">Close</span>
              <div className="relative w-3.5 h-3.5 flex items-center justify-center">
                <div className="absolute w-full h-[1px] bg-current rotate-45" />
                <div className="absolute w-full h-[1px] bg-current -rotate-45" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GalleryImage({ img, index, setIndex }: { img: any, index: number, setIndex: any }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      onClick={() => setIndex(index)}
      className={cn(
        "relative break-inside-avoid cursor-pointer overflow-hidden rounded-xl shadow-sm transition-all duration-500",
        // The "Skeleton" state:
        !loaded ? "bg-black/5 animate-pulse min-h-[300px]" : "bg-black"
      )}
    >
      <img
        src={img.url}
        alt="Archive item"
        loading={index < 6 ? "eager" : "lazy"}
        fetchPriority={index < 6 ? "high" : "low"}
        onLoad={() => setLoaded(true)}
        className={cn(
          "w-full h-auto object-cover block group-hover:opacity-60 transition-all duration-700 ease-in-out",
          // Hidden until loaded to prevent "half-loaded" image flickering
          loaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.02]"
        )}
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
    </div>
  );
}