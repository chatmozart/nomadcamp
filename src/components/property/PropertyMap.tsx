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
          const location = {
            lat: result[0].geometry.location.lat(),
            lng: result[0].geometry.location.lng()
          };
          console.log('PropertyMap - Geocoded coordinates:', location);
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
  }, [address, window.google]);

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
        zoom={15}
        mapContainerStyle={{ width: '100%', height: '100%' }}
      >
        <Marker position={coordinates} />
      </GoogleMap>
    </div>
  );
};