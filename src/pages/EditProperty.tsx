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
  const [propertyImages, setPropertyImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { googleMapsApiKey, isLoading: isLoadingMaps } = useGoogleMaps();
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const libraries = useMemo(() => ["places"], []);

  useEffect(() => {
    const fetchPropertyAndImages = async () => {
      if (!id) return;

      try {
        console.log('Fetching property with ID:', id);
        
        // Fetch property details
        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();

        if (propertyError) {
          console.error('Error fetching property:', propertyError);
          throw propertyError;
        }

        if (propertyData.owner_id !== user?.id) {
          toast({
            variant: "destructive",
            title: "Unauthorized",
            description: "You don't have permission to edit this property",
          });
          navigate('/profile');
          return;
        }

        // Fetch property images
        const { data: imagesData, error: imagesError } = await supabase
          .from('property_images')
          .select('image_url')
          .eq('property_id', id)
          .order('order', { ascending: true });

        if (imagesError) {
          console.error('Error fetching property images:', imagesError);
          throw imagesError;
        }

        console.log('Fetched property data:', propertyData);
        console.log('Fetched property images:', imagesData);

        setProperty({
          ...propertyData,
          priceThreeMonths: propertyData.price_three_months,
          priceSixMonths: propertyData.price_six_months,
          priceOneYear: propertyData.price_one_year,
          availabilityStart: propertyData.availability_start,
          availabilityEnd: propertyData.availability_end
        });
        
        setPropertyImages(imagesData.map(img => img.image_url));
        setIsLoading(false);
      } catch (error) {
        console.error('Error in fetchPropertyAndImages:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load property details",
        });
        navigate('/profile');
      }
    };

    fetchPropertyAndImages();
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
    amenityIds: string[];
    availabilityStart: string;
    availabilityEnd?: string;
  }) => {
    if (!user || !id) return;

    try {
      console.log('Submitting form with availability dates:', {
        start: formData.availabilityStart,
        end: formData.availabilityEnd
      });

      // Update property data
      const updateData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        location: formData.location,
        price_three_months: formData.priceThreeMonths ? parseFloat(formData.priceThreeMonths) : null,
        price_six_months: formData.priceSixMonths ? parseFloat(formData.priceSixMonths) : null,
        price_one_year: formData.priceOneYear ? parseFloat(formData.priceOneYear) : null,
        availability_start: formData.availabilityStart,
        availability_end: formData.availabilityEnd || null
      };

      console.log('Attempting to update property with data:', updateData);

      const { data: propertyData, error: updateError } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', id)
        .select();

      if (updateError) throw updateError;
      
      console.log("Property updated:", propertyData);

      // Update property amenities
      const { error: deleteAmenitiesError } = await supabase
        .from('property_amenities')
        .delete()
        .eq('property_id', id);

      if (deleteAmenitiesError) throw deleteAmenitiesError;

      if (formData.amenityIds.length > 0) {
        const amenityRecords = formData.amenityIds.map(amenityId => ({
          property_id: id,
          amenity_id: amenityId
        }));

        const { error: insertAmenitiesError } = await supabase
          .from('property_amenities')
          .insert(amenityRecords);

        if (insertAmenitiesError) throw insertAmenitiesError;
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
        initialData={{
          ...property,
          priceThreeMonths: property.price_three_months,
          priceSixMonths: property.price_six_months,
          priceOneYear: property.price_one_year,
          existingImages: propertyImages,
          availabilityStart: property.availability_start,
          availabilityEnd: property.availability_end
        }}
        mode="edit"
      />
    </div>
  );
};

export default EditProperty;