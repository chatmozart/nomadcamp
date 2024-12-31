import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { X } from "lucide-react";

interface DateFilterProps {
  onDateChange: (date: string | null, isExact: boolean) => void;
  initialDate?: string | null;
  initialIsExact?: boolean;
}

export const DateFilter = ({ 
  onDateChange, 
  initialDate = null, 
  initialIsExact = false 
}: DateFilterProps) => {
  const [dateType, setDateType] = useState<"approximate" | "exact">(
    initialIsExact ? "exact" : "approximate"
  );
  const [selectedDate, setSelectedDate] = useState<string>(initialDate || "");

  useEffect(() => {
    if (initialDate) {
      setSelectedDate(initialDate);
      onDateChange(initialDate, initialIsExact);
    }
  }, [initialDate, initialIsExact]);

  const handleDateTypeChange = (value: "approximate" | "exact") => {
    setDateType(value);
    if (value === "approximate") {
      onDateChange(selectedDate, false);
    } else {
      onDateChange(selectedDate, true);
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    onDateChange(date, dateType === "exact");
  };

  const handleClear = () => {
    setSelectedDate("");
    setDateType("approximate");
    onDateChange(null, false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Date Filter</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="h-8 px-2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>

      <RadioGroup
        defaultValue={dateType}
        value={dateType}
        onValueChange={(value: "approximate" | "exact") => handleDateTypeChange(value)}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="approximate" id="approximate" />
          <Label htmlFor="approximate">Approximate Date</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="exact" id="exact" />
          <Label htmlFor="exact">Exact Date</Label>
        </div>
      </RadioGroup>

      <div className="space-y-2">
        <Label htmlFor="availabilityDate">Select Date</Label>
        <Input
          type="date"
          id="availabilityDate"
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
          min={format(new Date(), 'yyyy-MM-dd')}
        />
      </div>
    </div>
  );
};