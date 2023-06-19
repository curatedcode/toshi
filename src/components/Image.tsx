/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import type { ImageProps } from "~/customTypes";

function Image({ className = "", ...props }: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (ref.current?.complete) {
      setIsLoading(false);
    }
  }, [isLoading]);
  return (
    <>
      <img
        {...props}
        ref={ref}
        onLoad={() => setIsLoading(false)}
        onError={(el) => (el.currentTarget.src = "/image-fallback.png")}
        className={`${isLoading ? "w-0 max-w-0" : ""} ${className}`}
      />
      <div className={isLoading ? "relative" : "hidden"}>
        <img {...props} className={className} src="/product-placeholder.png" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-toshi-primary border-r-transparent align-[-0.125em]" />
        </div>
      </div>
    </>
  );
}

export default Image;
