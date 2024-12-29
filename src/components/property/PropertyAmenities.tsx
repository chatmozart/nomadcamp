import { Wifi, Home, Car, Tv } from "lucide-react";

export const PropertyAmenities = () => {
  return (
    <div className="py-6 border-b">
      <h3 className="text-xl font-semibold mb-4">What this place offers</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-4">
          <Wifi className="w-6 h-6" />
          <span>WiFi</span>
        </div>
        <div className="flex items-center gap-4">
          <Home className="w-6 h-6" />
          <span>Kitchen</span>
        </div>
        <div className="flex items-center gap-4">
          <Car className="w-6 h-6" />
          <span>Free Parking</span>
        </div>
        <div className="flex items-center gap-4">
          <Tv className="w-6 h-6" />
          <span>TV</span>
        </div>
      </div>
    </div>
  );
};