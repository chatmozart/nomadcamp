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
        console.log('Fetching Google Maps API key from Supabase secrets...');
        
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
          // Load the Google Maps JavaScript API
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${data.GOOGLE_MAPS_API_KEY}&libraries=places`;
          script.async = true;
          script.defer = true;
          
          script.onload = () => {
            console.log('Google Maps JavaScript API loaded successfully');
            setGoogleMapsApiKey(data.GOOGLE_MAPS_API_KEY);
            setIsLoading(false);
          };

          script.onerror = () => {
            console.error('Failed to load Google Maps JavaScript API');
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to load Google Maps. Please check your internet connection.",
            });
            setIsLoading(false);
          };

          document.head.appendChild(script);
        } else {
          console.log('No Google Maps API key found in secrets');
          toast({
            variant: "destructive",
            title: "Configuration Required",
            description: "Google Maps API key is not configured.",
          });
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error in fetchApiKey:', err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load Google Maps configuration.",
        });
        setIsLoading(false);
      }
    };

    fetchApiKey();

    // Cleanup function
    return () => {
      const scripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
      scripts.forEach(script => script.remove());
    };
  }, [toast]);

  return { googleMapsApiKey, isLoading };
};