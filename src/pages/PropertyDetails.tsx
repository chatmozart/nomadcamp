import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyAmenities } from "@/components/property/PropertyAmenities";
import { PropertyBookingCard } from "@/components/property/PropertyBookingCard";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  image_url: string;
  owner_id: string;
}

const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      console.log('Fetching property details for ID:', id);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching property:', error);
        return;
      }

      console.log('Property details fetched:', data);
      setProperty(data);
      setIsLoading(false);
    };

    fetchProperty();
  }, [id]);

  useEffect(() => {
    const loadImageUrl = async () => {
      if (!property?.image_url) return;

      console.log('PropertyDetails - Starting to load image URL:', property.image_url);
      
      try {
        const { data, error } = await supabase.storage
          .from('properties')
          .createSignedUrl(property.image_url, 60 * 60); // URL valid for 1 hour

        if (error) {
          console.error('PropertyDetails - Error generating signed URL:', error);
          return;
        }

        console.log('PropertyDetails - Generated Supabase signed URL:', data?.signedUrl);
        setImageUrl(data?.signedUrl || null);
      } catch (error) {
        console.error('PropertyDetails - Failed to generate signed URL:', error);
      }
    };

    loadImageUrl();
  }, [property?.image_url]);

  const handleDelete = async () => {
    if (!property) return;

    console.log('Attempting to delete property:', property.id);
    
    try {
      // Delete the image from storage
      if (property.image_url) {
        const { error: storageError } = await supabase.storage
          .from('properties')
          .remove([property.image_url]);

        if (storageError) {
          console.error('Error deleting property image:', storageError);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to delete property image",
          });
          return;
        }
      }

      // Delete the property record
      const { error: deleteError } = await supabase
        .from('properties')
        .delete()
        .eq('id', property.id);

      if (deleteError) {
        console.error('Error deleting property:', deleteError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete property",
        });
        return;
      }

      console.log('Property deleted successfully');
      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
      navigate('/');
    } catch (error) {
      console.error('Error in delete operation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  if (!property) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Property not found</div>;
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('PropertyDetails - Image failed to load:', {
      imageUrl,
      originalImage: property.image_url,
      error: e
    });
    e.currentTarget.src = '/placeholder.svg';
  };

  const isOwner = user?.id === property.owner_id;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center px-4">
          <PropertyHeader 
            title={property.title}
            location={property.location}
          />
          {isOwner && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Property
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    property listing and remove the data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {/* Image Section */}
        <div className="px-4">
          <Card className="overflow-hidden">
            <img 
              src={imageUrl || '/placeholder.svg'}
              alt={property.title} 
              className="w-full h-[600px] object-cover"
              onError={handleImageError}
            />
          </Card>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-3 gap-12 px-4 py-8">
          <div className="col-span-2">
            <div className="border-b pb-6">
              <h2 className="text-2xl font-semibold mb-4">
                Property Details
              </h2>
            </div>

            <div className="py-6 border-b">
              <p className="text-gray-600">{property.description}</p>
            </div>

            <PropertyAmenities />
          </div>

          <div className="col-span-1">
            <PropertyBookingCard price={property.price} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;