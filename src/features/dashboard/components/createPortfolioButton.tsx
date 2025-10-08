'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createPortfolio } from '@/features/portfolio/actions/portfolios';
import { motion, AnimatePresence } from 'framer-motion';
import { PortfolioForm } from '../../../features/portfolio/components/PortfolioForm';

interface CreatePortfolioButtonProps {
  disabled?: boolean;
  variant?: 'default' | 'large';
}

export function CreatePortfolioButton({ 
  disabled = false,
  variant = 'default'
}: CreatePortfolioButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!title.trim() || !slug.trim()) {
      setError('All fields are required');
      return;
    }
    
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug)) {
      setError('Slug can only contain lowercase letters, numbers and hyphens');
      return;
    }
    
    startTransition(async () => {
      const response = await createPortfolio({
        title,
        slug,
        visibility: 'draft'
      });
      
      if (response.success) {
        setIsOpen(false);
        setTitle('');
        setSlug('');
        router.push('/app/dashboard');
        router.refresh();
      } else {
        setError(response.error || 'Error creating portfolio');
      }
    });
  };
  
  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(value));
    }
  };
  
  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);
  };
  
  const handleCancel = () => {
    if (!isPending) {
      setIsOpen(false);
      setError('');
    }
  };
  
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
            onClick={handleCancel}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8"
            >
              <PortfolioForm
                title={title}
                slug={slug}
                error={error}
                isPending={isPending}
                onTitleChange={handleTitleChange}
                onSlugChange={setSlug}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                mode="create"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}