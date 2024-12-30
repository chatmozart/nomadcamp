import { MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
}

const PropertyCard = ({
  id,
  title,
  location,
  price,
  rating,
  reviews,
  image,
}: PropertyCardProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  useEffect(() => {
    const loadImageUrl = async () => {
      console.log('PropertyCard - Starting to load image URL for ID:', id);
      
      try {
        // Always try to get the first image from property_images table first
        const { data: imageData, error: imageError } = await supabase
          .from('property_images')
          .select('image_url')
          .eq('property_id', id)
          .order('order', { ascending: true })
          .limit(1)
          .single();

        if (!imageError && imageData?.image_url) {
          console.log('PropertyCard - Found image in property_images:', imageData.image_url);
          const { data: signedUrlData, error: signedUrlError } = await supabase.storage
            .from('properties')
            .createSignedUrl(imageData.image_url, 60 * 60);

          if (!signedUrlError && signedUrlData) {
            console.log('PropertyCard - Generated signed URL from property_images:', signedUrlData.signedUrl);
            setImageUrl(signedUrlData.signedUrl);
            return;
          }
        }

        // Fallback to the direct image path if no property_images or error occurred
        if (image) {
          console.log('PropertyCard - Falling back to direct image path:', image);
          const { data: directSignedUrlData, error: directSignedUrlError } = await supabase.storage
            .from('properties')
            .createSignedUrl(image, 60 * 60);

          if (!directSignedUrlError && directSignedUrlData) {
            console.log('PropertyCard - Generated signed URL from direct path:', directSignedUrlData.signedUrl);
            setImageUrl(directSignedUrlData.signedUrl);
            return;
          }
        }

        console.log('PropertyCard - No valid image found, using placeholder');
        setImageUrl(null);
      } catch (error) {
        console.error('PropertyCard - Failed to load image:', error);
        setImageUrl(null);
      }
    };

    loadImageUrl();
  }, [id, image]);

  // Function to handle image load error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('PropertyCard - Image failed to load:', {
      id,
      imageUrl,
      originalImage: image,
      error: e
    });
    e.currentTarget.src = '/placeholder.svg';
  };

  // Function to handle successful image load
  const handleImageLoad = () => {
    console.log('PropertyCard - Image loaded successfully:', {
      id,
      imageUrl
    });
  };

  return (
    <Link to={`/property/${id}`} className="block">
      <div className="property-card rounded-xl overflow-hidden bg-card transition-transform hover:scale-[1.02]">
        <div className="relative aspect-[4/3]">
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg">{title}</h3>
              <div className="flex items-center text-muted-foreground mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{location}</span>
              </div>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-primary fill-current" />
              <span className="ml-1 font-medium">{rating}</span>
              <span className="text-muted-foreground text-sm ml-1">({reviews})</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="font-semibold text-lg">${price}</span>
            <span className="text-muted-foreground"> / month</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;