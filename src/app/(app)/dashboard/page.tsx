import { redirect } from 'next/navigation';
import { getSupabaseServer } from '@/lib/supabase/supabaseServer';
import { getUserPortfolios } from '@/lib/helpers/portfolio-data';
import { DashboardHeader } from '@/features/dashboard/components/DashboardHeader';
import { PortfolioList } from '@/features/portfolio/components/portfolio-list/PortfolioList';
import { EmptyPortfolios } from '@/features/portfolio/components/portfolio-list/EmptyPortfolios';
import HeaderServer from '@/components/layout/HeaderServer';

export default async function DashboardPage() {
  // 1. Verificar autenticación
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  // 2. Obtener portfolios del usuario
  const portfolios = await getUserPortfolios(user.id);

  // 3. Renderizar
  return (
    <>
      <HeaderServer />
      <main className="min-h-screen bg-[var(--blue-gray)] text-black">
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