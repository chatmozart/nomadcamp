import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface PropertyActionsProps {
  isOwner: boolean;
  propertyId: string;
  published: boolean;
  onDelete: () => Promise<void>;
}

export const PropertyActions = ({ isOwner, propertyId, published, onDelete }: PropertyActionsProps) => {
  const { toast } = useToast();

  // Early return if not owner
  if (!isOwner) return null;

  const handlePublishToggle = async () => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ published: !published })
        .eq('id', propertyId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Property ${published ? 'unpublished' : 'published'} successfully`,
      });

      // Refresh the page to show updated state
      window.location.reload();
    } catch (error) {
      console.error('Error toggling publish state:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update property visibility",
      });
    }
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        className="gap-2"
        onClick={handlePublishToggle}
      >
        {published ? (
          <>
            <EyeOff className="h-4 w-4" />
            Unpublish
          </>
        ) : (
          <>
            <Eye className="h-4 w-4" />
            Publish
          </>
        )}
      </Button>

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