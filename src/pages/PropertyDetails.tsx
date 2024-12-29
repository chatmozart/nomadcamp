import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyImageSection } from "@/components/property/PropertyImageSection";
import { PropertyDetailsSection } from "@/components/property/PropertyDetailsSection";
import { PropertyActions } from "@/components/property/PropertyActions";

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  price_three_months: number | null;
  price_six_months: number | null;
  price_one_year: number | null;
  location: string;
  image_url: string;
  owner_id: string;
  availability_start: string | null;
  availability_end: string | null;
}

const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [propertyImages, setPropertyImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPropertyAndImages = async () => {
      if (!id) return;

      try {
        console.log('Fetching property details for ID:', id);
        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();

        if (propertyError) {
          console.error('Error fetching property:', propertyError);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load property details",
          });
          return;
        }

        console.log('Property details fetched:', propertyData);
        setProperty(propertyData);

        // Fetch all images for this property
        const { data: imagesData, error: imagesError } = await supabase
          .from('property_images')
          .select('image_url')
          .eq('property_id', id)
          .order('order', { ascending: true });

        if (imagesError) {
          console.error('Error fetching property images:', imagesError);
          return;
        }

        console.log('Property images fetched:', imagesData);
        const imageUrls = imagesData.map(img => img.image_url);
        setPropertyImages(imageUrls);
      } catch (error) {
        console.error('Error in fetchPropertyAndImages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertyAndImages();
  }, [id, toast]);

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Property not found</h1>
        <p className="text-muted-foreground">The property you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  const isOwner = user?.id === property.owner_id;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center px-4">
          <PropertyHeader 
            title={property.title}
            location={property.location}
            isOwner={isOwner}
            propertyId={property.id}
          />
          {isOwner && (
            <PropertyActions 
              isOwner={isOwner}
              propertyId={property.id}
              onDelete={async () => {
                try {
                  const { error } = await supabase
                    .from('properties')
                    .delete()
                    .eq('id', property.id);

                  if (error) throw error;

                  toast({
                    title: "Success",
                    description: "Property deleted successfully",
                  });
                  navigate('/');
                } catch (error) {
                  console.error('Error deleting property:', error);
                  toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to delete property",
                  });
                }
              }}
            />
          )}
        </div>

        <PropertyImageSection 
          imageUrl={property.image_url}
          title={property.title}
          additionalImages={propertyImages}
        />

        <PropertyDetailsSection 
          id={property.id}
          description={property.description}
          price={property.price}
          priceThreeMonths={property.price_three_months || undefined}
          priceSixMonths={property.price_six_months || undefined}
          priceOneYear={property.price_one_year || undefined}
          location={property.location}
          availabilityStart={property.availability_start}
          availabilityEnd={property.availability_end}
        />
      </div>
    </div>
  );
};

export default PropertyDetails;