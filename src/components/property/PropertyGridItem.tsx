import { Link } from "react-router-dom";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { useSupabaseImage } from "@/hooks/useSupabaseImage";

interface PropertyGridItemProps {
  id: number;
  title: string;
  image_url: string;
}

export const PropertyGridItem = ({ id, title, image_url }: PropertyGridItemProps) => {
  const { displayImageUrl } = useSupabaseImage(id.toString(), image_url);

  return (
    <Link to={`/property/${id}`} className="block">
      <div className="aspect-square relative rounded-lg overflow-hidden">
        <ImageWithFallback
          src={displayImageUrl}
          alt={title}
          className="w-full h-full object-cover"
          containerClassName="w-full h-full"
        />
      </div>
      <h3 className="mt-2 text-sm font-medium">{title}</h3>
    </Link>
  );
};