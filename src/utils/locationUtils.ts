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
  
  return fullCategory || urlLocation.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const getPropertyCategory = (location: string): LocationCategory | null => {
  console.log('Categorizing location:', location);
  
  // Convert location to lowercase for case-insensitive matching
  const normalizedLocation = location.toLowerCase();
  
  // Find matching category
  const category = LOCATION_CATEGORIES.find(cat => {
    const locationPart = cat.split(' - ')[0].toLowerCase();
    return normalizedLocation.includes(locationPart);
  });
  
  console.log('Matched category:', category || 'None');
  return category || null;
};

export const groupPropertiesByLocation = (properties: any[]) => {
  console.log('Grouping properties by location...');
  
  const grouped = properties.reduce((acc, property) => {
    const category = getPropertyCategory(property.location);
    if (category) {
      const locationName = category.split(' - ')[0];
      if (!acc[locationName]) {
        acc[locationName] = [];
      }
      acc[locationName].push(property);
    } else {
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