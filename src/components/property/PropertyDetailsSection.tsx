import { PropertyAmenities } from "@/components/property/PropertyAmenities";
import { PropertyBookingCard } from "@/components/property/PropertyBookingCard";
import { PropertyMap } from "@/components/property/PropertyMap";

interface PropertyDetailsSectionProps {
  id: string;
  description: string;
  price: number | null;
  priceThreeMonths?: number | null;
  priceSixMonths?: number | null;
  priceOneYear?: number | null;
  location: string;
  availabilityStart?: string | null;
  availabilityEnd?: string | null;
  contactName?: string;
  contactEmail?: string;
  contactWhatsapp?: string;
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
  availabilityEnd,
  contactName,
  contactEmail,
  contactWhatsapp
}: PropertyDetailsSectionProps) => {
  const formattedLocation = location.split(',')[0].trim();

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
          contactName={contactName}
          contactEmail={contactEmail}
          contactWhatsapp={contactWhatsapp}
        />
      </div>

      <div className="col-span-3 -mx-4">
        <h3 className="text-xl font-semibold mb-4 px-4">Map</h3>
        <PropertyMap address={formattedLocation} />
      </div>
    </div>
  );
};