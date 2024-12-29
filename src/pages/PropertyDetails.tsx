import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Star, MapPin, Share, Heart, Home, Wifi, Car, Tv } from "lucide-react";
import { supabase } from "@/lib/supabase";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-3xl font-bold">{property.title}</h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center">
                  <MapPin className="mr-2" />
                  <span>{property.location}</span>
                </div>
                <div className="flex items-center">
                  <Star className="mr-2" />
                  <span>4.5 (0 reviews)</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-full">
                <Share className="w-5 h-5" />
                <span>Share</span>
              </button>
              <button className="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-full">
                <Heart className="w-5 h-5" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="px-4">
          <Card className="overflow-hidden">
            <img 
              src={`https://mqgpycqviacxddgnwbxo.supabase.co/storage/v1/object/public/properties/${property.image_url}`}
              alt={property.title} 
              className="w-full h-[600px] object-cover" 
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

            <div className="py-6 border-b">
              <h3 className="text-xl font-semibold mb-4">What this place offers</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-4">
                  <Wifi className="w-6 h-6" />
                  <span>WiFi</span>
                </div>
                <div className="flex items-center gap-4">
                  <Home className="w-6 h-6" />
                  <span>Kitchen</span>
                </div>
                <div className="flex items-center gap-4">
                  <Car className="w-6 h-6" />
                  <span>Free Parking</span>
                </div>
                <div className="flex items-center gap-4">
                  <Tv className="w-6 h-6" />
                  <span>TV</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <Card className="p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <div className="text-2xl font-bold">${property.price}</div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  <span>4.5</span>
                  <span className="mx-1">•</span>
                  <span className="text-gray-600">0 reviews</span>
                </div>
              </div>
              <button className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors">
                Reserve
              </button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;