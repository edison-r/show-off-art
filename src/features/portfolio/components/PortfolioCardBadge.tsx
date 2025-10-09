type Visibility = 'draft' | 'unlisted' | 'public';

interface PortfolioCardBadgeProps {
    visibility: Visibility;
}

const VISIBILITY_CONFIG = {
    draft: { 
        text: 'Draft', 
        color: 'bg-neutral-100 text-neutral-600',
        icon: '🔒'
    },
    unlisted: { 
        text: 'Unlisted', 
        color: 'bg-yellow-100 text-yellow-700',
        icon: '🔗'
    },
    public: { 
        text: 'Public', 
        color: 'bg-green-100 text-green-700',
        icon: '🌐'
    }
} as const;

export function PortfolioCardBadge({ visibility }: PortfolioCardBadgeProps) {
    const config = VISIBILITY_CONFIG[visibility];
    
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium ${config.color}`}>
        <span>{config.icon}</span>
        {config.text}
        </span>
    );
}