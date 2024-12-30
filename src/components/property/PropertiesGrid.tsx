import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyGridItem } from "./PropertyGridItem";

interface Property {
  id: number;
  title: string;
  imageSignedUrl?: string;
}

interface PropertiesGridProps {
  properties: Property[];
}

export const PropertiesGrid = ({ properties }: PropertiesGridProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Properties</h2>
        <Link to="/list-property">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            List Property
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {properties.map((property) => (
          <PropertyGridItem
            key={property.id}
            id={property.id}
            title={property.title}
            image_url={property.imageSignedUrl || ''}
          />
        ))}
      </div>
    </div>
  );
};