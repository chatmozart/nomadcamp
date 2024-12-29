import { useState, useEffect } from "react";
import { PropertyAmenities } from "./PropertyAmenities";
import { supabase } from "@/lib/supabase";

interface AmenitiesSelectionProps {
  propertyId?: string;
  onAmenitiesChange: (selectedAmenityIds: string[]) => void;
  mode: 'create' | 'edit';
}

export const AmenitiesSelection = ({ propertyId, onAmenitiesChange, mode }: AmenitiesSelectionProps) => {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  useEffect(() => {
    const fetchPropertyAmenities = async () => {
      if (!propertyId || mode === 'create') return;

      try {
        console.log('Fetching amenities for property:', propertyId);
        const { data, error } = await supabase
          .from('property_amenities')
          .select('amenity_id')
          .eq('property_id', propertyId);

        if (error) {
          console.error('Error fetching property amenities:', error);
          throw error;
        }

        const amenityIds = data.map(item => item.amenity_id);
        console.log('Fetched amenity IDs:', amenityIds);
        setSelectedAmenities(amenityIds);
      } catch (error) {
        console.error('Error in fetchPropertyAmenities:', error);
      }
    };

    fetchPropertyAmenities();
  }, [propertyId, mode]);

  const handleAmenityChange = (amenityId: string) => {
    setSelectedAmenities(prev => {
      const newSelection = prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId];
      
      onAmenitiesChange(newSelection);
      return newSelection;
    });
  };

  return (
    <div className="space-y-2">
      <PropertyAmenities
        propertyId={propertyId}
        isEditing={true}
        selectedAmenities={selectedAmenities}
        onAmenityChange={handleAmenityChange}
      />
    </div>
  );
};