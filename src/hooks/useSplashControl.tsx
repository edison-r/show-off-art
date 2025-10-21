import { useState, useEffect } from 'react';

export function useSplashControl() {
  const [shouldShowSplash, setShouldShowSplash] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('has_visited') === 'true';
    
    const hasNavigatedInSession = sessionStorage.getItem('internal_nav') === 'true';

    let shouldShow = false;

    if (!hasVisitedBefore) {
      shouldShow = true;
      localStorage.setItem('has_visited', 'true');
    } else if (!hasNavigatedInSession) {
      shouldShow = true;
    }

    setShouldShowSplash(shouldShow);
    setIsChecking(false);
  }, []);

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