import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Property } from "@/types/property";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ProfilePropertyCard } from "@/components/profile/ProfilePropertyCard";
import { ProfileForm } from "@/components/profile/ProfileForm";

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
      <ProfileForm />

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
              <ProfilePropertyCard {...property} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;