import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LOCATION_CATEGORIES } from "@/utils/locationUtils";

const CategoryFilter = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();
  
  const categories = ["All", ...LOCATION_CATEGORIES];

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    if (category === "All") {
      navigate("/");
    } else {
      // Convert category to URL-friendly format
      const getUrlFriendlyLocation = (location: string) => {
        if (location === "Koh Phangan") {
          return "ko-pha-ngan";
        }
        return location.toLowerCase().replace(/\s+/g, '-');
      };
      
      const locationParam = getUrlFriendlyLocation(category);
      console.log('Navigating to location:', locationParam);
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