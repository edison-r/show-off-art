'use client';

interface PreviewFooterProps {
    primaryColor: string;
}

export function PreviewFooter({ primaryColor }: PreviewFooterProps) {
    return (
        <footer className="border-t border-neutral-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm text-neutral-500">
            Creado con{' '}
            <a 
                href="https://show-off.art" 
                className="font-medium hover:underline"
                style={{ color: primaryColor }}
            >
                Show-Off
            </a>
            </p>
        </div>
        </footer>
    );
}