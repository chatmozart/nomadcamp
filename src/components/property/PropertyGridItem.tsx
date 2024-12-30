import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { supabase } from "@/lib/supabase";

interface PropertyGridItemProps {
  id: number;
  title: string;
  imageUrl?: string;
}

export const PropertyGridItem = ({ id, title, imageUrl }: PropertyGridItemProps) => {
  const [firstImage, setFirstImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchFirstImage = async () => {
      console.log('PropertyGridItem - Fetching first image for property:', id);
      
      try {
        const { data: imagesData, error: imagesError } = await supabase
          .from('property_images')
          .select('image_url')
          .eq('property_id', id)
          .order('order', { ascending: true })
          .limit(1)
          .single();

        if (imagesError) {
          console.error('PropertyGridItem - Error fetching property image:', imagesError);
          return;
        }

        if (imagesData) {
          console.log('PropertyGridItem - Found first image:', imagesData.image_url);
          setFirstImage(imagesData.image_url);
        } else {
          console.log('PropertyGridItem - No images found, falling back to imageUrl:', imageUrl);
          setFirstImage(imageUrl || null);
        }
      } catch (error) {
        console.error('PropertyGridItem - Error in fetchFirstImage:', error);
      }
    };

    fetchFirstImage();
  }, [id, imageUrl]);

  return (
    <Link 
      to={`/property/${id}`}
      className="flex flex-col space-y-2"
    >
      <h3 className="font-medium text-sm truncate">{title}</h3>
      <div className="relative aspect-square rounded-lg overflow-hidden">
        <ImageWithFallback
          src={firstImage}
          alt={title}
          className="w-full h-full object-cover"
          containerClassName="w-full h-full"
        />
      </div>
    </Link>
  );
};