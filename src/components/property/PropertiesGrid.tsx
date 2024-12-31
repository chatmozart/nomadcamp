import PropertyCard from "@/components/PropertyCard";
import { Property } from "@/types/property";

interface PropertiesGridProps {
  properties: Property[];
}

const PropertiesGrid = ({ properties }: PropertiesGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          id={property.id}
          title={property.title}
          location={property.location}
          location_category={property.locations?.name}
          price={property.price}
          image={property.image_url}
          price_three_months={property.price_three_months}
          price_six_months={property.price_six_months}
          price_one_year={property.price_one_year}
          availability_start={property.availability_start}
          availability_end={property.availability_end}
          owner_id={property.owner_id}
          published={property.published}
        />
      ))}
    </div>
  );
};

export default PropertiesGrid;