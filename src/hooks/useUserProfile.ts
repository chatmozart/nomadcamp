import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export const useUserProfile = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const updateUserProfile = async (values: {
    name: string;
    email: string;
    whatsapp: string;
  }) => {
    setIsSaving(true);
    try {
      console.log('Updating user profile:', values);
      
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { 
          full_name: values.name,
          whatsapp: values.whatsapp 
        }
      });

      if (metadataError) throw metadataError;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update your profile",
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    updateUserProfile,
    isSaving
  };
};