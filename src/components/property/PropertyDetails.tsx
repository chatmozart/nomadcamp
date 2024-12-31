import { MapPin } from "lucide-react";
import { format } from "date-fns";

interface PropertyDetailsProps {
  title: string;
  location: string;
  locationCategory?: string;
  price: number;
  priceThreeMonths?: number | null;
  priceSixMonths?: number | null;
  priceOneYear?: number | null;
  availabilityStart?: string | null;
  availabilityEnd?: string | null;
}

export const PropertyDetails = ({
  title,
  location,
  locationCategory,
  price,
  priceThreeMonths,
  priceSixMonths,
  priceOneYear,
  availabilityStart,
  availabilityEnd,
}: PropertyDetailsProps) => {
  const getCheapestPrice = () => {
    const monthlyPrices = [
      price,
      priceThreeMonths,
      priceSixMonths,
      priceOneYear,
    ].filter((p): p is number => p !== null);

    return monthlyPrices.length > 0 ? Math.min(...monthlyPrices) : null;
  };

  const formatAvailability = () => {
    if (!availabilityStart) return null;
    
    const startDate = format(new Date(availabilityStart), 'd MMM yyyy');
    const endDate = availabilityEnd 
      ? format(new Date(availabilityEnd), 'd MMM yyyy')
      : 'ongoing';
      
    return `Available: ${startDate} - ${endDate}`;
  };

  const cheapestPrice = getCheapestPrice();

  return (
    <div className="p-2 flex flex-col flex-1">
      <div className="flex-1">
        <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.2rem]">{title}</h3>
        <div className="flex items-center text-muted-foreground mt-0.5">
          <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="text-xs truncate">{locationCategory || location.split(',')[0].trim()}</span>
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
        {availabilityStart && (
          <div className="text-xs text-muted-foreground">
            {formatAvailability()}
          </div>
        )}
      </div>
    </div>
  );
};