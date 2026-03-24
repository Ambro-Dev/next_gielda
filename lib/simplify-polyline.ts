// @ts-expect-error - no type declarations for @mapbox/polyline
import * as polyline from "@mapbox/polyline";
import simplify from "simplify-js";

/**
 * Simplifies an encoded polyline using the Douglas-Peucker algorithm.
 * Reduces the number of points while preserving the shape of the route,
 * producing a shorter encoded string suitable for Mapbox Static Images API URLs.
 */
export function simplifyEncodedPolyline(
  encoded: string,
  tolerance = 0.001
): string {
  const decoded: [number, number][] = polyline.decode(encoded);
  const points = decoded.map(([lat, lng]: [number, number]) => ({
    x: lng,
    y: lat,
  }));

  const simplified = simplify(points, tolerance, true);

  const coords: [number, number][] = simplified.map(
    (p: { x: number; y: number }) => [p.y, p.x]
  );
  return polyline.encode(coords);
}
