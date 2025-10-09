import { getUserPortfolios } from '@/features/portfolio/actions/portfolios';
import { DashboardHeader } from '@/features/dashboard/components/DashboardHeader';
import { PortfolioList } from '@/features/portfolio/components/PortfolioList';
import { EmptyPortfolios } from '@/features/portfolio/components/EmptyPortfolios';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import HeaderServer from '@/components/layout/HeaderServer';

export default async function DashboardPage() {
  const response = await getUserPortfolios();
  
  if (!response.success) {
    return (
      <>
        <HeaderServer />
        <main className="min-h-screen bg-[var(--blue-gray)] text-black">
          <ErrorMessage 
            title="Error"
            message={response.error}
          />
        </main>
      </>
    );
  }
  
  const portfolios = response.data || [];
  
  return (
    <>
      <main className="min-h-screen bg-[var(--blue-gray)] text-black">
      <HeaderServer />
        <DashboardHeader portfolioCount={portfolios.length} />
        
        <section className="px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 py-12 md:py-16">
          {portfolios.length === 0 ? (
            <EmptyPortfolios />
          ) : (
            <PortfolioList portfolios={portfolios} />
          )}
        </section>
      </main>
    </>
  );
}