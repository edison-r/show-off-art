'use client';

interface PreviewHeroProps {
    title: string;
    about?: string;
    specialties?: string[];
    primaryColor: string;
}

export function PreviewHero({ 
    title, 
    about, 
    specialties, 
    primaryColor 
}: PreviewHeroProps) {
    return (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h1 className="font-titles text-4xl md:text-6xl font-bold mb-4">
            {title}
        </h1>
        
        {about && (
            <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto">
            {about}
            </p>
        )}

        {specialties && specialties.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mt-6">
            {specialties.map((specialty, index) => (
                <span 
                key={index}
                className="px-4 py-2 rounded-full text-sm font-medium"
                style={{ 
                    backgroundColor: `${primaryColor}20`,
                    color: primaryColor 
                }}
                >
                {specialty}
                </span>
            ))}
            </div>
        )}
        </section>
    );
}