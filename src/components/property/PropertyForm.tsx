import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Autocomplete } from "@react-google-maps/api";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PropertyFormProps {
  onSubmit: (formData: {
    title: string;
    description: string;
    price: string;
    priceThreeMonths: string;
    priceSixMonths: string;
    priceOneYear: string;
    location: string;
    imageFiles: File[];
  }) => Promise<void>;
  googleMapsLoaded: boolean;
  onPlaceSelect: (autocomplete: google.maps.places.Autocomplete) => void;
  initialData?: {
    title: string;
    description: string;
    price: number;
    priceThreeMonths?: number;
    priceSixMonths?: number;
    priceOneYear?: number;
    location: string;
  };
  mode?: 'create' | 'edit';
}

export const PropertyForm = ({ 
  onSubmit, 
  googleMapsLoaded, 
  onPlaceSelect,
  initialData,
  mode = 'create'
}: PropertyFormProps) => {
  const { toast } = useToast();
  const [propertyTitle, setPropertyTitle] = useState(initialData?.title || "");
  const [propertyDescription, setPropertyDescription] = useState(initialData?.description || "");
  const [propertyPrice, setPropertyPrice] = useState(initialData?.price?.toString() || "");
  const [propertyPriceThreeMonths, setPropertyPriceThreeMonths] = useState(initialData?.priceThreeMonths?.toString() || "");
  const [propertyPriceSixMonths, setPropertyPriceSixMonths] = useState(initialData?.priceSixMonths?.toString() || "");
  const [propertyPriceOneYear, setPropertyPriceOneYear] = useState(initialData?.priceOneYear?.toString() || "");
  const [propertyLocation, setPropertyLocation] = useState(initialData?.location || "");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'create' && imageFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "Image Required",
        description: "Please select at least one image for the property",
      });
      return;
    }

    console.log('Submitting form with images:', imageFiles);

    await onSubmit({
      title: propertyTitle,
      description: propertyDescription,
      price: propertyPrice,
      priceThreeMonths: propertyPriceThreeMonths,
      priceSixMonths: propertyPriceSixMonths,
      priceOneYear: propertyPriceOneYear,
      location: propertyLocation,
      imageFiles,
    });

    if (mode === 'create') {
      setPropertyTitle("");
      setPropertyDescription("");
      setPropertyPrice("");
      setPropertyPriceThreeMonths("");
      setPropertyPriceSixMonths("");
      setPropertyPriceOneYear("");
      setPropertyLocation("");
      setImageFiles([]);
      setPreviewUrls([]);
    }
  };

  const handlePlaceSelect = (autocomplete: google.maps.places.Autocomplete) => {
    const place = autocomplete.getPlace();
    if (place.formatted_address) {
      setPropertyLocation(place.formatted_address);
    }
    onPlaceSelect(autocomplete);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (imageFiles.length + files.length > 10) {
      toast({
        variant: "destructive",
        title: "Too many images",
        description: "Maximum 10 images allowed per property",
      });
      return;
    }
    
    const newFiles = files.filter(file => {
      const isValid = file.type.startsWith('image/');
      if (!isValid) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: `${file.name} is not an image file`,
        });
      }
      return isValid;
    });

    setImageFiles(prev => [...prev, ...newFiles]);
    
    // Generate preview URLs
    newFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      setPreviewUrls(prev => [...prev, url]);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div className="space-y-2">
        <Label htmlFor="propertyTitle">Property Title</Label>
        <Input
          id="propertyTitle"
          value={propertyTitle}
          onChange={(e) => setPropertyTitle(e.target.value)}
          placeholder="Enter property title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="propertyDescription">Description</Label>
        <Textarea
          id="propertyDescription"
          value={propertyDescription}
          onChange={(e) => setPropertyDescription(e.target.value)}
          placeholder="Describe your property"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="propertyPrice">Price per Month (฿)</Label>
        <Input
          id="propertyPrice"
          type="number"
          value={propertyPrice}
          onChange={(e) => setPropertyPrice(e.target.value)}
          placeholder="Enter monthly price"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="propertyPriceThreeMonths">Price for 3 Months (฿)</Label>
        <Input
          id="propertyPriceThreeMonths"
          type="number"
          value={propertyPriceThreeMonths}
          onChange={(e) => setPropertyPriceThreeMonths(e.target.value)}
          placeholder="Enter 3-month price"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="propertyPriceSixMonths">Price for 6 Months (฿)</Label>
        <Input
          id="propertyPriceSixMonths"
          type="number"
          value={propertyPriceSixMonths}
          onChange={(e) => setPropertyPriceSixMonths(e.target.value)}
          placeholder="Enter 6-month price"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="propertyPriceOneYear">Price for 12 Months (฿)</Label>
        <Input
          id="propertyPriceOneYear"
          type="number"
          value={propertyPriceOneYear}
          onChange={(e) => setPropertyPriceOneYear(e.target.value)}
          placeholder="Enter yearly price"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="propertyLocation">Location</Label>
        {googleMapsLoaded ? (
          <Autocomplete
            onLoad={onPlaceSelect}
            onPlaceChanged={() => {
              const autocomplete = document.querySelector('input#propertyLocation') as HTMLInputElement;
              if (autocomplete) {
                setPropertyLocation(autocomplete.value);
              }
            }}
          >
            <Input
              id="propertyLocation"
              value={propertyLocation}
              onChange={(e) => setPropertyLocation(e.target.value)}
              placeholder="Enter location"
              required
            />
          </Autocomplete>
        ) : (
          <Input
            id="propertyLocation"
            value={propertyLocation}
            onChange={(e) => setPropertyLocation(e.target.value)}
            placeholder="Enter location"
            required
          />
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="propertyImages">Property Images {mode === 'create' && '(at least 1 required)'}</Label>
        <Input
          id="propertyImages"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          multiple
          required={mode === 'create'}
        />
        
        {previewUrls.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button type="submit">
        {mode === 'create' ? 'List Property' : 'Update Property'}
      </Button>
    </form>
  );
};