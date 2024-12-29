import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PropertyCard from "@/components/PropertyCard";
import { supabase } from "@/lib/supabase";

const PropertiesList = () => {
  const { location } = useParams();
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  console.log("Current location:", location);

  useEffect(() => {
    const fetchProperties = async () => {
      console.log('Fetching properties for location:', location);
      let query = supabase.from('properties').select('*');
      
      if (location) {
        // Convert URL-friendly format back to display format
        const displayLocation = location.split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        query = query.eq('location', displayLocation);
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 sm:py-12">
        <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-8 fade-in px-2">
          {location ? `Properties in ${location?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}` : 'All Properties'}
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
                  image={property.image_url} // Pass just the image filename
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