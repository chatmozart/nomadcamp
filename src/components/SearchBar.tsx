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
import { DateFilter } from "./filters/DateFilter";

const SearchBar = () => {
  const { isLoading } = useGoogleMaps();
  const [searchQuery, setSearchQuery] = useState(() => {
    const saved = localStorage.getItem('searchQuery');
    return saved || "";
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(() => {
    const saved = localStorage.getItem('selectedDate');
    return saved ? saved : null;
  });
  const [isExactDate, setIsExactDate] = useState<boolean>(() => {
    const saved = localStorage.getItem('isExactDate');
    return saved ? JSON.parse(saved) : false;
  });
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

  // Save filters and search query to localStorage whenever they change
  useEffect(() => {
    if (selectedDate) {
      localStorage.setItem('selectedDate', selectedDate);
    } else {
      localStorage.removeItem('selectedDate');
    }
    localStorage.setItem('isExactDate', JSON.stringify(isExactDate));
  }, [selectedDate, isExactDate]);

  useEffect(() => {
    if (searchQuery) {
      localStorage.setItem('searchQuery', searchQuery);
    } else {
      localStorage.removeItem('searchQuery');
    }
  }, [searchQuery]);

  const handleSearch = () => {
    if (searchQuery) {
      const urlFriendlyQuery = searchQuery
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      console.log('Navigating to:', `/properties/${urlFriendlyQuery}`);
      console.log('Current filters:', { selectedDate, isExactDate });
      
      navigate(`/properties/${urlFriendlyQuery}`);
    }
  };

  const handleDateChange = (date: string | null, isExact: boolean) => {
    console.log('Date filter changed:', { date, isExact });
    setSelectedDate(date);
    setIsExactDate(isExact);
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
            <DateFilter 
              onDateChange={handleDateChange}
              initialDate={selectedDate}
              initialIsExact={isExactDate}
            />
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