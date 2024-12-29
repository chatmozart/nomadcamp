import { useParams } from "react-router-dom";
import { 
  MapPin, 
  Star, 
  Share2, 
  Heart,
  Users,
  Calendar,
  Wifi,
  Coffee,
  Tv,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
    host: {
      name: "Sarah",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80",
      joinedDate: "2019",
      responseRate: "100%",
      responseTime: "within an hour"
    },
    beds: 3,
    baths: 2,
    maxGuests: 6
  },
];

const PropertyDetails = () => {
  const { id } = useParams();
  const property = properties.find((p) => p.id === Number(id));

  if (!property) return (
    <div className="container mx-auto px-4 py-8">Property not found</div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-2">{property.title}</h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-primary fill-current" />
              <span className="ml-1 font-medium">{property.rating}</span>
              <span className="mx-1">·</span>
              <span className="underline">{property.reviews} reviews</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4" />
              <span className="ml-1 underline">{property.location}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Heart className="w-4 h-4" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="container mx-auto px-4 mb-8">
        <Carousel className="w-full">
          <CarouselContent>
            {property.images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="aspect-[16/9]">
                  <img 
                    src={image} 
                    alt={`Property ${index + 1}`} 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Host Section */}
            <div className="flex items-center justify-between pb-6 border-b">
              <div>
                <h2 className="text-xl font-semibold">
                  Entire villa hosted by {property.host.name}
                </h2>
                <p className="text-muted-foreground">
                  {property.maxGuests} guests · {property.beds} bedrooms · {property.baths} baths
                </p>
              </div>
              <Avatar className="h-14 w-14">
                <AvatarImage src={property.host.image} alt={property.host.name} />
                <AvatarFallback>
                  <User className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Description */}
            <div className="space-y-4 pb-6 border-b">
              <h2 className="text-xl font-semibold">About this place</h2>
              <p className="text-muted-foreground leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">What this place offers</h2>
              <div className="grid grid-cols-2 gap-4">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-4">
                    {amenity.includes("WiFi") && <Wifi className="w-6 h-6" />}
                    {amenity.includes("Kitchen") && <Coffee className="w-6 h-6" />}
                    {amenity.includes("TV") && <Tv className="w-6 h-6" />}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div>
            <div className="sticky top-8 bg-card rounded-xl p-6 border shadow-sm">
              <div className="mb-4">
                <span className="text-2xl font-bold">${property.price}</span>
                <span className="text-muted-foreground"> / month</span>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="border rounded-t-lg p-3">
                    <label className="block text-sm font-medium">Check-in</label>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Add date</span>
                    </div>
                  </div>
                  <div className="border rounded-t-lg p-3">
                    <label className="block text-sm font-medium">Check-out</label>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Add date</span>
                    </div>
                  </div>
                </div>
                <div className="border rounded-b-lg p-3">
                  <label className="block text-sm font-medium">Guests</label>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    <span>1 guest</span>
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