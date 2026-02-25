const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Haversine distance between two points in km
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/**
 * Minimum distance (km) from a point to any point on a polyline.
 * polylinePoints is array of [lat, lng] (as decoded by @mapbox/polyline).
 */
export function distanceToPolyline(
  pointLat: number,
  pointLng: number,
  polylinePoints: [number, number][]
): number {
  let minDist = Infinity;
  for (const [lat, lng] of polylinePoints) {
    const dist = haversineDistance(pointLat, pointLng, lat, lng);
    if (dist < minDist) {
      minDist = dist;
    }
  }
  return minDist;
}

/**
 * Calculate search radius: 10% of route length, clamped to 5-50 km.
 * routeLengthKm is the total route distance in km.
 */
export function calculateSearchRadius(routeLengthKm: number): number {
  const radius = routeLengthKm * 0.1;
  return Math.max(5, Math.min(50, radius));
}
