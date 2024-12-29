import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import * as icons from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";

interface Amenity {
  id: string;
  name: string;
  icon: string;
}

interface PropertyAmenitiesProps {
  propertyId?: string;
  isEditing?: boolean;
  selectedAmenities?: string[];
  onAmenityChange?: (amenityId: string) => void;
}

export const PropertyAmenities = ({ 
  propertyId,
  isEditing = false,
  selectedAmenities = [],
  onAmenityChange
}: PropertyAmenitiesProps) => {
  const { data: amenities, isLoading } = useQuery({
    queryKey: ['amenities'],
    queryFn: async () => {
      console.log('Fetching amenities');
      const { data, error } = await supabase
        .from('amenities')
        .select('*')
        .order('name');
      
      if (error) throw error;
      console.log('Fetched amenities:', data);
      return data as Amenity[];
    }
  });

  const { data: propertyAmenities, isLoading: isLoadingPropertyAmenities } = useQuery({
    queryKey: ['property-amenities', propertyId],
    queryFn: async () => {
      if (!propertyId) return [];
      
      console.log('Fetching property amenities for:', propertyId);
      const { data, error } = await supabase
        .from('property_amenities')
        .select('amenity_id')
        .eq('property_id', propertyId);
      
      if (error) throw error;
      console.log('Fetched property amenities:', data);
      return data.map(pa => pa.amenity_id);
    },
    enabled: !!propertyId && !isEditing
  });

  if (isLoading || (isLoadingPropertyAmenities && !isEditing)) {
    return (
      <div className="py-6 border-b">
        <h3 className="text-xl font-semibold mb-4">What this place offers</h3>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const displayAmenities = amenities?.filter(amenity => 
    isEditing 
      ? selectedAmenities.includes(amenity.id)
      : propertyAmenities?.includes(amenity.id)
  );

  const IconComponent = (iconName: string) => {
    const Icon = (icons as any)[iconName];
    return Icon ? <Icon className="w-6 h-6 text-gray-600" /> : null;
  };

  return (
    <div className="py-6 border-b">
      <h3 className="text-xl font-semibold mb-4">What this place offers</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {isEditing ? (
          amenities?.map((amenity) => (
            <label 
              key={amenity.id} 
              className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <Checkbox
                checked={selectedAmenities.includes(amenity.id)}
                onCheckedChange={() => onAmenityChange?.(amenity.id)}
                className="h-5 w-5"
              />
              {IconComponent(amenity.icon)}
              <span className="text-sm text-gray-700">{amenity.name}</span>
            </label>
          ))
        ) : (
          displayAmenities?.map((amenity) => (
            <div 
              key={amenity.id} 
              className="flex items-center gap-4 p-2"
            >
              {IconComponent(amenity.icon)}
              <span className="text-sm text-gray-700">{amenity.name}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};