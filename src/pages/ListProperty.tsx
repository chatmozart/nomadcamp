import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { PropertyForm } from "@/components/property/PropertyForm";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

const ListProperty = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
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
        console.log("Processing image file:", formData.imageFile);
        const fileExt = formData.imageFile.name.split('.').pop();
        // Generate a more URL-friendly filename using timestamp and random string
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const fileName = `${timestamp}-${randomStr}.${fileExt}`;
        
        console.log("Generated filename:", fileName);
        
        // Upload the image file to Supabase storage
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('properties')
          .upload(fileName, formData.imageFile);

        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          throw new Error(uploadError.message);
        }
        
        if (!uploadData?.path) {
          throw new Error("Failed to get uploaded image path");
        }
        
        imageUrl = uploadData.path;
        console.log("Image uploaded successfully. Path:", imageUrl);
      }

      console.log("Creating property record with image URL:", imageUrl);
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

      navigate('/profile');
      
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
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="space-y-4 max-w-xl">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-48" />
        </div>
      </div>
    );
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">List a New Property</h1>
      <PropertyForm 
        onSubmit={handlePropertySubmit}
        googleMapsLoaded={!!googleMapsApiKey}
        onPlaceSelect={onLoad}
      />
    </div>
  );
};

export default ListProperty;