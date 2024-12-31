import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import PropertiesGrid from "@/components/property/PropertiesGrid";
import { Property } from "@/types/property";
import { Card } from "@/components/ui/card";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      if (!user) return;

      try {
        console.log('Fetching properties for user:', user.id);
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

        const transformedData = data?.map(property => ({
          ...property,
          locations: property.locations ? {
            name: property.locations.name
          } : null
        })) as Property[];

        console.log('Fetched properties:', transformedData);
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
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">Profile</h1>
          <p>Please log in to view your profile.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Card className="p-6 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-primary/10 p-4 rounded-full">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.email}</h2>
            <p className="text-muted-foreground">Member since {new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </Card>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Properties</h1>
        <Link to="/list-property">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            List Property
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <Card className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </Card>
      ) : properties.length === 0 ? (
        <Card className="p-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">No Properties Listed</h3>
            <p className="text-muted-foreground mb-4">You haven't listed any properties yet.</p>
            <Link to="/list-property">
              <Button>List Your First Property</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((property) => (
            <div key={property.id} className="h-full">
              <PropertyCard {...property} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Compact PropertyCard component specifically for the Profile page
const PropertyCard = (property: Property) => {
  return (
    <Link to={`/property/${property.id}/edit`}>
      <Card className="h-full hover:shadow-lg transition-shadow">
        <div className="relative aspect-[4/3]">
          <img
            src={property.image_url || '/placeholder.svg'}
            alt={property.title}
            className="w-full h-full object-cover rounded-t-lg"
          />
          <div className="absolute top-2 right-2">
            <Button
              variant={property.published ? "default" : "destructive"}
              size="sm"
              className="text-xs"
            >
              {property.published ? "Published" : "Unpublished"}
            </Button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold mb-2 line-clamp-1">{property.title}</h3>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
            {property.location}
          </p>
          <p className="text-sm font-medium">
            ฿{property.price.toLocaleString()} / month
          </p>
        </div>
      </Card>
    </Link>
  );
};

export default Profile;