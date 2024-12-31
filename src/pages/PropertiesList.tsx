import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PropertyGridItem } from "@/components/property/PropertyGridItem";

const PropertiesList = () => {
  const [properties, setProperties] = useState([]);

  const fetchProperties = async (locationId: string | null = null) => {
    let query = supabase
      .from('properties')
      .select(`
        *,
        property_images (
          image_url,
          order
        ),
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
        setProperties(propertiesData);
      } catch (error) {
        console.error('Error loading properties:', error);
      }
    };

    loadProperties();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Properties</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {properties.map((property) => (
          <PropertyGridItem
            key={property.id}
            id={property.id}
            title={property.title}
            image_url={property.image_url}
          />
        ))}
      </div>
    </div>
  );
};

export default PropertiesList;
