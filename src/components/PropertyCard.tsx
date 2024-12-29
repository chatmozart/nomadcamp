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
  console.log('Rendering PropertyCard with ID:', id);
  console.log('Raw image path:', image);
  
  // Construct the URL using the object/public endpoint
  const imageUrl = `https://mqgpycqviacxddgnwbxo.supabase.co/storage/v1/object/public/properties/${image}`;
  console.log('Constructed image URL:', imageUrl);

  // Function to validate image URL
  const validateImageUrl = async (url: string) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      console.log('Image validation response:', response.status);
      return response.ok;
    } catch (error) {
      console.error('Image validation error:', error);
      return false;
    }
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
            onError={async (e) => {
              console.error('Image failed to load:', {
                imageUrl,
                originalImage: image,
                error: e
              });
              
              // Try to validate the URL before falling back to placeholder
              const isValid = await validateImageUrl(imageUrl);
              console.log('Image URL validation result:', isValid);
              
              if (!isValid) {
                e.currentTarget.src = '/placeholder.svg';
              }
            }}
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