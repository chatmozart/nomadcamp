import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export const useSupabaseImage = (propertyId: string, mainImage: string | null) => {
  const [mainImageUrl, setMainImageUrl] = useState<string | null>(null);
  const [fallbackImageUrl, setFallbackImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const getImages = async () => {
      try {
        // First try to get the main image if it exists
        if (mainImage) {
          console.log('useSupabaseImage: Fetching main image:', mainImage);
          if (mainImage.startsWith('http')) {
            setMainImageUrl(mainImage);
          } else {
            const { data: mainImageData, error: mainImageError } = await supabase.storage
              .from('properties')
              .createSignedUrl(mainImage, 2592000);
            
            if (!mainImageError && mainImageData) {
              setMainImageUrl(mainImageData.signedUrl);
            }
          }
        }

        // Then fetch additional images from property_images table as fallback
        console.log('useSupabaseImage: Fetching additional images for property:', propertyId);
        const { data: propertyImages, error: propertyImagesError } = await supabase
          .from('property_images')
          .select('image_url')
          .eq('property_id', propertyId)
          .order('order', { ascending: true })
          .limit(1);

        if (propertyImagesError) {
          console.error('useSupabaseImage: Error fetching property images:', propertyImagesError);
          return;
        }

        if (propertyImages && propertyImages.length > 0) {
          console.log('useSupabaseImage: Found additional images:', propertyImages);
          const firstAdditionalImage = propertyImages[0].image_url;
          
          if (firstAdditionalImage.startsWith('http')) {
            setFallbackImageUrl(firstAdditionalImage);
          } else {
            const { data: signedUrlData, error: signedUrlError } = await supabase.storage
              .from('properties')
              .createSignedUrl(firstAdditionalImage, 2592000);
            
            if (!signedUrlError && signedUrlData) {
              setFallbackImageUrl(signedUrlData.signedUrl);
            }
          }
        }
      } catch (error) {
        console.error('useSupabaseImage: Error in getImages:', error);
      }
    };

    getImages();
  }, [mainImage, propertyId]);

  return {
    displayImageUrl: mainImageUrl || fallbackImageUrl || null
  };
};