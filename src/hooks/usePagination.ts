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

    const pageHeightPx = paperSize === 'letter' ? 1056 : 1123;

    const marginY = 80;
    const usableHeight = pageHeightPx - marginY;

    const blocks = Array.from(measureRef.current.querySelectorAll('[data-page-block="true"]'));

    if (blocks.length === 0) return;

    let currentHeight = 0;
    const splits: number[] = [];

    blocks.forEach((block, index) => {
      const el = block as HTMLElement;
      const style = window.getComputedStyle(el);
      const marginTop = parseFloat(style.marginTop) || 0;
      const marginBottom = parseFloat(style.marginBottom) || 0;
      const blockHeight = el.offsetHeight + marginTop + marginBottom;

      if (currentHeight + blockHeight > usableHeight && index > 0) {
        splits.push(index);
        currentHeight = blockHeight;
      } else {
        currentHeight += blockHeight;
      }
    });

    setPageSplits(splits);
    setIsMeasuring(false);
  }, [paperSize]);

  useLayoutEffect(() => {
    setIsMeasuring(true);
    const timer = setTimeout(measure, 50);
    return () => clearTimeout(timer);
  }, [triggerDep, measure]);

  return { isMeasuring, pageSplits };
}
