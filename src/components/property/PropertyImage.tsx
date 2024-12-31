import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { useSupabaseImage } from "@/hooks/useSupabaseImage";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

interface PropertyImageProps {
  id: string;
  title: string;
  image: string | null;
  isOwner: boolean;
  published?: boolean;
}

export const PropertyImage = ({ id, title, image, isOwner, published = true }: PropertyImageProps) => {
  const { displayImageUrl } = useSupabaseImage(id, image);

  return (
    <div className="relative w-full pb-[66.67%]">
      <div className="absolute inset-0">
        <ImageWithFallback
          src={displayImageUrl}
          alt={title}
          className="w-full h-full object-cover"
          containerClassName="w-full h-full"
        />
      </div>
      {isOwner && (
        <div className="absolute top-2 right-2">
          <Badge 
            variant={published ? "default" : "destructive"}
            className="flex items-center gap-1"
          >
            {published ? (
              <>
                <Check className="w-3 h-3" />
                Published
              </>
            ) : (
              <>
                <X className="w-3 h-3" />
                Unpublished
              </>
            )}
          </Badge>
        </div>
      )}
    </div>
  );
};