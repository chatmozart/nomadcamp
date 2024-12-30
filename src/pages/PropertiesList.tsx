import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PropertyCard from "@/components/PropertyCard";
import { PropertiesMap } from "@/components/property/PropertiesMap";
import { supabase } from "@/lib/supabase";
import { getPropertyCategory, getDisplayLocation } from "@/utils/locationUtils";

const PropertiesList = () => {
  const { location } = useParams();
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  
  console.log("Current location param:", location);

  useEffect(() => {
    const fetchProperties = async () => {
      console.log('Fetching properties for location:', location);
      let query = supabase.from('properties').select('*');
      
      if (location) {
        const displayLocation = getDisplayLocation(location);
        console.log('Searching for location:', displayLocation);
        const { data, error } = await query;

        if (error) {
          console.error('Error fetching properties:', error);
          return;
        }

        const filteredProperties = data?.filter(property => {
          const category = getPropertyCategory(property.location);
          return category?.split(' - ')[0] === displayLocation;
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

  const handleMarkerClick = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    const element = document.getElementById(`property-${propertyId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 sm:py-12">
        <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-8 fade-in px-2">
          Properties in {getDisplayLocation(location)}
        </h1>
        
        <div className="flex gap-8">
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4 sm:gap-8">
              {isLoading ? (
                <p>Loading properties...</p>
              ) : properties.length === 0 ? (
                <p>No properties found in this location.</p>
              ) : (
                properties.map((property) => (
                  <div 
                    key={property.id} 
                    id={`property-${property.id}`}
                    className="transition-all duration-300"
                    onMouseEnter={() => setHoveredPropertyId(property.id)}
                    onMouseLeave={() => setHoveredPropertyId(null)}
                  >
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

          <div className="w-[600px] sticky top-24">
            <div className="h-[800px]">
              <PropertiesMap 
                properties={properties}
                onMarkerClick={handleMarkerClick}
                hoveredPropertyId={hoveredPropertyId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesList;