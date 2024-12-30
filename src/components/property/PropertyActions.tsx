import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PropertyActionsProps {
  isOwner: boolean;
  propertyId: string;
  onDelete: () => Promise<void>;
}

export const PropertyActions = ({ isOwner, propertyId, onDelete }: PropertyActionsProps) => {
  // Early return if not owner
  if (!isOwner) return null;

  return (
    <div className="flex gap-2">
      <Link to={`/property/${propertyId}/edit`}>
        <Button variant="outline" className="gap-2">
          <Pencil className="h-4 w-4" />
          Edit Property
        </Button>
      </Link>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="gap-2">
            <Trash2 className="h-4 w-4" />
            Delete Property
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              property listing and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};