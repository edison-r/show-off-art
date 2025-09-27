import { useState, useEffect } from 'react';

export function useSplashControl() {
  const [shouldShowSplash, setShouldShowSplash] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkSplashCondition = () => {
      // 1. Verificar múltiples indicadores de navegación interna
      const hasNavigated = sessionStorage.getItem('hasNavigated');
      const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
      const internalNavFlag = sessionStorage.getItem('internal_nav');
      
      // Si cualquier indicador sugiere navegación interna
      if (hasNavigated || hasSeenSplash || internalNavFlag) {
        console.log('🔴 Indicadores de navegación interna encontrados');
        console.log('- hasNavigated:', hasNavigated);
        console.log('- hasSeenSplash:', hasSeenSplash);
        console.log('- internalNavFlag:', internalNavFlag);
        return false; // NO mostrar splash
      }

      // 2. Verificar si es refresh o primera visita
      try {
        const perfEntries = performance.getEntriesByType('navigation');
        const navEntry = perfEntries[0] as PerformanceNavigationTiming;
        const isReload = navEntry && navEntry.type === 'reload';
        
        console.log('🔍 Tipo de navegación:', navEntry?.type || 'desconocido');
        
        // Mostrar splash en reload o primera visita
        return isReload || (!hasNavigated && !hasSeenSplash);
        
      } catch (error) {
        console.warn('⚠️ Error detectando tipo de navegación:', error);
        // Fallback: solo mostrar si no hay indicadores de navegación previa
        return !hasNavigated && !hasSeenSplash;
      }
    };

    const shouldShow = checkSplashCondition();
    console.log(shouldShow ? '🟢 MOSTRAR splash' : '🔴 NO mostrar splash');
    
    setShouldShowSplash(shouldShow);
    setIsChecking(false);
  }, []);

  const markSplashAsSeen = () => {
    console.log('✅ Splash completado - Seteando flags');
    
    // Setear múltiples indicadores para mayor seguridad
    sessionStorage.setItem('hasNavigated', 'true');
    sessionStorage.setItem('hasSeenSplash', 'true');
    sessionStorage.setItem('internal_nav', 'true');
    
    setShouldShowSplash(false);
  };

  // Función para debugging
  const debugSplashState = () => {
    console.log('🐛 DEBUG Splash State:');
    console.log('- shouldShowSplash:', shouldShowSplash);
    console.log('- isChecking:', isChecking);
    console.log('- hasNavigated:', sessionStorage.getItem('hasNavigated'));
    console.log('- hasSeenSplash:', sessionStorage.getItem('hasSeenSplash'));
    console.log('- internal_nav:', sessionStorage.getItem('internal_nav'));
  };

  return {
    shouldShowSplash,
    isChecking,
    markSplashAsSeen,
    debugSplashState // Para debugging
  };
}