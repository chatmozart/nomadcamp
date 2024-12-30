import { useEffect, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";

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
              // Add random offset within 300 meters for privacy
              const metersToLatDegrees = 0.00001 / 1.11;
              const randomLat = (Math.random() - 0.5) * (300 * metersToLatDegrees * 2);
              const randomLng = (Math.random() - 0.5) * (300 * metersToLatDegrees * 2);

              const location = {
                lat: result[0].geometry.location.lat() + randomLat,
                lng: result[0].geometry.location.lng() + randomLng,
                id: property.id
              };
              markersData.push(location);
            }
          } catch (error) {
            console.error(`Error geocoding property ${property.id}:`, error);
          }
        }

        console.log('PropertiesMap - Geocoded markers:', markersData);
        setMarkers(markersData);

        // Set map center to the average of all markers
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
    return <div className="h-[400px] bg-muted flex items-center justify-center">Loading map...</div>;
  }

  if (!mapCenter || markers.length === 0) {
    return <div className="h-[400px] bg-muted flex items-center justify-center">Could not load map locations</div>;
  }

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden">
      <GoogleMap
        center={mapCenter}
        zoom={13}
        mapContainerStyle={{ width: '100%', height: '100%' }}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => onMarkerClick?.(marker.id)}
            icon={{
              url: hoveredPropertyId === marker.id 
                ? "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                : "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
              scaledSize: new google.maps.Size(32, 32)
            }}
            animation={hoveredPropertyId === marker.id ? google.maps.Animation.BOUNCE : undefined}
          />
        ))}
      </GoogleMap>
    </div>
  );
};