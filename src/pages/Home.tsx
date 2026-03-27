import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FadeIn } from "../components/FadeIn";
import { Button } from "../components/Button";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../lib/utils";
import emailjs from '@emailjs/browser'; // Assuming you have a cn utility, otherwise use standard strings
import { ArrowRight } from "lucide-react";

emailjs.init("fOUurTrFc6Ki6O-PI");

const SERVICES = [
  {
    title: "Magazine Publishing",
    tag: "The Foundation",
    desc: "Magazine publishing is the foundation of BM Advertiser. We create premium publications that feature entrepreneurs, professionals, and successful businesses. Each feature is designed to present our clients in a professional and impactful way, helping them build credibility and stand out in their industry."
  },
  {
    title: "High-Profile Events & Award Shows",
    tag: "Elite Platforms",
    desc: "We organize large-scale, professionally managed events that bring together business owners and influential personalities. From launch events to award shows, our platforms create visibility and the opportunity to be part of an influential community."
  },
  {
    title: "Brand Features & Personal Branding",
    tag: "Narrative Craft",
    desc: "Helping individuals and business owners build a strong professional image through well-crafted storytelling. Our approach focuses on highlighting achievements, vision, and credibility in a structured and impactful way."
  },
  {
    title: "Public Relations (PR) & Media Coverage",
    tag: "Strategic Reach",
    desc: "We provide PR support through media features, brand storytelling, and promotional coverage. Our focus is on helping clients gain visibility and establish a strong public image."
  },
  {
    title: "Graphic Design & Creative",
    tag: "Visual Precision",
    desc: "Professional design services including magazine layouts, promotional creatives, and branding materials. Every design maintains a clean, premium, and impactful visual identity."
  }
];

const GALLERY_IMAGES = [
  {
    url: "/gallery/1.webp",
    title: "Elite Events",
    size: "col-span-1 md:col-span-8 md:row-span-2 h-[250px] md:h-auto",
  },
  {
    url: "/gallery/2.webp",
    title: "Premium Publishing",
    size: "col-span-1 md:col-span-4 md:row-span-1 h-[200px] md:h-auto",
  },
  {
    url: "/gallery/3.webp",
    title: "Brand Strategy",
    size: "col-span-1 md:col-span-4 md:row-span-1 h-[200px] md:h-auto",
  },
  {
    url: "/gallery/4.webp",
    title: "Networking Gala",
    size: "col-span-1 md:col-span-4 md:row-span-2 h-[250px] md:h-auto",
  },
  {
    url: "/gallery/5.webp",
    title: "Recognition Awards",
    size: "col-span-1 md:col-span-8 md:row-span-2 h-[250px] md:h-auto",
  },
];

const INTERESTS = [
  "Magazine Feature",
  "Event Coverage",
  "Personal Branding",
  "Public Relations (PR)",
  "Graphic Design"
];

