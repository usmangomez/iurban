export interface BrandingLogo {
  type: string;
  value: string;
}

export interface BrandingAppStyle {
  corpColor1: string;
  corpColor2?: string;
  backgroundColor?: string;
  headerColor?: string;
  corpCompl?: string;
  logo?: BrandingLogo;
  logoList?: {
    primaryLogo?: BrandingLogo;
    secondaryLogo?: BrandingLogo;
  };
}

export interface BrandingLang {
  mainLanguage: string;
  styleLanguage?: string;
  availableLanguages: string[];
  chatbot?: unknown;
}

export interface Branding {
  appId: number;
  location?: {
    lat: string;
    lng: string;
    address: string;
    searchRadius: string;
    visualizeLines: boolean;
  };
  type: string;
  appStyle: BrandingAppStyle;
  lang: BrandingLang;
  channelID?: number | null;
  chatbotID?: number | null;
  newVersion?: number;
  privacyPolicy?: unknown[];
  hasIncidentsSurvey?: boolean;
  passport?: unknown;
  clientID: number;
}
