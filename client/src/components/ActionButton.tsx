import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface ActionButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "destructive" | "outline";
}

export function ActionButton({ 
  children, 
  className, 
  variant = "primary", 
  disabled,
  ...props 
}: ActionButtonProps) {
  const variants = {
    primary: "bg-primary text-primary-foreground shadow-primary/25 hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground shadow-secondary/25 hover:bg-secondary/90",
    destructive: "bg-destructive text-destructive-foreground shadow-destructive/25 hover:bg-destructive/90",
    outline: "bg-transparent border-2 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      disabled={disabled}
      className={cn(
        "px-6 py-4 md:px-10 md:py-5 rounded-2xl font-bold text-lg md:text-xl tracking-wide uppercase transition-colors shadow-lg",
        variants[variant],
        disabled && "opacity-50 cursor-not-allowed grayscale",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
