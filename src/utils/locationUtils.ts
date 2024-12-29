export const LOCATION_CATEGORIES = [
  "Koh Phangan",
  "Chiang Mai",
  "Bali",
  "Lisbon",
  "Tenerife",
  "Santa Teresa",
  "Tamarindo"
] as const;

export type LocationCategory = typeof LOCATION_CATEGORIES[number];

export const getPropertyCategory = (location: string): LocationCategory | null => {
  console.log('Categorizing location:', location);
  
  // Convert location to lowercase for case-insensitive matching
  const normalizedLocation = location.toLowerCase();
  
  // Find matching category
  const category = LOCATION_CATEGORIES.find(cat => 
    normalizedLocation.includes(cat.toLowerCase())
  );
  
  console.log('Matched category:', category || 'None');
  return category || null;
};

export const groupPropertiesByLocation = (properties: any[]) => {
  console.log('Grouping properties by location...');
  
  const grouped = properties.reduce((acc, property) => {
    const category = getPropertyCategory(property.location);
    if (category) {
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(property);
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