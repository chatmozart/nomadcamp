import { BaseMap } from "./BaseMap";
import { PropertyMapMarker } from "./PropertyMapMarker";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import { usePropertyMarkers } from "@/hooks/usePropertyMarkers";

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
  const { isLoading: isLoadingMaps, isError: isMapsError } = useGoogleMaps();
  const { markers, isGeocoding, mapCenter } = usePropertyMarkers(properties, isLoadingMaps);

  if (isLoadingMaps || isGeocoding) {
    return <div className="h-full bg-muted flex items-center justify-center">Loading map locations...</div>;
  }

  if (isMapsError || !mapCenter) {
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