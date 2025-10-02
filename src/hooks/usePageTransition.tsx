import { useCallback } from 'react';

type WipeOptions = {
  duration?: number; 
  delay?: number; 
  color?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  easing?: string;
};

export function usePageTransition() {
    const triggerWipe = useCallback((
        callback: () => void, 
        options: WipeOptions = {}
    ) => {
        const {
        duration = 1400,
        delay = 0,
        color = 'black',
        direction = 'down',
        easing = 'cubic-bezier(0.22, 1, 0.36, 1)'
        } = options;

        const getCurtainTransforms = () => {
        switch (direction) {
            case 'up': 
            return { 
                initial: 'translateY(100vh)', 
                cover: 'translateY(0)', 
                exit: 'translateY(-100vh)',
                origin: 'bottom'
            };
            case 'left':
            return { 
                initial: 'translateX(100vw)', 
                cover: 'translateX(0)', 
                exit: 'translateX(-100vw)',
                origin: 'right'
            };
            case 'right':
            return { 
                initial: 'translateX(-100vw)', 
                cover: 'translateX(0)', 
                exit: 'translateX(100vw)',
                origin: 'left'
            };
            default:
            return { 
                initial: 'translateY(-100vh)', 
                cover: 'translateY(0)', 
                exit: 'translateY(100vh)',
                origin: 'top'
            };
        }
        };

        const { initial, cover, exit, origin } = getCurtainTransforms();
        
        const curtain = document.createElement('div');
        curtain.style.cssText = `
        position: fixed;
        inset: 0;
        background: ${color};
        z-index: 9999;
        transform: ${initial};
        transition: transform ${duration}ms ${easing};
        pointer-events: none;
        transform-origin: ${origin};
        `;

        const overlay = document.createElement('div');
        overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.05));
        z-index: 9998;
        opacity: 0;
        transition: opacity ${duration * 0.3}ms ease;
        pointer-events: none;
        `;
        
        document.body.appendChild(overlay);
        document.body.appendChild(curtain);
        
        setTimeout(() => {
            overlay.style.opacity = '1';
            
            setTimeout(() => {
                curtain.style.transform = cover;
            }, 150);
            
            setTimeout(() => {
                overlay.style.opacity = '0';
                callback();
            }, duration * 0.5);
            
            setTimeout(() => {
                curtain.style.transform = exit;
            }, duration * 0.65);
            
            setTimeout(() => {
                if (document.body.contains(curtain)) {
                document.body.removeChild(curtain);
                }
                if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
                }
            }, duration + 200);
        }, delay);
    }, []);

    return { triggerWipe };
}
