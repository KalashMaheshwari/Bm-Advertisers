import { useState } from "react";
import { FadeIn } from "../components/FadeIn";
import { Button } from "../components/Button";
import { AnimatePresence, motion } from "framer-motion";

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
    url: "/gallery/1.jpg", // Correct: Browser looks in public/gallery/1.jpg
    title: "Elite Events",
    size: "md:col-span-8 md:row-span-2",
  },
  {
    url: "/gallery/2.jpg",
    title: "Premium Publishing",
    size: "md:col-span-4 md:row-span-1",
  },
  {
    url: "/gallery/3.jpg",
    title: "Brand Strategy",
    size: "md:col-span-4 md:row-span-1",
  },
  {
    url: "/gallery/4.jpg",
    title: "Networking Gala",
    size: "md:col-span-4 md:row-span-2",
  },
  {
    url: "/gallery/5.jpg",
    title: "Recognition Awards",
    size: "md:col-span-8 md:row-span-2",
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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // 2. Add State for the Contact Dropdown
  const [selectedInterest, setSelectedInterest] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white selection:bg-[#A30000] selection:text-white">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[900px] w-full flex items-center overflow-hidden bg-black">

        {/* THE CINEMATIC STACK */}
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover scale-105 brightness-[0.5] contrast-[1.2]">
            <source src="/video/hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[#A30000]/10 mix-blend-multiply" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Refined Editorial Layout */}
          <div className="lg:col-span-7">
            {/* Identity Tag */}
            <FadeIn delay={0.2} direction="up">
              <div className="inline-flex items-center space-x-4 mb-10">
                <span className="text-[10px] font-bold tracking-[0.5em] text-[#A30000] uppercase">
                  Est. 2006 • Chandigarh
                </span>
                <div className="h-[0.5px] w-12 bg-[#A30000]" />
              </div>
            </FadeIn>

            {/* Full Tagline - Reduced Font Size for Elegance */}
            <FadeIn delay={0.4} direction="up">
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-white mb-8">
                Showcasing Success<span className="text-[#A30000]">.</span><br />
                <span
                  className="font-serif text-5xl md:text-6xl lg:text-6xl leading-[1.1] tracking-tight text-white mb-8"
                >
                  Powering Recognition
                </span><span className="text-[#A30000]">.</span>
              </h1>
            </FadeIn>

            {/* Subheading - Clean, spacious, and grounded */}
            <FadeIn delay={0.6} direction="up" className="max-w-xl mb-12">
              <p className="text-white/70 text-base md:text-lg font-light leading-relaxed tracking-wide">
                BM Advertiser is a Chandigarh-based media and event powerhouse specializing in premium magazines
                and high-profile events. We create platforms where brands, entrepreneurs, and
                professionals gain the visibility, credibility, and meaningful connections they deserve.
              </p>
            </FadeIn>

            {/* Focused CTA */}
            <FadeIn delay={0.8} direction="up">
              <Button
                href="/#contact"
                variant="primary"
                className="px-14 py-4 text-[10px] tracking-[0.2em] bg-[#A30000] text-white border-none hover:bg-white hover:text-[#A30000] transition-all duration-700 shadow-2xl rounded-sm uppercase font-bold"
              >
                Get Featured Now —
              </Button>
            </FadeIn>
          </div>

          {/* Right Column: Staggered Glass Trio with Crimson Bleed Effect */}
          <div className="lg:col-span-4 relative h-[500px] hidden lg:block">
            {[
              {
                title: "Visibility.",
                text: "Chandigarh-based media and event company specializing in premium magazines.",
                pos: "top-0 left-0",
                delay: 0.8
              },
              {
                title: "Credibility.",
                text: "Creating platforms where entrepreneurs and professionals connect and grow.",
                pos: "top-[160px] left-[60px]",
                delay: 1.0
              },
              {
                title: "Connections.",
                text: "Beyond publishing. We showcase success stories and connect influential individuals.",
                pos: "top-[320px] left-[120px]",
                delay: 1.2,
                hasLine: true
              }
            ].map((box, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: box.delay }}
                whileHover={{ scale: 1.02, zIndex: 50 }}
                className={`absolute ${box.pos} w-64 glass-card p-6 rounded-2xl border border-white/40 shadow-2xl backdrop-blur-3xl overflow-hidden group cursor-default transition-all duration-500`}
              >
                {/* THE BLEED: Red color drop effect */}
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#A30000]/30 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 group-hover:scale-[2.5] transition-all duration-1000 ease-out pointer-events-none z-0" />

                <div className="relative z-10">
                  <h3 className="text-[#A30000] font-serif text-lg mb-2 italic transition-colors duration-500 group-hover:text-black">
                    {box.title}
                  </h3>
                  <p className="text-black/80 text-[11px] leading-relaxed font-medium">
                    {box.text}
                  </p>
                  {box.hasLine && <div className="mt-4 h-[1px] w-8 bg-[#A30000] group-hover:w-12 transition-all duration-500" />}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Metrics Strip */}
        <div className="absolute bottom-12 left-0 right-0 z-10 px-6 lg:px-12">
          <FadeIn delay={1.0} direction="up">
            <div className="flex flex-wrap justify-center md:justify-start gap-8 md:gap-16 opacity-60">
              {["20+ Years Authority", "Premium Editions", "High-Profile Events"].map((metric, i) => (
                <div key={i} className="flex flex-col items-center md:items-start">
                  <span className="text-[10px] font-bold tracking-[0.4em] text-white uppercase">{metric}</span>
                  <div className="h-[1px] w-6 bg-[#A30000] mt-2" />
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* About Section - The Digital Archive of Authority */}
      <section id="about" className="py-32 px-6 lg:px-12 bg-[#FAFAFA] overflow-hidden">
        <div className="max-w-7xl mx-auto">

          {/* Part 1: The Intro (The "Hook") */}
          <FadeIn direction="up" className="mb-24">
            <div className="grid lg:grid-cols-12 gap-12 items-end">
              <div className="lg:col-span-8">
                <div className="flex items-center space-x-4 mb-8">
                  <span className="text-[10px] font-bold tracking-[0.6em] text-[#A30000] uppercase">The Narrative</span>
                  <div className="h-[0.5px] w-16 bg-[#A30000]" />
                </div>
                <h2 className="font-serif text-5xl md:text-8xl leading-[0.9] text-black tracking-tighter">
                  Architecting <br />
                  <span className="italic text-[#A30000]">The Power of Presence.</span>
                </h2>
              </div>
              <div className="lg:col-span-4 pb-4">
                <p className="text-black/50 text-xs uppercase tracking-[0.3em] font-bold mb-4">Established 2006</p>
                <p className="text-black/80 text-lg font-light leading-relaxed border-l-2 border-[#A30000] pl-6">
                  BM Advertiser is a leading media and event company with over 20 years of expertise based in the heart of Chandigarh.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Part 2: The Editorial Bento Grid (The "Matter") */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[350px]">

            {/* Block 1: The Core Mission (Spacious & Sophisticated) */}
            <motion.div
              whileHover={{ y: -8 }}
              className="md:col-span-7 bg-white rounded-[2.5rem] p-12 flex flex-col justify-between border border-black/[0.03] shadow-[0_4px_30px_rgba(0,0,0,0.02)] group relative overflow-hidden"
            >
              <div className="relative z-10">
                <h3 className="text-[#A30000] font-serif text-3xl italic mb-6">Beyond Publishing.</h3>
                <p className="text-xl md:text-2xl font-serif text-black/90 leading-snug max-w-lg">
                  "Over the years, we have built a reputation for creating platforms that not only
                  <span className="text-[#A30000]"> showcase success </span>
                  but create real, lasting opportunities."
                </p>
              </div>

              {/* Subtle Watermark */}
              <span className="absolute -bottom-16 -right-10 font-serif text-[22rem] text-black/[0.02] font-bold select-none">
                BM
              </span>

              <p className="relative z-10 text-black/40 text-[10px] uppercase tracking-[0.4em] font-bold">
                Market Authority • Networking • Growth
              </p>
            </motion.div>

            {/* Block 2: The Philosophy (Bionic Glass Feel) */}
            <div className="md:col-span-5 bg-black rounded-[2.5rem] p-12 flex flex-col justify-center relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#A30000]/20 to-transparent opacity-50" />
              <div className="relative z-10">
                <h4 className="text-white/40 text-[10px] font-bold tracking-[0.4em] uppercase mb-8">The Philosophy</h4>
                <p className="text-white text-xl font-light leading-relaxed mb-8">
                  We believe that <span className="text-[#A30000] font-medium">true growth</span> comes from both visibility and connection. We combine media presence with real-world engagement.
                </p>
                <div className="h-[1px] w-12 bg-[#A30000]" />
              </div>
            </div>

            {/* Block 3: Visual Identity (Monochrome Impact) */}
            <div className="md:col-span-4 rounded-[2.5rem] overflow-hidden relative group">
              <img
                src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800"
                className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 scale-110 group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-10 left-10">
                <p className="text-white font-serif text-2xl italic">Curated Excellence.</p>
              </div>
            </div>

            {/* Block 4: The Impact Statement (Spacious Text) */}
            <div className="md:col-span-8 bg-white rounded-[2.5rem] p-12 border border-black/[0.03] flex flex-col justify-between group hover:border-[#A30000]/20 transition-all duration-500">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h4 className="font-serif text-2xl mb-4">Success Stories</h4>
                  <p className="text-black/60 text-sm leading-relaxed font-light">
                    Our magazines highlight inspiring journeys and growing brands, while our events provide a space for recognition and meaningful collaborations.
                  </p>
                </div>
                <div>
                  <h4 className="font-serif text-2xl mb-4">Credible Names</h4>
                  <p className="text-black/60 text-sm leading-relaxed font-light">
                    We continue to create experiences that leave a lasting impact and position our clients as recognized names in their field.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-12 mt-8 pt-8 border-t border-black/5">
                <div className="flex flex-col">
                  <span className="text-3xl font-serif text-[#A30000]">20+</span>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-black/30">Years in Media</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-serif text-black">15+</span>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-black/30">High-Profile Events</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-serif text-black">Strong</span>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-black/30">Industry Network</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Services Section - Refined Editorial Spread */}
      <section id="services" className="py-32 px-6 lg:px-12 bg-white">
        <div className="max-w-5xl mx-auto">

          {/* Section Header */}
          <FadeIn direction="up" className="mb-24">
            <div className="flex items-center space-x-4 mb-8">
              <span className="text-[10px] font-bold tracking-[0.5em] text-[#A30000] uppercase">Expertise</span>
              <div className="h-[0.5px] w-12 bg-[#A30000]" />
            </div>
            <h2 className="font-serif text-5xl md:text-7xl text-black tracking-tight">
              Our Services<span className="text-[#A30000]">.</span>
            </h2>
          </FadeIn>

          {/* Accordion List */}
          <div className="border-t border-black/5">
            {SERVICES.map((service, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div
                  key={index}
                  animate={{ backgroundColor: isOpen ? "rgba(0,0,0,0.01)" : "rgba(255,255,255,1)" }}
                  className="relative border-b border-black/5 overflow-hidden transition-colors duration-700"
                >

                  {/* RED IDENTITY BAR - Pulsing Effect */}
                  <motion.div
                    initial={false}
                    animate={{
                      height: isOpen ? '100%' : '0%',
                      opacity: isOpen ? [0.4, 1, 0.4] : 0
                    }}
                    transition={{
                      height: { duration: 0.5 },
                      opacity: { repeat: Infinity, duration: 3 }
                    }}
                    className="absolute left-0 top-0 w-[2px] bg-[#A30000] z-20"
                  />

                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full py-16 flex items-center justify-between text-left group focus:outline-none relative z-10"
                  >
                    <div className="flex items-center pl-4 w-full">
                      {/* Number */}
                      <span className={`font-serif text-xl transition-all duration-700 mr-12 ${isOpen ? 'text-[#A30000] scale-110' : 'text-black/10 group-hover:text-black/30'}`}>
                        0{index + 1}
                      </span>

                      {/* Title & Underline Wrapper */}
                      <div className="relative">
                        <h3 className={`font-serif text-2xl md:text-4xl transition-all duration-500 ${isOpen ? 'text-black' : 'text-black/60 group-hover:text-black'}`}>
                          {service.title}
                        </h3>
                        {/* THE DRAW LINE */}
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: isOpen ? '100%' : 0 }}
                          transition={{ duration: 0.8, ease: "circOut" }}
                          className="absolute -bottom-2 left-0 h-[1px] bg-[#A30000]/30"
                        />
                      </div>
                    </div>

                    {/* AGENCY ARROW */}
                    <div className="relative flex items-center justify-center w-12 h-12 ml-4">
                      <motion.div
                        animate={{ scale: isOpen ? 1 : 0, opacity: isOpen ? 1 : 0 }}
                        className="absolute inset-0 bg-[#A30000]/10 rounded-full blur-xl"
                      />
                      <motion.div
                        animate={{ rotate: isOpen ? 45 : -45, color: isOpen ? "#A30000" : "rgba(0,0,0,0.15)" }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="relative z-10"
                      >
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                          <line x1="7" y1="12" x2="17" y2="12"></line>
                          <polyline points="12 7 17 12 12 17"></polyline>
                        </svg>
                      </motion.div>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-16 pl-32 md:pl-44 max-w-2xl relative">
                          {/* Staggered Content reveal */}
                          <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <div className="flex items-center space-x-3 mb-6">
                              <div className="h-[1px] w-6 bg-[#A30000]" />
                              <p className="text-[10px] font-bold tracking-[0.4em] text-[#A30000] uppercase">{service.tag}</p>
                            </div>
                          </motion.div>

                          <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-black/60 text-lg md:text-xl font-light leading-relaxed"
                          >
                            {service.desc}
                          </motion.p>

                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: 'spring' }}
                            className="mt-10 w-2 h-2 bg-[#A30000] rounded-full shadow-[0_0_15px_rgba(163,0,0,0.5)]"
                          />
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

      {/* Gallery Preview Section */}
      <section id="gallery" className="py-32 px-6 lg:px-12 bg-[#FAF8F8] overflow-hidden">
        <div className="max-w-7xl mx-auto">

          {/* Section Header - High Contrast */}
          <FadeIn direction="up" className="mb-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
              <div>
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-[10px] font-bold tracking-[0.6em] text-[#A30000] uppercase">Archive</span>
                  <div className="h-[0.5px] w-12 bg-[#A30000]" />
                </div>
                <h2 className="font-serif text-5xl md:text-7xl text-black tracking-tighter leading-none">
                  Visual <span className="italic text-[#A30000] font-light">Legacy.</span>
                </h2>
              </div>

              {/* THE TACTILE "VIEW MORE" BUTTON */}
              <div className="pb-4 pr-4">
                <motion.a
                  href="/gallery"
                  whileHover={{
                    x: 4,
                    y: 4,
                    boxShadow: "0px 0px 0px 0px #A30000"
                  }}
                  transition={{
                    duration: 0.1,
                    ease: "linear"
                  }}
                  className="relative inline-flex items-center px-10 py-4 border-2 border-black rounded-none bg-white cursor-pointer select-none"
                  style={{
                    boxShadow: "4px 4px 0px 0px #A30000",
                  }}
                >
                  {/* Button Text */}
                  <span className="relative z-10 text-[10px] font-bold tracking-[0.4em] uppercase text-black">
                    View More
                  </span>

                  {/* Surgical Arrow */}
                  <svg
                    className="ml-4"
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </motion.a>
              </div>
            </div>
          </FadeIn>

          {/* The Asymmetric Grid - 0px Border Radius */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 auto-rows-[300px]">
            {GALLERY_IMAGES.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={`relative group overflow-hidden bg-black ${image.size}`}
              >
                {/* Image Container - NO ROUNDED CORNERS */}
                <motion.img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover transition-all duration-1000 ease-out opacity-70 group-hover:opacity-100 group-hover:scale-105"
                />

                {/* Gradient Overlay - Crimson Tint */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />

                {/* Surgical Red Accent Line (Top) */}
                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  className="absolute top-0 left-0 h-[2px] bg-[#A30000] z-20"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 lg:px-12 bg-[#FAFAFA] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-20">

            {/* Left Column: The Invitation */}
            <div className="lg:col-span-5">
              <FadeIn direction="right">
                <div className="flex items-center space-x-4 mb-8">
                  <span className="text-[10px] font-bold tracking-[0.6em] text-[#A30000] uppercase">Connect</span>
                  <div className="h-[0.5px] w-12 bg-[#A30000]" />
                </div>
                <h2 className="font-serif text-6xl md:text-8xl text-black tracking-tighter leading-none mb-12">
                  Let's Build <br />
                  <span className="italic text-[#A30000]">Your Legacy.</span>
                </h2>

                <div className="space-y-12">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.4em] text-black/50 uppercase mb-4">The Studio</p>
                    <p className="text-xl font-serif text-black leading-relaxed">
                      Chandigarh, India <br />
                      Sector 17-C, City Centre
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold tracking-[0.4em] text-black/50 uppercase mb-4">Direct Inquiries</p>
                    <a href="mailto:hello@bmadvertiser.com" className="block text-2xl font-serif text-black hover:text-[#A30000] transition-colors duration-300 mb-2">
                      hello@bmadvertiser.com
                    </a>
                    <p className="text-xl font-serif text-black">+91 90730 03600</p>
                  </div>

                  <div className="pt-10 mt-12 border-t border-black/5">
                    <div className="flex flex-wrap gap-x-12 gap-y-6">
                      {[
                        {
                          name: 'Instagram',
                          url: 'https://www.instagram.com/bmadvt/', // Add your link
                          icon: <><path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5H17.51" /></>
                        },
                        {
                          name: 'Facebook',
                          url: 'https://www.facebook.com/bmadvertiser', // Add your link
                          icon: <><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></>
                        }
                      ].map((social) => (
                        <a
                          key={social.name}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center space-x-3"
                        >
                          {/* Sharp Crimson Icon */}
                          <svg
                            width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="#A30000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            className="transition-transform duration-300 group-hover:scale-110"
                          >
                            {social.icon}
                          </svg>

                          {/* Bold, Visible Text */}
                          <span className="text-[11px] font-black tracking-[0.3em] uppercase text-black hover:text-[#A30000] transition-colors duration-300">
                            {social.name}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Right Column: The Form */}
            <div className="lg:col-span-7 bg-white p-10 md:p-16 border border-black/5 shadow-sm relative">
              <FadeIn direction="left" delay={0.2}>
                <form className="space-y-12">
                  <div className="grid md:grid-cols-2 gap-12">
                    {/* Name Input */}
                    <div className="relative group">
                      <p className="text-[10px] font-bold tracking-[0.3em] text-black/50 uppercase mb-2">Your Name</p>
                      <input
                        type="text"
                        className="w-full bg-transparent border-b border-black/20 py-2 text-sm font-medium focus:outline-none focus:border-[#A30000] transition-colors"
                        placeholder="Full Name"
                      />
                      <motion.div className="absolute bottom-0 left-0 h-[1.5px] bg-[#A30000] w-0 group-focus-within:w-full transition-all duration-500" />
                    </div>

                    {/* Email Input */}
                    <div className="relative group">
                      <p className="text-[10px] font-bold tracking-[0.3em] text-black/50 uppercase mb-2">Email Address</p>
                      <input
                        type="email"
                        className="w-full bg-transparent border-b border-black/20 py-2 text-sm font-medium focus:outline-none focus:border-[#A30000] transition-colors"
                        placeholder="name@email.com"
                      />
                      <motion.div className="absolute bottom-0 left-0 h-[1.5px] bg-[#A30000] w-0 group-focus-within:w-full transition-all duration-500" />
                    </div>
                  </div>

                  {/* DROPDOWN: INTERESTED IN */}
                  <div className="relative">
                    <p className="text-[10px] font-bold tracking-[0.3em] text-black/50 uppercase mb-4">Interested In</p>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full flex items-center justify-between border-b border-black/20 py-3 text-sm font-medium focus:outline-none group"
                    >
                      <span className={selectedInterest ? "text-black" : "text-black/30"}>
                        {selectedInterest || "Select a service"}
                      </span>
                      <motion.svg
                        animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                        className="w-4 h-4 text-black/40 group-hover:text-[#A30000] transition-colors"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                      >
                        <path d="M19 9l-7 7-7-7" />
                      </motion.svg>
                    </button>

                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-50 left-0 right-0 mt-2 bg-white border border-black/5 shadow-2xl rounded-none"
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
                      rows={3}
                      className="w-full bg-transparent border-b border-black/20 py-2 text-sm font-medium focus:outline-none focus:border-[#A30000] transition-colors resize-none"
                      placeholder="Tell us about your project"
                    />
                    <motion.div className="absolute bottom-0 left-0 h-[1.5px] bg-[#A30000] w-0 group-focus-within:w-full transition-all duration-500" />
                  </div>

                  {/* SNAPPY PUSH BUTTON */}
                  <div className="pt-6">
                    <motion.button
                      type="submit"
                      whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px #A30000" }}
                      transition={{ duration: 0.1, ease: "linear" }}
                      className="relative inline-flex items-center px-12 py-5 border-2 border-black rounded-none bg-white cursor-pointer"
                      style={{ boxShadow: "4px 4px 0px 0px #A30000" }}
                    >
                      <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-black">
                        Send Inquiry
                      </span>
                      <svg className="ml-4" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </motion.button>
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