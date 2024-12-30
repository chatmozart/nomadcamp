export const LOCATION_CATEGORIES = [
  "Koh Phangan - Thailand",
  "Chiang Mai - Thailand",
  "Bali - Indonesia",
  "Lisbon - Portugal",
  "Tenerife - Spain",
  "Santa Teresa - Costa Rica",
  "Tamarindo - Costa Rica"
] as const;

export type LocationCategory = typeof LOCATION_CATEGORIES[number];

export const getUrlFriendlyLocation = (location: string): string => {
  // Extract the location name without the country
  const locationName = location.split(' - ')[0];
  
  if (locationName === "Koh Phangan") {
    return "ko-pha-ngan";
  }
  return locationName.toLowerCase().replace(/\s+/g, '-');
};

export const getDisplayLocation = (urlLocation: string | undefined): string => {
  if (!urlLocation) return 'All Properties';
  
  // Find the full category name (with country) based on the URL-friendly version
  const fullCategory = LOCATION_CATEGORIES.find(cat => {
    const locationPart = cat.split(' - ')[0];
    return getUrlFriendlyLocation(locationPart) === urlLocation;
  });
  
  return fullCategory ? fullCategory.split(' - ')[0] : urlLocation.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const groupPropertiesByLocation = (properties: any[]) => {
  console.log('Grouping properties by location...', properties);
  
  const grouped = properties.reduce((acc, property) => {
    // Use the location name from the locations table relationship
    if (property.locations?.name) {
      const locationName = property.locations.name.split(' - ')[0];
      console.log('Grouping property under location:', locationName, property);
      
      if (!acc[locationName]) {
        acc[locationName] = [];
      }
      acc[locationName].push(property);
    } else {
      console.log('Property without location category, adding to Other:', property);
      if (!acc.Other) {
        acc.Other = [];
      }
      acc.Other.push(property);
    }
    return acc;
  }, {} as Record<string, any[]>);
  
  console.log('Grouped properties:', grouped);
  return grouped;
};