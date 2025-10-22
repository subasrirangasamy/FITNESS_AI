import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for reveal-on-scroll animations
 * 
 * @param threshold - Percentage of element visibility to trigger (0-1)
 * @param rootMargin - Margin around root (e.g., "0px 0px -100px 0px")
 * @returns ref to attach to element and isVisible state
 * 
 * @example
 * const { ref, isVisible } = useRevealOnScroll();
 * <div ref={ref} className={`reveal-on-scroll ${isVisible ? 'visible' : ''}`}>
 *   Content here
 * </div>
 */
export function useRevealOnScroll(threshold = 0.1, rootMargin = '0px') {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Once visible, stop observing (animation happens once)
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin]);

  return { ref, isVisible };
}
