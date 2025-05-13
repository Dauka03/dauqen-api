interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Address {
  street: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
}

interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

// Function to calculate distance between two points using Haversine formula
export const calculateDistance = (
  point1: Coordinates,
  point2: Coordinates
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(point2.latitude - point1.latitude);
  const dLon = toRad(point2.longitude - point1.longitude);
  const lat1 = toRad(point1.latitude);
  const lat2 = toRad(point2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 1000); // Convert to meters
};

// Function to convert degrees to radians
const toRad = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

// Function to check if a point is within a bounding box
export const isPointInBoundingBox = (
  point: Coordinates,
  box: BoundingBox
): boolean => {
  return (
    point.latitude <= box.north &&
    point.latitude >= box.south &&
    point.longitude <= box.east &&
    point.longitude >= box.west
  );
};

// Function to create a bounding box around a point with a given radius
export const createBoundingBox = (
  center: Coordinates,
  radiusKm: number
): BoundingBox => {
  const lat = center.latitude;
  const lon = center.longitude;
  const R = 6371; // Earth's radius in kilometers

  const latDelta = (radiusKm / R) * (180 / Math.PI);
  const lonDelta =
    (radiusKm / R) * (180 / Math.PI) / Math.cos(lat * (Math.PI / 180));

  return {
    north: lat + latDelta,
    south: lat - latDelta,
    east: lon + lonDelta,
    west: lon - lonDelta,
  };
};

// Function to check if a point is within a radius
export const isPointInRadius = (
  center: Coordinates,
  point: Coordinates,
  radius: number
): boolean => {
  const distance = calculateDistance(center, point);
  return distance <= radius;
};

// Function to format coordinates
export const formatCoordinates = (coordinates: Coordinates): string => {
  return `${coordinates.latitude},${coordinates.longitude}`;
};

// Function to parse coordinates from string
export const parseCoordinates = (coordinatesString: string): Coordinates => {
  const [latitude, longitude] = coordinatesString.split(',').map(Number);
  return { latitude, longitude };
};

// Function to validate coordinates
export const isValidCoordinates = (coordinates: Coordinates): boolean => {
  return (
    coordinates.latitude >= -90 &&
    coordinates.latitude <= 90 &&
    coordinates.longitude >= -180 &&
    coordinates.longitude <= 180
  );
};

// Function to format address
export const formatAddress = (address: Address): string => {
  const parts = [
    address.street,
    address.city,
    address.state,
    address.postalCode,
    address.country,
  ].filter(Boolean);
  return parts.join(', ');
};

// Function to calculate estimated delivery time based on distance
export const calculateDeliveryTime = (
  distance: number,
  averageSpeed: number = 30 // km/h
): number => {
  const timeInHours = distance / averageSpeed;
  return Math.ceil(timeInHours * 60); // Convert to minutes
};

// Function to calculate delivery fee based on distance
export const calculateDeliveryFeeByDistance = (
  distance: number,
  baseFee: number = 500,
  perKmFee: number = 100
): number => {
  return baseFee + Math.ceil(distance * perKmFee);
};

// Function to check if a delivery address is within delivery range
export const isWithinDeliveryRange = (
  restaurantLocation: Coordinates,
  deliveryAddress: Coordinates,
  maxDeliveryDistance: number
): boolean => {
  const distance = calculateDistance(restaurantLocation, deliveryAddress);
  return distance <= maxDeliveryDistance;
};

// Function to get nearby restaurants
export const getNearbyRestaurants = (
  userLocation: Coordinates,
  restaurants: Array<{ location: Coordinates; [key: string]: any }>,
  maxDistance: number
): Array<{ location: Coordinates; [key: string]: any }> => {
  return restaurants.filter((restaurant) =>
    isPointInRadius(userLocation, restaurant.location, maxDistance)
  );
};

// Function to sort restaurants by distance
export const sortRestaurantsByDistance = (
  userLocation: Coordinates,
  restaurants: Array<{ location: Coordinates; [key: string]: any }>
): Array<{ location: Coordinates; [key: string]: any }> => {
  return [...restaurants].sort((a, b) => {
    const distanceA = calculateDistance(userLocation, a.location);
    const distanceB = calculateDistance(userLocation, b.location);
    return distanceA - distanceB;
  });
};

// Function to get delivery zones
export const getDeliveryZones = (
  center: Coordinates,
  zones: number[] = [1000, 3000, 5000] // meters
): Array<{ radius: number; fee: number }> => {
  return zones.map((radius, index) => ({
    radius,
    fee: 500 + index * 200, // Base fee + additional fee per zone
  }));
};

// Function to get delivery zone for a distance
export const getDeliveryZone = (
  distance: number,
  zones: Array<{ radius: number; fee: number }>
): { radius: number; fee: number } | null => {
  return (
    zones.find((zone) => distance <= zone.radius) || {
      radius: zones[zones.length - 1].radius,
      fee: zones[zones.length - 1].fee,
    }
  );
};

export default {
  calculateDistance,
  isPointInBoundingBox,
  createBoundingBox,
  isPointInRadius,
  formatCoordinates,
  parseCoordinates,
  isValidCoordinates,
  formatAddress,
  calculateDeliveryTime,
  calculateDeliveryFeeByDistance,
  isWithinDeliveryRange,
  getNearbyRestaurants,
  sortRestaurantsByDistance,
  getDeliveryZones,
  getDeliveryZone,
}; 