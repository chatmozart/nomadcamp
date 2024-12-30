import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const SCRIPT_ID = 'google-maps-script';

export const useGoogleMaps = () => {
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        setIsLoading(true);
        console.log('Starting Google Maps API key fetch...');
        
        // Get the API key from Supabase Edge Function
        const { data, error } = await supabase.functions.invoke('get-google-maps-key');
        console.log('Edge Function response:', { data, error });

        if (error) {
          console.error('Error from Edge Function:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not load Google Maps. Please try again later.",
          });
          setIsLoading(false);
          return;
        }

        if (data?.apiKey) {
          console.log('Successfully received API key from Edge Function');
          
          // Check if script already exists
          if (!document.getElementById(SCRIPT_ID)) {
            const script = document.createElement('script');
            script.id = SCRIPT_ID;
            script.src = `https://maps.googleapis.com/maps/api/js?key=${data.apiKey}&libraries=places&callback=initMap`;
            script.async = true;
            script.defer = true;
            
            // Define the callback function
            window.initMap = () => {
              console.log('Google Maps JavaScript API loaded successfully');
              setGoogleMapsApiKey(data.apiKey);
              setIsLoading(false);
            };

            script.onerror = (e) => {
              console.error('Failed to load Google Maps JavaScript API:', e);
              toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load Google Maps. Please check your internet connection.",
              });
              setIsLoading(false);
            };

            document.head.appendChild(script);
          } else {
            // If script already exists, just update the API key
            setGoogleMapsApiKey(data.apiKey);
            setIsLoading(false);
          }
        } else {
          console.log('No Google Maps API key found in Edge Function response');
          toast({
            variant: "destructive",
            title: "Configuration Required",
            description: "Google Maps API key is not configured.",
          });
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Unexpected error in loadGoogleMaps:', err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load Google Maps configuration.",
        });
        setIsLoading(false);
      }
    };

    loadGoogleMaps();

    // Cleanup function
    return () => {
      delete window.initMap;
    };
  }, [toast]);

  return { googleMapsApiKey, isLoading };
};

// Add the initMap to the window object type
declare global {
  interface Window {
    initMap: () => void;
  }
}