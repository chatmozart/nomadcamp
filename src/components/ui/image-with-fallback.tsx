import { useState, useEffect } from "react";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageWithFallbackProps {
  src: string | null;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export const ImageWithFallback = ({
  src,
  alt,
  className,
  containerClassName,
}: ImageWithFallbackProps) => {
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!src) {
      console.log('ImageWithFallback - No source provided');
      setError(true);
      return;
    }

    console.log('ImageWithFallback - Setting up image with src:', src);
    setImageSrc(src);
    setError(false);
  }, [src]);

  if (!imageSrc || error) {
    return (
      <div className={cn(
        "bg-gray-100 flex items-center justify-center",
        containerClassName
      )}>
        <Home className="w-12 h-12 text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={() => {
        console.error('ImageWithFallback - Image failed to load:', imageSrc);
        setError(true);
      }}
    />
  );
};