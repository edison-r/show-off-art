'use client';

import { useState } from 'react';
import { usePortfolioActions } from '@/features/portfolio/hooks/usePortfolioActions';
import type { Portfolio } from '@/features/portfolio/types/portfolio';

interface PortfolioCardMenuProps {
    portfolio: Portfolio;
}

export function PortfolioCardMenu({ portfolio }: PortfolioCardMenuProps) {
    const [showMenu, setShowMenu] = useState(false);
    const { handleDelete, handlePublish, handleUnpublish, isPending } = usePortfolioActions(portfolio.id);
    
    const isDraft = portfolio.visibility === 'draft';
    
    return (
        <div className="relative">
        <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            aria-label="Portfolio actions"
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
        </button>
        
        {showMenu && (
            <div className="absolute right-0 top-10 bg-white border border-neutral-200 rounded-lg shadow-xl z-10 py-1 min-w-[150px]">
            {isDraft ? (
                <>
                <button
                    onClick={() => {
                    handlePublish();
                    setShowMenu(false);
                    }}
                    disabled={isPending}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 disabled:opacity-50"
                >
                    Publish
                </button>
                <button
                    onClick={() => {
                    handleDelete();
                    setShowMenu(false);
                    }}
                    disabled={isPending}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                    Delete
                </button>
                </>
            ) : (
                <button
                onClick={() => {
                    handleUnpublish();
                    setShowMenu(false);
                }}
                disabled={isPending}
                className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 disabled:opacity-50"
                >
                Unpublish
                </button>
            )}
            </div>
        )}
        </div>
    );
}