import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SearchBar = () => {
  return (
    <div className="search-bar w-full max-w-3xl mx-auto rounded-full p-2 flex items-center gap-2">
      <div className="flex-1 flex items-center gap-2 px-4">
        <Search className="w-5 h-5 text-gray-500" />
        <Input
          type="text"
          placeholder="Where to?"
          className="border-0 bg-transparent focus:outline-none focus:ring-0 text-lg placeholder:text-gray-500"
        />
      </div>
      <Button className="rounded-full bg-primary hover:bg-primary/90">
        Search
      </Button>
    </div>
  );
};

export default SearchBar;