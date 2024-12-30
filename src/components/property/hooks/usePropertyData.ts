import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

interface PropertyData {
  title: string;
  description: string;
  price: number;
  location: string; // Google Maps location
  price_three_months: number | null;
  price_six_months: number | null;
  price_one_year: number | null;
  availability_start: string;
  availability_end: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_whatsapp: string | null;
  owner_id: string;
  location_category_id: number | null;
  locations?: {
    name: string;
  } | null;
}

export const usePropertyData = (propertyId: string | undefined) => {
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [propertyImages, setPropertyImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPropertyAndImages = async () => {
      if (!propertyId) return;

      try {
        console.log('Fetching property with ID:', propertyId);
        
        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .select(`
            *,
            locations (
              name
            )
          `)
          .eq('id', propertyId)
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
          .eq('property_id', propertyId)
          .order('order', { ascending: true });

        if (imagesError) {
          console.error('Error fetching property images:', imagesError);
          throw imagesError;
        }

        console.log('Fetched property data:', propertyData);
        console.log('Fetched property images:', imagesData);

        setProperty(propertyData);
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
  }, [propertyId, user, navigate, toast]);

  return { property, propertyImages, isLoading };
};