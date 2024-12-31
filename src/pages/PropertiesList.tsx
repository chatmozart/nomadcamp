import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import PropertyCard from "@/components/PropertyCard";
import { PropertiesMap } from "@/components/property/PropertiesMap";
import { supabase } from "@/lib/supabase";
import { getDisplayLocation, LOCATION_CATEGORIES } from "@/utils/locationUtils";
import { addDays, subDays, parseISO, isWithinInterval } from "date-fns";

const PropertiesList = () => {
  const { location } = useParams();
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProperties = async () => {
      console.log('Fetching properties for location:', location);
      
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          locations (
            name
          )
        `);
      
      if (error) {
        console.error('Error fetching properties:', error);
        return;
      }

      if (location && data) {
        const displayLocation = getDisplayLocation(location);
        console.log('Searching for location:', displayLocation);
        
        const matchingCategory = LOCATION_CATEGORIES.find(category => 
          category.split(' - ')[0].toLowerCase() === displayLocation.toLowerCase()
        );
        
        console.log('Matching category:', matchingCategory);

        let filteredProperties = data.filter(property => {
          const propertyCategory = property.locations?.name;
          return propertyCategory === matchingCategory;
        });

        // Apply date filtering if date parameters exist
        const selectedDate = searchParams.get('date');
        const isExactDate = searchParams.get('isExactDate') === 'true';

        if (selectedDate) {
          const filterDate = parseISO(selectedDate);
          
          filteredProperties = filteredProperties.filter(property => {
            if (!property.availability_start) return false;
            
            const availabilityStart = parseISO(property.availability_start);
            
            if (isExactDate) {
              // For exact date, the property must be available on the selected date
              return availabilityStart <= filterDate && 
                (!property.availability_end || parseISO(property.availability_end) >= filterDate);
            } else {
              // For approximate date (±10 days)
              const intervalStart = subDays(filterDate, 10);
              const intervalEnd = addDays(filterDate, 10);
              
              return isWithinInterval(availabilityStart, {
                start: intervalStart,
                end: intervalEnd
              });
            }
          });
        }

        console.log('Filtered properties:', filteredProperties);
        setProperties(filteredProperties);
      } else {
        setProperties(data || []);
      }
      setIsLoading(false);
    };

    fetchProperties();
  }, [location, searchParams]);

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
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="sticky top-24 h-[600px]">
            <PropertiesMap 
              properties={properties}
              onMarkerClick={handleMarkerClick}
              hoveredPropertyId={hoveredPropertyId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesList;