import { useState, useEffect } from 'react';
import { geocodeLocation, calculateMapCenter } from '@/utils/geocodingUtils';

interface Property {
  id: string;
  location: string;
}

interface PropertyMarker {
  lat: number;
  lng: number;
  id: string;
}

export const usePropertyMarkers = (properties: Property[], isLoadingMaps: boolean) => {
  const [markers, setMarkers] = useState<PropertyMarker[]>([]);
  const [isGeocoding, setIsGeocoding] = useState(true);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral | null>(null);

  useEffect(() => {
    const geocodeAddresses = async () => {
      if (isLoadingMaps) {
        console.log('usePropertyMarkers - Waiting for Google Maps to load...');
        return;
      }

      if (!properties.length) {
        console.log('usePropertyMarkers - No properties to geocode');
        setIsGeocoding(false);
        setMapCenter({ lat: 13.7563, lng: 100.5018 }); // Default to Thailand
        return;
      }

      try {
        console.log('usePropertyMarkers - Starting geocoding for properties:', properties);
        const markersData: PropertyMarker[] = [];

        for (const property of properties) {
          if (!property.location) continue;

          const location = await geocodeLocation(property.location);
          if (location) {
            markersData.push({
              ...location,
              id: property.id
            });
          }
        }

        console.log('usePropertyMarkers - Geocoded markers:', markersData);
        
        if (markersData.length > 0) {
          setMarkers(markersData);
          setMapCenter(calculateMapCenter(markersData));
        } else {
          setMapCenter({ lat: 13.7563, lng: 100.5018 }); // Default to Thailand
        }
      } catch (error) {
        console.error('usePropertyMarkers - Geocoding error:', error);
        setMapCenter({ lat: 13.7563, lng: 100.5018 }); // Default to Thailand
      } finally {
        setIsGeocoding(false);
      }
    };

    geocodeAddresses();
  }, [properties, isLoadingMaps]);

  return { markers, isGeocoding, mapCenter };
};