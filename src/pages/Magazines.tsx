import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ZoomIn, ZoomOut, RotateCw, ArrowRight, Volume2, VolumeX, ChevronLeft, ChevronRight
} from "lucide-react";
import { cn } from "../lib/utils";

/**
 * ARCHIVE DATA
 */
const UPCOMING_ASSETS = [
  { type: "image", url: "/banners/banner1.webp" },
  { type: "image", url: "/banners/banner2.webp" },
  { type: "video", url: "/banners/banner3.mp4" },
  { type: "video", url: "/banners/banner4.mp4" }
];

const MAGAZINES_DATA = [
  {
    id: 1,
    title: "BEMISAL SAKSHIYAT",
    year: "2024",
    cover: "/magazines/Bemisal_Sakshiyat_24/thumbnail.webp",
    basePath: "/magazines/Bemisal_Sakshiyat_24",
    pages: 152 // Update to actual page count
  },
  {
    id: 2,
    title: "SAFALTA KE SARTAJ",
    year: "2023",
    cover: "/magazines/Safalta_Ke_Sartaj_23/thumbnail.webp",
    basePath: "/magazines/Safalta_Ke_Sartaj_23",
    pages: 124 // Update to actual page count
  },
  {
    id: 3,
    title: "UDAAN",
    year: "2025",
    cover: "/magazines/UDAAN_25/thumbnail.webp",
    basePath: "/magazines/UDAAN_25",
    pages: 194 // Update to actual page count
  },
];

// Helper to determine default zoom based on screen size
const getDefaultZoom = () => {
  if (typeof window !== 'undefined') {
    return window.innerWidth < 768 ? 1.0 : 0.3; // 100% for mobile, 30% for desktop
  }
  return 0.3;
};

