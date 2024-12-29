import { PropertyAmenities } from "@/components/property/PropertyAmenities";
import { PropertyBookingCard } from "@/components/property/PropertyBookingCard";
import { PropertyMap } from "@/components/property/PropertyMap";

interface PropertyDetailsSectionProps {
  id: string;
  description: string;
  price: number;
  priceThreeMonths?: number;
  priceSixMonths?: number;
  priceOneYear?: number;
  location: string;
  availabilityStart?: string | null;
  availabilityEnd?: string | null;
}

export const PropertyDetailsSection = ({ 
  id,
  description, 
  price,
  priceThreeMonths,
  priceSixMonths,
  priceOneYear,
  location,
  availabilityStart,
  availabilityEnd
}: PropertyDetailsSectionProps) => {
  console.log('PropertyDetailsSection rendering with data:', {
    price,
    priceThreeMonths,
    priceSixMonths,
    priceOneYear,
    availabilityStart,
    availabilityEnd
  });

  return (
    <div className="grid grid-cols-3 gap-12 px-4 py-8">
      <div className="col-span-2">
        <div className="border-b pb-6">
          <h2 className="text-2xl font-semibold mb-4">Property Details</h2>
        </div>

        <div className="py-6 border-b">
          <p className="text-gray-600">{description}</p>
        </div>

        <PropertyAmenities propertyId={id} />
      </div>

      <div className="col-span-1">
        <PropertyBookingCard 
          price={price}
          priceThreeMonths={priceThreeMonths}
          priceSixMonths={priceSixMonths}
          priceOneYear={priceOneYear}
          availabilityStart={availabilityStart}
          availabilityEnd={availabilityEnd}
        />
      </div>

      <div className="col-span-3 -mx-4">
        <h3 className="text-xl font-semibold mb-4 px-4">Map</h3>
        <PropertyMap address={location} />
      </div>
    </div>
  );
};