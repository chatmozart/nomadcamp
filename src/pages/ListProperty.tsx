import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { PropertyForm } from "@/components/property/PropertyForm";

const ListProperty = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handlePropertySubmit = async ({
    title,
    description,
    price,
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

      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .insert({
          title,
          description,
          price: parseFloat(price),
          location,
          owner_id: user.id,
          availability_start: availabilityStart,
          availability_end: availabilityEnd,
          contact_name: contactName || null,
          contact_email: contactEmail || null,
          contact_whatsapp: contactWhatsapp || null
        })
        .select()
        .single();

      if (propertyError) {
        throw propertyError;
      }

      // Handle image uploads here if any
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const fileExt = file.name.split('.').pop();
          const timestamp = Date.now();
          const randomStr = Math.random().toString(36).substring(2, 8);
          const fileName = `${timestamp}-${randomStr}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('properties')
            .upload(fileName, file);

          if (uploadError) {
            throw uploadError;
          }

          await supabase
            .from('property_images')
            .insert({
              property_id: propertyData.id,
              image_url: fileName,
            });
        }
      }

      toast({
        title: "Success",
        description: "Property listed successfully",
      });
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
        googleMapsLoaded={true} // Assuming Google Maps is always loaded for this page
        onPlaceSelect={() => {}}
      />
    </div>
  );
};

export default ListProperty;
