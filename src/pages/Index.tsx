import { useState, useEffect } from "react";
import { Search, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PropertyCard from "@/components/PropertyCard";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      console.log('Fetching properties from Supabase...');
      const { data, error } = await supabase
        .from('properties')
        .select('*');

      if (error) {
        console.error('Error fetching properties:', error);
        return;
      }

      console.log('Properties fetched successfully:', data);
      setProperties(data || []);
      setIsLoading(false);
    };

    fetchProperties();
  }, []);

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
            For digital nomads looking to rent for minimum 1 month
          </p>
          <SearchBar />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <CategoryFilter />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {isLoading ? (
            <p>Loading properties...</p>
          ) : properties.length === 0 ? (
            <p>No properties found.</p>
          ) : (
            properties.map((property) => {
              console.log('Property image URL:', property.image_url);
              return (
                <PropertyCard 
                  key={property.id}
                  id={property.id}
                  title={property.title}
                  location={property.location}
                  price={property.price}
                  rating={4.5}
                  reviews={0}
                  image={property.image_url}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;