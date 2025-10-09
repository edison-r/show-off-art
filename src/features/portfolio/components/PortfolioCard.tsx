'use client';

import type { Portfolio } from '@/features/portfolio/types/portfolio';
import Link from 'next/link';
import { PortfolioCardMenu } from './PortfolioCardMenu';
import { PortfolioCardBadge } from './PortfolioCardBadge';

interface PortfolioCardProps {
  portfolio: Portfolio;
}

export function PortfolioCard({ portfolio }: PortfolioCardProps) {
  return (
    <article className="bg-black/30 border border-black rounded-xl p-6 hover:shadow-lg transition-all group relative">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <PortfolioCardBadge visibility={portfolio.visibility} />
        <PortfolioCardMenu portfolio={portfolio} />
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