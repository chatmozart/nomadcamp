import { useState, useEffect } from "react";
import { Home } from "lucide-react";
import { supabase } from "@/lib/supabase";
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
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getSignedUrl = async () => {
      if (!src) {
        console.log('ImageWithFallback - No source provided');
        setError(true);
        return;
      }

      // If the URL is already a full URL (e.g., from the carousel), use it directly
      if (src.startsWith('http')) {
        console.log('ImageWithFallback - Using direct URL:', src);
        setSignedUrl(src);
        setError(false);
        return;
      }

      try {
        console.log('ImageWithFallback - Getting signed URL for:', src);
        const { data, error } = await supabase.storage
          .from('properties')
          .createSignedUrl(src, 60 * 60); // 1 hour

        if (error) {
          console.error('ImageWithFallback - Error getting signed URL:', error);
          setError(true);
          return;
        }

        console.log('ImageWithFallback - Received signed URL:', data.signedUrl);
        setSignedUrl(data.signedUrl);
        setError(false);
      } catch (error) {
        console.error('ImageWithFallback - Error in getSignedUrl:', error);
        setError(true);
      }
    };

    // Reset states when src changes
    setError(false);
    setSignedUrl(null);
    
    getSignedUrl();
  }, [src]);

  const handleError = () => {
    console.error('ImageWithFallback - Image failed to load:', { src, signedUrl });
    setError(true);
  };

  if (error || !signedUrl) {
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
      src={signedUrl}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
};