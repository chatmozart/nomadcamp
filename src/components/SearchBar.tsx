import { useEffect, useRef, useState } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const SearchBar = () => {
  const { isLoading } = useGoogleMaps();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState("any");
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isIndexPage = location.pathname === "/";

  useEffect(() => {
    if (!window.google || !inputRef.current || isLoading) return;

    console.log('Initializing Google Places Autocomplete...');
    
    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      types: ['(cities)'],
      fields: ['formatted_address', 'geometry', 'name'],
    });

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      console.log('Selected place:', place);

      if (place?.name) {
        const urlFriendlyName = place.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

        console.log('Navigating to:', `/properties/${urlFriendlyName}`);
        navigate(`/properties/${urlFriendlyName}`);
      }
    });

    return () => {
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
    <div className={`search-bar rounded-full p-2 flex items-center gap-2 ${
      isIndexPage 
        ? 'w-full max-w-3xl mx-auto' 
        : 'w-full max-w-md'
    }`}>
      <div className="flex-1 flex items-center gap-2 px-4">
        <Search className="w-5 h-5 text-gray-500" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Where to?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`border-0 bg-transparent focus:outline-none focus:ring-0 placeholder:text-gray-500 ${
            isIndexPage ? 'text-lg' : 'text-base'
          }`}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
      </div>
      
      <Popover open={showFilters} onOpenChange={setShowFilters}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="icon"
            className="rounded-full"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-4">
            <h4 className="font-medium">Filters</h4>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price Range</label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <option value="any">Any</option>
                <option value="0-500">$0 - $500</option>
                <option value="501-1000">$501 - $1000</option>
                <option value="1001-2000">$1001 - $2000</option>
                <option value="2000+">$2000+</option>
              </select>
            </div>
          </div>
        </PopoverContent>
      </Popover>

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