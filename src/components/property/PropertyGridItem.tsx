import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { supabase } from "@/lib/supabase";

interface PropertyGridItemProps {
  id: number;
  title: string;
  imageUrl?: string;
}

export const PropertyGridItem = ({ id, title, imageUrl }: PropertyGridItemProps) => {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  useEffect(() => {
    const getSignedUrl = async () => {
      if (!imageUrl) return;

      try {
        console.log('PropertyGridItem: Fetching signed URL for:', imageUrl);
        const { data, error } = await supabase.storage
          .from('properties')
          .createSignedUrl(imageUrl, 60 * 60);

        if (error) {
          console.error('PropertyGridItem: Error getting signed URL:', error);
          return;
        }

        console.log('PropertyGridItem: Received signed URL:', data.signedUrl);
        setSignedUrl(data.signedUrl);
      } catch (error) {
        console.error('PropertyGridItem: Error in getSignedUrl:', error);
      }
    };

    getSignedUrl();
  }, [imageUrl]);

  return (
    <Link 
      to={`/property/${id}`}
      className="flex flex-col space-y-2"
    >
      <h3 className="font-medium text-sm truncate">{title}</h3>
      <div className="relative aspect-square rounded-lg overflow-hidden">
        <ImageWithFallback
          src={signedUrl}
          alt={title}
          className="w-full h-full object-cover"
          containerClassName="w-full h-full"
        />
      </div>
    </Link>
  );
};