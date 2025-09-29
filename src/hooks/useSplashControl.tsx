import { useState, useEffect } from 'react';

export function useSplashControl() {
  const [shouldShowSplash, setShouldShowSplash] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const hasInternalNav = sessionStorage.getItem('internal_navigation_happened');
    const isFirstTimeEver = !localStorage.getItem('site_visited_before');
    
    const isReloadSession = sessionStorage.getItem('is_reload_session');

    let shouldShow = false;

    if (isFirstTimeEver) {
      shouldShow = true;
      localStorage.setItem('site_visited_before', 'true');
    } else if (isReloadSession && !hasInternalNav) {
      shouldShow = true;
    } else if (!hasInternalNav && !isReloadSession) {
      shouldShow = true;
      sessionStorage.setItem('is_reload_session', 'true');
    } else {
      shouldShow = false;
    }

    setShouldShowSplash(shouldShow);
    setIsChecking(false);
  }, []);

  const markSplashAsSeen = () => {
    sessionStorage.setItem('internal_navigation_happened', 'true');
    setShouldShowSplash(false);
  };

  return {
    shouldShowSplash,
    isChecking,
    markSplashAsSeen
  };
}