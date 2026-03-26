import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Download, ZoomIn, ZoomOut, RotateCw,
  ChevronUp, Maximize, Minimize, ChevronLeft, ChevronRight, ArrowRight, Volume2, VolumeX
} from "lucide-react";

// Standard worker for react-pdf performance
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

/**
 * ARCHIVE DATA
 */
const UPCOMING_ASSETS = [
  { type: "video", url: "/banners/banner1.mp4" },
  { type: "image", url: "/banners/banner2.png" },
  { type: "image", url: "/banners/banner3.png" },
];

const MAGAZINES = [
  { id: 1, title: "BEMISAL SAKSHIYAT", year: "2024", cover: "/magazines/Bemisal_Sakshiyat_24/thumbnail.png", pdf: "/magazines/Bemisal_Sakshiyat_24/magazine.pdf" },
  { id: 2, title: "SAFALTA KE SARTAJ", year: "2023", cover: "/magazines/Safalta_Ke_Sartaj_23/thumbnail.png", pdf: "/magazines/Safalta_Ke_Sartaj_23/magazine.pdf" },
  { id: 3, title: "UDAAN ANNUAL EDITION", year: "2025", cover: "/magazines/UDAAN_25/thumbnail.png", pdf: "/magazines/UDAAN_25/magazine.pdf" },
];

