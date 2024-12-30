import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

interface PropertyGridItemProps {
  id: number;
  title: string;
  imageUrl?: string;
}

export const PropertyGridItem = ({ id, title, imageUrl }: PropertyGridItemProps) => {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  useEffect(() => {
    const getSignedUrl = async () => {
      if (imageUrl) {
        try {
          console.log('Getting signed URL for:', imageUrl);
          const { data, error } = await supabase.storage
            .from('properties')
            .createSignedUrl(imageUrl, 3600);

          if (error) {
            console.error('Error getting signed URL:', error);
            return;
          }

          console.log('Received signed URL:', data.signedUrl);
          setSignedUrl(data.signedUrl);
        } catch (error) {
          console.error('Error in getSignedUrl:', error);
        }
      }
    };

    getSignedUrl();
  }, [imageUrl]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Image failed to load, using placeholder');
    e.currentTarget.src = '/placeholder.svg';
  };

  return (
    <Link 
      to={`/property/${id}`}
      className="flex flex-col space-y-2"
    >
      <h3 className="font-medium text-sm truncate">{title}</h3>
      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
        {signedUrl ? (
          <img
            src={signedUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Home className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>
    </Link>
  );
};