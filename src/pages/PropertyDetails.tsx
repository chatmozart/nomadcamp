import { useParams } from "react-router-dom";
import { MapPin, Star, Calendar, Wifi, Coffee, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// This would typically come from an API, but for now we'll use static data
const properties = [
  {
    id: 1,
    title: "Luxury Villa with Ocean View",
    location: "Malibu, California",
    price: 2200,
    rating: 4.9,
    reviews: 128,
    description: "Experience luxury living in this stunning oceanfront villa. Perfect for digital nomads seeking inspiration with panoramic views of the Pacific Ocean. This fully furnished property includes a dedicated workspace, high-speed fiber internet, and all modern amenities.",
    amenities: ["High-speed WiFi", "Dedicated Workspace", "Full Kitchen", "Ocean View", "Smart TV", "Pool"],
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80",
    ],
  },
  // ... other properties
];

const PropertyDetails = () => {
  const { id } = useParams();
  const property = properties.find((p) => p.id === Number(id));

  if (!property) {
    return <div className="container mx-auto px-4 py-8">Property not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header section */}
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-3xl font-bold">{property.title}</h1>
        <div className="flex items-center mt-2 text-muted-foreground">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{property.location}</span>
          <div className="flex items-center ml-4">
            <Star className="w-4 h-4 text-primary fill-current" />
            <span className="ml-1 font-medium">{property.rating}</span>
            <span className="text-sm ml-1">({property.reviews} reviews)</span>
          </div>
        </div>
      </div>

      {/* Full-width carousel section */}
      <div className="w-full bg-black/5 py-8">
        <div className="max-w-[2000px] mx-auto px-4">
          <Carousel className="w-full">
            <CarouselContent>
              {property.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-[21/9] relative rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`${property.title} - Image ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-8" />
            <CarouselNext className="right-8" />
          </Carousel>
        </div>
      </div>

      {/* Content section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">About this property</h2>
              <p className="text-muted-foreground">{property.description}</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Amenities</h2>
              <div className="grid grid-cols-2 gap-4">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    {amenity.includes("WiFi") && <Wifi className="w-4 h-4" />}
                    {amenity.includes("Kitchen") && <Coffee className="w-4 h-4" />}
                    {amenity.includes("TV") && <Tv className="w-4 h-4" />}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:pl-8">
            <div className="sticky top-8 bg-card rounded-lg p-6 border shadow-sm">
              <div className="text-2xl font-bold mb-4">
                ${property.price}
                <span className="text-muted-foreground text-base font-normal">
                  {" "}
                  / month
                </span>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Check-in
                    </label>
                    <div className="flex items-center border rounded-md p-2">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Select date</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Check-out
                    </label>
                    <div className="flex items-center border rounded-md p-2">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Select date</span>
                    </div>
                  </div>
                </div>
                <Button className="w-full">Book now</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;