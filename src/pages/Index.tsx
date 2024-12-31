import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PropertiesGrid } from "@/components/property/PropertiesGrid";
import SearchBar from "@/components/SearchBar";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { data: properties, isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      console.log('Fetching all properties');
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
        <div className="flex justify-center mb-8">
          <SearchBar />
        </div>
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
      <div className="flex justify-center mb-8">
        <SearchBar />
      </div>
      <PropertiesGrid properties={properties || []} />
    </div>
  );
};

export default Index;