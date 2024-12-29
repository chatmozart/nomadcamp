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
    imageFiles: File[];
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
      // First, create the property record
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .insert({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          location: formData.location,
          owner_id: user.id,
        })
        .select()
        .single();

      if (propertyError) throw propertyError;
      
      console.log("Property created:", propertyData);

      // Upload images and create image records
      for (const [index, file] of formData.imageFiles.entries()) {
        console.log(`Processing image ${index + 1}:`, file);
        
        const fileExt = file.name.split('.').pop();
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const fileName = `${timestamp}-${randomStr}.${fileExt}`;
        
        console.log("Generated filename:", fileName);
        
        // Upload the image file
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('properties')
          .upload(fileName, file);

        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          throw uploadError;
        }
        
        if (!uploadData?.path) {
          throw new Error("Failed to get uploaded image path");
        }
        
        // Create image record
        const { error: imageError } = await supabase
          .from('property_images')
          .insert({
            property_id: propertyData.id,
            image_url: uploadData.path,
            order: index,
          });

        if (imageError) {
          console.error("Error creating image record:", imageError);
          throw imageError;
        }
        
        console.log(`Image ${index + 1} uploaded successfully:`, uploadData.path);
      }

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