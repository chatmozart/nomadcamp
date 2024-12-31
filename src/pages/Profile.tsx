import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import PropertiesGrid from "@/components/property/PropertiesGrid";
import { Property } from "@/types/property";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('properties')
          .select(`
            *,
            locations (
              name
            )
          `)
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform the data to match the Property type
        const transformedData = data?.map(property => ({
          ...property,
          locations: property.locations ? {
            name: property.locations.name
          } : null
        })) as Property[];

        setProperties(transformedData || []);
      } catch (error) {
        console.error('Error fetching properties:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your properties",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [user, toast]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Properties</h1>
        <Link to="/property/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            List Property
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div>Loading your properties...</div>
      ) : properties.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">You haven't listed any properties yet.</p>
          <Link to="/property/new">
            <Button>List Your First Property</Button>
          </Link>
        </div>
      ) : (
        <PropertiesGrid properties={properties} />
      )}
    </div>
  );
};

export default Profile;