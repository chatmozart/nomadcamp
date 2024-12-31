import { MapPin, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { useSupabaseImage } from "@/hooks/useSupabaseImage";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

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
  availability_start?: string | null;
  availability_end?: string | null;
  owner_id?: string;
  published?: boolean;
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
  availability_start,
  availability_end,
  owner_id,
  published = true,
}: PropertyCardProps) => {
  const { displayImageUrl } = useSupabaseImage(id, image);
  const { user } = useAuth();

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

  const formatAvailability = () => {
    if (!availability_start) return null;
    
    const startDate = format(new Date(availability_start), 'd MMM yyyy');
    const endDate = availability_end 
      ? format(new Date(availability_end), 'd MMM yyyy')
      : 'ongoing';
      
    return `Available: ${startDate} - ${endDate}`;
  };

  const isOwner = user?.id === owner_id;

  return (
    <Link to={`/property/${id}`} className="block h-full">
      <div className="property-card rounded-xl overflow-hidden bg-card h-full flex flex-col">
        <div className="relative w-full pb-[66.67%]">
          <div className="absolute inset-0">
            <ImageWithFallback
              src={displayImageUrl}
              alt={title}
              className="w-full h-full object-cover"
              containerClassName="w-full h-full"
            />
          </div>
          {user && isOwner && (
            <div className="absolute top-2 right-2">
              <Badge 
                variant={published ? "default" : "destructive"}
                className="flex items-center gap-1"
              >
                {published ? (
                  <>
                    <Check className="w-3 h-3" />
                    Published
                  </>
                ) : (
                  <>
                    <X className="w-3 h-3" />
                    Unpublished
                  </>
                )}
              </Badge>
            </div>
          )}
        </div>
        <div className="p-2 flex flex-col flex-1">
          <div className="flex-1">
            <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.2rem]">{title}</h3>
            <div className="flex items-center text-muted-foreground mt-0.5">
              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="text-xs truncate">{location_category || location.split(',')[0].trim()}</span>
            </div>
          </div>
          <div className="mt-1 space-y-1">
            <div>
              {cheapestPrice ? (
                <>
                  <span className="font-semibold text-sm">฿{cheapestPrice.toLocaleString()}</span>
                  <span className="text-muted-foreground text-xs"> / month</span>
                </>
              ) : (
                <span className="text-muted-foreground text-xs">Contact for pricing</span>
              )}
            </div>
            {availability_start && (
              <div className="text-xs text-muted-foreground">
                {formatAvailability()}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;