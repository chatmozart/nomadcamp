import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

interface DateFilterProps {
  onDateChange: (date: string | null, isExact: boolean) => void;
}

export const DateFilter = ({ onDateChange }: DateFilterProps) => {
  const [dateType, setDateType] = useState<"approximate" | "exact">("approximate");
  const [selectedDate, setSelectedDate] = useState<string>("");

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

  return (
    <div className="space-y-4">
      <RadioGroup
        defaultValue="approximate"
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