import { CreatePortfolioButton } from '@/features/dashboard/components/CreatePortfolioButton';

export function EmptyPortfolios() {
    return (
        <div className="text-center py-20 max-w-2xl mx-auto">
        <h2 className="font-titles text-3xl md:text-4xl font-bold mb-4">
            No portfolios yet
        </h2>
        <p className="text-lg text-neutral-600 mb-8">
            Create your first portfolio to start showcasing your work
        </p>
        <CreatePortfolioButton variant="large" />
        </div>
    );
}