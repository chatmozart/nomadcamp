import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface PropertyBookingCardProps {
  price: number;
  priceThreeMonths?: number;
  priceSixMonths?: number;
  priceOneYear?: number;
  availabilityStart?: string | null;
  availabilityEnd?: string | null;
  contactName?: string;
  contactEmail?: string;
  contactWhatsapp?: string;
}

export const PropertyBookingCard = ({ 
  price,
  priceThreeMonths,
  priceSixMonths,
  priceOneYear,
  availabilityStart,
  availabilityEnd,
  contactName,
  contactEmail,
  contactWhatsapp
}: PropertyBookingCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  console.log('Rendering PropertyBookingCard with prices and dates:', { 
    price, 
    priceThreeMonths, 
    priceSixMonths, 
    priceOneYear,
    availabilityStart,
    availabilityEnd,
    contactName,
    contactEmail,
    contactWhatsapp
  });
  
  return (
    <div className="sticky top-24">
      <Card className="p-6 min-h-fit flex flex-col justify-between gap-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Price</h3>
            <div className="flex justify-between items-center">
              <span>1 month</span>
              <span className="text-2xl font-bold">{price.toLocaleString()}฿</span>
            </div>
            {priceThreeMonths && (
              <div className="flex justify-between items-center">
                <span>3 months</span>
                <span className="text-2xl font-bold">{priceThreeMonths.toLocaleString()}฿</span>
              </div>
            )}
            {priceSixMonths && (
              <div className="flex justify-between items-center">
                <span>6 months</span>
                <span className="text-2xl font-bold">{priceSixMonths.toLocaleString()}฿</span>
              </div>
            )}
            {priceOneYear && (
              <div className="flex justify-between items-center">
                <span>12 months</span>
                <span className="text-2xl font-bold">{priceOneYear.toLocaleString()}฿</span>
              </div>
            )}
          </div>
          
          {availabilityStart && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold">Availability</h3>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Period</span>
                <span className="font-medium">
                  {new Date(availabilityStart).toLocaleDateString('en-GB', { 
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })} - {
                    availabilityEnd 
                      ? new Date(availabilityEnd).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })
                      : 'ongoing'
                  }
                </span>
              </div>
            </div>
          )}

          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <button className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors">
                Book
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              <div className="space-y-4">
                <Input
                  type="text"
                  value={contactName || ""}
                  readOnly
                  className="w-full bg-gray-50"
                  placeholder="Contact Name"
                />
                <Input
                  type="email"
                  value={contactEmail || ""}
                  readOnly
                  className="w-full bg-gray-50"
                  placeholder="Contact Email"
                />
                <Input
                  type="tel"
                  value={contactWhatsapp || ""}
                  readOnly
                  className="w-full bg-gray-50"
                  placeholder="WhatsApp Number"
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </Card>
    </div>
  );
};