import { usePageTransition } from './usePageTransition';
import { useRouter } from 'next/navigation';

export function useNavigationHelper() {
    const { triggerWipe } = usePageTransition();
    const router = useRouter();

    const navigateWithTransition = (
        path: string, 
        options?: { 
        direction?: 'up' | 'down' | 'left' | 'right';
        color?: string;
        duration?: number;
        }
    ) => {
        sessionStorage.setItem('hasNavigated', 'true');
        
        triggerWipe(() => {
        router.push(path);
        }, {
        duration: 1500,
        ...options
        });
    };

    return { navigateWithTransition };
}