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
    <Link to={`/property/${id}`} className="block h-full">
      <div className="property-card rounded-xl overflow-hidden bg-card h-full flex flex-col">
        <div className="relative aspect-[16/9]">
          <ImageWithFallback
            src={displayImageUrl}
            alt={title}
            className="w-full h-full object-cover"
            containerClassName="w-full h-full"
          />
        </div>
        <div className="p-3 flex flex-col flex-1">
          <div className="flex-1">
            <h3 className="font-semibold text-base line-clamp-2 min-h-[2.5rem]">{title}</h3>
            <div className="flex items-center text-muted-foreground mt-0.5">
              <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
              <span className="text-sm truncate">{location_category || location.split(',')[0].trim()}</span>
            </div>
          </div>
          <div className="mt-2">
            {cheapestPrice ? (
              <>
                <span className="font-semibold text-base">฿{cheapestPrice.toLocaleString()}</span>
                <span className="text-muted-foreground text-sm"> / month</span>
              </>
            ) : (
              <span className="text-muted-foreground text-sm">Contact for pricing</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;