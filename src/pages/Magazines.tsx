import { useState, useEffect, useRef, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Download, ZoomIn, ZoomOut, RotateCw,
  ChevronUp, Maximize, Minimize, ChevronLeft, ChevronRight, ArrowRight, Volume2, VolumeX
} from "lucide-react";
import { cn } from "../lib/utils";

// Use a stable, versioned CDN for the worker to avoid 404s
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

/**
 * ARCHIVE DATA
 */
const UPCOMING_ASSETS = [
  { type: "video", url: "./banners/banner1.mp4" },
  { type: "image", url: "./banners/banner2.webp" },
  { type: "image", url: "./banners/banner3.webp" },
];

const MAGAZINES_DATA = [
  {
    id: 1,
    title: "BEMISAL SAKSHIYAT",
    year: "2024",
    cover: "/Bm-Advertisers/magazines/Bemisal_Sakshiyat_24/thumbnail.webp",
    pdf: "/Bm-Advertisers/magazines/Bemisal_Sakshiyat_24/magazine.pdf"
  },
  {
    id: 2,
    title: "SAFALTA KE SARTAJ",
    year: "2023",
    cover: "/Bm-Advertisers/magazines/Safalta_Ke_Sartaj_23/thumbnail.webp",
    pdf: "/Bm-Advertisers/magazines/Safalta_Ke_Sartaj_23/magazine.pdf"
  },
  {
    id: 3,
    title: "UDAAN ANNUAL EDITION",
    year: "2025",
    cover: "/Bm-Advertisers/magazines/UDAAN_25/thumbnail.webp",
    pdf: "/Bm-Advertisers/magazines/UDAAN_25/magazine.pdf"
  },
];

