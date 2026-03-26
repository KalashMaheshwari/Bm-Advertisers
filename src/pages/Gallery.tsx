import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

const TOTAL_IMAGES = 124;
const ALL_IMAGES = Array.from({ length: TOTAL_IMAGES }, (_, i) => ({
  id: i + 1,
  url: `./gallery/all/img (${i + 1}).jpg`,
}));

export default function Gallery() {
  const [index, setIndex] = useState<number | null>(null);
  const [showTop, setShowTop] = useState(false);

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
    <div className="min-h-screen bg-white selection:bg-[#A30000] selection:text-white overflow-x-hidden">
      
      {/* 3. HEADER — Responsive Scaling */}
      <header className="pt-20 pb-12 md:pt-12 md:pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-6 md:left-12 w-[1px] h-full bg-black/5 -z-10" />
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center space-x-4 md:space-x-6 mb-8 md:mb-10">
            <div className="w-12 md:w-16 h-[1.5px] bg-[#A30000]" />
            <span className="text-[9px] md:text-[10px] font-bold tracking-[0.5em] text-black/40 uppercase">Archive</span>
          </div>
          <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-end">
            <div className="lg:col-span-8 text-left">
              <h1 className="font-serif text-[12vw] md:text-[clamp(4rem,12vw,10rem)] text-black tracking-tighter leading-[0.85] md:leading-[0.8]">
                Visual <span className="italic text-[#A30000]">Legacy.</span>
              </h1>
            </div>
            <div className="lg:col-span-4 border-l border-[#A30000]/20 md:border-black/10 pl-6 md:pl-8 pb-2">
              <p className="text-[10px] md:text-[11px] font-bold text-black/40 uppercase tracking-[0.3em] md:tracking-[0.4em] leading-relaxed">
                A non-linear journey through artifacts of prestige branding and high-impact storytelling.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 4. GRID — Pinterest Style (2 Columns Mobile, 3 Columns Desktop) */}
      <main className="px-2 md:px-6 pt-4 pb-24 max-w-[2000px] mx-auto">
        <div 
          /* columns-2: Mobile 
             md:columns-3: Desktop (Restored your preferred layout)
             gap-2: Mobile tight spacing
             md:gap-6: Desktop spacious spacing
          */
          className="columns-2 md:columns-3 gap-2 md:gap-6 space-y-2 md:space-y-6"
          style={{ contentVisibility: 'auto' }}
        >
          {ALL_IMAGES.map((img, i) => (
            <GalleryImage key={img.id} img={img} index={i} setIndex={setIndex} />
          ))}
        </div>
      </main>

      {/* 6. TOP BUTTON */}
      <AnimatePresence>
        {showTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-[150] w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-black/80 backdrop-blur-md border border-white/10 rounded-full cursor-pointer shadow-2xl"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. LIGHTBOX */}
      <AnimatePresence>
        {index !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIndex(null)}
            className="fixed inset-0 z-[400] bg-black/98 flex items-center justify-center p-4 cursor-zoom-out backdrop-blur-sm"
          >
            <motion.img
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              src={ALL_IMAGES[index].url}
              className="max-w-full max-h-[80vh] md:max-h-[85vh] object-contain shadow-2xl rounded-sm"
            />
            <div className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center space-x-3 text-white/50">
              <span className="text-[8px] md:text-[9px] font-black tracking-[0.4em] uppercase">Close</span>
              <div className="w-3 h-3 relative">
                <div className="absolute w-full h-[1.5px] bg-current rotate-45" />
                <div className="absolute w-full h-[1.5px] bg-current -rotate-45" />
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "100px" }}
      transition={{ duration: 0.5, delay: (index % 2) * 0.1 }}
      onClick={() => setIndex(index)}
      className={cn(
        "relative break-inside-avoid cursor-pointer overflow-hidden rounded-md md:rounded-xl transition-all duration-500",
        !loaded ? "bg-black/5 animate-pulse min-h-[180px] md:min-h-[300px]" : "bg-black"
      )}
    >
      <img
        src={img.url}
        alt="BM Archive"
        loading={index < 8 ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        className={cn(
          "w-full h-auto object-cover block transition-all duration-700 ease-out",
          loaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-sm scale-[1.03]"
        )}
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
      {/* Hover overlay active primarily on desktop */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}