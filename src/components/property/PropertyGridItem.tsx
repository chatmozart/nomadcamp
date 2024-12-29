import { Home } from "lucide-react";
import { Link } from "react-router-dom";

interface PropertyGridItemProps {
  id: number;
  title: string;
  imageUrl?: string;
}

export const PropertyGridItem = ({ id, title, imageUrl }: PropertyGridItemProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Image failed to load, using placeholder');
    e.currentTarget.src = '/placeholder.svg';
  };

  return (
    <Link 
      to={`/property/${id}`}
      className="flex flex-col space-y-2"
    >
      <h3 className="font-medium text-sm truncate">{title}</h3>
      <div className="relative aspect-square rounded-lg overflow-hidden hover:opacity-90 transition-opacity">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Home className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>
    </Link>
  );
};