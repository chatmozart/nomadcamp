import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PropertyAvailabilityFieldsProps {
  initialStartDate?: string;
  initialEndDate?: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export const PropertyAvailabilityFields = ({
  initialStartDate,
  initialEndDate,
  onStartDateChange,
  onEndDateChange,
}: PropertyAvailabilityFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="availabilityStart">Available From</Label>
        <Input
          id="availabilityStart"
          type="date"
          value={initialStartDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="availabilityEnd">Available Until (Optional)</Label>
        <Input
          id="availabilityEnd"
          type="date"
          value={initialEndDate}
          onChange={(e) => onEndDateChange(e.target.value)}
        />
      </div>
    </div>
  );
};