import { useState, useEffect, useRef, useMemo } from "react";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import the required styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ChevronLeft, ChevronRight, ArrowRight, Volume2, VolumeX
} from "lucide-react";
import { cn } from "../lib/utils";

/**
 * ARCHIVE DATA
 */
const UPCOMING_ASSETS = [
  { type: "image", url: "/banners/banner1.webp" },
  { type: "image", url: "/banners/banner2.webp" },
  { type: "video", url: "/banners/banner3.mp4" },
];

const MAGAZINES_DATA = [
  {
    id: 1,
    title: "BEMISAL SAKSHIYAT",
    year: "2024",
    cover: "/magazines/Bemisal_Sakshiyat_24/thumbnail.webp",
    pdf: "/magazines/Bemisal_Sakshiyat_24/magazine.pdf"
  },
  {
    id: 2,
    title: "SAFALTA KE SARTAJ",
    year: "2023",
    cover: "/magazines/Safalta_Ke_Sartaj_23/thumbnail.webp",
    pdf: "/magazines/Safalta_Ke_Sartaj_23/magazine.pdf"
  },
  {
    id: 3,
    title: "UDAAN ANNUAL EDITION",
    year: "2025",
    cover: "/magazines/UDAAN_25/thumbnail.webp",
    pdf: "/magazines/UDAAN_25/magazine.pdf"
  },
];

export default function Magazines() {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
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
  const [isMuted, setIsMuted] = useState(true);


  const videoRef = useRef<HTMLVideoElement>(null);

  const nextSlide = () => setAssetIdx(p => (p + 1) % UPCOMING_ASSETS.length);

  useEffect(() => {
    const currentAsset = UPCOMING_ASSETS[assetIdx];
    if (currentAsset.type === "image") {
      const timer = setTimeout(() => nextSlide(), 8000);
      return () => clearTimeout(timer);
    }
  }, [assetIdx]);

  // NEW: Logic to pause video when out of focus
  // This must be a separate, standalone hook
  useEffect(() => {
    document.body.style.overflow = activeMag ? "hidden" : "auto";
  }, [activeMag]);

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
  }, [activeMag, assetIdx]); // Re-run if magazine opens or slide changes
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
                onEnded={nextSlide} // This triggers the loop back to the start
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-[#0A0A0A] flex flex-col h-screen w-screen"
          >
            {/* HEADER WITH CLOSE BUTTON */}
            <div className="flex justify-between items-center px-6 py-4 bg-[#111] border-b border-white/5">
              <h2 className="text-white font-serif italic text-xl uppercase tracking-widest">{activeMag.title}</h2>
              <button onClick={() => setActiveMag(null)} className="text-white/40 hover:text-[#A30000] transition-colors">
                <X size={32} strokeWidth={1} />
              </button>
            </div>

            {/* THE VIEWER ENGINE */}
            <div className="flex-1 overflow-hidden">
              <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js">
                <Viewer
                  fileUrl={activeMag.pdf}
                  plugins={[defaultLayoutPluginInstance]}
                  theme="dark"
                />
              </Worker>
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