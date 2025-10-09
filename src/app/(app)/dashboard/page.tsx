import { getFromSupabase } from '@/lib/database/db';
import { getSupabaseServer } from '@/lib/supabase/supabaseServer';
import { DashboardHeader } from '@/features/dashboard/components/DashboardHeader';
import { PortfolioList } from '@/features/portfolio/components/PortfolioList';
import { EmptyPortfolios } from '@/features/portfolio/components/EmptyPortfolios';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import HeaderServer from '@/components/layout/HeaderServer';
import type { Portfolio } from '@/features/portfolio/types/portfolio';

export default async function DashboardPage() {
  // 1. AUTENTICACIÓN
  // Obtener el usuario autenticado
  const supabase = await getSupabaseServer();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  // Si no está autenticado, mostrar error
  if (authError || !user) {
    return (
      <>
        <HeaderServer />
        <main className="min-h-screen bg-[var(--blue-gray)] text-black">
          <ErrorMessage 
            title="Authentication Error"
            message="You must be logged in to view this page"
          />
        </main>
      </>
    );
  }
  
  // 2. OBTENER PORTFOLIOS
  // Usar función genérica para obtener portfolios del usuario
  const response = await getFromSupabase<Portfolio[]>('portfolios', {
    owner_id: user.id  // Filtrar por usuario actual
  }, {
    orderBy: { 
      column: 'created_at', 
      ascending: false  // Más recientes primero
    }
  });
  
  // 3. MANEJAR ERRORES
  if (!response.success) {
    return (
      <>
        <HeaderServer />
        <main className="min-h-screen bg-[var(--blue-gray)] text-black">
          <ErrorMessage 
            title="Error"
            message={response.error || 'Failed to load portfolios'}
          />
        </main>
      </>
    );
  }
  
  // 4. RENDERIZAR
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