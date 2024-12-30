import { useEffect, useState } from "react";
import { GoogleMap } from "@react-google-maps/api";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import { PropertyMapMarker } from "./PropertyMapMarker";
import { defaultMapOptions } from "@/utils/mapUtils";

interface Property {
  id: string;
  title: string;
  location: string;
}

interface PropertiesMapProps {
  properties: Property[];
  onMarkerClick?: (propertyId: string) => void;
  hoveredPropertyId?: string | null;
}

export const PropertiesMap = ({ properties, onMarkerClick, hoveredPropertyId }: PropertiesMapProps) => {
  const [markers, setMarkers] = useState<{ lat: number; lng: number; id: string }[]>([]);
  const { isLoading: isLoadingApi } = useGoogleMaps();
  const [isGeocoding, setIsGeocoding] = useState(true);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const geocodeAddresses = async () => {
      if (!window.google || !properties.length) return;

      try {
        console.log('PropertiesMap - Geocoding addresses for properties:', properties);
        const geocoder = new google.maps.Geocoder();
        const markersData = [];

        for (const property of properties) {
          try {
            const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
              geocoder.geocode({ address: property.location }, (results, status) => {
                if (status === 'OK' && results) {
                  resolve(results);
                } else {
                  reject(new Error(`Geocoding failed for ${property.location}: ${status}`));
                }
              });
            });

            if (result[0]?.geometry?.location) {
              const location = {
                lat: result[0].geometry.location.lat(),
                lng: result[0].geometry.location.lng()
              };
              
              markersData.push({
                ...location,
                id: property.id
              });
            }
          } catch (error) {
            console.error(`Error geocoding property ${property.id}:`, error);
          }
        }

        console.log('PropertiesMap - Geocoded markers:', markersData);
        setMarkers(markersData);

        if (markersData.length > 0) {
          const center = markersData.reduce(
            (acc, curr) => ({
              lat: acc.lat + curr.lat / markersData.length,
              lng: acc.lng + curr.lng / markersData.length
            }),
            { lat: 0, lng: 0 }
          );
          setMapCenter(center);
        }
      } catch (error) {
        console.error('PropertiesMap - Geocoding error:', error);
      } finally {
        setIsGeocoding(false);
      }
    };

    if (window.google && properties.length > 0) {
      geocodeAddresses();
    }
  }, [properties]);

  if (isLoadingApi || isGeocoding) {
    return <div className="h-full bg-muted flex items-center justify-center">Loading map...</div>;
  }

  if (!mapCenter || markers.length === 0) {
    return <div className="h-full bg-muted flex items-center justify-center">Could not load map locations</div>;
  }

  return (
    <div className="h-full w-full rounded-xl overflow-hidden">
      <GoogleMap
        center={mapCenter}
        zoom={13}
        mapContainerStyle={{ width: '100%', height: '100%' }}
        options={defaultMapOptions}
      >
        {markers.map((marker) => (
          <PropertyMapMarker
            key={marker.id}
            position={{ lat: marker.lat, lng: marker.lng }}
            propertyId={marker.id}
            isHovered={hoveredPropertyId === marker.id}
            onClick={() => onMarkerClick?.(marker.id)}
          />
        ))}
      </GoogleMap>
    </div>
  );
};