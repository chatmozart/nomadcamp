import { ReactNode } from "react";
import { GoogleMap, GoogleMapProps } from "@react-google-maps/api";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import { defaultMapOptions } from "@/utils/mapUtils";

interface BaseMapProps extends Omit<GoogleMapProps, 'onLoad'> {
  children?: ReactNode;
  className?: string;
}

export const BaseMap = ({ children, className = "h-[600px]", ...props }: BaseMapProps) => {
  const { isLoading } = useGoogleMaps();

  if (isLoading) {
    return <div className={`${className} bg-muted flex items-center justify-center`}>Loading map...</div>;
  }

  return (
    <div className={className}>
      <GoogleMap
        {...props}
        options={defaultMapOptions}
        mapContainerStyle={{ width: '100%', height: '100%' }}
      >
        {children}
      </GoogleMap>
    </div>
  );
};