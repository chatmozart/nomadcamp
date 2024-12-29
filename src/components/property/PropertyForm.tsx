import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Autocomplete } from "@react-google-maps/api";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ExistingImagesGrid } from "./ExistingImagesGrid";
import { AmenitiesSelection } from "./AmenitiesSelection";
import { PropertyAvailabilityFields } from "./PropertyAvailabilityFields";

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
    amenityIds: string[];
    availabilityStart: string;
    availabilityEnd?: string;
  }) => Promise<void>;
  googleMapsLoaded: boolean;
  onPlaceSelect: (autocomplete: google.maps.places.Autocomplete) => void;
  initialData?: {
    id?: string;
    title: string;
    description: string;
    price: number;
    priceThreeMonths?: number;
    priceSixMonths?: number;
    priceOneYear?: number;
    location: string;
    existingImages?: string[];
    availabilityStart?: string;
    availabilityEnd?: string;
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

  const [existingImages, setExistingImages] = useState<string[]>(
    initialData?.existingImages || []
  );

  const [selectedAmenityIds, setSelectedAmenityIds] = useState<string[]>([]);
  const [availabilityStart, setAvailabilityStart] = useState(initialData?.availabilityStart || "");
  const [availabilityEnd, setAvailabilityEnd] = useState(initialData?.availabilityEnd || "");
  const [contactName, setContactName] = useState(initialData?.contactName || "");
  const [contactEmail, setContactEmail] = useState(initialData?.contactEmail || "");
  const [contactWhatsapp, setContactWhatsapp] = useState(initialData?.contactWhatsapp || "");

  const handleExistingImageDelete = (deletedImageUrl: string) => {
    setExistingImages(prev => prev.filter(url => url !== deletedImageUrl));
  };

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

    if (!availabilityStart) {
      toast({
        variant: "destructive",
        title: "Availability Required",
        description: "Please select when the property becomes available",
      });
      return;
    }

    console.log('Submitting form with data:', {
      images: imageFiles,
      amenities: selectedAmenityIds,
      availability: { start: availabilityStart, end: availabilityEnd }
    });

    await onSubmit({
      title: propertyTitle,
      description: propertyDescription,
      price: propertyPrice,
      priceThreeMonths: propertyPriceThreeMonths,
      priceSixMonths: propertyPriceSixMonths,
      priceOneYear: propertyPriceOneYear,
      location: propertyLocation,
      imageFiles,
      amenityIds: selectedAmenityIds,
      availabilityStart,
      availabilityEnd,
      contactName,
      contactEmail,
      contactWhatsapp,
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
      setSelectedAmenityIds([]);
      setAvailabilityStart("");
      setAvailabilityEnd("");
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
        
        {mode === 'edit' && existingImages.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Existing Images</h3>
            <ExistingImagesGrid
              propertyId={initialData?.id || ''}
              images={existingImages}
              onImageDelete={handleExistingImageDelete}
            />
          </div>
        )}

        <Input
          id="propertyImages"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          multiple
          required={mode === 'create' && existingImages.length === 0}
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

      <AmenitiesSelection
        propertyId={initialData?.id}
        onAmenitiesChange={setSelectedAmenityIds}
        mode={mode}
      />

      <PropertyAvailabilityFields
        initialStartDate={availabilityStart}
        initialEndDate={availabilityEnd}
        onStartDateChange={setAvailabilityStart}
        onEndDateChange={setAvailabilityEnd}
      />

      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-semibold">Contact Information</h3>
        
        <div className="space-y-2">
          <Label htmlFor="contactName">Contact Name</Label>
          <Input
            id="contactName"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="Enter contact name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactEmail">Contact Email</Label>
          <Input
            id="contactEmail"
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="Enter contact email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactWhatsapp">WhatsApp Phone Number</Label>
          <Input
            id="contactWhatsapp"
            value={contactWhatsapp}
            onChange={(e) => setContactWhatsapp(e.target.value)}
            placeholder="Enter WhatsApp number"
          />
        </div>
      </div>

      <Button type="submit">
        {mode === 'create' ? 'List Property' : 'Update Property'}
      </Button>
    </form>
  );
};
