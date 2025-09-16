"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  setPlace: (place: {
    lat: number;
    lng: number;
    formatted_address: string;
  }) => void;
  placeholder?: string;
};

interface PlaceSuggestion {
  placePrediction: {
    place: string;
    text: {
      text: string;
    };
  };
}

const NewPlaceSelector = ({ setPlace, placeholder }: Props) => {
  const [open, setOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);

  // Initialize AutocompleteService when needed (lazy initialization)
  const initializeAutocompleteService = () => {
    if (autocompleteService.current) {
      return true; // Already initialized
    }

    if (typeof window !== 'undefined' && 
        window.google?.maps?.places?.AutocompleteService) {
      try {
        autocompleteService.current = new google.maps.places.AutocompleteService();
        return true;
      } catch (error) {
        console.error("Error initializing Google Places AutocompleteService:", error);
        return false;
      }
    } else {
      return false;
    }
  };

  const handleInputChange = async (value: string) => {
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    // Try to initialize the service if not already done
    if (!initializeAutocompleteService()) {
      setSuggestions([]);
      return;
    }

    // Double-check the service and its method
    if (!autocompleteService.current || 
        typeof autocompleteService.current.getPlacePredictions !== 'function') {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    
    try {
      const request: google.maps.places.AutocompletionRequest = {
        input: value,
        componentRestrictions: { 
          country: [
            'pl', 'de', 'fr', 'it', 'es', 'nl', 'be', 'at', 'ch', 'cz', 'sk', 'hu', 'si', 'hr', 'ba', 'rs', 'me', 'mk', 'al', 'bg', 'ro', 'md', 'ua', 'by', 'lt', 'lv', 'ee', 'fi', 'se', 'no', 'dk', 'is', 'ie', 'gb', 'pt', 'ad', 'mc', 'sm', 'va', 'mt', 'cy', 'gr', 'tr', 'lu'
          ] 
        }, // European countries
        language: 'pl',
      };

      autocompleteService.current.getPlacePredictions(request, (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          // Convert standard predictions to our format
          const convertedSuggestions: PlaceSuggestion[] = predictions.map((prediction) => ({
            placePrediction: {
              place: prediction.place_id,
              text: {
                text: prediction.description,
              },
            },
          }));
          setSuggestions(convertedSuggestions);
        } else {
          if (status !== google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            console.error("Places API error:", status);
          }
          setSuggestions([]);
        }
        setIsLoading(false);
      });
    } catch (error) {
      console.error("Error in handleInputChange:", error);
      setSuggestions([]);
      setIsLoading(false);
    }
  };

  const handleSelect = async (suggestion: PlaceSuggestion) => {
    try {
      setCurrentValue(suggestion.placePrediction.text.text);
      setOpen(false);
      setSuggestions([]);

      // Get place details using Places API
      const service = new google.maps.places.PlacesService(
        document.createElement('div')
      );

      const request: google.maps.places.PlaceDetailsRequest = {
        placeId: suggestion.placePrediction.place,
        fields: ['geometry', 'formatted_address'],
      };

      service.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          const location = place.geometry?.location;
          if (location) {
            setPlace({
              lat: location.lat(),
              lng: location.lng(),
              formatted_address: place.formatted_address || suggestion.placePrediction.text.text,
            });
          }
        } else {
          console.error("Error getting place details:", status);
        }
      });
    } catch (error) {
      console.error("Error in handleSelect:", error);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between capitalize"
        >
          {currentValue || placeholder || "Szukaj miejsca..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder={placeholder || "Szukaj miejsca..."}
            onValueChange={handleInputChange}
          />
          <CommandEmpty>
            {isLoading ? "Wyszukiwanie..." : 
             !window.google?.maps?.places ? "Google Places API niedostępne" :
             "Nie znaleziono miejsca."}
          </CommandEmpty>
          <CommandGroup>
            {suggestions.map((suggestion, index) => (
              <CommandItem
                key={index}
                onSelect={() => handleSelect(suggestion)}
              >
                {suggestion.placePrediction.text.text}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default NewPlaceSelector;
