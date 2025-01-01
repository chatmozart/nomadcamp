import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { User } from "lucide-react";
import { ProfileFormSkeleton } from "./ProfileFormSkeleton";
import { useUserProfile } from "@/hooks/useUserProfile";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  whatsapp: z.string().min(10, "WhatsApp number must be at least 10 digits").max(15),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const ProfileForm = () => {
  const { user } = useAuth();
  const { updateUserProfile, isSaving } = useUserProfile();
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
    },
  });

  useEffect(() => {
    if (!user) return;

    console.log('Initializing form with user data:', user);
    const defaultValues: ProfileFormValues = {
      name: user.user_metadata?.full_name || "",
      email: user.email || "",
      whatsapp: user.user_metadata?.whatsapp || "",  // Changed back to user_metadata.whatsapp
    };
    form.reset(defaultValues);
    setIsLoading(false);
  }, [user, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    await updateUserProfile({
      name: values.name,
      email: values.email,
      whatsapp: values.whatsapp,
    });
  };

  if (isLoading) {
    return <ProfileFormSkeleton />;
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