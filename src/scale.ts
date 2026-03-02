import { useCallback, useEffect, useLayoutEffect, useRef, type RefObject } from "react";

const HOOK = "useAdaptiveScale";

// prettier-ignore
const ERROR_MESSAGES = {
  OBSERVE_BODY: `${HOOK}: ResizeObserver unavailable; scaling will not react to body resizes.`,
  APPLY_STYLES: `${HOOK}: Could not apply scale styles to target/wrapper elements.`,
  ATTACH_LISTENERS: `${HOOK}: Failed to attach 'orientationchange'/'pageshow' listeners; scaling may miss those events.`,
} as const;

/**
 * Ref to the container element that will receive the CSS transform.
 * Typically a div that wraps the content that must be scaled to fit the viewport.
 */
interface UseAdaptiveScaleProps {
  targetRef: RefObject<HTMLDivElement | null>;
  width?: number;
  height?: number;
}

/**
 * Applies a CSS `scale()` transform to the provided element so it fits inside the
 * current viewport while preserving aspect ratio.
 *
 * Behavior notes:
 * - The hook schedules an initial measurement on layout and re-schedules on
 * `resize`, `orientationchange` and `pageshow` events.
 * - All DOM writes are guarded with try/catch to avoid breaking the app when
 * running in restricted environments.
 *
 * @param targetRef - ref to the element to scale
 * @param width - element width to scale from
 * @param height - element height to scale from
 */
export function useAdaptiveScale({
  targetRef,
  width: w = 1920,
  height: h = 1080,
}: UseAdaptiveScaleProps): void {
  const rafId = useRef<number | null>(null);
  const vv = useRef<VisualViewport | null>(null);
  const lastAppliedRef = useRef<{ coef: number; scaledW: number; scaledH: number; } | null>(null);

  const measure = useCallback(() => {
    if (typeof window === "undefined") return null;

    const zoomScale = vv.current?.scale ?? 1;
    const vw = (vv.current?.width ?? window.innerWidth) * zoomScale;
    const vh = (vv.current?.height ?? window.innerHeight) * zoomScale;

    const coef = Math.min(vw / w, vh / h);
    return { coef, scaledW: Math.round(w * coef), scaledH: Math.round(h * coef) };
  }, [w, h]);

  const applyScale = useCallback(
    (
      target: HTMLElement,
      parent: HTMLElement,
      next: { coef: number; scaledW: number; scaledH: number; }
    ) => {
      const prev = lastAppliedRef.current;
      if (
        prev &&
        prev.coef === next.coef &&
        prev.scaledW === next.scaledW &&
        prev.scaledH === next.scaledH
      ) {
        return;
      }

      try {
        target.style.transform = `scale(${next.coef})`;
        target.style.transformOrigin = "top left";
        parent.style.width = `${next.scaledW}px`;
        parent.style.height = `${next.scaledH}px`;
        lastAppliedRef.current = next;
      } catch (e: unknown) {
        console.warn(
          ERROR_MESSAGES.APPLY_STYLES,
          { scale: next.coef, width: next.scaledW, height: next.scaledH },
          e
        );
      }
    },
    []
  );

  useLayoutEffect(() => {
    const target = targetRef.current;
    if (!target) return;
    const parent = target.parentElement;
    if (!parent) return;

    const measurements = measure();
    if (!measurements) return;
    applyScale(target, parent, measurements);
  }, [applyScale, measure, targetRef]);

  const update = useCallback(() => {
    const target = targetRef.current;
    if (!target) return;
    const parent = target.parentElement;
    if (!parent) return;

    if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      const measurements = measure();
      if (!measurements) return;
      applyScale(target, parent, measurements);
    });
  }, [targetRef, measure, applyScale]);

  useEffect(() => {
    if (typeof window !== "undefined" && "visualViewport" in window) {
      vv.current = window.visualViewport as VisualViewport;
    }

    update();

    const observer = new ResizeObserver(() => update());
    try {
      observer.observe(document.body);
    } catch (e: unknown) {
      console.warn(ERROR_MESSAGES.OBSERVE_BODY, e);
    }

    try {
      window.addEventListener("orientationchange", update);
      window.addEventListener("pageshow", update);
      window.addEventListener("resize", update);
      vv.current?.addEventListener("resize", update);
      vv.current?.addEventListener("scroll", update);
    } catch (e: unknown) {
      console.warn(ERROR_MESSAGES.ATTACH_LISTENERS, e);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener("orientationchange", update);
      window.removeEventListener("pageshow", update);
      window.removeEventListener("resize", update);
      vv.current?.removeEventListener("resize", update);
      vv.current?.removeEventListener("scroll", update);

      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, [update]);
}
