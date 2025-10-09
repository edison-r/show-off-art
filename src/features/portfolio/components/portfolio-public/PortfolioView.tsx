// src/components/portfolio/PortfolioView.tsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Download, Mail, Globe, Linkedin, Twitter } from 'lucide-react';

interface PortfolioViewProps {
  profile: {
    id: string;
    username: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  portfolio: {
    id: string;
    title: string;
    description: string | null;
    template_id: string;
    theme_config: any;
    portfolio_assets: Array<{
      id: string;
      asset_type: 'image' | 'video';
      url: string;
      caption: string | null;
      display_order: number;
    }>;
    cv_url: string | null;
  };
}

export default function PortfolioView({ profile, portfolio }: PortfolioViewProps) {
  // Ordenar assets por display_order
  const sortedAssets = [...portfolio.portfolio_assets].sort(
    (a, b) => a.display_order - b.display_order
  );

  // Separar imágenes y videos
  const images = sortedAssets.filter(a => a.asset_type === 'image');
  const videos = sortedAssets.filter(a => a.asset_type === 'video');

  // Theme config con defaults
  const theme = {
    primaryColor: portfolio.theme_config?.primaryColor || '#8b5cf6',
    backgroundColor: portfolio.theme_config?.backgroundColor || '#ffffff',
    textColor: portfolio.theme_config?.textColor || '#1f2937',
    ...portfolio.theme_config
  };

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: theme.backgroundColor,
        color: theme.textColor 
      }}
    >
      {/* Header/Hero Section */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-12 md:py-20"
      >
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Avatar */}
          {profile.avatar_url && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center"
            >
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name || profile.username}
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          )}

          {/* Name & Title */}
          <div className="space-y-3">
            <h1 className="text-4xl md:text-6xl font-bold">
              {profile.full_name || profile.username}
            </h1>
            <h2 
              className="text-2xl md:text-3xl font-semibold"
              style={{ color: theme.primaryColor }}
            >
              {portfolio.title}
            </h2>
          </div>

          {/* Description */}
          {portfolio.description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl max-w-2xl mx-auto opacity-80"
            >
              {portfolio.description}
            </motion.p>
          )}

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center pt-6"
          >
            {portfolio.cv_url && (
              <a
                href={portfolio.cv_url}
                download
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                style={{
                  backgroundColor: theme.primaryColor,
                  color: '#ffffff'
                }}
              >
                <Download className="w-5 h-5" />
                Descargar CV
              </a>
            )}
            
            <button
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full font-medium border border-white/20 hover:bg-white/20 transition-all duration-200"
            >
              <Mail className="w-5 h-5" />
              Contactar
            </button>
          </motion.div>
        </div>
      </motion.header>

      {/* Gallery - Bento Grid Style */}
      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <BentoGrid images={images} videos={videos} />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200/20 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-60">
            Creado con{' '}
            <a 
              href="https://show-off.art" 
              className="font-medium hover:underline"
              style={{ color: theme.primaryColor }}
            >
              Show-Off
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

// Componente Bento Grid
function BentoGrid({ 
  images, 
  videos 
}: { 
  images: any[]; 
  videos: any[]; 
}) {
  // Crear layout dinámico basado en cantidad de items
  const allItems = [...images, ...videos];
  
  if (allItems.length === 0) {
    return (
      <div className="text-center py-20 opacity-60">
        <p>No hay contenido para mostrar</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[200px]">
      {allItems.map((item, index) => {
        // Crear patrón de tamaños variados (estilo bento)
        const spanClass = getSpanClass(index, allItems.length);
        
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`${spanClass} relative group rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800`}
          >
            {item.asset_type === 'image' ? (
              <Image
                src={item.url}
                alt={item.caption || 'Portfolio image'}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <video
                src={item.url}
                className="w-full h-full object-cover"
                controls
                playsInline
              />
            )}
            
            {/* Caption overlay */}
            {item.caption && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white text-sm md:text-base">
                    {item.caption}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// Helper para crear layout bento variado
function getSpanClass(index: number, total: number): string {
  const patterns = [
    'md:col-span-2 md:row-span-2', // Grande
    'md:col-span-1 md:row-span-1', // Normal
    'md:col-span-1 md:row-span-2', // Alto
    'md:col-span-2 md:row-span-1', // Ancho
  ];
  
  // Crear patrón: cada 5 items, uno es grande
  if ((index + 1) % 5 === 0) {
    return patterns[0]; // Grande
  } else if (index % 3 === 0) {
    return patterns[2]; // Alto
  } else if (index % 4 === 0) {
    return patterns[3]; // Ancho
  }
  
  return patterns[1]; // Normal por defecto
}