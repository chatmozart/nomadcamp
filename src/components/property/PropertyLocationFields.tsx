import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Autocomplete } from "@react-google-maps/api";
import { useLocations } from "@/hooks/useLocations";

interface PropertyLocationFieldsProps {
  locationCategory: string;
  location: string;
  onLocationCategoryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  googleMapsLoaded: boolean;
  onPlaceSelect: (autocomplete: google.maps.places.Autocomplete) => void;
}

export const PropertyLocationFields = ({
  locationCategory,
  location,
  onLocationCategoryChange,
  onLocationChange,
  googleMapsLoaded,
  onPlaceSelect,
}: PropertyLocationFieldsProps) => {
  const { data: locations, isLoading: isLoadingLocations } = useLocations();

  console.log('Current location category:', locationCategory);
  console.log('Available locations:', locations);

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="locationCategory">Location Category</Label>
        <Select
          value={locationCategory}
          onValueChange={onLocationCategoryChange}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a location category" />
          </SelectTrigger>
          <SelectContent>
            {locations?.map((location) => (
              <SelectItem key={location.id} value={location.id.toString()}>
                {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="propertyLocation">Exact Location (from Google Maps)</Label>
        {googleMapsLoaded ? (
          <Autocomplete
            onLoad={onPlaceSelect}
            onPlaceChanged={() => {
              const autocomplete = document.querySelector('input#propertyLocation') as HTMLInputElement;
              if (autocomplete) {
                onLocationChange(autocomplete.value);
              }
            }}
          >
            <Input
              id="propertyLocation"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              placeholder="Enter exact location"
              required
            />
          </Autocomplete>
        ) : (
          <Input
            id="propertyLocation"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="Enter exact location"
            required
          />
        )}
      </div>
    </>
  );
};