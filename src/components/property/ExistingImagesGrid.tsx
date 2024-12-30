import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface ExistingImagesGridProps {
  propertyId: string;
  images: string[];
  onImageDelete: (deletedImageUrl: string) => void;
}

export const ExistingImagesGrid = ({ 
  propertyId, 
  images, 
  onImageDelete 
}: ExistingImagesGridProps) => {
  const { toast } = useToast();
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});

  const getSignedUrl = async (imageUrl: string) => {
    if (signedUrls[imageUrl]) return signedUrls[imageUrl];

    try {
      console.log('Fetching signed URL for:', imageUrl);
      const { data, error } = await supabase.storage
        .from('properties')
        .createSignedUrl(imageUrl, 2592000); // 30 days expiry

      if (error) {
        console.error('Error getting signed URL:', error);
        throw error;
      }

      console.log('Received signed URL:', data.signedUrl);
      setSignedUrls(prev => ({
        ...prev,
        [imageUrl]: data.signedUrl
      }));

      return data.signedUrl;
    } catch (error) {
      console.error('Error getting signed URL:', error);
      return null;
    }
  };

  const handleDelete = async (imageUrl: string) => {
    try {
      console.log('Attempting to delete image:', imageUrl);
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('properties')
        .remove([imageUrl]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
        throw storageError;
      }

      console.log('Successfully deleted from storage');

      // Delete from property_images table
      const { error: dbError } = await supabase
        .from('property_images')
        .delete()
        .match({ property_id: propertyId, image_url: imageUrl });

      if (dbError) {
        console.error('Database deletion error:', dbError);
        throw dbError;
      }

      console.log('Successfully deleted from database');
      onImageDelete(imageUrl);
      
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete image",
      });
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
      {images.map((imageUrl, index) => (
        <div key={index} className="relative">
          <img
            src={signedUrls[imageUrl] || '/placeholder.svg'}
            alt={`Existing image ${index + 1}`}
            className="w-full aspect-square object-cover rounded-lg"
            onLoad={async () => {
              if (!signedUrls[imageUrl]) {
                await getSignedUrl(imageUrl);
              }
            }}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => handleDelete(imageUrl)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};