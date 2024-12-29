import { MapPin, Star, Share, Heart } from "lucide-react";

interface PropertyHeaderProps {
  title: string;
  location: string;
  rating?: number;
  reviews?: number;
}

export const PropertyHeader = ({ title, location, rating = 4.5, reviews = 0 }: PropertyHeaderProps) => {
  console.log('Rendering PropertyHeader:', { title, location });
  
  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-bold">{title}</h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center">
              <MapPin className="mr-2" />
              <span>{location}</span>
            </div>
            <div className="flex items-center">
              <Star className="mr-2" />
              <span>{rating} ({reviews} reviews)</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-full">
            <Share className="w-5 h-5" />
            <span>Share</span>
          </button>
          <button className="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-full">
            <Heart className="w-5 h-5" />
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};