import { useLayoutEffect } from "react";

let lockCount = 0;

export function useLockBodyScroll(locked: boolean = true) {
  useLayoutEffect(() => {
    if (!locked) return;

    lockCount++;

    const docEl = document.documentElement;
    const body = document.body;

    const scrollbarWidth = window.innerWidth - docEl.clientWidth;

    const originalOverflow = body.style.overflow;
    const originalPaddingRight = body.style.paddingRight;

    body.style.overflow = "hidden";

    if (scrollbarWidth > 0) {
      const currentPR = parseFloat(getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${currentPR + scrollbarWidth}px`;
    }

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        body.style.overflow = originalOverflow;
        body.style.paddingRight = originalPaddingRight;
      }
    };
  }, [locked]);
}
