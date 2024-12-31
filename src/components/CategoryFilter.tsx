import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LOCATION_CATEGORIES, getUrlFriendlyLocation, getDisplayLocation } from "@/utils/locationUtils";

const CategoryFilter = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract just the location names without the country for display
  const categories = ["All", ...LOCATION_CATEGORIES.map(cat => cat.split(' - ')[0])];

  useEffect(() => {
    // Extract the location from the URL path
    const pathSegments = location.pathname.split('/');
    if (pathSegments[1] === 'properties' && pathSegments[2]) {
      const currentLocation = getDisplayLocation(pathSegments[2]);
      console.log('Current location from URL:', currentLocation);
      setActiveCategory(currentLocation);
    } else {
      setActiveCategory("All");
    }
  }, [location.pathname]);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    if (category === "All") {
      navigate("/");
    } else {
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