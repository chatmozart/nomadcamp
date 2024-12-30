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
  image: string | null;
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
  const [mainImageUrl, setMainImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const getImages = async () => {
      try {
        // First try to get the main image if it exists
        if (image) {
          console.log('PropertyCard: Fetching main image:', image);
          if (image.startsWith('http')) {
            setMainImageUrl(image);
          } else {
            const { data: mainImageData, error: mainImageError } = await supabase.storage
              .from('properties')
              .createSignedUrl(image, 2592000);
            
            if (!mainImageError && mainImageData) {
              setMainImageUrl(mainImageData.signedUrl);
            }
          }
        }

        // Then fetch additional images from property_images table
        console.log('PropertyCard: Fetching additional images for property:', id);
        const { data: propertyImages, error: propertyImagesError } = await supabase
          .from('property_images')
          .select('image_url')
          .eq('property_id', id)
          .order('order', { ascending: true })
          .limit(1);

        if (propertyImagesError) {
          console.error('PropertyCard: Error fetching property images:', propertyImagesError);
          return;
        }

        if (propertyImages && propertyImages.length > 0) {
          console.log('PropertyCard: Found additional images:', propertyImages);
          const firstAdditionalImage = propertyImages[0].image_url;
          
          if (firstAdditionalImage.startsWith('http')) {
            setSignedUrls([firstAdditionalImage]);
          } else {
            const { data: signedUrlData, error: signedUrlError } = await supabase.storage
              .from('properties')
              .createSignedUrl(firstAdditionalImage, 2592000);
            
            if (!signedUrlError && signedUrlData) {
              setSignedUrls([signedUrlData.signedUrl]);
            }
          }
        }
      } catch (error) {
        console.error('PropertyCard: Error in getImages:', error);
      }
    };

    getImages();
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
  const displayImageUrl = mainImageUrl || signedUrls[0] || null;

  return (
    <Link to={`/property/${id}`} className="block">
      <div className="property-card rounded-xl overflow-hidden bg-card transition-transform hover:scale-[1.02]">
        <div className="relative aspect-[4/3]">
          <ImageWithFallback
            src={displayImageUrl}
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