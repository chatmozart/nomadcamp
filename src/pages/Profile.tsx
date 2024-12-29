import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { Home, Plus } from "lucide-react";

interface Property {
  id: number;
  title: string;
  image_url: string;
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('properties')
          .select('id, title, image_url')
          .eq('owner_id', user.id);

        if (!error && data) {
          setProperties(data);
        }
      }
    };

    fetchProperties();
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (newPassword) {
        await supabase.auth.updateUser({ password: newPassword });
      }
      
      const { error } = await supabase.auth.updateUser({ 
        data: { 
          full_name: name,
        }
      });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Update Profile</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>

            <Button type="submit">Update Profile</Button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">My Properties</h2>
            <Link to="/list-property">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                List Property
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {properties.map((property) => (
              <Link 
                key={property.id} 
                to={`/property/${property.id}`}
                className="relative aspect-square rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
              >
                {property.image_url ? (
                  <img
                    src={`https://mqgpycqviacxddgnwbxo.supabase.co/storage/v1/object/public/properties/${property.image_url}`}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Home className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;