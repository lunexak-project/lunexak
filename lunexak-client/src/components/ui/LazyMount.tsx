"use client";

import {
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

type LazyMountProps = {
  children: ReactNode;
  className?: string;
  minHeight?: number;
  rootMargin?: string;
};

export default function LazyMount({
  children,
  className,
  minHeight = 320,
  rootMargin = "300px",
}: LazyMountProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shouldRender, setShouldRender] =
    useState(false);

  useEffect(() => {
    if (shouldRender) {
      return;
    }

    const element = ref.current;

    if (!element) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setTimeout(() => {
        setShouldRender(true);
      }, 0);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin, shouldRender]);

  return (
    <div
      ref={ref}
      className={className}
      style={
        shouldRender
          ? undefined
          : { minHeight }
      }
    >
      {shouldRender ? children : null}
    </div>
  );
}
