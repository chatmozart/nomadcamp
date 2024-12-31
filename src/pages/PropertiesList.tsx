import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PropertiesGrid } from "@/components/property/PropertiesGrid";
import { Skeleton } from "@/components/ui/skeleton";

const PropertiesList = () => {
  const { location } = useParams();

  const { data: properties, isLoading } = useQuery({
    queryKey: ['properties', location],
    queryFn: async () => {
      console.log('Fetching properties for location:', location);
      const { data, error } = await supabase
        .from('properties')
        .select(`
          id,
          title,
          description,
          price,
          image_url,
          availability_start,
          availability_end,
          locations (
            name
          )
        `)
        .eq('locations.name', location)
        .eq('published', true); // Only fetch published properties

      if (error) {
        console.error('Error fetching properties:', error);
        throw error;
      }

      console.log('Fetched properties:', data);
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[300px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Properties in {location}</h1>
      <PropertiesGrid properties={properties || []} />
    </div>
  );
};

export default PropertiesList;