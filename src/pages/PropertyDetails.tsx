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
  User,
  BedDouble,
  Bath,
  Medal,
  Key,
  Home,
  Clock
} from "lucide-react";
import { useParams } from "react-router-dom";
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
    reviewCount: 128,
    description: "Experience luxury living in this stunning oceanfront villa. Perfect for digital nomads seeking inspiration with panoramic views of the Pacific Ocean. This fully furnished property includes a dedicated workspace, high-speed fiber internet, and all modern amenities.",
    highlights: [
      "Entire villa to yourself",
      "Enhanced Clean",
      "Self check-in",
      "Free cancellation for 48 hours"
    ],
    amenities: [
      { name: "High-speed WiFi", icon: Wifi },
      { name: "Full Kitchen", icon: Coffee },
      { name: "Smart TV", icon: Tv },
      { name: "Ocean View", icon: Home },
      { name: "Pool", icon: Home },
      { name: "Workspace", icon: Home }
    ],
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
      responseTime: "within an hour",
      totalReviews: 245,
      isSuperhost: true
    },
    beds: 3,
    baths: 2,
    maxGuests: 6,
    reviews: [
      {
        id: 1,
        user: {
          name: "John",
          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80"
        },
        rating: 5,
        date: "October 2023",
        comment: "Amazing place with stunning views. Sarah was an excellent host and made sure we had everything we needed."
      },
      {
        id: 2,
        user: {
          name: "Emma",
          image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80"
        },
        rating: 5,
        date: "September 2023",
        comment: "The villa exceeded our expectations. The location is perfect and the amenities are top-notch."
      }
    ]
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
      {/* Logo */}
      <div className="fixed top-0 left-0 z-50 p-4">
        <a href="/" className="flex items-center">
          <img 
            src="/logo.svg" 
            alt="NomadRent Logo" 
            className="h-8 w-auto"
          />
        </a>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="px-4 py-6">
          <h1 className="text-2xl font-semibold mb-2">{property.title}</h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-primary fill-current" />
                <span className="ml-1 font-medium">{property.rating}</span>
                <span className="mx-1">·</span>
                <span className="underline">{property.reviewCount} reviews</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4" />
                <span className="ml-1 underline">{property.location}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="relative w-full h-[600px] px-4 mb-12">
          <div className="w-full h-full">
            <Carousel className="w-full h-full">
              <CarouselContent>
                {property.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="w-full h-[600px]">
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
        </div>

        {/* Main Content */}
        <div className="px-4 pt-8">
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

              {/* Highlights */}
              <div className="space-y-4 pb-6 border-b">
                {property.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <Medal className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-medium">{highlight}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="space-y-4 pb-6 border-b">
                <h2 className="text-xl font-semibold">About this place</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Amenities */}
              <div className="space-y-4 pb-6 border-b">
                <h2 className="text-xl font-semibold">What this place offers</h2>
                <div className="grid grid-cols-2 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <amenity.icon className="w-6 h-6" />
                      <span>{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-primary fill-current" />
                  <span className="text-xl font-semibold">
                    {property.rating} · {property.reviews.length} reviews
                  </span>
                </div>
                <div className="grid gap-6">
                  {property.reviews.map((review) => (
                    <div key={review.id} className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={review.user.image} alt={review.user.name} />
                          <AvatarFallback>{review.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{review.user.name}</p>
                          <p className="text-sm text-muted-foreground">{review.date}</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:block">
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

        {/* Host Section */}
        <div className="mt-12 pb-12 border-t">
          <div className="max-w-3xl pt-12">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={property.host.image} alt={property.host.name} />
                <AvatarFallback>{property.host.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-semibold">Hosted by {property.host.name}</h2>
                <p className="text-muted-foreground">
                  Joined in {property.host.joinedDate} · {property.host.totalReviews} reviews
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {property.host.isSuperhost && (
                <div className="flex items-center gap-4">
                  <Medal className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-medium">Superhost</p>
                    <p className="text-sm text-muted-foreground">
                      Superhosts are experienced, highly rated hosts.
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-4">
                <Key className="w-6 h-6" />
                <div>
                  <p className="font-medium">Great check-in experience</p>
                  <p className="text-sm text-muted-foreground">
                    100% of recent guests gave the check-in process a 5-star rating.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Clock className="w-6 h-6" />
                <div>
                  <p className="font-medium">Great communication</p>
                  <p className="text-sm text-muted-foreground">
                    {property.host.responseRate} response rate · Responds {property.host.responseTime}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;