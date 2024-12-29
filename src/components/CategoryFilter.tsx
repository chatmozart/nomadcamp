import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CategoryFilter = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();
  
  const categories = [
    "All",
    "Koh Phangan",
    "Chiang Mai",
    "Bali",
    "Lisbon",
    "Tenerife",
    "Santa Teresa",
    "Tamarindo"
  ];

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    if (category === "All") {
      navigate("/");
    } else {
      // Convert category to URL-friendly format
      const locationParam = category.toLowerCase().replace(/\s+/g, '-');
      navigate(`/properties/${locationParam}`);
    }
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "ghost"}
          className="category-button whitespace-nowrap"
          onClick={() => handleCategoryClick(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;