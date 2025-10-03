'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deletePortfolio, publishPortfolio, unpublishPortfolio } from '@app/app/actions/portfolios';
import type { Portfolio } from '@/types/portfolio';
import Link from 'next/link';

interface PortfolioCardProps {
  portfolio: Portfolio;
}

export function PortfolioCard({ portfolio }: PortfolioCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showMenu, setShowMenu] = useState(false);
  
  const visibilityConfig = {
    draft: { 
      text: 'Draft', 
      color: 'bg-neutral-100 text-neutral-600',
      icon: '🔒'
    },
    unlisted: { 
      text: 'Unlisted', 
      color: 'bg-yellow-100 text-yellow-700',
      icon: '🔗'
    },
    public: { 
      text: 'Public', 
      color: 'bg-green-100 text-green-700',
      icon: '🌐'
    }
  };
  
  const config = visibilityConfig[portfolio.visibility];
  
  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this portfolio? This action cannot be undone.')) {
      return;
    }
    
    startTransition(async () => {
      const response = await deletePortfolio(portfolio.id);
      if (response.success) {
        router.refresh();
      } else {
        alert(response.error);
      }
    });
  };
  
  const handlePublish = () => {
    startTransition(async () => {
      const response = await publishPortfolio(portfolio.id);
      if (response.success) {
        router.refresh();
      } else {
        alert(response.error);
      }
    });
  };

    const handleUnpublish = () => {
    if (!confirm('This will make your portfolio private. Are you sure?')) {
        return;
    }
    
    startTransition(async () => {
        const response = await unpublishPortfolio(portfolio.id);
        if (response.success) {
        router.refresh();
        } else {
        alert(response.error);
        }
    });
    };
  
  return (
    <article className="bg-black/30 border border-black rounded-xl p-6 hover:shadow-lg transition-all group relative">
      <div className="flex items-start justify-between mb-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium ${config.color}`}>
          <span>{config.icon}</span>
          {config.text}
        </span>
        
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          
            {showMenu && (
                <div className="absolute right-0 top-10 bg-white border border-neutral-200 rounded-lg shadow-xl z-10 py-1 min-w-[150px]">
                    {portfolio.visibility === 'draft' ? (
                    <>
                        <button
                        onClick={handlePublish}
                        disabled={isPending}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 disabled:opacity-50"
                        >
                        Publish
                        </button>
                        <button
                        onClick={handleDelete}
                        disabled={isPending}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                        Delete
                        </button>
                    </>
                    ) : (
                    <>
                        <button
                        onClick={handleUnpublish}
                        disabled={isPending}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 disabled:opacity-50"
                        >
                        Unpublish
                        </button>
                    </>
                        )}
                </div>
            )}
        </div>
      </div>
      
      {/* Content */}
      <div className="mb-6">
        <h3 className="font-titles text-xl font-bold mb-2">
          {portfolio.title}
        </h3>
        <p className="font-mono text-sm text-neutral-500">
          /{portfolio.slug}
        </p>
      </div>
      
      {/* Meta */}
      <div className="font-mono text-xs text-neutral-600 mb-6 space-y-1">
        <p>Created: {new Date(portfolio.created_at).toLocaleDateString('en-US')}</p>
        {portfolio.published_at && (
          <p>Published: {new Date(portfolio.published_at).toLocaleDateString('en-US')}</p>
        )}
      </div>
      
      {/* Actions */}
      <div className="flex gap-2">
        <Link
          href={`/app/dashboard/${portfolio.slug}`}
          className="flex-1 px-4 py-2 bg-blue text-white rounded-lg font-medium hover:bg-blue/90 transition-colors inline-flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </Link>
        
        <Link
          href={`/app/preview/${portfolio.slug}`}
          className="px-4 py-2 border border-neutral-300 rounded-lg font-medium hover:bg-neutral-50 transition-colors inline-flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Preview
        </Link>
      </div>
    </article>
  );
}