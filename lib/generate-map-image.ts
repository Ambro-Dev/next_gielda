import { simplifyEncodedPolyline } from "@/lib/simplify-polyline";

interface GenerateMapImageParams {
  transportId: string;
  directions: {
    start: { lat: number; lng: number };
    finish: { lat: number; lng: number };
  };
  polyline?: string | null;
}

/**
 * Builds a Mapbox Static Images API URL for a transport route.
 * Pre-computes the URL with polyline simplification so it can be cached in DB
 * instead of being rebuilt on every render.
 * Returns null if required data is missing.
 */
export function generateMapImage(
  params: GenerateMapImageParams
): string | null {
  const { directions, polyline } = params;
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!token || !directions.start || !directions.finish) return null;

  const { start, finish } = directions;
  const markers = `pin-s-a+D4850C(${start.lng},${start.lat}),pin-s-b+1A1A2E(${finish.lng},${finish.lat})`;
  const base = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/`;
  const size = "800x500@2x";
  const suffix = `/auto/${size}?padding=60&access_token=${token}`;

  if (polyline) {
    const simplified = simplifyEncodedPolyline(polyline);
    const path = `,path-5+D4850C-0.9(${encodeURIComponent(simplified)})`;
    const fullUrl = `${base}${markers}${path}${suffix}`;
    if (fullUrl.length <= 8192) return fullUrl;
  }

  return `${base}${markers}${suffix}`;
}
