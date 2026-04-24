import { useState, useLayoutEffect, useCallback, type RefObject } from 'react';

export function usePagination(
  measureRef: RefObject<HTMLDivElement | null>,
  paperSize: 'letter' | 'a4',
  triggerDep: any
) {
  const [pageSplits, setPageSplits] = useState<number[]>([]);
  const [isMeasuring, setIsMeasuring] = useState(true);

  const measure = useCallback(() => {
    if (!measureRef.current) return;
    
    // Paper dimensions in pixels (assuming 96dpi, 1in = 96px)
    // Letter: 8.5 x 11 in -> 816 x 1056 px
    // A4: 210 x 297 mm -> 794 x 1123 px
    const pageHeightPx = paperSize === 'letter' ? 1056 : 1123;
    
    // We want physical margins inside the page (e.g., 1 inch top/bottom = 96px * 2 = 192px reserved)
    // Let's say usable height is pageHeight - (paddingTop + paddingBottom)
    // Actually, our elements are already padded? No, the container will have padding.
    // Let's assume the page div will have py-10 (40px top, 40px bottom = 80px)
    const marginY = 80; 
    const usableHeight = pageHeightPx - marginY;

    const blocks = Array.from(measureRef.current.querySelectorAll('[data-page-block="true"]'));
    
    if (blocks.length === 0) return;

    let currentHeight = 0;
    const splits: number[] = []; // Indices of blocks where a new page starts

    blocks.forEach((block, index) => {
      const el = block as HTMLElement;
      // Get height including margins roughly
      const style = window.getComputedStyle(el);
      const marginTop = parseFloat(style.marginTop) || 0;
      const marginBottom = parseFloat(style.marginBottom) || 0;
      const blockHeight = el.offsetHeight + marginTop + marginBottom;

      if (currentHeight + blockHeight > usableHeight && index > 0) {
        // Break before this block
        splits.push(index);
        currentHeight = blockHeight; // Reset for new page
      } else {
        currentHeight += blockHeight;
      }
    });

    setPageSplits(splits);
    setIsMeasuring(false);
  }, [paperSize]);

  useLayoutEffect(() => {
    setIsMeasuring(true);
    // Give react a tick to render the measuring layer
    const timer = setTimeout(measure, 50);
    return () => clearTimeout(timer);
  }, [triggerDep, measure]);

  return { isMeasuring, pageSplits };
}
