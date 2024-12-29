import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyAmenities } from "@/components/property/PropertyAmenities";
import { PropertyBookingCard } from "@/components/property/PropertyBookingCard";

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  image_url: string;
}

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  if (!property) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Property not found</div>;
  }

  const imageUrl = `https://mqgpycqviacxddgnwbxo.supabase.co/storage/v1/object/public/properties/${property.image_url}`;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <PropertyHeader 
          title={property.title}
          location={property.location}
        />

        {/* Image Section */}
        <div className="px-4">
          <Card className="overflow-hidden">
            <img 
              src={imageUrl}
              alt={property.title} 
              className="w-full h-[600px] object-cover"
              onError={(e) => {
                console.error('Image failed to load:', imageUrl);
                e.currentTarget.src = '/placeholder.svg';
              }}
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