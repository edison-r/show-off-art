import { PortfolioCard } from './PortfolioCard';
import type { Portfolio } from '@/features/portfolio/types/portfolio';

interface PortfolioListProps {
    portfolios: Portfolio[];
}

export function PortfolioList({ portfolios }: PortfolioListProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {portfolios.map((portfolio) => (
            <PortfolioCard 
            key={portfolio.id}
            portfolio={portfolio}
            />
        ))}
        </div>
    );
}