export default function Magazines() {
  const [activeMag, setActiveMag] = useState<typeof MAGAZINES[0] | null>(null);
  const [assetIdx, setAssetIdx] = useState(0);
  const [numPages, setNumPages] = useState<number>(0);
  const [currPage, setCurrPage] = useState(1);
  const [jumpValue, setJumpValue] = useState("1");
  const [scale, setScale] = useState(1.1);
  const [rotation, setRotation] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const readerRef = useRef<HTMLDivElement>(null);

  const [isMuted, setIsMuted] = useState(true);

  // 1. Reusable Next/Prev logic
  const nextSlide = () => setAssetIdx(p => (p + 1) % UPCOMING_ASSETS.length);
  const prevSlide = () => setAssetIdx(p => (p - 1 + UPCOMING_ASSETS.length) % UPCOMING_ASSETS.length);

  useEffect(() => {
    const currentAsset = UPCOMING_ASSETS[assetIdx];

    // Only start a timer if the current asset is an IMAGE.
    // For videos, we rely on the <video onEnded={...}> event.
    if (currentAsset.type === "image") {
      const timer = setTimeout(() => {
        nextSlide();
      }, 8000); // 8 seconds for images
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
      setScrollProgress(0);
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
  }, [activeMag]);

  useEffect(() => {
    setJumpValue(currPage.toString());
  }, [currPage]);

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
    <div className="min-h-screen bg-white pt-12 pb-32 selection:bg-[#A30000] selection:text-white antialiased">

      {/* HERO SECTION */}
      <section className="px-6 lg:px-12 mb-32">
        <div className="max-w-[1600px] mx-auto relative aspect-video bg-[#0A0A0A] rounded-[2.5rem] overflow-hidden shadow-2xl group">
          <AnimatePresence mode="wait">
            {UPCOMING_ASSETS[assetIdx].type === "video" ? (
              <motion.video
                key={`video-${assetIdx}`}
                src={UPCOMING_ASSETS[assetIdx].url}
                autoPlay
                playsInline
                muted={isMuted} // Dynamically controlled
                onEnded={nextSlide}
                onLoadedData={(e) => {
                  e.currentTarget.muted = isMuted; // Double-enforce for browser compliance
                  e.currentTarget.play();
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full h-full object-cover"
              />

            ) : (
              <motion.img
                key={`img-${assetIdx}`}
                src={UPCOMING_ASSETS[assetIdx].url}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }} // 1.0 = FULL BRIGHTNESS
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full h-full object-cover"
              />
            )}
          </AnimatePresence>
          {UPCOMING_ASSETS[assetIdx].type === "video" && (
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute bottom-10 right-10 z-30 w-14 h-14 flex items-center justify-center bg-black/20 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-[#A30000] hover:border-[#A30000] transition-all shadow-xl"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          )}
          <button onClick={() => setAssetIdx(p => (p - 1 + UPCOMING_ASSETS.length) % UPCOMING_ASSETS.length)} className="absolute left-8 top-1/2 -translate-y-1/2 z-20 w-16 h-16 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20"><ChevronLeft size={28} /></button>
          <button onClick={() => setAssetIdx(p => (p + 1) % UPCOMING_ASSETS.length)} className="absolute right-8 top-1/2 -translate-y-1/2 z-20 w-16 h-16 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20"><ChevronRight size={28} /></button>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex space-x-3 bg-black/20 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/5">
            {UPCOMING_ASSETS.map((_, i) => (<button key={i} onClick={() => setAssetIdx(i)} className={`h-1.5 rounded-full transition-all duration-500 ${i === assetIdx ? "w-10 bg-white" : "w-1.5 bg-white/30 hover:bg-white/60"}`} />))}
          </div>
        </div>
      </section>

      {/* EDITORIAL GRID */}
      <main className="px-6 lg:px-12 max-w-[1600px] mx-auto">
        <div className="mb-32 flex flex-col md:flex-row md:items-end justify-between gap-12">
          <h3 className="font-serif text-8xl md:text-[11rem] tracking-tighter text-black leading-none uppercase">Editorial.</h3>
          <p className="max-w-xs text-[11px] font-bold text-black/40 uppercase tracking-[0.4em] border-l border-black/10 pl-8 leading-relaxed">Archived publications documenting industrial leadership.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-48 gap-x-20">
          {MAGAZINES.map((mag) => (
            <div key={mag.id} className="group cursor-pointer" onClick={() => setActiveMag(mag)}>
              {/* cover section remains similar but tighter */}
              <div className="relative aspect-[3/4.2] mb-12 shadow-2xl overflow-hidden rounded-sm bg-gray-50">
                <div className="absolute inset-y-0 left-0 w-[45px] bg-gradient-to-r from-black/[0.1] to-transparent z-10" />
                <img src={mag.cover} alt={mag.title} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" />
              </div>

              {/* REFINED TITLES & YEAR METADATA */}
              <div className="flex flex-col">
                <span className="text-[#A30000] text-[10px] font-black uppercase tracking-[0.5em] mb-4 flex items-center">
                  <span className="w-6 h-[1.5px] bg-[#A30000] mr-3" />
                  Edition—{mag.year}
                </span>
                <h4 className="font-serif text-5xl md:text-6xl font-black tracking-tighter text-black group-hover:text-[#A30000] transition-colors uppercase leading-[0.85] mb-8">
                  {mag.title}
                </h4>
                <div className="flex items-center text-[10px] font-bold uppercase tracking-[0.4em] text-black/20 group-hover:text-black transition-colors">
                  Secure Access <ArrowRight size={14} className="ml-4 group-hover:translate-x-3 transition-transform" />
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

            {/* FULLSCREEN PILL BAR (High-End Functional HUD) */}
            {isFullscreen && (
              <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[2000] flex items-center bg-black/60 backdrop-blur-2xl border border-white/10 rounded-full px-8 py-3 space-x-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all">
                {/* Zoom hud */}
                <div className="flex items-center space-x-5 border-r border-white/10 pr-10 text-white">
                  <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))} className="opacity-40 hover:opacity-100 transition-opacity"><ZoomOut size={18} /></button>
                  <span className="text-[10px] font-black w-10 text-center tracking-tighter">{Math.round(scale * 100)}%</span>
                  <button onClick={() => setScale(s => Math.min(3, s + 0.2))} className="opacity-40 hover:opacity-100 transition-opacity"><ZoomIn size={18} /></button>
                </div>

                {/* Jump to Page (Now in Fullscreen) */}
                <form onSubmit={jumpToPage} className="flex items-center space-x-4 border-r border-white/10 pr-10">
                  <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Go To</span>
                  <input type="text" value={jumpValue} onChange={(e) => setJumpValue(e.target.value)} onBlur={() => jumpToPage()} className="bg-white/10 border border-white/10 text-white text-[11px] font-black w-12 py-1 text-center rounded-sm focus:border-[#A30000] outline-none transition-all" />
                  <span className="text-[10px] font-black text-white/20 uppercase">/ {numPages}</span>
                </form>

                <button onClick={() => setRotation(r => (r + 90) % 360)} className="text-white opacity-40 hover:opacity-100 transition-opacity"><RotateCw size={18} /></button>

                {/* Clean Exit Icon */}
                <button onClick={toggleFullscreen} className="text-white/40 hover:text-[#A30000] transition-colors p-1">
                  <Minimize size={22} strokeWidth={1.5} />
                </button>
              </div>
            )}

            {/* NORMAL HEADER (Auto-hides in FS) */}
            <nav className={`shrink-0 px-10 py-7 flex justify-between items-center border-b border-white/5 bg-[#0A0A0A] z-[60] transition-transform duration-500 ${isFullscreen ? '-translate-y-full' : 'translate-y-0'}`}>
              <div className="flex flex-col">
                <span className="text-white/20 text-[9px] font-black uppercase tracking-[0.4em] mb-1">Digitized Publication</span>
                <h2 className="text-white text-2xl tracking-tight font-medium">
                  {activeMag.title} <span className="text-white/40 not-italic font-sans font-bold ml-2">— {activeMag.year}</span>
                </h2>
              </div>

              <div className="flex items-center space-x-12">
                <div className="flex items-center bg-white/5 rounded-full px-7 py-2.5 border border-white/10 space-x-10">
                  <div className="flex items-center space-x-5 border-r border-white/10 pr-10">
                    <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))} className="text-white/30 hover:text-white transition-colors"><ZoomOut size={18} /></button>
                    <span className="text-[10px] font-black text-white/40 w-12 text-center tracking-widest">{Math.round(scale * 100)}%</span>
                    <button onClick={() => setScale(s => Math.min(3, s + 0.2))} className="text-white/30 hover:text-white transition-colors"><ZoomIn size={18} /></button>
                  </div>
                  <button onClick={() => setRotation(r => (r + 90) % 360)} className="text-white/30 hover:text-white transition-colors"><RotateCw size={18} /></button>
                  <button onClick={toggleFullscreen} className="text-white/30 hover:text-white transition-colors">{isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}</button>
                  <form onSubmit={jumpToPage} className="flex items-center space-x-4 border-l border-white/10 pl-8">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Go To</span>
                    <input type="text" value={jumpValue} onChange={(e) => setJumpValue(e.target.value)} onBlur={() => jumpToPage()} className="bg-white/5 border border-white/10 text-white text-[11px] font-black w-14 py-1.5 text-center rounded-sm focus:border-[#A30000] outline-none transition-all" />
                    <span className="text-[10px] font-black text-white/20 uppercase">/ {numPages}</span>
                  </form>
                </div>
                <div className="flex items-center space-x-10">
                  <a href={activeMag.pdf} download className="text-white/30 hover:text-white transition-colors"><Download size={20} /></a>
                  <button onClick={() => setActiveMag(null)} className="text-white/30 hover:text-[#A30000] transition-colors"><X size={36} strokeWidth={1} /></button>
                </div>
              </div>
            </nav>

            {/* SCROLL VIEWPORT */}
            <div ref={scrollContainerRef} onScroll={handleScroll} className="flex-1 w-full overflow-y-scroll overflow-x-hidden custom-scrollbar bg-[#070707] relative scroll-smooth z-10">

              {/* DYNAMIC SCROLL INDICATOR (Only in non-FS for extra space) */}
              {!isFullscreen && (
                <div className="fixed right-0 top-[120px] bottom-[40px] w-14 z-[70] pointer-events-none">
                  <div className="absolute right-[8px] top-0 bottom-0 w-[1px] bg-white/5" />
                  <motion.div className="absolute right-[15px] flex items-center" style={{ top: `${scrollProgress * 100}%`, translateY: '-50%' }} transition={{ type: "spring", stiffness: 400, damping: 40 }}>
                    <div className="bg-[#A30000] text-white text-[10px] font-black px-3.5 py-2.5 rounded-sm shadow-[0_15px_40px_rgba(163,0,0,0.4)]">{currPage}</div>
                  </motion.div>
                </div>
              )}

              <div className={`flex flex-col items-center relative min-h-full transition-all duration-500 ${isFullscreen ? 'py-40' : 'py-28 space-y-24'}`}>
                <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_#070707_100%)] opacity-40 pointer-events-none" />
                <Document file={activeMag.pdf} onLoadSuccess={({ numPages }) => setNumPages(numPages)} loading={<div className="text-white font-serif italic text-2xl animate-pulse py-60 uppercase tracking-widest">Opening Volume...</div>}>
                  {Array.from(new Array(numPages), (_, index) => (
                    <div key={`page_${index + 1}`} className={`relative shadow-[0_80px_180px_rgba(0,0,0,0.8)] border border-white/5 transition-all ${isFullscreen ? 'mb-20' : 'mb-0'}`}>
                      <Page
                        pageNumber={index + 1}
                        scale={isFullscreen ? scale * 1.3 : scale}
                        rotate={rotation}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                        className="bg-white"
                        loading={null}
                      />
                    </div>
                  ))}
                </Document>
              </div>
              <button onClick={() => scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-12 right-16 w-14 h-14 rounded-full bg-[#111] border border-white/10 text-white/30 flex items-center justify-center shadow-2xl hover:bg-[#A30000] hover:text-white transition-all z-50"><ChevronUp size={24} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 10px; display: block !important; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0A0A0A; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #A30000; border-radius: 20px; border: 3px solid #0A0A0A; }
        .custom-scrollbar { scrollbar-width: auto; scrollbar-color: #A30000 #0A0A0A; }
      `}</style>
    </div>
  );
}