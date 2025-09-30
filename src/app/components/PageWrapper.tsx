import { motion } from "framer-motion";
import { ReactNode, useState, useEffect } from "react";

type PageWrapperProps = {
    children: ReactNode;
    className?: string;
};

export function PageWrapper({ 
  children, 
  className = "", 
}: PageWrapperProps) {
    const [doParallax, setDoParallax] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
        setDoParallax(true);
        }, 50);

        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div
            className={`min-h-screen transform-gpu ${className}`}
            initial={{ y: -50 }} 
            animate={{ y: doParallax ? 0 : -50 }}
            transition={{ 
                duration: 1.2, 
                ease: [0.22, 1, 0.36, 1],
                delay: 0
            }}
            >
            {children}
        </motion.div>
    );
}