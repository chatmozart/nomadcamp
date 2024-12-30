import { useEffect, useState } from "react";

interface PropertyMapMarkerProps {
  position: google.maps.LatLngLiteral;
  propertyId: string;
  isHovered: boolean;
  onClick?: () => void;
}

export const PropertyMapMarker = ({ position, propertyId, isHovered, onClick }: PropertyMapMarkerProps) => {
  const [circle, setCircle] = useState<google.maps.Circle | null>(null);

  useEffect(() => {
    if (!window.google) return;

    const newCircle = new google.maps.Circle({
      center: position,
      radius: 100, // 100 meters
      fillColor: isHovered ? "#0EA5E9" : "#ef4444",
      fillOpacity: 0.6,
      strokeColor: isHovered ? "#0284c7" : "#dc2626",
      strokeWeight: 2,
      strokeOpacity: 0.8,
      clickable: true
    });

    if (onClick) {
      newCircle.addListener("click", onClick);
    }

    setCircle(newCircle);

    return () => {
      if (circle) {
        google.maps.event.clearInstanceListeners(circle);
        circle.setMap(null);
      }
    };
  }, [position, isHovered, onClick]);

  useEffect(() => {
    if (circle) {
      circle.setOptions({
        fillColor: isHovered ? "#0EA5E9" : "#ef4444",
        strokeColor: isHovered ? "#0284c7" : "#dc2626"
      });
    }
  }, [isHovered, circle]);

  return null;
};