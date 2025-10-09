'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { 
    deletePortfolio, 
    publishPortfolio, 
    unpublishPortfolio 
} from '@/features/portfolio/actions/portfolios';


export function usePortfolioActions(portfolioId: string) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    
    const handleDelete = () => {
        if (!confirm('Are you sure you want to delete this portfolio? This action cannot be undone.')) {
        return;
        }
        
        startTransition(async () => {
        const response = await deletePortfolio(portfolioId);
        if (response.success) {
            router.refresh();
        } else {
            alert(response.error);
        }
        });
    };
    
    const handlePublish = () => {
        startTransition(async () => {
        const response = await publishPortfolio(portfolioId);
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
        const response = await unpublishPortfolio(portfolioId);
        if (response.success) {
            router.refresh();
        } else {
            alert(response.error);
        }
        });
    };
    
    return {
        handleDelete,
        handlePublish,
        handleUnpublish,
        isPending
    };
}