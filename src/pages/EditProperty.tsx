import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { PropertyForm } from "@/components/property/PropertyForm";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import { Skeleton } from "@/components/ui/skeleton";
import { usePropertyData } from "@/components/property/hooks/usePropertyData";

const EditProperty = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { googleMapsApiKey, isLoading: isLoadingMaps } = useGoogleMaps();
  const { property, propertyImages, isLoading } = usePropertyData(id);

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
    contactName?: string;
    contactEmail?: string;
    contactWhatsapp?: string;
  }) => {
    if (!user || !id) return;

    try {
      console.log('Submitting form with amenities:', formData.amenityIds);

      const updateData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        location: formData.location,
        price_three_months: formData.priceThreeMonths ? parseFloat(formData.priceThreeMonths) : null,
        price_six_months: formData.priceSixMonths ? parseFloat(formData.priceSixMonths) : null,
        price_one_year: formData.priceOneYear ? parseFloat(formData.priceOneYear) : null,
        availability_start: formData.availabilityStart,
        availability_end: formData.availabilityEnd || null,
        contact_name: formData.contactName || null,
        contact_email: formData.contactEmail || null,
        contact_whatsapp: formData.contactWhatsapp || null
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

        console.log('Inserting new amenities:', amenityRecords);

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
        initialData={{
          id: id,
          title: property.title,
          description: property.description,
          price: property.price,
          priceThreeMonths: property.price_three_months,
          priceSixMonths: property.price_six_months,
          priceOneYear: property.price_one_year,
          location: property.location,
          existingImages: propertyImages,
          availabilityStart: property.availability_start,
          availabilityEnd: property.availability_end,
          contactName: property.contact_name,
          contactEmail: property.contact_email,
          contactWhatsapp: property.contact_whatsapp
        }}
        mode="edit"
      />
    </div>
  );
};

export default EditProperty;