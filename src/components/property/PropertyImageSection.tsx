import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

interface PropertyImageSectionProps {
  imageUrl: string | null;
  title: string;
}

export const PropertyImageSection = ({ imageUrl, title }: PropertyImageSectionProps) => {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  useEffect(() => {
    const getSignedUrl = async () => {
      if (!imageUrl) return;
      
      try {
        console.log('Getting signed URL for:', imageUrl);
        const { data, error } = await supabase.storage
          .from('properties')
          .createSignedUrl(imageUrl, 60 * 60);

        if (error) {
          console.error('Error getting signed URL:', error);
          return;
        }

        console.log('Got signed URL:', data.signedUrl);
        setSignedUrl(data.signedUrl);
      } catch (error) {
        console.error('Error in getSignedUrl:', error);
      }
    };

    getSignedUrl();
  }, [imageUrl]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Image failed to load, using placeholder');
    e.currentTarget.src = '/placeholder.svg';
  };

  return (
    <div className="px-4">
      <Card className="overflow-hidden">
        <img 
          src={signedUrl || '/placeholder.svg'}
          alt={title} 
          className="w-full h-[600px] object-cover"
          onError={handleImageError}
        />
      </Card>
    </div>
  );
};