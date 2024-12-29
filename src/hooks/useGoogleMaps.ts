import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const useGoogleMaps = () => {
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('secrets')
          .select('GOOGLE_MAPS_API_KEY')
          .single();

        if (error) {
          console.error('Error fetching Google Maps API key:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not load Google Maps. Please try again later.",
          });
          return;
        }

        if (data?.GOOGLE_MAPS_API_KEY) {
          console.log('Successfully fetched Google Maps API key');
          setGoogleMapsApiKey(data.GOOGLE_MAPS_API_KEY);
        }
      } catch (err) {
        console.error('Error in fetchApiKey:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiKey();
  }, [toast]);

  return { googleMapsApiKey, isLoading };
};