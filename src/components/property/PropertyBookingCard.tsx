import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PropertyBookingCardProps {
  price: number;
  rating?: number;
  reviews?: number;
}

export const PropertyBookingCard = ({ price, rating = 4.5, reviews = 0 }: PropertyBookingCardProps) => {
  return (
    <Card className="p-6 sticky top-24">
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-bold">${price}</div>
        <div className="flex items-center">
          <Star className="w-4 h-4 mr-1" />
          <span>{rating}</span>
          <span className="mx-1">•</span>
          <span className="text-gray-600">{reviews} reviews</span>
        </div>
      </div>
      <button className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors">
        Reserve
      </button>
    </Card>
  );
};