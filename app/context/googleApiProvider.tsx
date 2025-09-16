"use client";

import React from "react";
import { LoadScriptProps, useLoadScript } from "@react-google-maps/api";
import Loading from "../loading";

const libraries: LoadScriptProps["libraries"] = ["places"];

export const GoogleApiProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string;
  
  // Check if Google Maps is already loaded globally
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return !!(window as any).google?.maps;
    }
    return false;
  });

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
    id: "google-maps-script",
    preventGoogleFontsLoading: true,
  });

  // Google Maps API is now loaded and available globally
  React.useEffect(() => {
    if ((isLoaded || isGoogleMapsLoaded) && typeof window !== 'undefined') {
      setIsGoogleMapsLoaded(true);
      
      // Only log errors in production, not success messages
      if (!(window as any).google?.maps?.places) {
        console.error("Google Places API not loaded. Check if 'places' library is included.");
      }
    }
  }, [isLoaded, isGoogleMapsLoaded]);

  // Manual loading with proper async/defer and loading strategy
  React.useEffect(() => {
    if (!isLoaded && !loadError && !isGoogleMapsLoaded && typeof window !== 'undefined') {
      // Check if Google Maps is already loaded
      if ((window as any).google?.maps) {
        setIsGoogleMapsLoaded(true);
        return;
      }

      // Check if script is already being loaded
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        // Wait for existing script to load
        const checkLoaded = setInterval(() => {
          if ((window as any).google?.maps) {
            setIsGoogleMapsLoaded(true);
            clearInterval(checkLoaded);
          }
        }, 100);
        setTimeout(() => clearInterval(checkLoaded), 10000); // Stop checking after 10 seconds
        return;
      }
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;
      script.id = 'google-maps-script-manual';
      
      script.onload = () => {
        // Give Google Maps API a moment to fully initialize
        setTimeout(() => {
          setIsGoogleMapsLoaded(true);
        }, 100);
      };
      
      script.onerror = (error) => {
        console.error("Failed to load Google Maps API manually:", error);
      };
      
      document.head.appendChild(script);
    }
  }, [isLoaded, loadError, isGoogleMapsLoaded, apiKey]);

  // Debug logging
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("Google Maps API Key:", apiKey ? `Present (${apiKey.substring(0, 10)}...)` : "Missing");
      console.log("Google Maps Loaded:", isLoaded);
      console.log("Google Maps Load Error:", loadError);
    }
  }, [apiKey, isLoaded, loadError]);
  
  // Check if Google Maps is available globally
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      if (process.env.NODE_ENV === 'development') {
        console.log("Window.google available:", !!window.google);
        console.log("Window.google.maps available:", !!(window as any).google?.maps);
      }
    }
  }, [isLoaded]);

  // If no API key is available, show error
  if (!apiKey) {
    return (
      <main className="relative flex min-h-screen w-full flex-col bg-gray-100">
        <div className="lg:pt-36 pt-20 flex-grow mx-auto max-w-6xl w-full">
          <div className="flex w-full h-full lg:p-10 p-5 justify-center items-center backdrop-blur-md flex-col">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Błąd konfiguracji Google Maps
              </h2>
              <p className="text-gray-600 mb-2">
                Brak klucza API Google Maps
              </p>
              <p className="text-sm text-gray-500">
                Skontaktuj się z administratorem
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="relative flex min-h-screen w-full flex-col bg-gray-100">
        <div className="lg:pt-36 pt-20 flex-grow mx-auto max-w-6xl w-full">
          <div className="flex w-full h-full lg:p-10 p-5 justify-center items-center backdrop-blur-md flex-col">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Błąd Google Maps
              </h2>
              <p className="text-gray-600 mb-2">
                Nie można załadować Google Maps API
              </p>
              <p className="text-sm text-gray-500">
                Sprawdź konfigurację klucza API
              </p>
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-blue-600">
                  Szczegóły błędu
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded">
                  {loadError.toString()}
                </pre>
              </details>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!isLoaded && !isGoogleMapsLoaded)
    return (
      <main className="relative flex min-h-screen w-full flex-col bg-gray-100">
        <div className="lg:pt-36 pt-20 flex-grow mx-auto max-w-6xl w-full">
          <Loading />
        </div>
      </main>
    );
  return <>{children}</>;
};