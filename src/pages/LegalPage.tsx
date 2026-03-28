import { useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function LegalPage() {
  const location = useLocation();
  const path = location.pathname;

  // Automatically scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);

  // Content Selection Logic based on the provided document 
  const renderContent = () => {
    switch (path) {
      case "/privacy-policy":
        return (
          <div className="space-y-8">
            <p className="font-bold text-black">Effective Date: 2026</p>
            <p>At BM Advertiser (bmadvertiser.com), we respect your privacy and are committed to protecting your personal information.</p>
            
            <section>
              <h3 className="text-black font-bold uppercase tracking-widest text-xs mb-4">Information We Collect</h3>
              <p>We collect personal information such as your name and email address when you voluntarily submit it through our contact form.</p>
            </section>

            <section>
              <h3 className="text-black font-bold uppercase tracking-widest text-xs mb-4">How We Use Your Information</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Respond to your inquiries</li>
                <li>Communicate with you when necessary</li>
              </ul>
              <p className="mt-4 text-[#A30000] font-medium">We do not sell, trade, or rent your personal information to third parties.</p>
            </section>

            <section>
              <h3 className="text-black font-bold uppercase tracking-widest text-xs mb-4">Media & Publications</h3>
              <p>All magazines, images, videos, and other content published on this website are original works owned and managed by BM Advertiser. Any unauthorized use, reproduction, or distribution of this content is strictly prohibited.</p>
            </section>

            <section>
              <h3 className="text-black font-bold uppercase tracking-widest text-xs mb-4">Data Security & External Links</h3>
              <p>We take reasonable measures to protect your information. However, we are not responsible for the privacy practices of external platforms such as Instagram and Facebook.</p>
            </section>
          </div>
        );

      case "/terms-conditions":
        return (
          <div className="space-y-8">
            <p className="font-bold text-black">Effective Date: 2026</p>
            <p>Welcome to BM Advertiser (bmadvertiser.com). By accessing this website, you agree to the following terms:</p>

            <section>
              <h3 className="text-black font-bold uppercase tracking-widest text-xs mb-4">Ownership of Content</h3>
              <p>All content on this website, including magazines, images, videos, designs, and text, is the intellectual property of BM Advertiser. Unauthorized copying, reproduction, distribution, or reuse without prior written permission is strictly prohibited.</p>
            </section>

            <section>
              <h3 className="text-black font-bold uppercase tracking-widest text-xs mb-4">Publications</h3>
              <p>All magazines displayed on this website are original publications managed by BM Advertiser. Any resemblance to previously published or external materials is purely coincidental.</p>
            </section>

            <section>
              <h3 className="text-black font-bold uppercase tracking-widest text-xs mb-4">Limitation of Liability</h3>
              <p>BM Advertiser shall not be held liable for any direct or indirect damages resulting from the use of this website or its content.</p>
            </section>
          </div>
        );

      case "/disclaimer":
        return (
          <div className="space-y-8">
            <p>The content on bmadvertiser.com, including magazines, images, videos, and other materials, is provided for informational and promotional purposes only.</p>
            <p>While we strive to keep all information accurate and up to date, we make no guarantees regarding completeness, accuracy, or reliability.</p>
            <p>All media content and publications on this website are owned and managed by BM Advertiser. Any unauthorized use may result in appropriate action.</p>
            <div className="bg-gray-50 p-8 border-l-4 border-[#A30000] italic text-black/80">
              If you believe any content violates your rights, please contact us at bmadvertiserchd@gmail.com and we will take appropriate action.
            </div>
          </div>
        );

      default:
        return <p>Page not found.</p>;
    }
  };

  const getTitle = () => {
    if (path === "/privacy-policy") return "Privacy Policy";
    if (path === "/terms-conditions") return "Terms & Conditions";
    if (path === "/disclaimer") return "Disclaimer";
    return "Legal";
  };

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white pt-40 md:pt-56 pb-32 px-6 selection:bg-[#A30000] selection:text-white"
    >
      <div className="max-w-4xl mx-auto">
        {/* Editorial Heading */}
        <div className="mb-16 md:mb-24">
          <span className="text-[#A30000] text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">
            Legal Document — 2026
          </span>
          <h1 className="font-serif text-5xl md:text-8xl tracking-tighter text-black leading-[0.9] uppercase">
            {getTitle()}<span className="text-[#A30000]">.</span>
          </h1>
        </div>

        {/* Content Area */}
        <div className="text-[13px] md:text-[15px] leading-relaxed text-black/60 max-w-2xl">
          {renderContent()}
        </div>

        {/* Global Footer Contact for Legal */}
        <div className="mt-20 pt-12 border-t border-black/5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">
            Inquiries regarding legal terms:
          </p>
          <a 
            href="mailto:bmadvertiserchd@gmail.com" 
            className="text-[#A30000] font-serif italic text-xl md:text-2xl hover:text-black transition-colors"
          >
            bmadvertiserchd@gmail.com
          </a>
        </div>
      </div>
    </motion.main>
  );
}