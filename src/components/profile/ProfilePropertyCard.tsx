import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Property } from "@/types/property";
import { useSupabaseImage } from "@/hooks/useSupabaseImage";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

export const ProfilePropertyCard = ({
  id,
  title,
  location,
  price,
  image_url,
  published,
}: Property) => {
  const { displayImageUrl } = useSupabaseImage(id, image_url);

  console.log('ProfilePropertyCard image:', { id, image_url, displayImageUrl });

  return (
    <Link to={`/property/${id}/edit`}>
      <Card className="h-full hover:shadow-lg transition-shadow">
        <div className="relative aspect-[4/3]">
          <ImageWithFallback
            src={displayImageUrl}
            alt={title}
            className="w-full h-full object-cover rounded-t-lg"
          />
          <div className="absolute top-2 right-2">
            <Button
              variant={published ? "default" : "destructive"}
              size="sm"
              className="text-xs"
            >
              {published ? "Published" : "Unpublished"}
            </Button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold mb-2 line-clamp-1">{title}</h3>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
            {location}
          </p>
          <p className="text-sm font-medium">
            ฿{price.toLocaleString()} / month
          </p>
        </div>
      </Card>
    </Link>
  );
};