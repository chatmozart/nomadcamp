import { Card } from "@/components/ui/card";

export const ProfileFormSkeleton = () => {
  return (
    <Card className="p-6 mb-8">
      <div className="animate-pulse space-y-4">
        <div className="h-12 bg-primary/10 rounded-full w-12"></div>
        <div className="h-4 bg-muted rounded w-1/4"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
        <div className="h-10 bg-muted rounded"></div>
        <div className="h-10 bg-muted rounded"></div>
        <div className="h-10 bg-muted rounded"></div>
      </div>
    </Card>
  );
};