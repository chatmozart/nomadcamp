import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";

const SearchBar = () => {
  const { isLoading } = useGoogleMaps();
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.google || !inputRef.current || isLoading) return;

    console.log('Initializing Google Places Autocomplete...');
    
    // Initialize Google Places Autocomplete
    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      types: ['(cities)'],
      fields: ['formatted_address', 'geometry', 'name'],
    });

    // Add place_changed event listener
    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      console.log('Selected place:', place);

      if (place?.name) {
        // Convert the place name to URL-friendly format
        const urlFriendlyName = place.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

        console.log('Navigating to:', `/properties/${urlFriendlyName}`);
        navigate(`/properties/${urlFriendlyName}`);
      }
    });

    return () => {
      // Cleanup
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [navigate, isLoading]);

  const handleSearch = () => {
    if (searchQuery) {
      const urlFriendlyQuery = searchQuery
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      console.log('Navigating to:', `/properties/${urlFriendlyQuery}`);
      navigate(`/properties/${urlFriendlyQuery}`);
    }
  };

  return (
    <div className="search-bar w-full max-w-3xl mx-auto rounded-full p-2 flex items-center gap-2">
      <div className="flex-1 flex items-center gap-2 px-4">
        <Search className="w-5 h-5 text-gray-500" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Where to?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-0 bg-transparent focus:outline-none focus:ring-0 text-lg placeholder:text-gray-500"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
      </div>
      <Button 
        className="rounded-full bg-primary hover:bg-primary/90"
        onClick={handleSearch}
      >
        Search
      </Button>
    </div>
  );
};

export default SearchBar;