import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, MapPin } from "lucide-react";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState({
    id: 1,
    title: "Luxury Villa with Ocean View",
    location: "Malibu, California",
    price: 2200,
    rating: 4.9,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80",
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="px-4 py-6">
          <h1 className="text-3xl font-bold">{property.title}</h1>
          <div className="flex items-center mt-2">
            <MapPin className="mr-2" />
            <span>{property.location}</span>
          </div>
          <div className="flex items-center mt-2">
            <Star className="mr-2" />
            <span>{property.rating} ({property.reviews} reviews)</span>
          </div>
          <div className="mt-4">
            <Button>Add to Favorites</Button>
          </div>
        </div>
        <div className="h-[600px] w-full">
          <Card>
            <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-bold">Price: ${property.price}/night</h2>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;