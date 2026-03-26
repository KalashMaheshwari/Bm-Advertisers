import { Link } from "react-router-dom";
import { cn } from "../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  href?: string;
}

export function Button({ 
  children, 
  variant = 'primary', 
  className, 
  href,
  ...props 
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium tracking-widest uppercase transition-all duration-400 ease-out";
  
  const variants = {
    primary: "border border-[#A30000] text-[#A30000] btn-wipe hover:border-transparent",
    secondary: "border border-black/20 text-black/80 hover:border-[#A30000] hover:text-[#A30000] bg-white/50 backdrop-blur-sm",
    outline: "border border-black/80 text-black hover:bg-black hover:text-white",
    ghost: "text-black/70 hover:text-[#A30000] hover:bg-black/5"
  };

  if (href) {
    if (href.startsWith('/#')) {
      return (
        <a 
          href={href}
          className={cn(baseStyles, variants[variant], className)}
        >
          {children}
        </a>
      );
    }
    return (
      <Link 
        to={href}
        className={cn(baseStyles, variants[variant], className)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button 
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}