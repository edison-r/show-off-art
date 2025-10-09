'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreatePortfolioForm } from '@/features/portfolio/components/CreatePortfolioForm';

interface CreatePortfolioButtonProps {
  disabled?: boolean;
  variant?: 'default' | 'large';
}

export function CreatePortfolioButton({ 
  disabled = false,
  variant = 'default'
}: CreatePortfolioButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const buttonClasses = variant === 'large'
    ? 'px-8 py-4 text-lg'
    : 'px-6 py-3';
  
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        className={`${buttonClasses} bg-black text-white cursor-pointer rounded-lg font-mono font-semibold hover:bg-black/60 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2`}
        aria-label="Create new portfolio"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        New Portfolio
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8"
            >
              <CreatePortfolioForm
                onSuccess={() => setIsOpen(false)}
                onCancel={() => setIsOpen(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}