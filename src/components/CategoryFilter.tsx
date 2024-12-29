import { useState } from "react";
import { Button } from "@/components/ui/button";

const CategoryFilter = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  
  const categories = [
    "All",
    "Beach Houses",
    "Mountain Cabins",
    "City Apartments",
    "Luxury Villas",
    "Unique Stays",
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "ghost"}
          className="category-button whitespace-nowrap"
          onClick={() => setActiveCategory(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;