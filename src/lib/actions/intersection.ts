import type { NavSectionId } from '$lib/types';

interface RevealParams {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  className?: string;
}

export function reveal(node: HTMLElement, params: RevealParams = {}) {
  let observer: IntersectionObserver | null = null;

  const setup = (next: RevealParams) => {
    observer?.disconnect();

    const {
      threshold = 0.15,
      rootMargin = '0px',
      once = true,
      className = 'visible'
    } = next;

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          node.classList.add(className);

          if (once) {
            observer?.unobserve(node);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
  };

  setup(params);

  return {
    update(next: RevealParams) {
      setup(next);
    },
    destroy() {
      observer?.disconnect();
    }
  };
}

interface TrackSectionParams {
  id: NavSectionId;
  onChange: (section: NavSectionId) => void;
  rootMargin?: string;
  threshold?: number;
}

export function trackSection(node: HTMLElement, params: TrackSectionParams) {
  let observer: IntersectionObserver | null = null;

  const setup = (next: TrackSectionParams) => {
    observer?.disconnect();

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            next.onChange(next.id);
          }
        });
      },
      {
        rootMargin: next.rootMargin || '-40% 0px -55% 0px',
        threshold: next.threshold ?? 0
      }
    );

    observer.observe(node);
  };

  setup(params);

  return {
    update(next: TrackSectionParams) {
      setup(next);
    },
    destroy() {
      observer?.disconnect();
    }
  };
}
