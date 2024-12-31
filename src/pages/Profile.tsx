import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import PropertiesGrid from "@/components/property/PropertiesGrid";
import { Property } from "@/types/property";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        console.log('Fetching user profile data...');
        const { data: { user: userData }, error } = await supabase.auth.getUser();

        if (error) {
          console.error('Error fetching user profile:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load profile data",
          });
          return;
        }

        if (userData?.user_metadata?.full_name) {
          console.log('User profile data loaded:', userData.user_metadata);
          setName(userData.user_metadata.full_name);
        }
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, toast]);

  useEffect(() => {
    const fetchProperties = async () => {
      if (user) {
        console.log('Fetching user properties...');
        const { data, error } = await supabase
          .from('properties')
          .select(`
            id,
            title,
            description,
            price,
            location,
            image_url,
            owner_id,
            price_three_months,
            price_six_months,
            price_one_year,
            availability_start,
            availability_end,
            contact_name,
            contact_email,
            contact_whatsapp,
            location_category_id,
            published,
            locations (
              name
            )
          `)
          .eq('owner_id', user.id);

        if (!error && data) {
          console.log('Properties loaded:', data);
          setProperties(data);
        } else if (error) {
          console.error('Error fetching properties:', error);
        }
      }
    };

    fetchProperties();
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Updating user profile...');
      if (newPassword) {
        await supabase.auth.updateUser({ password: newPassword });
      }
      
      const { error } = await supabase.auth.updateUser({ 
        data: { 
          full_name: name,
        }
      });

      if (error) throw error;

      console.log('Profile updated successfully');
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

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

        <PropertiesGrid properties={properties} />
      </div>
    </div>
  );
};

export default Profile;