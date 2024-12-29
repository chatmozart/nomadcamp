import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Star, MapPin, Share, Heart, Home, Wifi, Car, Tv } from "lucide-react";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState({
    id: 1,
    title: "Luxury Villa with Ocean View",
    location: "Malibu, California",
    price: 2200,
    rating: 4.9,
    reviews: 128,
    description: "Experience luxury living in this stunning oceanfront villa. Perfect for families and groups looking for an unforgettable stay.",
    amenities: ["Full Kitchen", "Free Parking", "WiFi", "TV", "Ocean View"],
    bedrooms: 4,
    bathrooms: 3,
    guests: 8,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80",
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-3xl font-bold">{property.title}</h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center">
                  <MapPin className="mr-2" />
                  <span>{property.location}</span>
                </div>
                <div className="flex items-center">
                  <Star className="mr-2" />
                  <span>{property.rating} ({property.reviews} reviews)</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-full">
                <Share className="w-5 h-5" />
                <span>Share</span>
              </button>
              <button className="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-full">
                <Heart className="w-5 h-5" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="px-4">
          <Card className="overflow-hidden">
            <img src={property.image} alt={property.title} className="w-full h-[600px] object-cover" />
          </Card>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-3 gap-12 px-4 py-8">
          <div className="col-span-2">
            <div className="border-b pb-6">
              <h2 className="text-2xl font-semibold mb-4">
                Hosted by NomadRent
              </h2>
              <div className="flex gap-4 text-gray-600">
                <span>{property.guests} guests</span>
                <span>•</span>
                <span>{property.bedrooms} bedrooms</span>
                <span>•</span>
                <span>{property.bathrooms} bathrooms</span>
              </div>
            </div>

            <div className="py-6 border-b">
              <p className="text-gray-600">{property.description}</p>
            </div>

            <div className="py-6 border-b">
              <h3 className="text-xl font-semibold mb-4">What this place offers</h3>
              <div className="grid grid-cols-2 gap-4">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-4">
                    {amenity.includes("Kitchen") && <Home className="w-6 h-6" />}
                    {amenity.includes("WiFi") && <Wifi className="w-6 h-6" />}
                    {amenity.includes("Parking") && <Car className="w-6 h-6" />}
                    {amenity.includes("TV") && <Tv className="w-6 h-6" />}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <Card className="p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <div className="text-2xl font-bold">${property.price}</div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  <span>{property.rating}</span>
                  <span className="mx-1">•</span>
                  <span className="text-gray-600">{property.reviews} reviews</span>
                </div>
              </div>
              <button className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors">
                Reserve
              </button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;