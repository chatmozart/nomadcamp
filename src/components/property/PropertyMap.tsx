import { useEffect, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";

interface PropertyMapProps {
  address: string;
}

export const PropertyMap = ({ address }: PropertyMapProps) => {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const { isLoading: isLoadingApi } = useGoogleMaps();
  const [isGeocoding, setIsGeocoding] = useState(true);

  useEffect(() => {
    const geocodeAddress = async () => {
      if (!window.google || !address) return;

      try {
        console.log('PropertyMap - Geocoding address:', address);
        const geocoder = new google.maps.Geocoder();
        
        const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
          geocoder.geocode({ address }, (results, status) => {
            if (status === 'OK' && results) {
              resolve(results);
            } else {
              reject(new Error(`Geocoding failed: ${status}`));
            }
          });
        });

        if (result[0]?.geometry?.location) {
          // Add random offset within 300 meters
          const metersToLatDegrees = 0.00001 / 1.11; // Approximate conversion
          const randomLat = (Math.random() - 0.5) * (300 * metersToLatDegrees * 2);
          const randomLng = (Math.random() - 0.5) * (300 * metersToLatDegrees * 2);

          const location = {
            lat: result[0].geometry.location.lat() + randomLat,
            lng: result[0].geometry.location.lng() + randomLng
          };
          console.log('PropertyMap - Approximated coordinates:', location);
          setCoordinates(location);
        }
      } catch (error) {
        console.error('PropertyMap - Geocoding error:', error);
      } finally {
        setIsGeocoding(false);
      }
    };

    if (window.google && address) {
      geocodeAddress();
    }
  }, [address]);

  if (isLoadingApi || isGeocoding) {
    return <div className="h-[400px] bg-muted flex items-center justify-center">Loading map...</div>;
  }

  if (!coordinates) {
    return <div className="h-[400px] bg-muted flex items-center justify-center">Could not load map location</div>;
  }

  return (
    <div className="h-[400px] w-full">
      <GoogleMap
        center={coordinates}
        zoom={14}
        mapContainerStyle={{ width: '100%', height: '100%' }}
      >
        <Marker position={coordinates} />
      </GoogleMap>
    </div>
  );
};