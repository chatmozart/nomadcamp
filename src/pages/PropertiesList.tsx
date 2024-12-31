import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import CategoryFilter from "@/components/CategoryFilter";
import { PropertiesMap } from "@/components/property/PropertiesMap";
import PropertiesGrid from "@/components/property/PropertiesGrid";
import { Property } from "@/types/property";

const PropertiesList = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);

  const fetchProperties = async (locationId: string | null = null) => {
    let query = supabase
      .from('properties')
      .select(`
        *,
        locations (
          name
        )
      `);

    // If locationId is provided, filter by location
    if (locationId) {
      query = query.eq('location_category_id', locationId);
    }

    // Only show published properties unless user is the owner
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      query = query.eq('published', true);
    } else {
      query = query.or(`published.eq.true,owner_id.eq.${user.id}`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }

    return data;
  };

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const propertiesData = await fetchProperties();
        setProperties(propertiesData || []);
      } catch (error) {
        console.error('Error loading properties:', error);
      }
    };

    loadProperties();
  }, []);

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
      <div className="container mx-auto py-8">
        <CategoryFilter />
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-4 mt-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Properties</h2>
            <div 
              onMouseLeave={() => setHoveredPropertyId(null)}
            >
              <PropertiesGrid 
                properties={properties}
                onPropertyHover={setHoveredPropertyId}
              />
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