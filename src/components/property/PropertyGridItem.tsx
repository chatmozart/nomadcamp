import { Link } from "react-router-dom";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

interface PropertyGridItemProps {
  id: number;
  title: string;
  imageUrl?: string;
}

export const PropertyGridItem = ({ id, title, imageUrl }: PropertyGridItemProps) => {
  return (
    <Link 
      to={`/property/${id}`}
      className="flex flex-col space-y-2"
    >
      <h3 className="font-medium text-sm truncate">{title}</h3>
      <div className="relative aspect-square rounded-lg overflow-hidden">
        <ImageWithFallback
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          containerClassName="w-full h-full"
        />
      </div>
    </Link>
  );
};