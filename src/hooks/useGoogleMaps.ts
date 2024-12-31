import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const SCRIPT_ID = 'google-maps-script';

export const useGoogleMaps = () => {
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        console.log('Starting Google Maps API key fetch...');
        
        // Check if the API is already loaded
        if (window.google?.maps) {
          console.log('Google Maps API already loaded');
          setIsLoading(false);
          return;
        }

        // Get the API key from Supabase Edge Function
        const { data, error } = await supabase.functions.invoke('get-google-maps-key');
        console.log('Edge Function response:', { data, error });

        if (error) {
          console.error('Error from Edge Function:', error);
          setIsError(true);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not load Google Maps. Please try again later.",
          });
          return;
        }

        if (data?.apiKey) {
          console.log('Successfully received API key from Edge Function');
          
          // Remove any existing script to prevent duplicates
          const existingScript = document.getElementById(SCRIPT_ID);
          if (existingScript) {
            existingScript.remove();
          }

          // Create new script element
          const script = document.createElement('script');
          script.id = SCRIPT_ID;
          script.src = `https://maps.googleapis.com/maps/api/js?key=${data.apiKey}&libraries=places`;
          script.async = true;
          script.defer = true;
          
          // Create a promise to handle script loading
          const loadPromise = new Promise((resolve, reject) => {
            script.onload = () => {
              console.log('Google Maps JavaScript API loaded successfully');
              resolve(true);
            };
            script.onerror = (e) => {
              console.error('Failed to load Google Maps JavaScript API:', e);
              reject(e);
            };
          });

          // Add script to document
          document.head.appendChild(script);

          // Wait for script to load
          await loadPromise;
          setGoogleMapsApiKey(data.apiKey);
        } else {
          console.log('No Google Maps API key found in Edge Function response');
          setIsError(true);
          toast({
            variant: "destructive",
            title: "Configuration Required",
            description: "Google Maps API key is not configured.",
          });
        }
      } catch (err) {
        console.error('Unexpected error in loadGoogleMaps:', err);
        setIsError(true);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load Google Maps configuration.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadGoogleMaps();
  }, [toast]);

  return { googleMapsApiKey, isLoading, isError };
};