export default function Magazines() {
  const MAGAZINES = useMemo(() => {
    return [...MAGAZINES_DATA].sort((a, b) => parseInt(b.year) - parseInt(a.year));
  }, []);

  // Hero Carousel State
  const [assetIdx, setAssetIdx] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Magazine Reader State
  const [activeMag, setActiveMag] = useState<typeof MAGAZINES[0] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpInput, setJumpInput] = useState("1"); 
  const [zoomLevel, setZoomLevel] = useState(getDefaultZoom);
  const [zoomInput, setZoomInput] = useState(`${Math.round(getDefaultZoom() * 100)}`);
  const [rotation, setRotation] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Carousel Logic
  const nextSlide = () => setAssetIdx(p => (p + 1) % UPCOMING_ASSETS.length);
  const prevSlide = () => setAssetIdx(p => (p - 1 + UPCOMING_ASSETS.length) % UPCOMING_ASSETS.length);

  const onDragEnd = (_: any, info: any) => {
    if (info.offset.x < -50) nextSlide();
    if (info.offset.x > 50) prevSlide();
  };

  // Auto-advance for images
  useEffect(() => {
    const currentAsset = UPCOMING_ASSETS[assetIdx];
    if (currentAsset.type === "image") {
      const timer = setTimeout(() => nextSlide(), 8000);
      return () => clearTimeout(timer);
    }
  }, [assetIdx]);

  // Lock body scroll when reader is open
  useEffect(() => {
    document.body.style.overflow = activeMag ? "hidden" : "auto";
  }, [activeMag]);

  // Reset reader state when magazine opens
  useEffect(() => {
    if (activeMag) {
      const defaultZoom = getDefaultZoom();
      setZoomLevel(defaultZoom);
      setZoomInput(String(Math.round(defaultZoom * 100)));
      setRotation(0);
      setCurrentPage(1);
      setJumpInput("1");
      setTimeout(() => {
        scrollContainerRef.current?.scrollTo({ top: 0 });
      }, 50);
    }
  }, [activeMag]);

  // Keep jump input in sync with scroll position
  useEffect(() => {
    setJumpInput(String(currentPage));
  }, [currentPage]);

  // Keep zoom input in sync with zoom level
  useEffect(() => {
    setZoomInput(String(Math.round(zoomLevel * 100)));
  }, [zoomLevel]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeMag) return;
      if (e.key === "Escape") setActiveMag(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeMag]);

  // Video intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current) {
          if (entry.isIntersecting && !activeMag) {
            videoRef.current.play().catch(() => { });
          } else {
            videoRef.current.pause();
          }
        }
      },
      { threshold: 0.1 }
    );
    const heroSection = videoRef.current?.closest('section');
    if (heroSection) observer.observe(heroSection);
    return () => observer.disconnect();
  }, [activeMag, assetIdx]);

  // Scroll Listener: Track which page is currently in view
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !activeMag) return;

    const handleScroll = () => {
      const pages = container.querySelectorAll('.mag-page');
      const containerRect = container.getBoundingClientRect();
      const middlePoint = containerRect.top + containerRect.height / 2;

      let current = 1;
      pages.forEach((page, index) => {
        const rect = page.getBoundingClientRect();
        if (rect.top < middlePoint) {
          current = index + 1;
        }
      });
      setCurrentPage(current);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [activeMag]);

  // Jump to Page Logic
  const handleJumpToPage = (e: React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
    if ('key' in e && e.key !== 'Enter') return;
    
    const pageNum = parseInt(jumpInput, 10);
    if (activeMag && pageNum >= 1 && pageNum <= activeMag.pages) {
      const target = scrollContainerRef.current?.querySelector(`[data-page="${pageNum}"]`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      setJumpInput(String(currentPage));
    }
  };

  // Zoom Input Logic
  const handleZoomSubmit = (e: React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
    if ('key' in e && e.key !== 'Enter') return;
    
    let val = parseInt(zoomInput, 10);
    if (isNaN(val)) val = Math.round(getDefaultZoom() * 100); // Fallback
    
    const clampedVal = Math.max(20, Math.min(300, val)); // Clamp between 20% and 300%
    setZoomLevel(clampedVal / 100);
    setZoomInput(String(clampedVal)); // Clean up input to valid number
  };

  // Toolbar Controls
  const handleZoomIn = () => setZoomLevel(z => Math.min(3, parseFloat((z + 0.1).toFixed(1))));
  const handleZoomOut = () => setZoomLevel(z => Math.max(0.2, parseFloat((z - 0.1).toFixed(1))));
  const handleRotate = () => setRotation(r => (r + 90) % 360);

  return (
    <div className="min-h-screen bg-white pt-20 md:pt-12 pb-32 selection:bg-[#A30000] selection:text-white antialiased overflow-x-hidden">

      {/* HERO SECTION */}
      <section className="px-4 md:px-12 mb-20 md:mb-32">
        <div className="max-w-[1600px] mx-auto relative aspect-[16/10] md:aspect-video bg-[#0A0A0A] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl group">
          <motion.div
            key={`asset-${assetIdx}`}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={onDragEnd}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            {UPCOMING_ASSETS[assetIdx].type === "video" ? (
              <video
                ref={videoRef}
                src={UPCOMING_ASSETS[assetIdx].url}
                autoPlay
                playsInline
                muted={isMuted}
                onEnded={nextSlide}
                className="w-full h-full object-cover pointer-events-none"
              />
            ) : (
              <img
                src={UPCOMING_ASSETS[assetIdx].url}
                alt="Editorial Banner"
                className="w-full h-full object-cover pointer-events-none select-none"
              />
            )}
          </motion.div>

          {UPCOMING_ASSETS[assetIdx].type === "video" && (
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-30 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center bg-black/20 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-[#A30000] transition-all"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          )}

          <button
            onClick={prevSlide}
            className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 w-16 h-16 items-center justify-center bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20"
          >
            <ChevronLeft size={28} />
          </button>

          <button
            onClick={nextSlide}
            className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 w-16 h-16 items-center justify-center bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20"
          >
            <ChevronRight size={28} />
          </button>

          <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20 flex space-x-2 md:space-x-3 bg-black/20 backdrop-blur-sm px-4 md:px-5 py-2 md:py-2.5 rounded-full border border-white/5">
            {UPCOMING_ASSETS.map((_, i) => (<button key={i} onClick={() => setAssetIdx(i)} className={cn("h-[3px] md:h-1.5 rounded-full transition-all duration-500", i === assetIdx ? "w-4 md:w-10 bg-white" : "w-1 md:w-1.5 bg-white/30")} />))}
          </div>
        </div>
      </section>

      {/* EDITORIAL GRID */}
      <main className="px-6 lg:px-12 max-w-[1600px] mx-auto">
        <div className="mb-16 md:mb-32 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-12">
          <h3 className="font-serif text-6xl md:text-[11rem] tracking-tighter text-black leading-none uppercase">Editorial.</h3>
          <p className="max-w-xs text-[9px] md:text-[11px] font-bold text-black/40 uppercase tracking-[0.3em] md:tracking-[0.4em] md:border-l border-black/10 md:pl-8 leading-relaxed">Archived publications documenting industrial leadership.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-24 md:gap-y-48 gap-x-12 md:gap-x-20">
          {MAGAZINES.map((mag) => (
            <div key={mag.id} className="group cursor-pointer" onClick={() => setActiveMag(mag)}>
              <div className="relative aspect-[3/4.2] w-[85%] mx-auto md:w-full mb-8 md:mb-12 shadow-2xl overflow-hidden rounded-sm bg-gray-50 border border-black/5">
                <div className="absolute inset-y-0 left-0 w-[25px] md:w-[45px] bg-gradient-to-r from-black/[0.1] to-transparent z-10" />
                <img src={mag.cover} alt={mag.title} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" />
              </div>

              <div className="flex flex-col">
                <span className="text-[#A30000] text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] mb-3 md:mb-4 flex items-center">
                  <span className="w-4 md:w-6 h-[1.5px] bg-[#A30000] mr-3" />
                  Edition—{mag.year}
                </span>
                <h4 className="font-serif text-3xl md:text-6xl font-black tracking-tighter text-black group-hover:text-[#A30000] transition-colors uppercase leading-[0.9] md:leading-[0.85] mb-6 md:mb-8">
                  {mag.title}
                </h4>
                <div className="flex items-center text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-black/20 group-hover:text-black transition-colors">
                  Secure Access <ArrowRight size={12} className="ml-3 md:ml-4 group-hover:translate-x-2 md:group-hover:translate-x-3 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* CONTINUOUS SCROLL IMAGE READER */}
      <AnimatePresence>
        {activeMag && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-[#0A0A0A] flex flex-col h-screen w-screen"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center px-6 py-4 bg-[#111] border-b border-white/5">
              <h2 className="text-white font-serif italic text-xl uppercase tracking-widest">{activeMag.title}</h2>
              <button onClick={() => setActiveMag(null)} className="text-white/40 hover:text-[#A30000] transition-colors">
                <X size={32} strokeWidth={1} />
              </button>
            </div>

            {/* ESSENTIAL TOOLBAR */}
            <div className="flex items-center justify-between w-full px-4 py-2 bg-[#111] border-b border-white/10">
              {/* Left: Page Indicator & Jump */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-white/5 px-3 py-1 rounded border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest">
                  <input
                    type="number"
                    value={jumpInput}
                    onChange={(e) => setJumpInput(e.target.value)}
                    onKeyDown={handleJumpToPage}
                    onBlur={handleJumpToPage}
                    className="w-8 bg-transparent text-center outline-none text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    min={1}
                    max={activeMag.pages}
                  />
                  <span className="mx-2 opacity-30">/</span>
                  <span>{activeMag.pages}</span>
                </div>
              </div>

              {/* Right: Controls */}
              <div className="flex items-center space-x-1 border-l border-white/10 pl-4">
                <button 
                  onClick={handleRotate} 
                  className="p-2 text-white/60 hover:text-white transition-colors"
                  title="Rotate"
                >
                  <RotateCw size={18} />
                </button>
                
                <div className="flex items-center border-l border-white/10 pl-4 ml-1">
                  <button 
                    onClick={handleZoomOut} 
                    disabled={zoomLevel === 0.2}
                    className="p-2 text-white/60 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                  >
                    <ZoomOut size={18} />
                  </button>
                  <div className="flex items-center px-1 text-white/80 text-[11px] font-bold select-none">
                    <input
                      type="number"
                      value={zoomInput}
                      onChange={(e) => setZoomInput(e.target.value)}
                      onKeyDown={handleZoomSubmit}
                      onBlur={handleZoomSubmit}
                      className="w-10 bg-transparent text-center outline-none text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      min={20}
                      max={300}
                    />
                    <span>%</span>
                  </div>
                  <button 
                    onClick={handleZoomIn} 
                    disabled={zoomLevel === 3}
                    className="p-2 text-white/60 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                  >
                    <ZoomIn size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* VERTICAL SCROLL VIEWPORT */}
            <div 
              ref={scrollContainerRef}
              className="flex-1 overflow-auto bg-[#070707] custom-scrollbar"
            >
              <div 
                className="mx-auto transition-[width] duration-200 py-4 px-2"
                style={{ width: `${zoomLevel * 100}%` }}
              >
                {Array.from({ length: activeMag.pages }, (_, i) => (
                  <div key={i} className="mag-page flex justify-center mb-2" data-page={i + 1}>
                    <img
                      src={`${activeMag.basePath}/page (${i + 1}).webp`}
                      alt={`Page ${i + 1}`}
                      className="max-w-full h-auto shadow-lg transition-transform duration-300"
                      style={{ transform: `rotate(${rotation}deg)` }}
                      loading="lazy"
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0A0A0A; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #A30000; border-radius: 20px; border: 2px solid #0A0A0A; }
      `}</style>
    </div>
  );
}