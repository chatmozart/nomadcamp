export const geocodeLocation = async (location: string): Promise<google.maps.LatLngLiteral | null> => {
  if (!window.google?.maps) {
    console.log('geocodeLocation - Google Maps not available');
    return null;
  }

  try {
    const geocoder = new google.maps.Geocoder();
    const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
      geocoder.geocode({ address: location }, (results, status) => {
        if (status === 'OK' && results) {
          resolve(results);
        } else {
          reject(new Error(`Geocoding failed for ${location}: ${status}`));
        }
      });
    });

    if (result[0]?.geometry?.location) {
      return {
        lat: result[0].geometry.location.lat(),
        lng: result[0].geometry.location.lng()
      };
    }
  } catch (error) {
    console.error(`Error geocoding location ${location}:`, error);
  }
  return null;
};

export const calculateMapCenter = (markers: google.maps.LatLngLiteral[]): google.maps.LatLngLiteral => {
  if (markers.length === 0) {
    return { lat: 13.7563, lng: 100.5018 }; // Default to Thailand
  }

  return markers.reduce(
    (acc, curr) => ({
      lat: acc.lat + curr.lat / markers.length,
      lng: acc.lng + curr.lng / markers.length
    }),
    { lat: 0, lng: 0 }
  );
};