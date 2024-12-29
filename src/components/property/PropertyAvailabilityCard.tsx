import { Card } from "@/components/ui/card";
import { format } from "date-fns";

interface PropertyAvailabilityCardProps {
  availabilityStart?: string | null;
  availabilityEnd?: string | null;
}

export const PropertyAvailabilityCard = ({ 
  availabilityStart,
  availabilityEnd,
}: PropertyAvailabilityCardProps) => {
  console.log('Rendering PropertyAvailabilityCard with dates:', { availabilityStart, availabilityEnd });
  
  if (!availabilityStart) {
    return null;
  }

  const formattedStart = format(new Date(availabilityStart), 'd MMM yyyy');
  const formattedEnd = availabilityEnd 
    ? format(new Date(availabilityEnd), 'd MMM yyyy')
    : 'ongoing';

  return (
    <Card className="p-6 mt-6">
      <h3 className="text-lg font-semibold mb-4">Availability</h3>
      <div className="flex items-center justify-between">
        <span className="text-gray-600">Period</span>
        <span className="font-medium">{formattedStart} - {formattedEnd}</span>
      </div>
    </Card>
  );
};