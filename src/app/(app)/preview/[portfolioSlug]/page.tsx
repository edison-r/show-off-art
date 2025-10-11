import { notFound, redirect } from 'next/navigation';
import { getSupabaseServer } from '@/lib/supabase/supabaseServer';
import { getPortfolioWithProjects } from '@/lib/helpers/portfolio-data';
import { PortfolioPreview } from '@/features/portfolio/components/portfolio-preview/PortfolioPreview';

interface PreviewPortfolioPageProps {
  params: {
    portfolioSlug: string;
  };
}

export default async function PreviewPortfolioPage({ 
  params 
}: PreviewPortfolioPageProps) {
  // 1. Verificar autenticación
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  // 2. Obtener datos del portfolio
  const data = await getPortfolioWithProjects(params.portfolioSlug, user.id);

  // 3. Si no existe, mostrar 404
  if (!data) {
    notFound();
  }

  // 4. Renderizar
  return (
    <main className="min-h-screen">
      <PortfolioPreview 
        portfolio={data.portfolio}
        projects={data.projects}
      />
    </main>
  );
}