import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { useSupabaseImage } from "@/hooks/useSupabaseImage";

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  location_category?: string;
  price: number;
  image: string | null;
  price_three_months?: number | null;
  price_six_months?: number | null;
  price_one_year?: number | null;
}

const PropertyCard = ({
  id,
  title,
  location,
  location_category,
  price,
  image,
  price_three_months,
  price_six_months,
  price_one_year,
}: PropertyCardProps) => {
  const { displayImageUrl } = useSupabaseImage(id, image);

  const getCheapestPrice = () => {
    const monthlyPrices = [
      price,
      price_three_months,
      price_six_months,
      price_one_year,
    ].filter((p): p is number => p !== null);

    return monthlyPrices.length > 0 ? Math.min(...monthlyPrices) : null;
  };

  const cheapestPrice = getCheapestPrice();

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
                <span className="text-sm">{location_category || location.split(',')[0].trim()}</span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            {cheapestPrice ? (
              <>
                <span className="font-semibold text-lg">฿{cheapestPrice.toLocaleString()}</span>
                <span className="text-muted-foreground"> / month</span>
              </>
            ) : (
              <span className="text-muted-foreground">Contact for pricing</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;