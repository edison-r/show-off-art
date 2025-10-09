interface ErrorMessageProps {
    title?: string;
    message?: string;
}

export function ErrorMessage({ 
    title = 'Error', 
    message = 'Something went wrong' 
}: ErrorMessageProps) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
            <h1 className="font-titles text-4xl font-bold mb-4">{title}</h1>
            <p className="text-neutral-600">{message}</p>
        </div>
        </div>
    );
}