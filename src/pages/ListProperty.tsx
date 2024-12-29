import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { LoadScript, Autocomplete } from "@react-google-maps/api";

const ListProperty = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [propertyTitle, setPropertyTitle] = useState("");
  const [propertyDescription, setPropertyDescription] = useState("");
  const [propertyPrice, setPropertyPrice] = useState("");
  const [propertyLocation, setPropertyLocation] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  console.log("Rendering ListProperty component");

  const libraries = useMemo(() => ["places"], []);

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    console.log("Autocomplete loaded:", autocomplete);
    setAutocomplete(autocomplete);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      console.log("Place selected:", place);
      if (place.formatted_address) {
        setPropertyLocation(place.formatted_address);
      }
    }
  };

  const handlePropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting property form");
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
      console.error("Error submitting property:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to list property",
      });
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""}
      libraries={libraries as any}
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">List a New Property</h1>
        <form onSubmit={handlePropertySubmit} className="space-y-4 max-w-xl">
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
            <Autocomplete
              onLoad={onLoad}
              onPlaceChanged={onPlaceChanged}
            >
              <Input
                id="propertyLocation"
                value={propertyLocation}
                onChange={(e) => setPropertyLocation(e.target.value)}
                placeholder="Enter location"
                required
              />
            </Autocomplete>
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
    </LoadScript>
  );
};

export default ListProperty;