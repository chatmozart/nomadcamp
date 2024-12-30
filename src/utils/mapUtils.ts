export const getApproximateLocation = (lat: number, lng: number) => {
  // Convert 100 meters to approximate degrees (very rough approximation)
  const metersToLatDegrees = 0.0009;
  const randomLat = (Math.random() - 0.5) * (metersToLatDegrees * 2);
  const randomLng = (Math.random() - 0.5) * (metersToLatDegrees * 2);

  return {
    lat: lat + randomLat,
    lng: lng + randomLng
  };
};

export const mapStyles = [
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#f1f1f1" }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#8A898C" }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#f1f1f1" }]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [{ "color": "#c8c8c9" }]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#8A898C" }]
  },
  {
    "featureType": "landscape",
    "elementType": "geometry",
    "stylers": [{ "color": "#f1f1f1" }]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [{ "color": "#e5e5e5" }]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#8A898C" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [{ "color": "#e5e5e5" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{ "color": "#ffffff" }]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [{ "color": "#ffffff" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{ "color": "#dadada" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#8A898C" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#0EA5E9" }]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#33C3F0" }]
  }
];

export const defaultMapOptions = {
  styles: mapStyles,
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false,
  disableDefaultUI: true
};
