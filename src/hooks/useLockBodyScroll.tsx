import { useLayoutEffect } from "react";

/**
 * Counter global para manejar múltiples locks simultáneos
 * Ej: Splash + Modal al mismo tiempo
 */
let activeLocks = 0;

/**
 * Hook para bloquear el scroll del body
 * 
 * CÓMO FUNCIONA:
 * 1. Guarda el overflow y padding original
 * 2. Aplica overflow: hidden
 * 3. Compensa el espacio del scrollbar con padding-right
 * 4. Al desmontar, restaura valores solo si no hay otros locks activos
 * 
 * @param locked - Si debe bloquear el scroll (default: true)
 */
export function useLockBodyScroll(locked: boolean = true) {
  useLayoutEffect(() => {
    if (!locked) return;

    // Incrementar contador de locks activos
    activeLocks++;

    const body = document.body;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Guardar valores originales
    const originalOverflow = body.style.overflow;
    const originalPaddingRight = body.style.paddingRight;

    // Aplicar bloqueo
    body.style.overflow = "hidden";

    // Compensar scrollbar si existe
    if (scrollbarWidth > 0) {
      const currentPadding = parseFloat(getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
    }

    // Cleanup: Restaurar valores solo si es el último lock
    return () => {
      activeLocks = Math.max(0, activeLocks - 1);

      if (activeLocks === 0) {
        body.style.overflow = originalOverflow;
        body.style.paddingRight = originalPaddingRight;
      }
    };
  }, [locked]);
}