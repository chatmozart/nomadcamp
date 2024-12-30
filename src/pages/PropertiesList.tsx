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
        // Fetch all properties and filter them using the same logic as the index page
        const { data, error } = await query;

        if (error) {
          console.error('Error fetching properties:', error);
          return;
        }

        // Filter properties using the same categorization logic as the index page
        const filteredProperties = data?.filter(property => {
          const category = getPropertyCategory(property.location);
          return category === searchLocation;
        }) || [];

        console.log('Filtered properties:', filteredProperties);
        setProperties(filteredProperties);
      } else {
        const { data, error } = await query;
        if (error) {
          console.error('Error fetching properties:', error);
          return;
        }
        setProperties(data || []);
      }
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
                  image={property.image_url}
                  price_three_months={property.price_three_months}
                  price_six_months={property.price_six_months}
                  price_one_year={property.price_one_year}
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