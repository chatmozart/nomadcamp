import { useParams } from "react-router-dom";
import { MapPin, Star, Calendar, Wifi, Coffee, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    beds: 3,
    baths: 2,
    maxGuests: 6
  },
];

const PropertyDetails = () => {
  const { id } = useParams();
  const property = properties.find((p) => p.id === Number(id));

  if (!property) {
    return <div className="container mx-auto px-4 py-8">Property not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Title Section */}
      <div className="container mx-auto px-4 pt-6 pb-2">
        <h1 className="text-4xl font-semibold">{property.title}</h1>
      </div>

      {/* Image Grid Section */}
      <div className="container mx-auto px-4 mb-8">
        <div className="grid grid-cols-4 gap-2 h-[45vh] max-w-[2000px] mx-auto">
          <div className="col-span-2 row-span-2 relative">
            <img
              src={property.images[0]}
              alt={`${property.title} - Main`}
              className="w-full h-full object-cover rounded-l-xl"
            />
          </div>
          <div className="relative">
            <img
              src={property.images[1]}
              alt={`${property.title} - Second`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative">
            <img
              src={property.images[1]}
              alt={`${property.title} - Third`}
              className="w-full h-full object-cover rounded-tr-xl"
            />
          </div>
          <div className="relative">
            <img
              src={property.images[2]}
              alt={`${property.title} - Fourth`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative">
            <img
              src={property.images[2]}
              alt={`${property.title} - Fifth`}
              className="w-full h-full object-cover rounded-br-xl"
            />
            <Button 
              variant="outline" 
              className="absolute bottom-4 right-4 bg-white hover:bg-white/90"
            >
              Show all photos
            </Button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4">
        {/* Rating and Location Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-primary fill-current" />
              <span className="ml-1 font-medium">{property.rating}</span>
              <span className="mx-1">·</span>
              <span className="underline">{property.reviews} reviews</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5" />
              <span className="ml-1 underline">{property.location}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline">Share</Button>
            <Button variant="outline">Save</Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between pb-6 border-b">
              <div>
                <h2 className="text-2xl font-semibold">
                  Entire villa hosted by Owner
                </h2>
                <p className="text-muted-foreground">
                  {property.maxGuests} guests · {property.beds} bedrooms · {property.baths} baths
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gray-200"></div>
            </div>

            <div className="space-y-4 pb-6 border-b">
              <h2 className="text-2xl font-semibold">About this property</h2>
              <p className="text-muted-foreground leading-relaxed">
                {property.description}
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">What this place offers</h2>
              <div className="grid grid-cols-2 gap-4">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-4">
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
          <div className="relative">
            <div className="sticky top-8 bg-card rounded-xl p-6 border shadow-sm">
              <div className="mb-4">
                <span className="text-2xl font-bold">${property.price}</span>
                <span className="text-muted-foreground"> / month</span>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1 border rounded-t-lg p-3">
                    <label className="block text-sm font-medium">Check-in</label>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Add date</span>
                    </div>
                  </div>
                  <div className="space-y-1 border rounded-t-lg p-3">
                    <label className="block text-sm font-medium">Check-out</label>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Add date</span>
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