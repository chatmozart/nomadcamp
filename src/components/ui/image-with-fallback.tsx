import { useState } from "react";
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

  if (!src || error) {
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
      src={src}
      alt={alt}
      className={className}
      onError={() => {
        console.error('ImageWithFallback - Image failed to load:', src);
        setError(true);
      }}
    />
  );
};