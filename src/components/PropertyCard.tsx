import { MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  price_three_months?: number | null;
  price_six_months?: number | null;
  price_one_year?: number | null;
}

const PropertyCard = ({
  id,
  title,
  location,
  price,
  rating,
  reviews,
  image,
  price_three_months,
  price_six_months,
  price_one_year,
}: PropertyCardProps) => {
  const [signedUrls, setSignedUrls] = useState<string[]>([]);

  useEffect(() => {
    const getSignedUrls = async () => {
      if (!image) {
        console.log('PropertyCard: No image provided for property:', id);
        return;
      }

      try {
        // If it's already a full URL, use it directly
        if (image.startsWith('http')) {
          console.log('PropertyCard: Using direct URL:', image);
          setSignedUrls([image]);
          return;
        }

        console.log('PropertyCard: Fetching signed URL for path:', image);
        const { data, error } = await supabase.storage
          .from('properties')
          .createSignedUrl(image, 86400); // 24 hours expiry

        if (error) {
          console.error('PropertyCard: Error getting signed URL:', error);
          return;
        }

        console.log('PropertyCard: Successfully got signed URL:', data.signedUrl);
        setSignedUrls([data.signedUrl]);
      } catch (error) {
        console.error('PropertyCard: Error in getSignedUrls:', error);
      }
    };

    getSignedUrls();
  }, [image, id]);

  const getCheapestPrice = () => {
    const monthlyPrices = [
      price,
      price_three_months,
      price_six_months,
      price_one_year,
    ].filter((p): p is number => p !== null);

    return Math.min(...monthlyPrices);
  };

  const cheapestPrice = getCheapestPrice();

  return (
    <Link to={`/property/${id}`} className="block">
      <div className="property-card rounded-xl overflow-hidden bg-card transition-transform hover:scale-[1.02]">
        <div className="relative aspect-[4/3]">
          <ImageWithFallback
            src={signedUrls[0] || null}
            alt={title}
            className="w-full h-full object-cover"
            containerClassName="w-full h-full"
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
            <span className="font-semibold text-lg">฿{cheapestPrice.toLocaleString()}</span>
            <span className="text-muted-foreground"> / month</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;