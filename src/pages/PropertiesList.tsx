import { useParams } from "react-router-dom";
import PropertyCard from "@/components/PropertyCard";

const PropertiesList = () => {
  const { location } = useParams();
  
  console.log("Current location:", location);

  // Sample properties data - in a real app this would come from an API
  const properties = [
    {
      id: "1",
      title: "Beachfront Villa with Private Pool",
      location: location || "",
      price: 1800,
      rating: 4.9,
      reviews: 124,
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80",
    },
    {
      id: "2",
      title: "Tropical Garden Bungalow",
      location: location || "",
      price: 1200,
      rating: 4.8,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80",
    },
    {
      id: "3",
      title: "Modern Ocean View Apartment",
      location: location || "",
      price: 1500,
      rating: 4.95,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&q=80",
    },
    {
      id: "4",
      title: "Luxury Mountain Retreat",
      location: location || "",
      price: 2200,
      rating: 4.87,
      reviews: 92,
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80",
    },
    {
      id: "5",
      title: "Peaceful Hillside Villa",
      location: location || "",
      price: 1900,
      rating: 4.92,
      reviews: 113,
      image: "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?auto=format&fit=crop&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 sm:py-12">
        <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-8 fade-in px-2">
          Properties in {location?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {properties.map((property) => (
            <div key={property.id} className="px-2 sm:px-0">
              <PropertyCard {...property} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertiesList;