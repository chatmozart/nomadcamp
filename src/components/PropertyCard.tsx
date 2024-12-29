import { MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

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
  console.log('PropertyCard - Starting render for ID:', id);
  console.log('PropertyCard - Raw image path:', image);

  // Get the public URL for the image using Supabase storage
  const { data } = supabase.storage
    .from('properties')
    .getPublicUrl(image);

  const imageUrl = data?.publicUrl;
  console.log('PropertyCard - Generated Supabase URL:', imageUrl);

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
            src={imageUrl}
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