export default function Magazines() {
  // 1. SORTING LOGIC: Latest Year First
  const MAGAZINES = useMemo(() => {
    return [...MAGAZINES_DATA].sort((a, b) => parseInt(b.year) - parseInt(a.year));
  }, []);

  // NEW: Add prevSlide and swipe handler
  const prevSlide = () => setAssetIdx(p => (p - 1 + UPCOMING_ASSETS.length) % UPCOMING_ASSETS.length);

  const onDragEnd = (_: any, info: any) => {
    // If the user swipes left more than 50px
    if (info.offset.x < -50) nextSlide();
    // If the user swipes right more than 50px
    if (info.offset.x > 50) prevSlide();
  };

  const [activeMag, setActiveMag] = useState<typeof MAGAZINES[0] | null>(null);
  const [assetIdx, setAssetIdx] = useState(0);
  const [numPages, setNumPages] = useState<number>(0);
  const [currPage, setCurrPage] = useState(1);
  const [jumpValue, setJumpValue] = useState("1");
  const [scale, setScale] = useState(1.1);
  const [rotation, setRotation] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const readerRef = useRef<HTMLDivElement>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  const nextSlide = () => setAssetIdx(p => (p + 1) % UPCOMING_ASSETS.length);

  useEffect(() => {
    const currentAsset = UPCOMING_ASSETS[assetIdx];
    if (currentAsset.type === "image") {
      const timer = setTimeout(() => nextSlide(), 8000);
      return () => clearTimeout(timer);
    }
  }, [assetIdx]);

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  useEffect(() => {
    if (!activeMag) {
      setCurrPage(1);
      setJumpValue("1");
      setRotation(0);
      document.body.style.overflow = "auto";
      // RESUME VIDEO when closing magazine
      videoRef.current?.play().catch(() => { });
    } else {
      document.body.style.overflow = "hidden";
      // PAUSE VIDEO when opening magazine
      videoRef.current?.pause();
    }
  }, [activeMag]);

  useEffect(() => {
    setJumpValue(currPage.toString());
  }, [currPage]);

  // NEW: Logic to pause video when out of focus
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current) {
          // Only play if the video is visible AND no magazine is currently open
          if (entry.isIntersecting && !activeMag) {
            videoRef.current.play().catch(() => { });
          } else {
            videoRef.current.pause();
          }
        }
      },
      { threshold: 0.1 } // Triggers when 10% of the video is visible
    );

    // Target the hero section for observation
    const heroSection = videoRef.current?.closest('section');
    if (heroSection) observer.observe(heroSection);

    return () => observer.disconnect();
  }, [activeMag, assetIdx]); // Re-run if magazine opens or slide changes

  const toggleFullscreen = () => {
    if (!readerRef.current) return;
    if (!document.fullscreenElement) {
      readerRef.current.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current || numPages === 0) return;
    const container = scrollContainerRef.current;
    const totalScrollable = container.scrollHeight - container.clientHeight;
    const progress = container.scrollTop / totalScrollable;
    setScrollProgress(progress);

    const pageHeight = container.scrollHeight / numPages;
    const newPage = Math.ceil((container.scrollTop + container.clientHeight / 2) / pageHeight);
    if (newPage !== currPage && newPage > 0 && newPage <= numPages) setCurrPage(newPage);
  };

  const jumpToPage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetPage = parseInt(jumpValue);
    if (scrollContainerRef.current && targetPage > 0 && targetPage <= numPages) {
      const container = scrollContainerRef.current;
      const pageHeight = container.scrollHeight / numPages;
      container.scrollTo({ top: (targetPage - 1) * pageHeight, behavior: "smooth" });
    } else {
      setJumpValue(currPage.toString());
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20 md:pt-12 pb-32 selection:bg-[#A30000] selection:text-white antialiased overflow-x-hidden">

      {/* HERO SECTION - Optimized Aspect for Mobile */}
      <section className="px-4 md:px-12 mb-20 md:mb-32">
        <div className="max-w-[1600px] mx-auto relative aspect-[16/10] md:aspect-video bg-[#0A0A0A] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl group">
          <motion.div
            key={`asset-${assetIdx}`}
            drag="x" // Enables horizontal dragging
            dragConstraints={{ left: 0, right: 0 }} // Snaps back if not swiped far enough
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
                // CRITICAL: pointer-events-none ensures the video doesn't "steal" the drag gesture
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

          {/* Mute Toggle */}
          {UPCOMING_ASSETS[assetIdx].type === "video" && (
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-30 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center bg-black/20 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-[#A30000] transition-all"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          )}

          {/* Nav Arrows - Responsive Visibility */}
          {/* Left Arrow - Hidden on mobile, flex on medium screens */}
          <button
            onClick={prevSlide}
            className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 w-16 h-16 items-center justify-center bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Right Arrow - Hidden on mobile, flex on medium screens */}
          <button
            onClick={nextSlide}
            className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 w-16 h-16 items-center justify-center bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20"
          >
            <ChevronRight size={28} />
          </button>

          {/* Dots */}
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

      {/* MASTER READER */}
      <AnimatePresence>
        {activeMag && (
          <motion.div ref={readerRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] bg-[#0A0A0A] flex flex-col h-screen w-screen overflow-hidden">

            {/* FULLSCREEN HUD - Smaller on Mobile */}
            {isFullscreen && (
              <div className="fixed top-4 md:top-8 left-1/2 -translate-x-1/2 z-[2000] flex items-center bg-black/80 backdrop-blur-2xl border border-white/10 rounded-full px-4 md:px-8 py-2 md:py-3 space-x-4 md:space-x-10 shadow-2xl">
                <div className="hidden md:flex items-center space-x-5 border-r border-white/10 pr-10 text-white">
                  <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))}><ZoomOut size={18} /></button>
                  <span className="text-[10px] font-black w-10 text-center tracking-tighter">{Math.round(scale * 100)}%</span>
                  <button onClick={() => setScale(s => Math.min(3, s + 0.2))}><ZoomIn size={18} /></button>
                </div>
                <form onSubmit={jumpToPage} className="flex items-center space-x-3 md:space-x-4">
                  <span className="hidden sm:inline text-[9px] font-black text-white/20 uppercase">Go To</span>
                  <input type="text" value={jumpValue} onChange={(e) => setJumpValue(e.target.value)} className="bg-white/10 border border-white/10 text-white text-[10px] md:text-[11px] font-black w-10 md:w-12 py-1 text-center rounded-sm outline-none" />
                  <span className="text-[9px] md:text-[10px] font-black text-white/20">/ {numPages}</span>
                </form>
                <button onClick={toggleFullscreen} className="text-white/40 hover:text-[#A30000] p-1"><Minimize size={20} /></button>
              </div>
            )}

            {/* NORMAL HUD - Hidden on Small Mobile Screens if needed */}
            <nav className={cn(
              "shrink-0 px-6 md:px-10 py-5 md:py-7 flex justify-between items-center border-b border-white/5 bg-[#0A0A0A] z-[60] transition-transform duration-500",
              isFullscreen ? "-translate-y-full" : "translate-y-0"
            )}>
              <div className="flex flex-col max-w-[50%] md:max-w-none">
                <span className="text-white/20 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] mb-1">Digitized Publication</span>
                <h2 className="text-white text-lg md:text-2xl tracking-tight font-medium truncate">
                  {activeMag.title} <span className="hidden sm:inline text-white/40 font-bold ml-2">— {activeMag.year}</span>
                </h2>
              </div>

              <div className="flex items-center space-x-4 md:space-x-12">
                <div className="hidden lg:flex items-center bg-white/5 rounded-full px-7 py-2.5 border border-white/10 space-x-10">
                  <div className="flex items-center space-x-5 border-r border-white/10 pr-10">
                    <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))} className="text-white/30 hover:text-white"><ZoomOut size={18} /></button>
                    <span className="text-[10px] font-black text-white/40 w-12 text-center">{Math.round(scale * 100)}%</span>
                    <button onClick={() => setScale(s => Math.min(3, s + 0.2))} className="text-white/30 hover:text-white"><ZoomIn size={18} /></button>
                  </div>
                  <button onClick={() => setRotation(r => (r + 90) % 360)} className="text-white/30"><RotateCw size={18} /></button>
                  <button onClick={toggleFullscreen} className="text-white/30 transition-colors"><Maximize size={18} /></button>
                </div>
                <div className="flex items-center space-x-6 md:space-x-10">
                  <a href={activeMag.pdf} download className="text-white/30 hover:text-white"><Download size={typeof window !== 'undefined' && window.innerWidth >= 768 ? 20 : 18} /></a>
                  <button onClick={() => setActiveMag(null)} className="text-white/30 hover:text-[#A30000]"><X size={typeof window !== 'undefined' && window.innerWidth >= 768 ? 36 : 28} strokeWidth={1} /></button>
                </div>
              </div>
            </nav>

            {/* SCROLL VIEWPORT */}
            <div ref={scrollContainerRef} onScroll={handleScroll} className="flex-1 w-full overflow-y-scroll overflow-x-hidden custom-scrollbar bg-[#070707] relative scroll-smooth z-10">

              {!isFullscreen && (
                <div className="fixed right-0 top-[140px] bottom-[40px] w-10 md:w-14 z-[70] pointer-events-none">
                  <div className="absolute right-[6px] md:right-[8px] top-0 bottom-0 w-[1px] bg-white/5" />
                  <motion.div className="absolute right-[10px] md:right-[15px] flex items-center" style={{ top: `${scrollProgress * 100}%`, translateY: '-50%' }}>
                    <div className="bg-[#A30000] text-white text-[9px] md:text-[10px] font-black px-2 md:px-3.5 py-1.5 md:py-2.5 rounded-sm shadow-xl">{currPage}</div>
                  </motion.div>
                </div>
              )}

              <div className={cn(
                "flex flex-col items-center relative min-h-full transition-all duration-500",
                isFullscreen ? "py-20 md:py-40" : "py-16 md:py-28 space-y-12 md:space-y-24"
              )}>
                <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_#070707_100%)] opacity-40 pointer-events-none" />
                <Document file={activeMag.pdf} onLoadSuccess={({ numPages }) => setNumPages(numPages)} loading={<div className="text-white font-serif italic text-xl md:text-2xl animate-pulse py-60 uppercase tracking-widest text-center px-6">Opening Volume...</div>}>
                  {Array.from(new Array(numPages), (_, index) => (
                    <div key={`page_${index + 1}`} className={cn(
                      "relative shadow-2xl md:shadow-[0_80px_180px_rgba(0,0,0,0.8)] border border-white/5 transition-all w-[90%] md:w-auto",
                      isFullscreen ? "mb-10 md:mb-20" : "mb-0"
                    )}>
                      <Page
                        pageNumber={index + 1}
                        scale={isFullscreen ? scale * 1.1 : scale * 0.9} // Slightly smaller default for mobile
                        rotate={rotation}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                        className="bg-white"
                        loading={null}
                        width={window.innerWidth < 768 ? window.innerWidth * 0.85 : undefined}
                      />
                    </div>
                  ))}
                </Document>
              </div>

              <button onClick={() => scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-6 right-6 md:bottom-12 md:right-16 w-10 h-10 md:w-14 md:h-14 rounded-full bg-[#111] border border-white/10 text-white/30 flex items-center justify-center shadow-2xl z-50"><ChevronUp size={20} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0A0A0A; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #A30000; border-radius: 20px; border: 2px solid #0A0A0A; }
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #A30000 #0A0A0A; }
      `}</style>
    </div>
  );
}