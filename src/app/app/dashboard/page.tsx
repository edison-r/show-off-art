import { getUserPortfolios } from '@app/app/actions/portfolios';
import { CreatePortfolioButton } from "@app/components/dashboard/createPortfolioButton";
import { PortfolioCard } from '@app/components/dashboard/PortfolioCard';
import { redirect } from 'next/navigation';
import { getSupabaseServer } from '@/lib/supabase/supabaseServer';

import HeaderServer from '@/app/components/layout/HeaderServer';


export default async function DashboardPage() {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }
  
  const response = await getUserPortfolios();
  
  if (!response.success) {
    return (
      <>
        <HeaderServer />
        <main className="min-h-screen bg-[var(--blue-gray)] text-black">
          <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
              <h1 className="font-titles text-4xl font-bold mb-4">Error</h1>
              <p className="text-neutral-600">{response.error}</p>
            </div>
          </div>
        </main>
      </>
    );
  }
  
  const portfolios = response.data || [];
  
  return (
    <>
      <main className="min-h-screen bg-[var(--blue-gray)] text-black">
        <HeaderServer />
        
        <section className="px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 py-12 md:py-20 border-b border-neutral-200">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="font-titles font-extrabold text-[10vw] sm:text-[8vw] md:text-[6vw] leading-[0.8] mb-4">
                MY PORTFOLIOS
              </h1>
              <p className="font-mono text-sm text-neutral-600">
                {portfolios.length} of 3 portfolios created
              </p>
            </div>
            
            <CreatePortfolioButton 
              disabled={portfolios.length >= 6}
            />
          </div>
        </section>
        
        <section className="px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 py-12 md:py-16">
          {portfolios.length === 0 ? (
            <div className="text-center py-20 max-w-2xl mx-auto">
              <h2 className="font-titles text-3xl md:text-4xl font-bold mb-4">
                No portfolios yet
              </h2>
              <p className="text-lg text-neutral-600 mb-8">
                Create your first portfolio to start showcasing your work
              </p>
              <CreatePortfolioButton variant="large" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {portfolios.map((portfolio) => (
                <PortfolioCard 
                  key={portfolio.id}
                  portfolio={portfolio}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}