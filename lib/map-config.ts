import type mapboxgl from "mapbox-gl";

export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
export const MAP_STYLE = "mapbox://styles/mapbox/streets-v12";
export const STATIC_MAP_STYLE = "mapbox/streets-v12";

interface PremiumEffectsOptions {
  terrain?: boolean;
  buildings?: boolean;
  fog?: boolean;
  sky?: boolean;
  language?: string;
}

export function applyPremiumEffects(
  map: mapboxgl.Map,
  options: PremiumEffectsOptions = {}
) {
  const {
    terrain = true,
    buildings = true,
    fog = true,
    sky = true,
    language = "pl",
  } = options;

  map.setLanguage(language);

  // 3D Terrain
  if (terrain) {
    if (!map.getSource("mapbox-dem")) {
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });
    }
    map.setTerrain({ source: "mapbox-dem", exaggeration: 1.3 });
  }

  // Atmospheric fog
  if (fog) {
    map.setFog({
      color: "rgb(240, 237, 230)",
      "high-color": "rgb(180, 200, 230)",
      "horizon-blend": 0.08,
      "space-color": "rgb(15, 15, 30)",
      "star-intensity": 0.0,
    } as mapboxgl.FogSpecification);
  }

  // Sky atmosphere layer
  if (sky && !map.getLayer("sky")) {
    map.addLayer({
      id: "sky",
      type: "sky",
      paint: {
        "sky-type": "atmosphere",
        "sky-atmosphere-sun": [0.0, 60.0],
        "sky-atmosphere-sun-intensity": 5,
      },
    } as mapboxgl.LayerSpecification);
  }

  // 3D Building extrusions
  if (buildings) {
    try {
      if (!map.getLayer("3d-buildings")) {
        const layers = map.getStyle().layers;
        let labelLayerId: string | undefined;
        for (const layer of layers || []) {
          if (
            layer.type === "symbol" &&
            (layer as mapboxgl.SymbolLayerSpecification).layout?.["text-field"]
          ) {
            labelLayerId = layer.id;
            break;
          }
        }

        map.addLayer(
          {
            id: "3d-buildings",
            source: "composite",
            "source-layer": "building",
            filter: ["==", "extrude", "true"],
            type: "fill-extrusion",
            minzoom: 13,
            paint: {
              "fill-extrusion-color": "hsl(225, 20%, 88%)",
              "fill-extrusion-height": ["get", "height"],
              "fill-extrusion-base": ["get", "min_height"],
              "fill-extrusion-opacity": 0.5,
            },
          } as mapboxgl.LayerSpecification,
          labelLayerId
        );
      }
    } catch {
      // Style may already include 3D buildings
    }
  }
}

// Route line paint configs
export const ROUTE_HERO_GLOW = {
  paint: {
    "line-color": "hsl(225, 30%, 14%)",
    "line-width": 10,
    "line-opacity": 0.15,
    "line-blur": 6,
  },
  layout: { "line-cap": "round" as const, "line-join": "round" as const },
};

export const ROUTE_HERO_LINE = {
  paint: {
    "line-color": "hsl(39, 85%, 50%)",
    "line-width": 4,
    "line-opacity": 0.95,
  },
  layout: { "line-cap": "round" as const, "line-join": "round" as const },
};

export const ROUTE_SIMPLE = {
  paint: {
    "line-color": "hsl(39, 85%, 50%)",
    "line-width": 4,
    "line-opacity": 0.9,
  },
  layout: { "line-cap": "round" as const, "line-join": "round" as const },
};
