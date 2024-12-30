import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PropertyCard from "@/components/PropertyCard";
import { supabase } from "@/lib/supabase";
import { getPropertyCategory } from "@/utils/locationUtils";

const PropertiesList = () => {
  const { location } = useParams();
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  console.log("Current location param:", location);

  useEffect(() => {
    const fetchProperties = async () => {
      console.log('Fetching properties for location:', location);
      let query = supabase.from('properties').select('*');
      
      if (location) {
        // Convert URL-friendly format back to display format and handle special cases
        let searchLocation;
        if (location === 'ko-pha-ngan') {
          searchLocation = 'Koh Phangan';
        } else {
          searchLocation = location.split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        }
        
        console.log('Searching for location:', searchLocation);
        query = query.ilike('location', `%${searchLocation}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching properties:', error);
        return;
      }

      console.log('Properties fetched successfully:', data);
      setProperties(data || []);
      setIsLoading(false);
    };

    fetchProperties();
  }, [location]);

  // Get the display location for the title
  const getDisplayLocation = (urlLocation: string | undefined) => {
    if (!urlLocation) return 'All Properties';
    if (urlLocation === 'ko-pha-ngan') return 'Koh Phangan';
    return urlLocation.split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 sm:py-12">
        <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-8 fade-in px-2">
          Properties in {getDisplayLocation(location)}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {isLoading ? (
            <p>Loading properties...</p>
          ) : properties.length === 0 ? (
            <p>No properties found in this location.</p>
          ) : (
            properties.map((property) => (
              <div key={property.id} className="px-2 sm:px-0">
                <PropertyCard
                  id={property.id}
                  title={property.title}
                  location={property.location}
                  price={property.price}
                  rating={4.5}
                  reviews={0}
                  image={property.image_url}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertiesList;