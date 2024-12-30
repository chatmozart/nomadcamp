import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useLocations = () => {
  return useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      console.log("Fetching locations...");
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching locations:", error);
        throw error;
      }

      console.log("Locations fetched:", data);
      return data;
    },
  });
};