export default function Home() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedInterest, setSelectedInterest] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Manual data object - bypasses form issues
    const templateParams = {
      user_name: formRef.current?.user_name.value,
      user_email: formRef.current?.user_email.value,
      interest: selectedInterest,
      message: formRef.current?.message.value,
    };

    emailjs.send(
      'service_wirua98',
      'template_sm9k4nd',
      templateParams,
      'fOUurTrFc6Ki6O-PI'
    )
      .then(() => {
        setStatus("success");
        setIsSubmitting(false);
        formRef.current?.reset();
        setSelectedInterest("");
      })
      .catch((error) => {
        // This will tell us the SPECIFIC reason for the 400 error
        console.error("EmailJS Full Error:", error);
        setStatus("error");
        setIsSubmitting(false);
      });
  };


  return (
    <div className="min-h-screen bg-white selection:bg-[#A30000] selection:text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen md:h-screen w-full flex items-center overflow-hidden bg-black py-20 md:py-0">

        {/* THE CINEMATIC STACK */}
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover scale-105 brightness-[0.5] contrast-[1.2]">
            <source src="/video/hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[#A30000]/10 mix-blend-multiply" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:grid lg:grid-cols-12 gap-12 items-center">

          {/* Left Column - Content */}
          <div className="w-full lg:col-span-7 flex flex-col items-center md:items-start text-center md:text-left order-1">
            <FadeIn delay={0.2} direction="up">
              <div className="inline-flex items-center space-x-4 mb-6 md:mb-10">
                <span className="text-[9px] md:text-[10px] font-bold tracking-[0.4em] md:tracking-[0.5em] text-[#A30000] uppercase">
                  Est. 2006 • Chandigarh
                </span>
                <div className="h-[0.5px] w-8 md:w-12 bg-[#A30000]" />
              </div>
            </FadeIn>

            <FadeIn delay={0.4} direction="up">
              {/* FIX: whitespace-nowrap prevents the words from breaking on small screens */}
              <h1 className="font-serif text-[clamp(2rem,8vw,4.5rem)] leading-[1.1] tracking-tight text-white mb-6 md:mb-8">
                <span className="whitespace-nowrap">Showcasing Success<span className="text-[#A30000]">.</span></span>
                <br />
                <span className="whitespace-nowrap">Powering Recognition<span className="text-[#A30000]">.</span></span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.6} direction="up" className="max-w-xl mb-8 md:mb-12">
              <p className="text-white/70 text-sm md:text-lg font-light leading-relaxed tracking-wide px-2 md:px-0">
                BM Advertiser is a Chandigarh-based media and event powerhouse specializing in premium magazines
                and high-profile events.
              </p>
            </FadeIn>

            <FadeIn delay={0.8} direction="up" className="w-full md:w-auto">
              <Button
                href="/#contact"
                variant="primary"
                className="w-full sm:w-auto px-10 md:px-14 py-4 text-[10px] tracking-[0.2em] bg-[#A30000] text-white border-none transition-all duration-700 shadow-2xl rounded-sm uppercase font-bold text-center"
              >
                Get Featured Now —
              </Button>
            </FadeIn>
          </div>

          {/* Right Column - Cards (FIXED POSITIONING) */}
          {/* FIX: Added lg:relative and absolute positioning to mimic your screenshot layout */}
          <div className="w-full lg:col-span-5 relative flex flex-col gap-4 order-2 mt-12 lg:mt-0 lg:h-[500px]">
            {[
              {
                title: "Visibility.",
                text: "Specializing in premium magazines and influential storytelling.",
                pos: "lg:absolute lg:top-0 lg:right-20", // Step 1
                delay: 0.8
              },
              {
                title: "Credibility.",
                text: "Platforms where professionals gain recognized industry authority.",
                pos: "lg:absolute lg:top-[165px] lg:right-10", // Step 2
                delay: 1.0
              },
              {
                title: "Connections.",
                text: "Beyond publishing. Connecting influential individual networks.",
                pos: "lg:absolute lg:top-[330px] lg:right-0", // Step 3
                delay: 1.2
              }
            ].map((box, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: box.delay }}
                className={cn(
                  "w-full lg:w-72 glass-card p-6 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-3xl bg-white/10 transition-all duration-500",
                  box.pos
                )}
              >
                <h3 className="text-[#A30000] font-serif text-lg mb-2 italic">{box.title}</h3>
                <p className="text-white/80 text-[11px] leading-relaxed font-medium">{box.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-32 px-6 lg:px-12 bg-[#FAFAFA] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <FadeIn direction="up" className="mb-16 md:mb-24">
            <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-end">
              <div className="lg:col-span-8">
                <div className="flex items-center space-x-4 mb-6 md:mb-8">
                  <span className="text-[9px] md:text-[10px] font-bold tracking-[0.5em] md:tracking-[0.6em] text-[#A30000] uppercase">The Narrative</span>
                  <div className="h-[0.5px] w-12 md:w-16 bg-[#A30000]" />
                </div>
                <h2 className="font-serif text-4xl md:text-8xl leading-[1] md:leading-[0.9] text-black tracking-tighter">
                  Architecting <br />
                  <span className="italic text-[#A30000]">The Power of Presence.</span>
                </h2>
              </div>
              <div className="lg:col-span-4 pb-4">
                <p className="text-black/50 text-[10px] uppercase tracking-[0.3em] font-bold mb-3 md:mb-4">Established 2006</p>
                <p className="text-black/80 text-base md:text-lg font-light leading-relaxed border-l-2 border-[#A30000] pl-4 md:pl-6">
                  BM Advertiser is a leading media and event company with over 20 years of expertise based in the heart of Chandigarh.
                </p>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 md:auto-rows-[350px]">
            {/* Block 1 */}
            <motion.div whileHover={{ y: -8 }} className="md:col-span-7 bg-white rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 flex flex-col justify-between border border-black/[0.03] shadow-sm group relative overflow-hidden min-h-[300px] md:min-h-0">
              <div className="relative z-10">
                <h3 className="text-[#A30000] font-serif text-2xl md:text-3xl italic mb-4 md:mb-6">Beyond Publishing.</h3>
                <p className="text-lg md:text-2xl font-serif text-black/90 leading-snug max-w-lg">
                  "Over the years, we have built a reputation for creating platforms that not only
                  <span className="text-[#A30000]"> showcase success </span>
                  but create real, lasting opportunities."
                </p>
              </div>
              <span className="absolute -bottom-8 md:-bottom-16 -right-6 md:-right-10 font-serif text-[12rem] md:text-[22rem] text-black/[0.02] font-bold select-none leading-none">BM</span>
              <p className="relative z-10 text-black/40 text-[8px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] font-bold">Market Authority • Networking • Growth</p>
            </motion.div>

            {/* Block 2 */}
            <div className="md:col-span-5 bg-black rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 flex flex-col justify-center relative group overflow-hidden min-h-[250px] md:min-h-0">
              <div className="absolute inset-0 bg-gradient-to-br from-[#A30000]/20 to-transparent opacity-50" />
              <div className="relative z-10">
                <h4 className="text-white/40 text-[9px] md:text-[10px] font-bold tracking-[0.4em] uppercase mb-6 md:mb-8">The Philosophy</h4>
                <p className="text-white text-lg md:text-xl font-light leading-relaxed mb-6 md:mb-8">
                  We believe that <span className="text-[#A30000] font-medium">true growth</span> comes from both visibility and connection. We combine media presence with real-world engagement.
                </p>
                <div className="h-[1px] w-12 bg-[#A30000]" />
              </div>
            </div>

            {/* Block 3 */}
            <div className="md:col-span-4 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden relative group min-h-[300px] md:min-h-0">
              <img src="/about.webp" alt="About BM" className="w-full h-full object-cover brightness-[0.8] saturate-[1] group-hover:brightness-110 group-hover:saturate-150 transition-all duration-700 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity duration-700" />
              <div className="absolute bottom-8 left-8">
                <p className="text-white font-serif text-xl md:text-2xl italic">Curated Excellence.</p>
              </div>
            </div>

            {/* Block 4 */}
            <div className="md:col-span-8 bg-white rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 border border-black/[0.03] flex flex-col justify-between group hover:border-[#A30000]/20 transition-all duration-500">
              <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                <div>
                  <h4 className="font-serif text-xl md:text-2xl mb-3 md:mb-4">Success Stories</h4>
                  <p className="text-black/60 text-sm leading-relaxed font-light">
                    Our magazines highlight inspiring journeys and growing brands, while our events provide a space for recognition and meaningful collaborations.
                  </p>
                </div>
                <div>
                  <h4 className="font-serif text-xl md:text-2xl mb-3 md:mb-4">Credible Names</h4>
                  <p className="text-black/60 text-sm leading-relaxed font-light">
                    We continue to create experiences that leave a lasting impact and position our clients as recognized names in their field.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-start space-x-0 md:space-x-12 mt-8 pt-8 border-t border-black/5">
                {[
                  { n: "20+", label: "Years in Media", color: "text-[#A30000]" },
                  { n: "15+", label: "High-Profile Events", color: "text-black" },
                  { n: "Strong", label: "Industry Network", color: "text-black" }
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col">
                    <span className={cn("text-xl md:text-3xl font-serif", stat.color)}>{stat.n}</span>
                    <span className="text-[7px] md:text-[9px] uppercase tracking-widest font-bold text-black/30">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 md:py-20 px-6 lg:px-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <FadeIn direction="up" className="mb-12 md:mb-24">
            <div className="flex items-center space-x-4 mb-6 md:mb-8">
              <span className="text-[9px] md:text-[10px] font-bold tracking-[0.5em] text-[#A30000] uppercase">Expertise</span>
              <div className="h-[0.5px] w-12 bg-[#A30000]" />
            </div>
            <h2 className="font-serif text-4xl md:text-7xl text-black tracking-tight">
              Our Services<span className="text-[#A30000]">.</span>
            </h2>
          </FadeIn>

          <div className="border-t border-black/5">
            {SERVICES.map((service, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div key={index} animate={{ backgroundColor: isOpen ? "rgba(0,0,0,0.01)" : "rgba(255,255,255,1)" }} className="relative border-b border-black/5 overflow-hidden transition-colors duration-700">
                  <motion.div initial={false} animate={{ height: isOpen ? '100%' : '0%', opacity: isOpen ? [0.4, 1, 0.4] : 0 }} transition={{ height: { duration: 0.5 }, opacity: { repeat: Infinity, duration: 3 } }} className="absolute left-0 top-0 w-[2px] bg-[#A30000] z-20" />
                  <button onClick={() => setOpenIndex(isOpen ? null : index)} className="w-full py-10 md:py-16 flex items-center justify-between text-left group focus:outline-none relative z-10">
                    <div className="flex items-center pl-2 md:pl-4 w-full">
                      <span className={cn("font-serif text-base md:text-xl transition-all duration-700 mr-6 md:mr-12", isOpen ? 'text-[#A30000] scale-110' : 'text-black/10 group-hover:text-black/30')}>0{index + 1}</span>
                      <div className="relative">
                        <h3 className={cn("font-serif text-lg md:text-4xl transition-all duration-500", isOpen ? 'text-black' : 'text-black/60 group-hover:text-black')}>{service.title}</h3>
                        <motion.div initial={{ width: 0 }} animate={{ width: isOpen ? '100%' : 0 }} transition={{ duration: 0.8, ease: "circOut" }} className="absolute -bottom-1 md:-bottom-2 left-0 h-[1px] bg-[#A30000]/30" />
                      </div>
                    </div>
                    <div className="relative flex items-center justify-center w-8 h-8 md:w-12 md:h-12 ml-2">
                      <motion.div animate={{ rotate: isOpen ? 45 : -45, color: isOpen ? "#A30000" : "rgba(0,0,0,0.15)" }} className="relative z-10">
                        <svg className="w-6 h-6 md:w-8 md:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                          <line x1="7" y1="12" x2="17" y2="12" /><polyline points="12 7 17 12 12 17" />
                        </svg>
                      </motion.div>
                    </div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                        <div className="pb-10 md:pb-16 pl-12 md:pl-44 max-w-2xl pr-6">
                          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                            <div className="flex items-center space-x-3 mb-4 md:mb-6">
                              <div className="h-[1px] w-6 bg-[#A30000]" />
                              <p className="text-[8px] md:text-[10px] font-bold tracking-[0.3em] text-[#A30000] uppercase">{service.tag}</p>
                            </div>
                          </motion.div>
                          <motion.p initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-black/60 text-sm md:text-xl font-light leading-relaxed">{service.desc}</motion.p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 md:px-12 mb-0 md:mb-32">
        <div
          onClick={() => navigate('/magazines')}
          className="max-w-[1600px] mx-auto relative cursor-pointer overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl group"
        >
          {/* Mobile Banner (Hidden on Desktop) */}
          <img
            src="/banners/magazine_banner_ls.webp"
            alt="Read Our Magazines"
            className="block md:hidden w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Desktop Banner (Hidden on Mobile) */}
          <img
            src="/banners/magazine_banner_wide.webp"
            alt="Read Our Magazines"
            className="hidden md:block w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* MOBILE ONLY HINT (Visible without hover) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:hidden flex items-center space-x-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 animate-pulse">
            <span className="text-[8px] text-white font-black uppercase tracking-[0.2em]">Tap to Explore</span>
            <ArrowRight size={10} className="text-white" />
          </div>

          {/* Optional: Hover Overlay for better UX */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 font-bold uppercase tracking-widest text-[10px]">
              Click Banner to Explore Publications
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section id="gallery" className="py-20 md:py-15 px-6 lg:px-12 bg-[#FAF8F8] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <FadeIn direction="up" className="mb-16 md:mb-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12">
              <div>
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-[9px] md:text-[10px] font-bold tracking-[0.5em] text-[#A30000] uppercase">Archive</span>
                  <div className="h-[0.5px] w-12 bg-[#A30000]" />
                </div>
                <h2 className="font-serif text-4xl md:text-7xl text-black tracking-tighter leading-none">
                  Visual <span className="italic text-[#A30000] font-light">Legacy.</span>
                </h2>
              </div>
              <div className="pb-2 md:pb-4">
                <motion.a href="/gallery" whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px #A30000" }} transition={{ duration: 0.1, ease: "linear" }} className="w-full md:w-auto relative inline-flex items-center justify-center px-8 md:px-10 py-4 border-2 border-black bg-white" style={{ boxShadow: "4px 4px 0px 0px #A30000" }}>
                  <span className="text-[9px] md:text-[10px] font-bold tracking-[0.4em] uppercase text-black">View More</span>
                  <svg className="ml-4" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </motion.a>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:auto-rows-[300px]">
            {GALLERY_IMAGES.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={cn("relative group overflow-hidden bg-black", image.size)}
              >
                {/* EDIT 1: Changed opacity-70 to opacity-100 and removed group-hover:opacity-100 */}
                <motion.img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover transition-all duration-1000 ease-out opacity-100 md:group-hover:scale-105"
                />

                {/* EDIT 2: Removed the dark gradient overlay entirely */}
                {/* The <div> that was here previously is gone now */}

                <motion.div initial={{ width: 0 }} whileHover={{ width: "100%" }} className="absolute top-0 left-0 h-[2px] bg-[#A30000] z-20" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-32 px-6 lg:px-12 bg-[#FAFAFA] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 md:gap-20">
            <div className="lg:col-span-5">
              <FadeIn direction="right">
                <div className="flex items-center space-x-4 mb-8">
                  <span className="text-[9px] md:text-[10px] font-bold tracking-[0.5em] text-[#A30000] uppercase">Connect</span>
                  <div className="h-[0.5px] w-12 bg-[#A30000]" />
                </div>
                <h2 className="font-serif text-4xl md:text-8xl text-black tracking-tighter leading-none mb-10 md:mb-12">
                  Let's Build <br /><span className="italic text-[#A30000]">Your Legacy.</span>
                </h2>
                <div className="space-y-8 md:space-y-12">
                  <div>
                    <p className="text-[9px] md:text-[10px] font-bold tracking-[0.3em] text-black/50 uppercase mb-3">The Studio</p>
                    <p className="text-lg md:text-xl font-serif text-black leading-relaxed">S-316, 3rd Floor, Orbit Signature Walk<br />VIP Road, Zirakpur, PB, India</p>
                  </div>
                  <div>
                    <p className="text-[9px] md:text-[10px] font-bold tracking-[0.3em] text-black/50 uppercase mb-3">Direct Inquiries</p>
                    <a href="mailto:bmadvertiserchd@gmail.com" className="block text-xl md:text-2xl font-serif text-black hover:text-[#A30000] transition-colors break-words mb-2">bmadvertiserchd@gmail.com</a>
                    <p className="text-lg md:text-xl font-serif text-black">+91 907 300 3600</p>
                  </div>
                  <div className="pt-8 md:pt-10 mt-8 md:mt-12 border-t border-black/5">
                    <div className="flex flex-wrap gap-x-8 md:gap-x-12 gap-y-6">
                      {[
                        { name: 'Instagram', url: 'https://www.instagram.com/bmadvt/', icon: <><path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5H17.51" /></> },
                        { name: 'Facebook', url: 'https://www.facebook.com/bmadvertiser', icon: <><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></> }
                      ].map((social) => (
                        <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="group flex items-center space-x-2 md:space-x-3">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A30000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:scale-110">{social.icon}</svg>
                          <span className="text-[10px] md:text-[11px] font-black tracking-[0.2em] uppercase text-black hover:text-[#A30000] transition-colors">{social.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>

            <div className="lg:col-span-7 bg-white p-8 md:p-16 border border-black/5 shadow-sm">
              <FadeIn direction="left" delay={0.2}>
                <form ref={formRef} onSubmit={sendEmail} className="space-y-12">
                  {/* HIDDEN INPUT: Carries the dropdown value to EmailJS */}
                  <input type="hidden" name="interest" value={selectedInterest} />

                  <div className="grid md:grid-cols-2 gap-12">
                    {/* Name Input */}
                    <div className="relative group">
                      <p className="text-[10px] font-bold tracking-[0.3em] text-black/50 uppercase mb-2">Your Name</p>
                      <input
                        name="user_name"
                        type="text"
                        required
                        className="w-full bg-transparent border-b border-black/20 py-2 text-sm font-medium focus:outline-none focus:border-[#A30000] transition-colors"
                        placeholder="Full Name"
                      />
                      <motion.div className="absolute bottom-0 left-0 h-[1.5px] bg-[#A30000] w-0 group-focus-within:w-full transition-all duration-500" />
                    </div>

                    {/* Email Input */}
                    <div className="relative group">
                      <p className="text-[10px] font-bold tracking-[0.3em] text-black/50 uppercase mb-2">Email Address</p>
                      <input
                        name="user_email"
                        type="email"
                        required
                        className="w-full bg-transparent border-b border-black/20 py-2 text-sm font-medium focus:outline-none focus:border-[#A30000] transition-colors"
                        placeholder="name@email.com"
                      />
                      <motion.div className="absolute bottom-0 left-0 h-[1.5px] bg-[#A30000] w-0 group-focus-within:w-full transition-all duration-500" />
                    </div>
                  </div>

                  {/* DROPDOWN: INTERESTED IN - FIXED */}
                  <div className="relative">
                    <p className="text-[10px] font-bold tracking-[0.3em] text-black/50 uppercase mb-4">Interested In</p>

                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full flex items-center justify-between border-b border-black/20 py-3 text-sm font-medium focus:outline-none group text-left transition-colors"
                    >
                      <span className={selectedInterest ? "text-black" : "text-black/30"}>
                        {selectedInterest || "Select a service"}
                      </span>
                      <motion.svg
                        animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-4 h-4 text-black/40 group-hover:text-[#A30000]"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </motion.svg>
                      <motion.div className="absolute bottom-0 left-0 h-[1.5px] bg-[#A30000] w-0 group-focus-within:w-full transition-all duration-500" />
                    </button>

                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-50 left-0 right-0 mt-2 bg-white border border-black/5 shadow-2xl rounded-none overflow-hidden"
                        >
                          {INTERESTS.map((interest) => (
                            <button
                              key={interest}
                              type="button"
                              onClick={() => {
                                setSelectedInterest(interest);
                                setIsDropdownOpen(false);
                              }}
                              className="w-full text-left px-6 py-4 text-[11px] font-bold tracking-widest uppercase hover:bg-[#A30000] hover:text-white transition-all border-b border-black/5 last:border-0"
                            >
                              {interest}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Message Input */}
                  <div className="relative group">
                    <p className="text-[10px] font-bold tracking-[0.3em] text-black/50 uppercase mb-2">Message</p>
                    <textarea
                      name="message"
                      required
                      rows={3}
                      className="w-full bg-transparent border-b border-black/20 py-2 text-sm font-medium focus:outline-none focus:border-[#A30000] transition-colors resize-none"
                      placeholder="Tell us about your project"
                    />
                    <motion.div className="absolute bottom-0 left-0 h-[1.5px] bg-[#A30000] w-0 group-focus-within:w-full transition-all duration-500" />
                  </div>

                  {/* The Screenshot Button */}
                  <div className="pt-6 flex items-center gap-8">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={!isSubmitting ? { x: 4, y: 4, boxShadow: "0px 0px 0px 0px #A30000" } : {}}
                      transition={{ duration: 0.1, ease: "linear" }}
                      className="relative inline-flex items-center px-12 py-5 border-2 border-black rounded-none bg-white cursor-pointer"
                      style={{ boxShadow: isSubmitting ? "none" : "4px 4px 0px 0px #A30000" }}
                    >
                      <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-black">
                        {isSubmitting ? "Processing..." : "Send Inquiry"}
                      </span>
                      {!isSubmitting && (
                        <svg className="ml-4" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      )}
                    </motion.button>

                    {/* Subtle Success Message */}
                    {status === "success" && (
                      <span className="text-[#A30000] text-[10px] font-black uppercase tracking-widest animate-pulse">
                        ✓ Message Sent.
                      </span>
                    )}
                  </div>
                </form>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

