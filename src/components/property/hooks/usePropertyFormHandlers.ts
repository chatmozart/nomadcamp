import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const usePropertyFormHandlers = (
  setPropertyLocation: (location: string) => void,
  onPlaceSelect: (autocomplete: google.maps.places.Autocomplete) => void
) => {
  const { toast } = useToast();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

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
    
    newFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      setPreviewUrls(prev => [...prev, url]);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleExistingImageDelete = (deletedImageUrl: string) => {
    setExistingImages(prev => prev.filter(url => url !== deletedImageUrl));
  };

  return {
    imageFiles,
    previewUrls,
    existingImages,
    setExistingImages,
    setImageFiles,
    setPreviewUrls,
    handlePlaceSelect,
    handleImageChange,
    removeImage,
    handleExistingImageDelete,
  };
};