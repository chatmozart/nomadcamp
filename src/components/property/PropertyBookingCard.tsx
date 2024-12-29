import { Card } from "@/components/ui/card";
import { PropertyAvailabilityCard } from "./PropertyAvailabilityCard";

interface PropertyBookingCardProps {
  price: number;
  priceThreeMonths?: number;
  priceSixMonths?: number;
  priceOneYear?: number;
  availabilityStart?: string | null;
  availabilityEnd?: string | null;
}

export const PropertyBookingCard = ({ 
  price,
  priceThreeMonths,
  priceSixMonths,
  priceOneYear,
  availabilityStart,
  availabilityEnd,
}: PropertyBookingCardProps) => {
  console.log('Rendering PropertyBookingCard with prices and dates:', { 
    price, 
    priceThreeMonths, 
    priceSixMonths, 
    priceOneYear,
    availabilityStart,
    availabilityEnd 
  });
  
  return (
    <div className="space-y-6">
      <Card className="p-6 sticky top-24 min-h-fit flex flex-col justify-between gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>1 month</span>
            <span className="text-2xl font-bold">{price.toLocaleString()}฿</span>
          </div>
          {priceThreeMonths && (
            <div className="flex justify-between items-center">
              <span>3 months</span>
              <span className="text-2xl font-bold">{priceThreeMonths.toLocaleString()}฿</span>
            </div>
          )}
          {priceSixMonths && (
            <div className="flex justify-between items-center">
              <span>6 months</span>
              <span className="text-2xl font-bold">{priceSixMonths.toLocaleString()}฿</span>
            </div>
          )}
          {priceOneYear && (
            <div className="flex justify-between items-center">
              <span>12 months</span>
              <span className="text-2xl font-bold">{priceOneYear.toLocaleString()}฿</span>
            </div>
          )}
        </div>
        <button className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors">
          Reserve
        </button>
      </Card>
      <PropertyAvailabilityCard 
        availabilityStart={availabilityStart}
        availabilityEnd={availabilityEnd}
      />
    </div>
  );
};