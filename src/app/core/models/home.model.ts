export interface LocalizedString {
  es: string;
  en: string;
  [lang: string]: string;
}

export interface HeroMultimedia {
  duration: number;
  src: string;
  type: string;
}

export interface HeroSection {
  heroMultimedia: HeroMultimedia[];
  headerName: LocalizedString;
  claim: LocalizedString;
  plannerButton: { text: LocalizedString };
  searchEngine: { placeholder: LocalizedString };
}

export interface OpeningTime {
  day: string;
  time: string[];
}

export interface Category {
  id: number;
  icon: string;
  nameSlug: LocalizedString;
  name: LocalizedString;
  image: string;
}

export interface HomeItem {
  id: number;
  type: string;
  client_id: string[];
  name: LocalizedString;
  image: string;
  url: string | null;
  duration?: number;
  durationc: string;
  num_clicks: number;
  coordinates?: string;
  nameSlug: LocalizedString;
  subcategories: string[];
  accesibilities: string[];
  price?: string;
  price_custom: unknown;
  priceFilter: unknown;
  popularity?: number;
  start?: string;
  end?: string;
  categories: string[];
  opening_times: OpeningTime[];
  offers?: unknown[];
  subCatString: string | null;
  location?: string;
  labels: string | null;
  always_open: number;
}

export interface HomePoint {
  id: number | null;
  type: string;
  category?: Category;
  items: HomeItem[];
  icon?: string;
  events?: HomeItem[];
  hikings?: unknown[];
}

export interface HomeResponse {
  status: number;
  heroSection: HeroSection;
  recommendedRoutesList: unknown[];
  homePoints: HomePoint[];
}
