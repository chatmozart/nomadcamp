import { useState, useMemo } from "react";
import { LoadScript } from "@react-google-maps/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { PropertyForm } from "@/components/property/PropertyForm";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";

const ListProperty = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const { googleMapsApiKey, isLoading } = useGoogleMaps();

  console.log("Rendering ListProperty component");

  const libraries = useMemo(() => ["places"], []);

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    console.log("Autocomplete loaded:", autocomplete);
    setAutocomplete(autocomplete);
  };

  const handlePropertySubmit = async (formData: {
    title: string;
    description: string;
    price: string;
    location: string;
    imageFile: File | null;
  }) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to list a property.",
      });
      return;
    }

    try {
      let imageUrl = "";
      
      if (formData.imageFile) {
        const fileExt = formData.imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('properties')
          .upload(fileName, formData.imageFile);

        if (uploadError) throw uploadError;
        imageUrl = data.path;
      }

      const { error } = await supabase
        .from('properties')
        .insert({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          location: formData.location,
          image_url: imageUrl,
          owner_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Property listed",
        description: "Your property has been listed successfully.",
      });
    } catch (error) {
      console.error("Error submitting property:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to list property",
      });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!googleMapsApiKey) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Configuration Required</h2>
          <p>Google Maps API key is not configured. Please contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={googleMapsApiKey}
      libraries={libraries as any}
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">List a New Property</h1>
        <PropertyForm 
          onSubmit={handlePropertySubmit}
          googleMapsLoaded={!!googleMapsApiKey}
          onPlaceSelect={onLoad}
        />
      </div>
    </LoadScript>
  );
};

export default ListProperty;