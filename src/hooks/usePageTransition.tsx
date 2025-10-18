import { useCallback, useRef } from 'react';

type WipeDirection = 'up' | 'down' | 'left' | 'right';

type WipeOptions = {
    duration?: number;
    delay?: number;
    color?: string;
    direction?: WipeDirection;
    easing?: string;
};

const DEFAULT_OPTIONS: Required<WipeOptions> = {
    duration: 1400,
    delay: 0,
    color: 'black',
    direction: 'down',
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)', // easeOutQuart
};

/**
 * Configuración de transformaciones para cada dirección
 */
const CURTAIN_TRANSFORMS: Record<WipeDirection, {
    initial: string;
    cover: string;
    exit: string;
    origin: string;
}> = {
    up: {
        initial: 'translateY(100vh)',
        cover: 'translateY(0)',
        exit: 'translateY(-100vh)',
        origin: 'bottom',
    },
    down: {
        initial: 'translateY(-100vh)',
        cover: 'translateY(0)',
        exit: 'translateY(100vh)',
        origin: 'top',
    },
    left: {
        initial: 'translateX(100vw)',
        cover: 'translateX(0)',
        exit: 'translateX(-100vw)',
        origin: 'right',
    },
    right: {
        initial: 'translateX(-100vw)',
        cover: 'translateX(0)',
        exit: 'translateX(100vw)',
        origin: 'left',
    },
};

/**
 * Hook para crear transiciones de página con efecto cortina
 * 
 * FASES:
 * 1. Cortina entra (initial → cover)
 * 2. Callback se ejecuta (router.push)
 * 3. Cortina sale (cover → exit)
 * 4. Cleanup del DOM
 */
export function usePageTransition() {
    const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

    const triggerWipe = useCallback((
        callback: () => void,
        options: WipeOptions = {}
    ) => {
        const config = { ...DEFAULT_OPTIONS, ...options };
        const { initial, cover, exit, origin } = CURTAIN_TRANSFORMS[config.direction];

        // Crear cortina
        const curtain = document.createElement('div');
        curtain.style.cssText = `
        position: fixed;
        inset: 0;
        background: ${config.color};
        z-index: 9999;
        transform: ${initial};
        transition: transform ${config.duration}ms ${config.easing};
        pointer-events: none;
        transform-origin: ${origin};
        `;

        // Overlay sutil (opcional)
        const overlay = document.createElement('div');
        overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.05));
        z-index: 9998;
        opacity: 0;
        transition: opacity ${config.duration * 0.3}ms ease;
        pointer-events: none;
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(curtain);

        // FASE 1: Iniciar animación después del delay
        const t1 = setTimeout(() => {
        overlay.style.opacity = '1';

        // FASE 2: Cortina cubre pantalla
        const t2 = setTimeout(() => {
            curtain.style.transform = cover;
        }, 150);
        timeoutsRef.current.push(t2);

        // FASE 3: Ejecutar callback (cambiar ruta)
        const t3 = setTimeout(() => {
            overlay.style.opacity = '0';
            callback();
        }, config.duration * 0.5);
        timeoutsRef.current.push(t3);

        // FASE 4: Cortina sale
        const t4 = setTimeout(() => {
            curtain.style.transform = exit;
        }, config.duration * 0.65);
        timeoutsRef.current.push(t4);

        // FASE 5: Cleanup del DOM
        const t5 = setTimeout(() => {
            curtain.remove();
            overlay.remove();
        }, config.duration + 200);
        timeoutsRef.current.push(t5);

        }, config.delay);
        timeoutsRef.current.push(t1);

    }, []);

    // Cleanup de timeouts al desmontar
    const cleanup = useCallback(() => {
        timeoutsRef.current.forEach(clearTimeout);
        timeoutsRef.current = [];
    }, []);

    return { triggerWipe, cleanup };
}