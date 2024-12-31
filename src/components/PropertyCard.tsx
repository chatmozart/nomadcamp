import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PropertyImage } from "./property/PropertyImage";
import { PropertyDetails } from "./property/PropertyDetails";

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
  const { user } = useAuth();
  const isOwner = user?.id === owner_id;

  return (
    <Link to={`/property/${id}`} className="block h-full">
      <div className="property-card rounded-xl overflow-hidden bg-card h-full flex flex-col">
        <PropertyImage
          id={id}
          title={title}
          image={image}
          isOwner={isOwner}
          published={published}
        />
        <PropertyDetails
          title={title}
          location={location}
          locationCategory={location_category}
          price={price}
          priceThreeMonths={price_three_months}
          priceSixMonths={price_six_months}
          priceOneYear={price_one_year}
          availabilityStart={availability_start}
          availabilityEnd={availability_end}
        />
      </div>
    </Link>
  );
};

export default PropertyCard;