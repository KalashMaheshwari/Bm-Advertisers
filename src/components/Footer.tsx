import { Link } from "react-router-dom";

export function Footer() {

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#121212] text-white py-12 px-6 lg:px-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto text-left">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Tagline Section */}
          <div className="col-span-2 lg:col-span-6">
            <h2 className="font-serif text-3xl md:text-5xl tracking-tighter leading-tight mb-6">
              Let's define the <span className="text-[#A30000] italic">Next Chapter.</span>
            </h2>
            <Link 
              to="/#contact" 
              className="text-[9px] font-black uppercase tracking-[0.5em] text-[#A30000] border-b border-[#A30000] pb-1 hover:text-white hover:border-white transition-all inline-block"
            >
              Commence Collaboration
            </Link>
          </div>

          {/* Directory Section */}
          <div className="lg:col-span-3">
            <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.5em] mb-4">Directory</p>
            <ul className="space-y-3 text-[10px] font-bold uppercase tracking-widest text-white/60">
              <li className="hover:text-white cursor-pointer transition-colors" onClick={handleScrollToTop}>
                Home
              </li>
              <li>
                <Link to="/gallery" className="hover:text-white transition-colors">Gallery</Link>
              </li>
              <li>
                <Link to="/magazines" className="hover:text-white transition-colors">Magazines</Link>
              </li>
              <li>
                <Link to="/#contact" className="hover:text-white transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Connect Section */}
          <div className="lg:col-span-3">
            <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.5em] mb-4">Connect</p>
            <div className="flex flex-col space-y-4">
              <a href="https://www.instagram.com/bmadvt/" className="flex items-center space-x-3 text-white/60 hover:text-white group transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                <span className="text-[10px] font-bold uppercase tracking-widest group-hover:text-white transition-colors">Instagram</span>
              </a>
              <a href="https://www.facebook.com/bmadvertiser" className="flex items-center space-x-3 text-white/60 hover:text-white group transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
                <span className="text-[10px] font-bold uppercase tracking-widest group-hover:text-white transition-colors">Facebook</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: License & Logo */}
        <div className="pt-8 border-t border-white/5 flex justify-between items-center">
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20">
            ©{new Date().getFullYear()} BM ADVERTISERS
          </span>
          <Link to="/" onClick={handleScrollToTop}>
            <img 
              src="/logowhite.webp" 
              alt="BM Logo" 
              className="h-7 w-auto object-contain opacity-50 hover:opacity-100 transition-opacity" 
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}