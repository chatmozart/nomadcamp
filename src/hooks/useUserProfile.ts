import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface UserProfileData {
  name: string;
  email: string;
  whatsapp: string;
}

export const useUserProfile = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const updateUserProfile = async (values: UserProfileData) => {
    setIsSaving(true);
    try {
      console.log('Updating user profile:', values);
      
      // Update user metadata (name) and phone number
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          full_name: values.name
        },
        phone: values.whatsapp
      });

      if (updateError) throw updateError;

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