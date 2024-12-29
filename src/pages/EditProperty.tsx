import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { PropertyForm } from "@/components/property/PropertyForm";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import { Skeleton } from "@/components/ui/skeleton";

const EditProperty = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { googleMapsApiKey, isLoading: isLoadingMaps } = useGoogleMaps();
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const libraries = useMemo(() => ["places"], []);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;

      try {
        console.log('Fetching property with ID:', id);
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching property:', error);
          throw error;
        }

        if (data.owner_id !== user?.id) {
          toast({
            variant: "destructive",
            title: "Unauthorized",
            description: "You don't have permission to edit this property",
          });
          navigate('/profile');
          return;
        }

        console.log('Fetched property data:', data);
        setProperty(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error in fetchProperty:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load property details",
        });
        navigate('/profile');
      }
    };

    fetchProperty();
  }, [id, user, navigate, toast]);

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    console.log("Autocomplete loaded:", autocomplete);
    setAutocomplete(autocomplete);
  };

  const handlePropertySubmit = async (formData: {
    title: string;
    description: string;
    price: string;
    priceThreeMonths: string;
    priceSixMonths: string;
    priceOneYear: string;
    location: string;
    imageFiles: File[];
  }) => {
    if (!user || !id) return;

    try {
      console.log('Updating property with data:', formData);
      
      const updateData: any = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        location: formData.location,
        price_three_months: formData.priceThreeMonths ? parseFloat(formData.priceThreeMonths) : null,
        price_six_months: formData.priceSixMonths ? parseFloat(formData.priceSixMonths) : null,
        price_one_year: formData.priceOneYear ? parseFloat(formData.priceOneYear) : null
      };

      console.log('Sending update with data:', updateData);

      const { error: updateError } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', id);

      if (updateError) {
        console.error('Error updating property:', updateError);
        throw updateError;
      }

      // Handle new images if any
      if (formData.imageFiles.length > 0) {
        for (const [index, file] of formData.imageFiles.entries()) {
          const fileExt = file.name.split('.').pop();
          const timestamp = Date.now();
          const randomStr = Math.random().toString(36).substring(2, 8);
          const fileName = `${timestamp}-${randomStr}.${fileExt}`;
          
          const { error: uploadError, data: uploadData } = await supabase.storage
            .from('properties')
            .upload(fileName, file);

          if (uploadError) throw uploadError;
          
          if (!uploadData?.path) {
            throw new Error("Failed to get uploaded image path");
          }
          
          const { error: imageError } = await supabase
            .from('property_images')
            .insert({
              property_id: id,
              image_url: uploadData.path,
              order: index,
            });

          if (imageError) throw imageError;
        }
      }

      toast({
        title: "Success",
        description: "Property updated successfully",
      });

      navigate(`/property/${id}`);
    } catch (error) {
      console.error("Error updating property:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update property",
      });
    }
  };

  if (isLoading || isLoadingMaps) {
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

  if (!property) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Edit Property</h1>
      <PropertyForm 
        onSubmit={handlePropertySubmit}
        googleMapsLoaded={!!googleMapsApiKey}
        onPlaceSelect={onLoad}
        initialData={property}
        mode="edit"
      />
    </div>
  );
};

export default EditProperty;