import { useEffect, useState } from "react";
import { BaseMap } from "./BaseMap";
import { PropertyMapMarker } from "./PropertyMapMarker";

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
  const [isGeocoding, setIsGeocoding] = useState(true);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const geocodeAddresses = async () => {
      if (!window.google || !properties.length) {
        setIsGeocoding(false);
        return;
      }

      try {
        console.log('PropertiesMap - Starting geocoding for properties:', properties);
        const geocoder = new google.maps.Geocoder();
        const markersData = [];

        for (const property of properties) {
          if (!property.location) continue;

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
        
        if (markersData.length > 0) {
          setMarkers(markersData);
          const center = markersData.reduce(
            (acc, curr) => ({
              lat: acc.lat + curr.lat / markersData.length,
              lng: acc.lng + curr.lng / markersData.length
            }),
            { lat: 0, lng: 0 }
          );
          setMapCenter(center);
        } else {
          // If no markers were created, set a default center (e.g., Thailand)
          setMapCenter({ lat: 13.7563, lng: 100.5018 });
        }
      } catch (error) {
        console.error('PropertiesMap - Geocoding error:', error);
        // Set default center on error
        setMapCenter({ lat: 13.7563, lng: 100.5018 });
      } finally {
        setIsGeocoding(false);
      }
    };

    if (properties.length > 0) {
      geocodeAddresses();
    } else {
      setIsGeocoding(false);
      setMapCenter({ lat: 13.7563, lng: 100.5018 }); // Default center when no properties
    }
  }, [properties]);

  if (isGeocoding) {
    return <div className="h-full bg-muted flex items-center justify-center">Loading map locations...</div>;
  }

  if (!mapCenter) {
    return <div className="h-full bg-muted flex items-center justify-center">Could not load map</div>;
  }

  return (
    <BaseMap 
      center={mapCenter} 
      zoom={markers.length > 0 ? 13 : 5}
      className="h-full w-full rounded-xl overflow-hidden"
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
    </BaseMap>
  );
};