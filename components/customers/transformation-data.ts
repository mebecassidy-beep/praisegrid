export type TransformationCategory = "Home Services" | "Restaurants" | "Medical" | "Retail";

export const CATEGORIES: TransformationCategory[] = ["Home Services", "Restaurants", "Medical", "Retail"];

export interface TransformationExample {
  category: TransformationCategory;
  industry: string;
  businessName: string;
  searchTerm: string;
  before: { rating: number; responseTime: string; points: string[] };
  after: { rating: number; responseTime: string; points: string[] };
}

export const TRANSFORMATIONS: TransformationExample[] = [
  {
    category: "Home Services",
    industry: "Plumbing",
    businessName: "Sac Valley Plumbing",
    searchTerm: "plumbers near me",
    before: {
      rating: 3.8,
      responseTime: "No response — ever",
      points: ['Ranked #7 for "plumbers near me"', "12 reviews sitting unanswered"],
    },
    after: {
      rating: 4.9,
      responseTime: "Under 2 hours, every time",
      points: ['Top 3 local pack for "plumbers near me"', "Every review answered on-brand, automatically"],
    },
  },
  {
    category: "Home Services",
    industry: "Auto Repair",
    businessName: "Trailhead Auto & Tire",
    searchTerm: "auto repair near me",
    before: {
      rating: 3.7,
      responseTime: "3–5 days, if at all",
      points: ['Ranked #8 for "auto repair near me"', "Pricing complaints sitting in public view"],
    },
    after: {
      rating: 4.8,
      responseTime: "Same-day, 100% of the time",
      points: ['Top 3 local pack for "auto repair near me"', "Pricing concerns resolved before they go public"],
    },
  },
  {
    category: "Home Services",
    industry: "Home Cleaning",
    businessName: "Clearwater Cleaning Co.",
    searchTerm: "house cleaning near me",
    before: {
      rating: 3.9,
      responseTime: "1+ week, if ever",
      points: ['Ranked #9 for "house cleaning near me"', "Missed-appointment complaints piling up"],
    },
    after: {
      rating: 4.9,
      responseTime: "Same-day",
      points: ['Top 3 local pack for "house cleaning near me"', "Rebooking link in every AI reply"],
    },
  },
  {
    category: "Restaurants",
    industry: "Restaurant",
    businessName: "The Copper Fork",
    searchTerm: "restaurants near me",
    before: {
      rating: 3.6,
      responseTime: "Days, if ever",
      points: ['Ranked #9 for "restaurants near me"', "3 unaddressed 1-star complaints"],
    },
    after: {
      rating: 4.8,
      responseTime: "Within hours",
      points: ['Top 3 local pack for "restaurants near me"', "Negative reviews caught before they go public"],
    },
  },
  {
    category: "Restaurants",
    industry: "Cafe",
    businessName: "Brightleaf Cafe",
    searchTerm: "coffee shop near me",
    before: {
      rating: 3.5,
      responseTime: "Never responded",
      points: ['Ranked #11 for "coffee shop near me"', "Wait-time complaints going unanswered"],
    },
    after: {
      rating: 4.9,
      responseTime: "Under 3 hours",
      points: ['Top 3 local pack for "coffee shop near me"', "Every complaint turned into a return visit"],
    },
  },
  {
    category: "Medical",
    industry: "Dental",
    businessName: "Bright Smile Dental",
    searchTerm: "dentist near me",
    before: {
      rating: 4.1,
      responseTime: "No response",
      points: ['Ranked #5 for "dentist near me"', "Insurance complaints unaddressed"],
    },
    after: {
      rating: 4.9,
      responseTime: "Same business day",
      points: ['Top 3 local pack for "dentist near me"', "New-patient questions routed automatically"],
    },
  },
  {
    category: "Medical",
    industry: "Chiropractic",
    businessName: "Northgate Chiropractic",
    searchTerm: "chiropractor near me",
    before: {
      rating: 3.9,
      responseTime: "2+ weeks",
      points: ['Ranked #7 for "chiropractor near me"', "Scheduling frustrations visible to new patients"],
    },
    after: {
      rating: 4.8,
      responseTime: "Under 24 hours",
      points: ['Top 3 local pack for "chiropractor near me"', "HIPAA-safe replies to every review"],
    },
  },
  {
    category: "Retail",
    industry: "Hair Salon",
    businessName: "Willow & Co. Salon",
    searchTerm: "hair salon near me",
    before: {
      rating: 4.0,
      responseTime: "Rarely",
      points: ['Ranked #6 for "hair salon near me"', "No consistent brand voice in replies"],
    },
    after: {
      rating: 4.9,
      responseTime: "Same day",
      points: ['Top 3 local pack for "hair salon near me"', "Booking link in every AI reply"],
    },
  },
  {
    category: "Retail",
    industry: "Home Goods",
    businessName: "Sundial Home Goods",
    searchTerm: "home decor store near me",
    before: {
      rating: 3.7,
      responseTime: "Never",
      points: ['Ranked #10 for "home decor store near me"', "Shipping complaints sitting in public view"],
    },
    after: {
      rating: 4.8,
      responseTime: "Within hours",
      points: ['Top 3 local pack for "home decor store near me"', "Every complaint resolved before it spreads"],
    },
  },
];
