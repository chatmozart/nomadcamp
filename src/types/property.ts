export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  image_url: string | null;
  owner_id: string;
  price_three_months: number | null;
  price_six_months: number | null;
  price_one_year: number | null;
  availability_start: string | null;
  availability_end: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_whatsapp: string | null;
  location_category_id: number;
  published: boolean;
  locations?: {
    name: string;
  } | null;
}