import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { User } from "lucide-react";
import { supabase } from "@/lib/supabase";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  whatsapp: z.string().min(10, "WhatsApp number must be at least 10 digits").max(15),
});

export const ProfileForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
    },
  });

  useEffect(() => {
    const initializeForm = () => {
      // Initialize with auth user data first
      form.reset({
        name: user?.user_metadata?.full_name || "",
        email: user?.email || "",
        whatsapp: "",
      });
    };

    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        console.log('Fetching user profile:', user.id);
        
        // Try to fetch from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          console.log('Profile fetch error:', profileError);
          if (profileError.code === '42P01') {
            console.log('Profiles table does not exist yet. Using default values from auth.users.');
            initializeForm();
            setIsLoading(false);
            return;
          }
          throw profileError;
        }

        if (profileData) {
          console.log('Fetched profile data:', profileData);
          form.reset({
            name: profileData.name || user.user_metadata?.full_name || "",
            email: profileData.email || user.email || "",
            whatsapp: profileData.whatsapp || "",
          });
        } else {
          console.log('No profile data found, using auth user data');
          initializeForm();
        }
      } catch (error: any) {
        console.error('Error fetching user profile:', error);
        initializeForm();
        if (error.code !== '42P01') {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load your profile",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, toast, form]);

  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    if (!user) return;

    setIsSaving(true);
    try {
      console.log('Updating profile:', values);
      
      // Update auth.users metadata first
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { full_name: values.name }
      });

      if (metadataError) throw metadataError;

      try {
        // Then try to update profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            name: values.name,
            email: values.email,
            whatsapp: values.whatsapp,
            updated_at: new Date().toISOString(),
          });

        if (profileError) {
          console.log('Profile update error:', profileError);
          if (profileError.code === '42P01') {
            // If profiles table doesn't exist, just show success since we updated auth metadata
            toast({
              title: "Profile updated",
              description: "Your profile has been successfully updated.",
            });
            return;
          }
          throw profileError;
        }
      } catch (error: any) {
        console.log('Profile update catch error:', error);
        if (error.code !== '42P01') {
          throw error;
        }
      }

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
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6 mb-8">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-primary/10 rounded-full w-12"></div>
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-10 bg-muted rounded"></div>
          <div className="h-10 bg-muted rounded"></div>
          <div className="h-10 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-primary/10 p-4 rounded-full">
          <User className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Profile Settings</h2>
          <p className="text-muted-foreground">
            Member since {new Date(user?.created_at || "").toLocaleDateString()}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp Number</FormLabel>
                <FormControl>
                  <Input placeholder="Your WhatsApp number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    </Card>
  );
};