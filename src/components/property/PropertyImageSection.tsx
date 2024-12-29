import { Card } from "@/components/ui/card";
import { ImageCarousel } from "./ImageCarousel";

interface PropertyImageSectionProps {
  imageUrl: string | null;
  title: string;
  additionalImages?: string[];
}

export const PropertyImageSection = ({ 
  imageUrl, 
  title,
  additionalImages = []
}: PropertyImageSectionProps) => {
  const allImages = imageUrl ? [imageUrl, ...additionalImages] : additionalImages;

  return (
    <div className="px-4">
      <Card className="overflow-hidden">
        <ImageCarousel images={allImages} title={title} />
      </Card>
    </div>
  );
};