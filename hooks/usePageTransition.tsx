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
            default: // 'down'
            return { 
                initial: 'translateY(-100vh)', 
                cover: 'translateY(0)', 
                exit: 'translateY(100vh)',
                origin: 'top'
            };
        }
        };

        const { initial, cover, exit, origin } = getCurtainTransforms();
        
        // cortina principal
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

        // overlay para suavizar la transición
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
        // Fase 1: Mostrar overlay sutil
        overlay.style.opacity = '1';
        
        // Fase 2: Cerrar cortina (después de un pequeño delay)
        setTimeout(() => {
            curtain.style.transform = cover;
        }, 100);
        
        // Fase 3: Cambiar página cuando la cortina está completamente cerrada
        setTimeout(() => {
            overlay.style.opacity = '0';
            callback();
        }, duration * 0.5);
        
        // Fase 4: Abrir cortina para revelar nueva página
        setTimeout(() => {
            curtain.style.transform = exit;
        }, duration * 0.65);
        
        // Fase 5: Limpiar elementos
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
