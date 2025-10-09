import { notFound, redirect } from 'next/navigation';
import { getSupabaseServer } from '@/lib/supabase/supabaseServer';
import { getPortfolioWithProjects } from '@/lib/helpers/portfolio-data';
import HeaderServer from '@/components/layout/HeaderServer';
import { PortfolioEditor } from '@/features/portfolio/components/portfolio-editor/PortfolioEditor';

interface DashboardPortfolioPageProps {
  params: {
    portfolioSlug: string;
  };
}

export default async function DashboardPortfolioPage({ 
    params 
}: DashboardPortfolioPageProps) {
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
        <>
        <HeaderServer />
        <main className="min-h-screen bg-[var(--blue-gray)]">
            <PortfolioEditor 
            portfolio={data.portfolio}
            projects={data.projects}
            />
        </main>
        </>
    );
}