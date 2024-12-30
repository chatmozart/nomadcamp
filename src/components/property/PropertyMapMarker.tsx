import { Marker } from "@react-google-maps/api";

interface PropertyMapMarkerProps {
  position: google.maps.LatLngLiteral;
  propertyId: string;
  isHovered: boolean;
  onClick?: () => void;
}

export const PropertyMapMarker = ({ position, propertyId, isHovered, onClick }: PropertyMapMarkerProps) => {
  return (
    <Marker
      position={position}
      onClick={onClick}
      icon={{
        path: google.maps.SymbolPath.CIRCLE,
        scale: isHovered ? 12 : 10,
        fillColor: isHovered ? "#0EA5E9" : "#ef4444",
        fillOpacity: 0.6,
        strokeColor: isHovered ? "#0284c7" : "#dc2626",
        strokeWeight: 2,
        strokeOpacity: 0.8
      }}
    />
  );
};