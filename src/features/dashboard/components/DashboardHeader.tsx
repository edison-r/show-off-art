import { CreatePortfolioButton } from './createPortfolioButton'

interface DashboardHeaderProps {
    portfolioCount: number;
}

export function DashboardHeader({ portfolioCount }: DashboardHeaderProps) {
    const isAtLimit = portfolioCount >= 3;
    
    return (
        <section className="px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 py-12 md:py-20 border-b border-neutral-200">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
            <h1 className="font-titles font-extrabold text-[10vw] sm:text-[8vw] md:text-[6vw] leading-[0.8] mb-4">
                MY PORTFOLIOS
            </h1>
            <p className="font-mono text-sm text-neutral-600">
                {portfolioCount} of 3 portfolios created
            </p>
            </div>
            
            <CreatePortfolioButton disabled={isAtLimit} />
        </div>
        </section>
    );
}