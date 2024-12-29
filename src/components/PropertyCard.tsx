import { MapPin, Star } from "lucide-react";

interface PropertyCardProps {
  title: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
}

const PropertyCard = ({
  title,
  location,
  price,
  rating,
  reviews,
  image,
}: PropertyCardProps) => {
  return (
    <div className="property-card rounded-xl overflow-hidden bg-card">
      <div className="relative aspect-[4/3]">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-lg">{title}</h3>
            <div className="flex items-center text-muted-foreground mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{location}</span>
            </div>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-primary fill-current" />
            <span className="ml-1 font-medium">{rating}</span>
            <span className="text-muted-foreground text-sm ml-1">({reviews})</span>
          </div>
        </div>
        <div className="mt-4">
          <span className="font-semibold text-lg">${price}</span>
          <span className="text-muted-foreground"> / night</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;