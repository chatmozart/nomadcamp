import { useState, useEffect } from "react";
import PropertyCard from "@/components/PropertyCard";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import { supabase } from "@/lib/supabase";
import { groupPropertiesByLocation, LOCATION_CATEGORIES } from "@/utils/locationUtils";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [groupedProperties, setGroupedProperties] = useState<Record<string, any[]>>({});

  useEffect(() => {
    const fetchProperties = async () => {
      console.log('Fetching properties from Supabase...');
      try {
        const { data, error } = await supabase
          .from('properties')
          .select(`
            *,
            locations (
              name
            )
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching properties:', error);
          return;
        }

        console.log('Properties fetched successfully:', data);
        setProperties(data || []);
        
        // Group the properties by location
        const grouped = groupPropertiesByLocation(data || []);
        console.log('Grouped properties:', grouped);
        setGroupedProperties(grouped);
      } catch (error) {
        console.error('Unexpected error fetching properties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Get location names without country for display
  const locationNames = LOCATION_CATEGORIES.map(cat => cat.split(' - ')[0]);

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
        
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">All Locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {!isLoading && properties.map((property) => (
              <div
                key={property.id}
                id={`property-${property.id}`}
              >
                <PropertyCard 
                  id={property.id}
                  title={property.title}
                  location={property.location}
                  location_category={property.locations?.name}
                  price={property.price}
                  price_three_months={property.price_three_months}
                  price_six_months={property.price_six_months}
                  price_one_year={property.price_one_year}
                  image={property.image_url}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;