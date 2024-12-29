import { useState } from "react";
import { Search, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PropertyCard from "@/components/PropertyCard";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const properties = [
    {
      id: 1,
      title: "Luxury Villa with Ocean View",
      location: "Malibu, California",
      price: 550,
      rating: 4.9,
      reviews: 128,
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80",
    },
    {
      id: 2,
      title: "Modern Downtown Loft",
      location: "New York City, NY",
      price: 299,
      rating: 4.8,
      reviews: 96,
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80",
    },
    {
      id: 3,
      title: "Cozy Mountain Cabin",
      location: "Aspen, Colorado",
      price: 199,
      rating: 4.95,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[70vh] bg-gradient-to-r from-gray-900/90 to-gray-900/70 flex items-center justify-center">
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80"
            alt="Hero background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 fade-in">
            Welcome to NomadRent
          </h1>
          <p className="text-xl text-white/90 mb-8 fade-in">
            Find your perfect stay in digital nomad hotspots around the world
          </p>
          <SearchBar />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <CategoryFilter />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;