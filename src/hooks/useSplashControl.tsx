import { useState, useEffect } from 'react';

/**
 * Hook para controlar la visibilidad del Splash Screen
 * 
 * REGLAS:
 * 1. Primera visita EVER → Mostrar splash
 * 2. Nueva sesión del navegador → Mostrar splash
 * 3. Navegación interna (clic en link) → NO mostrar splash
 * 
 * STORAGE:
 * - localStorage.has_visited → Marca si visitó el sitio alguna vez
 * - sessionStorage.internal_nav → Marca si navegó internamente en esta sesión
 */
export function useSplashControl() {
  const [shouldShowSplash, setShouldShowSplash] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 1. Verificar si es primera visita EVER
    const hasVisitedBefore = localStorage.getItem('has_visited') === 'true';
    
    // 2. Verificar si ya navegó internamente en esta sesión
    const hasNavigatedInSession = sessionStorage.getItem('internal_nav') === 'true';

    let shouldShow = false;

    if (!hasVisitedBefore) {
      // ✅ CASO 1: Primera vez NUNCA → Mostrar splash
      shouldShow = true;
      localStorage.setItem('has_visited', 'true');
    } else if (!hasNavigatedInSession) {
      // ✅ CASO 2: Nueva sesión (recarga o nueva pestaña) → Mostrar splash
      shouldShow = true;
    }

    setShouldShowSplash(shouldShow);
    setIsChecking(false);
  }, []);

  /**
   * Marcar que el usuario ya vio el splash en esta sesión
   * Se llama al terminar la animación del splash
   */
  const markSplashAsSeen = () => {
    sessionStorage.setItem('internal_nav', 'true');
    setShouldShowSplash(false);
  };

  return {
    shouldShowSplash,
    isChecking,
    markSplashAsSeen
  };
}