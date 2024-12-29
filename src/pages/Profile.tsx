import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [propertyTitle, setPropertyTitle] = useState("");
  const [propertyDescription, setPropertyDescription] = useState("");
  const [propertyPrice, setPropertyPrice] = useState("");
  const [propertyLocation, setPropertyLocation] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (newPassword) {
        await supabase.auth.updateUser({ password: newPassword });
      }
      
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user?.id,
          name,
          updated_at: new Date().toISOString(),
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

  const handlePropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = "";
      
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('properties')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;
        imageUrl = data.path;
      }

      const { error } = await supabase
        .from('properties')
        .insert({
          title: propertyTitle,
          description: propertyDescription,
          price: parseFloat(propertyPrice),
          location: propertyLocation,
          image_url: imageUrl,
          owner_id: user?.id,
        });

      if (error) throw error;

      toast({
        title: "Property listed",
        description: "Your property has been listed successfully.",
      });

      // Reset form
      setPropertyTitle("");
      setPropertyDescription("");
      setPropertyPrice("");
      setPropertyLocation("");
      setImageFile(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to list property",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Profile Settings</h1>
      
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
          <h2 className="text-xl font-semibold">List a Property</h2>
          <form onSubmit={handlePropertySubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="propertyTitle">Property Title</Label>
              <Input
                id="propertyTitle"
                value={propertyTitle}
                onChange={(e) => setPropertyTitle(e.target.value)}
                placeholder="Enter property title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyDescription">Description</Label>
              <Textarea
                id="propertyDescription"
                value={propertyDescription}
                onChange={(e) => setPropertyDescription(e.target.value)}
                placeholder="Describe your property"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyPrice">Price per Month</Label>
              <Input
                id="propertyPrice"
                type="number"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(e.target.value)}
                placeholder="Enter price"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyLocation">Location</Label>
              <Input
                id="propertyLocation"
                value={propertyLocation}
                onChange={(e) => setPropertyLocation(e.target.value)}
                placeholder="Enter location"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyImage">Property Image</Label>
              <Input
                id="propertyImage"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                required
              />
            </div>

            <Button type="submit">List Property</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;