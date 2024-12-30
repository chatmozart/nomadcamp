import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { PropertyForm } from "@/components/property/PropertyForm";
import { useNavigate } from "react-router-dom";

const ListProperty = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handlePropertySubmit = async ({
    title,
    description,
    price,
    priceThreeMonths,
    priceSixMonths,
    priceOneYear,
    location,
    imageFiles,
    amenityIds,
    availabilityStart,
    availabilityEnd,
    contactName,
    contactEmail,
    contactWhatsapp
  }: {
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
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to list a property",
      });
      return;
    }

    try {
      setIsLoading(true);
      console.log('Creating property with contact details:', {
        contactName,
        contactEmail,
        contactWhatsapp
      });

      // Create the property data object, handling empty dates
      const propertyData = {
        title,
        description,
        price: parseFloat(price),
        price_three_months: priceThreeMonths ? parseFloat(priceThreeMonths) : null,
        price_six_months: priceSixMonths ? parseFloat(priceSixMonths) : null,
        price_one_year: priceOneYear ? parseFloat(priceOneYear) : null,
        location,
        owner_id: user.id,
        availability_start: availabilityStart || null,
        availability_end: availabilityEnd || null,
        contact_name: contactName || null,
        contact_email: contactEmail || null,
        contact_whatsapp: contactWhatsapp || null
      };

      console.log('Inserting property with data:', propertyData);

      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .insert(propertyData)
        .select()
        .single();

      if (propertyError) {
        console.error('Error creating property:', propertyError);
        throw propertyError;
      }

      // Handle image uploads if any
      if (imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];
          const fileExt = file.name.split('.').pop();
          const timestamp = Date.now();
          const randomStr = Math.random().toString(36).substring(2, 8);
          const fileName = `${timestamp}-${randomStr}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('properties')
            .upload(fileName, file);

          if (uploadError) {
            console.error('Error uploading image:', uploadError);
            throw uploadError;
          }

          // Create property image record
          const { error: imageError } = await supabase
            .from('property_images')
            .insert({
              property_id: propertyData.id,
              image_url: fileName,
              order: i
            });

          if (imageError) {
            console.error('Error creating image record:', imageError);
            throw imageError;
          }
        }
      }

      // Insert property amenities
      if (amenityIds.length > 0) {
        const amenityRecords = amenityIds.map(amenityId => ({
          property_id: propertyData.id,
          amenity_id: amenityId
        }));

        const { error: amenitiesError } = await supabase
          .from('property_amenities')
          .insert(amenityRecords);

        if (amenitiesError) {
          console.error('Error creating amenity records:', amenitiesError);
          throw amenitiesError;
        }
      }

      toast({
        title: "Success",
        description: "Property listed successfully",
      });

      // Navigate to the property details page
      navigate(`/property/${propertyData.id}`);
    } catch (error) {
      console.error("Error listing property:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to list property",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">List a Property</h1>
      <PropertyForm 
        onSubmit={handlePropertySubmit}
        googleMapsLoaded={true}
        onPlaceSelect={() => {}}
      />
    </div>
  );
};

export default ListProperty;