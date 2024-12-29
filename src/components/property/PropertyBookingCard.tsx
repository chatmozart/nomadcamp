import { Card } from "@/components/ui/card";

interface PropertyBookingCardProps {
  price: number;
  priceThreeMonths?: number;
  priceSixMonths?: number;
  priceOneYear?: number;
}

export const PropertyBookingCard = ({ 
  price,
  priceThreeMonths,
  priceSixMonths,
  priceOneYear,
}: PropertyBookingCardProps) => {
  console.log('Rendering PropertyBookingCard with prices:', { price, priceThreeMonths, priceSixMonths, priceOneYear });
  
  return (
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
  );
};