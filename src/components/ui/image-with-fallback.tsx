import { useState, useEffect } from "react";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

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
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getImage = async () => {
      if (!src) {
        console.log('ImageWithFallback: No source provided');
        setError(true);
        return;
      }

      // If it's already a full URL (signed or external), use it directly
      if (src.startsWith('http')) {
        console.log('ImageWithFallback: Using direct URL:', src);
        setImageUrl(src);
        return;
      }

      try {
        // Clean the path - remove any leading slashes or 'properties/' prefix
        const cleanPath = src.replace(/^\/*(properties\/)*/, '');
        console.log('ImageWithFallback: Fetching image with clean path:', cleanPath);

        const { data, error: signedUrlError } = await supabase.storage
          .from('properties')
          .createSignedUrl(cleanPath, 2592000); // 30 days expiry

        if (signedUrlError) {
          console.error('ImageWithFallback: Error getting signed URL:', signedUrlError);
          setError(true);
          return;
        }

        console.log('ImageWithFallback: Successfully got signed URL:', data.signedUrl);
        setImageUrl(data.signedUrl);
      } catch (error) {
        console.error('ImageWithFallback: Error processing image:', error);
        setError(true);
      }
    };

    setError(false); // Reset error state when src changes
    getImage();
  }, [src]);

  if (!imageUrl || error) {
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
      src={imageUrl}
      alt={alt}
      className={className}
      onError={() => {
        console.error('ImageWithFallback: Image failed to load:', imageUrl);
        setError(true);
      }}
    />
  );
};