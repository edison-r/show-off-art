'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createPortfolio } from '@app/app/actions/portfolios';
import { motion, AnimatePresence } from 'framer-motion';

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
        router.push(`/app/dashboard`);
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
  
  const buttonClasses = variant === 'large'
    ? 'px-8 py-4 text-lg'
    : 'px-6 py-3';
  
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        className={`${buttonClasses} bg-black text-white cursor-pointer rounded-lg font-mono font-semibold hover:bg-black/60 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2`}
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
            onClick={() => !isPending && setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-titles text-2xl md:text-3xl font-bold">
                  Create Portfolio
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium block">
                    Portfolio Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    disabled={isPending}
                    placeholder="E.g: Frontend Portfolio"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent disabled:bg-neutral-100"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="slug" className="text-sm font-medium block">
                    URL Slug
                  </label>
                  <div className="flex items-center gap-2 mb-2 font-mono text-sm text-neutral-500">
                    <span>show-off.com/u/username/</span>
                    <span className="font-semibold text-blue">
                      {slug || 'slug'}
                    </span>
                  </div>
                  <input
                    id="slug"
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase())}
                    disabled={isPending}
                    placeholder="E.g: frontend-portfolio"
                    pattern="[a-z0-9-]+"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent disabled:bg-neutral-100"
                    required
                  />
                  <p className="font-mono text-xs text-neutral-500">
                    Only lowercase letters, numbers and hyphens
                  </p>
                </div>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    disabled={isPending}
                    className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg font-medium hover:bg-neutral-50 disabled:opacity-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 px-4 py-3 bg-blue text-white rounded-lg font-semibold hover:bg-blue/90 disabled:opacity-50 transition-colors"
                  >
                    {isPending ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}