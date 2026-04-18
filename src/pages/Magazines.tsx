import { useState, useEffect, useRef, useMemo, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HTMLFlipBook from "react-pageflip";
import {
  X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw,
  Volume2, VolumeX, ArrowRight
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

const getDefaultZoom = () => 1.0;

// Dedicated Page Component (Required by react-pageflip for forwardRef)
// Also handles the individual round loader for each page
const MagazinePage = forwardRef(({ pageNum, basePath }: { pageNum: number; basePath: string }, ref: any) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div ref={ref} className="mag-page bg-[#111] overflow-hidden relative flex items-center justify-center">

      {/* Round Loader */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-10 h-10 border-4 border-white/10 border-t-[#A30000] rounded-full animate-spin" />
        </div>
      )}

      <img
        src={`${basePath}/page (${pageNum}).webp`}
        alt={`Page ${pageNum}`}
        className={`w-full h-full object-contain select-none pointer-events-none transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} // <-- Changed to object-contain
        draggable={false}
        loading={pageNum <= 3 ? "eager" : "lazy"}
        fetchPriority={pageNum <= 2 ? "high" : "low"}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
});

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
  const [currentPage, setCurrentPage] = useState(0);
  const [jumpInput, setJumpInput] = useState("1");
  const [zoomLevel, setZoomLevel] = useState(getDefaultZoom);
  const [zoomInput, setZoomInput] = useState(`${Math.round(getDefaultZoom() * 100)}`);
  const [rotation, setRotation] = useState(0);

  // Mobile Detection State
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  const flipBookRef = useRef<any>(null);
  const scrollLockRef = useRef(false);

  // Mobile Resize Listener
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Carousel Logic
  const nextSlide = () => setAssetIdx(p => (p + 1) % UPCOMING_ASSETS.length);
  const prevSlide = () => setAssetIdx(p => (p - 1 + UPCOMING_ASSETS.length) % UPCOMING_ASSETS.length);

  const onDragEnd = (_: any, info: any) => {
    if (info.offset.x < -50) nextSlide();
    if (info.offset.x > 50) prevSlide();
  };

  useEffect(() => {
    const currentAsset = UPCOMING_ASSETS[assetIdx];
    if (currentAsset.type === "image") {
      const timer = setTimeout(() => nextSlide(), 8000);
      return () => clearTimeout(timer);
    }
  }, [assetIdx]);

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
      setCurrentPage(0);
      setJumpInput("1");
    }
  }, [activeMag]);

  useEffect(() => {
    setJumpInput(String(currentPage + 1));
  }, [currentPage]);

  useEffect(() => {
    setZoomInput(String(Math.round(zoomLevel * 100)));
  }, [zoomLevel]);

  // Keyboard & Scroll Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeMag) return;
      if (e.key === "Escape") setActiveMag(null);
      if (e.key === "ArrowRight") flipBookRef.current?.pageFlip()?.flipNext();
      if (e.key === "ArrowLeft") flipBookRef.current?.pageFlip()?.flipPrev();
    };

    const handleWheel = (e: WheelEvent) => {
      if (!activeMag || scrollLockRef.current) return;
      e.preventDefault();
      scrollLockRef.current = true;

      if (e.deltaY > 0 || e.deltaX > 0) {
        flipBookRef.current?.pageFlip()?.flipNext();
      } else {
        flipBookRef.current?.pageFlip()?.flipPrev();
      }

      setTimeout(() => { scrollLockRef.current = false; }, 850);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
    };
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

  // Jump to Page Logic
  const handleJumpToPage = (e: React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
    if ('key' in e && e.key !== 'Enter') return;
    const pageNum = parseInt(jumpInput, 10);
    if (activeMag && pageNum >= 1 && pageNum <= activeMag.pages) {
      flipBookRef.current?.pageFlip()?.flip(pageNum - 1);
    } else {
      setJumpInput(String(currentPage + 1));
    }
  };

  // Zoom Input Logic
  const handleZoomSubmit = (e: React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
    if ('key' in e && e.key !== 'Enter') return;
    let val = parseInt(zoomInput, 10);
    if (isNaN(val)) val = Math.round(getDefaultZoom() * 100);
    const clampedVal = Math.max(20, Math.min(300, val));
    setZoomLevel(clampedVal / 100);
    setZoomInput(String(clampedVal));
  };

  const handleZoomIn = () => setZoomLevel(z => Math.min(3, parseFloat((z + 0.1).toFixed(1))));
  const handleZoomOut = () => setZoomLevel(z => Math.max(0.2, parseFloat((z - 0.1).toFixed(1))));
  const handleRotate = () => setRotation(r => (r + 90) % 360);

  // Dynamic Book Dimensions based on Mobile/Desktop
  // Dynamic Book Dimensions based on Mobile/Desktop
  const getBookDimensions = () => {
    if (isMobile) {
      const maxWidth = window.innerWidth * 0.92; // 92% of screen width
      const maxHeight = window.innerHeight * 0.72; // Leave safe room for header/toolbar

      let width = maxWidth;
      let height = width * (4.2 / 3); // Calculate height based on aspect ratio

      // If the calculated height is too tall for the screen, constrain by height instead
      if (height > maxHeight) {
        height = maxHeight;
        width = height * (3 / 4.2);
      }

      return { width, height };
    } else {
      const height = Math.min(window.innerHeight * 0.78, 800);
      const width = height * (3 / 4.2);
      return { width, height };
    }
  };

  const { width: bookWidth, height: bookHeight } = getBookDimensions();

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

      {/* PREMIUM 3D FLIP BOOK READER */}
      <AnimatePresence>
        {activeMag && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-[#050505] flex flex-col h-screen w-screen"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center px-6 py-4 bg-[#111] border-b border-white/5 z-20">
              <h2 className="text-white font-serif italic text-xl uppercase tracking-widest">{activeMag.title}</h2>
              <button onClick={() => setActiveMag(null)} className="text-white/40 hover:text-[#A30000] transition-colors">
                <X size={32} strokeWidth={1} />
              </button>
            </div>

            {/* ESSENTIAL TOOLBAR */}
            <div className="flex items-center justify-between w-full px-2 py-1.5 md:px-4 md:py-2 bg-[#111] border-b border-white/10 z-20">
              {/* Left: Navigation & Page Indicator */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => flipBookRef.current?.pageFlip()?.flipPrev()}
                  className="p-1.5 md:p-2 text-white/60 hover:text-white transition-colors"
                >
                  <ChevronLeft size={16} className="md:w-5 md:h-5" />
                </button>

                <div className="flex items-center bg-white/5 px-2 py-0.5 md:px-3 md:py-1 rounded border border-white/10 text-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
                  <input
                    type="number"
                    value={jumpInput}
                    onChange={(e) => setJumpInput(e.target.value)}
                    onKeyDown={handleJumpToPage}
                    onBlur={handleJumpToPage}
                    className="w-6 md:w-8 bg-transparent text-center outline-none text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    min={1}
                    max={activeMag.pages}
                  />
                  <span className="mx-2 opacity-30">/</span>
                  <span>{activeMag.pages}</span>
                </div>

                <button
                  onClick={() => flipBookRef.current?.pageFlip()?.flipNext()}
                  className="p-2 text-white/60 hover:text-white transition-colors"
                >
                  <ChevronRight size={16} className="md:w-5 md:h-5" />
                </button>
              </div>

              {/* Right: Controls */}
              <div className="flex items-center space-x-0.5 md:space-x-1 border-l border-white/10 pl-2 md:pl-4">
                <button
                  onClick={handleRotate}
                  className="p-1 md:p-2 text-white/60 hover:text-white transition-colors"
                  title="Rotate"
                >
                  <RotateCw size={16} className="md:w-[18px] md:h-[18px]" />
                </button>

                <div className="flex items-center border-l border-white/10 pl-2 ml-0.5 md:pl-4 md:ml-1">
                  <button
                    onClick={handleZoomOut}
                    disabled={zoomLevel === 0.2}
                    className="p-2 text-white/60 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                  >
                    <ZoomOut size={16} className="md:w-[18px] md:h-[18px]" />
                  </button>
                  <div className="flex items-center px-1 text-white/80 text-[9px] md:text-[11px] font-bold select-none">
                    <input
                      type="number"
                      value={zoomInput}
                      onChange={(e) => setZoomInput(e.target.value)}
                      onKeyDown={handleZoomSubmit}
                      onBlur={handleZoomSubmit}
                      className="w-8 md:w-10 bg-transparent text-center outline-none text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                    <ZoomIn size={16} className="md:w-[18px] md:h-[18px]" />
                  </button>
                </div>
              </div>
            </div>

            {/* 3D BOOK VIEWPORT */}
            <div className="flex-1 overflow-hidden bg-[#050505] flex items-center justify-center relative">
              {/* Ambient red glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(163,0,0,0.08)_0%,transparent_70%)]" />

              <div
                className="relative transition-transform duration-300 ease-out"
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                  transformOrigin: 'center center'
                }}
              >
                {/* @ts-ignore */}
                {/* @ts-ignore */}
                <HTMLFlipBook
                  key={isMobile ? 'mobile' : 'desktop'} // <--- ADD THIS LINE
                  ref={flipBookRef}
                  width={bookWidth}
                  height={bookHeight}
                  size="fixed"
                  minWidth={300}
                  maxWidth={1000}
                  minHeight={400}
                  maxHeight={1400}
                  showCover={true}
                  drawShadow={true}
                  flippingTime={800}
                  usePortrait={isMobile} // TRUE = 1 page on mobile, FALSE = 2 pages on desktop
                  startZIndex={0}
                  autoSize={false}
                  maxShadowOpacity={0.5}
                  mobileScrollSupport={false}
                  clickEventForward={false}
                  useMouseEvents={true}
                  swipeDistance={30}
                  showPageCorners={true}
                  disableFlipByClick={false}
                  startPage={0}
                  style={{}}
                  className="magazine-flipbook shadow-[0_25px_60px_rgba(0,0,0,0.5)]"
                  onFlip={(e: any) => setCurrentPage(e.data)}
                >
                  {Array.from({ length: activeMag.pages }, (_, i) => (
                    <MagazinePage
                      key={i}
                      pageNum={i + 1}
                      basePath={activeMag.basePath}
                    />
                  ))}
                </HTMLFlipBook>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .magazine-flipbook .mag-page {
          background-color: #111;
          overflow: hidden;
        }

        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #0A0A0A; }
        ::-webkit-scrollbar-thumb { background-color: #A30000; border-radius: 20px; border: 2px solid #0A0A0A; }
      `}</style>
    </div>
  );
}