import { notFound } from 'next/navigation';
import { getPublicPortfolio } from '@/lib/helpers/portfolio-data';
import { PortfolioPreview } from '@/features/portfolio/components/portfolio-preview/PortfolioPreview';

interface PublicPortfolioPageProps {
  params: {
    username: string;
    portfolioSlug: string;
  };
}

export default async function PublicPortfolioPage({ 
  params 
}: PublicPortfolioPageProps) {
  const data = await getPublicPortfolio(params.username, params.portfolioSlug);

  if (!data) {
    notFound();
  }

  return (
    <PortfolioPreview 
      portfolio={data.portfolio}
      projects={data.projects}
      isPublic={true}
    />
  );
}
