import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface PropertyHeaderProps {
  title: string;
  location: string;
  location_category?: string;
  isOwner?: boolean;
  propertyId?: string;
}

export const PropertyHeader = ({ 
  title, 
  location_category,
  isOwner, 
  propertyId 
}: PropertyHeaderProps) => {
  return (
    <div className="flex justify-between items-start mb-6">
      <div className="pt-4">
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-gray-600">{location_category}</p>
      </div>
      {isOwner && propertyId && (
        <Link to={`/property/${propertyId}/edit`}>
          <Button variant="outline" size="sm">
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </Link>
      )}
    </div>
  );
};