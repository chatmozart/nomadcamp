import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

interface ImageCarouselProps {
  images: string[];
  title: string;
}

export const ImageCarousel = ({ images, title }: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [signedUrls, setSignedUrls] = useState<string[]>([]);

  useEffect(() => {
    const getSignedUrls = async () => {
      const validImages = images.filter(img => img !== null && img !== undefined);
      
      if (validImages.length === 0) {
        console.log('No valid images to process');
        return;
      }

      const urls = await Promise.all(
        validImages.map(async (imageUrl) => {
          try {
            console.log('Fetching signed URL for:', imageUrl);
            const { data, error } = await supabase.storage
              .from('properties')
              .createSignedUrl(imageUrl, 86400); // 24 hours expiry

            if (error) {
              console.error('Error getting signed URL:', error);
              return null;
            }

            console.log('Received signed URL:', data.signedUrl);
            return data.signedUrl;
          } catch (error) {
            console.error('Error in getSignedUrl:', error);
            return null;
          }
        })
      );

      setSignedUrls(urls.filter((url): url is string => url !== null));
    };

    getSignedUrls();
  }, [images]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? signedUrls.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === signedUrls.length - 1 ? 0 : prev + 1));
  };

  if (!signedUrls.length) {
    return (
      <ImageWithFallback
        src={null}
        alt={title}
        className="w-full h-[600px] object-cover"
      />
    );
  }

  return (
    <div className="relative">
      <ImageWithFallback
        src={signedUrls[currentIndex]}
        alt={`${title} - Image ${currentIndex + 1}`}
        className="w-full h-[600px] object-cover"
      />
      
      {signedUrls.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={handleNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {signedUrls.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex ? "bg-white" : "bg-white/50"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};