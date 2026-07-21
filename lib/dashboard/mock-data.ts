export type FeedPlatform = "google" | "yelp" | "facebook";
export type FeedStatus = "pending" | "approved" | "flagged";

export interface FeedReview {
  id: string;
  reviewerName: string;
  initials: string;
  rating: number;
  platform: FeedPlatform;
  status: FeedStatus;
  reviewText: string;
  date: string;
  aiDrafts: string[];
}

export interface MockLocation {
  id: string;
  name: string;
  address: string;
}

export const LOCATIONS: MockLocation[] = [
  { id: "loc-downtown", name: "Downtown Location", address: "482 Market St, San Francisco, CA" },
  { id: "loc-riverside", name: "Riverside Location", address: "119 Riverside Dr, San Francisco, CA" },
  { id: "loc-uptown", name: "Uptown Location", address: "77 Uptown Ave, San Francisco, CA" },
];

export const FEED_REVIEWS: FeedReview[] = [
  {
    id: "r1",
    reviewerName: "Sarah Mitchell",
    initials: "SM",
    rating: 5,
    platform: "google",
    status: "pending",
    reviewText:
      "Amazing service! The team went above and beyond to make sure everything was perfect. Highly recommend to anyone in the area.",
    date: "2h ago",
    aiDrafts: [
      "Thank you so much, Sarah! We're thrilled the team could make your visit special — your kind words mean a lot to us. We can't wait to welcome you back soon!",
      "Wow, thank you Sarah! Comments like this make our day. We'll pass your kind words along to the whole team. See you again soon!",
    ],
  },
  {
    id: "r2",
    reviewerName: "Daniel Ortiz",
    initials: "DO",
    rating: 2,
    platform: "yelp",
    status: "flagged",
    reviewText:
      "Waited almost 40 minutes past my reservation time and no one apologized. Food was fine but the wait really soured the experience.",
    date: "5h ago",
    aiDrafts: [
      "Hi Daniel, thank you for the honest feedback and I'm sorry about the wait — that's not the experience we want for our guests. I'd like to make this right; please reach out to us directly so we can follow up.",
      "Daniel, we're sorry to hear about the delay and that it impacted your visit. We're addressing this with our team and would love the chance to make it up to you on your next visit.",
    ],
  },
  {
    id: "r3",
    reviewerName: "Priya Natarajan",
    initials: "PN",
    rating: 4,
    platform: "facebook",
    status: "approved",
    reviewText:
      "Really solid experience overall. Staff was friendly and knowledgeable. Only reason it's not 5 stars is parking was a bit tricky to find.",
    date: "1d ago",
    aiDrafts: [
      "Thank you, Priya! We're so glad the team took great care of you. Noted on the parking — we're working on clearer signage to make it easier next time. See you soon!",
    ],
  },
  {
    id: "r4",
    reviewerName: "Marcus Webb",
    initials: "MW",
    rating: 5,
    platform: "google",
    status: "approved",
    reviewText:
      "Best in the neighborhood, hands down. Consistent quality every time I come in. Never disappointed.",
    date: "1d ago",
    aiDrafts: [
      "Thank you, Marcus! Consistency is something we take a lot of pride in, so this means a lot. We appreciate you being a loyal customer!",
    ],
  },
  {
    id: "r5",
    reviewerName: "Ana Ferreira",
    initials: "AF",
    rating: 3,
    platform: "yelp",
    status: "pending",
    reviewText:
      "It was okay. Nothing stood out as bad, but nothing really wowed me either. Might try again to give it another shot.",
    date: "2d ago",
    aiDrafts: [
      "Thanks for giving us a try, Ana! We'd love the opportunity to show you a more memorable visit next time — feel free to let us know what we can do better.",
      "Hi Ana, thank you for the feedback. We're always looking to improve, so if there's anything specific you'd like to see, we'd love to hear it on your next visit.",
    ],
  },
  {
    id: "r6",
    reviewerName: "Jordan Lee",
    initials: "JL",
    rating: 1,
    platform: "facebook",
    status: "flagged",
    reviewText:
      "Order was completely wrong and when I called to fix it, nobody picked up. Very frustrating experience.",
    date: "3d ago",
    aiDrafts: [
      "Jordan, we're really sorry — this isn't the experience we want anyone to have. Please reach out directly so we can correct the order and make this right as soon as possible.",
    ],
  },
  {
    id: "r7",
    reviewerName: "Emily Chen",
    initials: "EC",
    rating: 5,
    platform: "google",
    status: "approved",
    reviewText:
      "Absolutely wonderful! The staff remembered my order from last time and made me feel so welcome. This is why I keep coming back.",
    date: "3d ago",
    aiDrafts: [
      "Thank you, Emily! We love getting to know our regulars — moments like this are exactly why we do what we do. See you next time!",
    ],
  },
  {
    id: "r8",
    reviewerName: "Tom Whitfield",
    initials: "TW",
    rating: 4,
    platform: "yelp",
    status: "pending",
    reviewText:
      "Great atmosphere and friendly staff. Food took a little longer than expected but it was worth the wait.",
    date: "4d ago",
    aiDrafts: [
      "Thanks, Tom! We appreciate your patience and are glad it was worth the wait. We're working on tightening up kitchen timing — hope to see you again soon!",
      "Hi Tom, thank you for the kind words! We're always looking to speed things up in the kitchen without cutting corners on quality. Appreciate you sticking with us!",
    ],
  },
  {
    id: "r9",
    reviewerName: "Nadia Hassan",
    initials: "NH",
    rating: 5,
    platform: "facebook",
    status: "pending",
    reviewText:
      "Five stars isn't enough! Every visit is consistently great and the team clearly cares about their customers.",
    date: "5d ago",
    aiDrafts: [
      "Thank you so much, Nadia! Comments like this make the whole team's day. We can't wait to keep earning that five-star experience every visit!",
    ],
  },
  {
    id: "r10",
    reviewerName: "Chris Park",
    initials: "CP",
    rating: 2,
    platform: "google",
    status: "flagged",
    reviewText:
      "Table was sticky and it took a while for anyone to notice we were seated. Food was good once it arrived though.",
    date: "6d ago",
    aiDrafts: [
      "Hi Chris, thank you for flagging this — that's not the standard we hold ourselves to. We're following up with the team on table turnover and service timing. Hope to have you back for a better experience.",
    ],
  },
  {
    id: "r11",
    reviewerName: "Laura Bianchi",
    initials: "LB",
    rating: 5,
    platform: "yelp",
    status: "approved",
    reviewText:
      "My go-to spot for the last two years. Never had a bad visit, and the team always goes the extra mile.",
    date: "1w ago",
    aiDrafts: [
      "Thank you, Laura! Two years of visits means the world to us — we're so glad we've been able to consistently deliver. Here's to many more!",
    ],
  },
];

export const RATING_DISTRIBUTION = [
  { stars: 5, count: 612 },
  { stars: 4, count: 248 },
  { stars: 3, count: 74 },
  { stars: 2, count: 31 },
  { stars: 1, count: 19 },
];

export const SENTIMENT_SPLIT = {
  positive: 78,
  neutral: 14,
  negative: 8,
};

export interface MonthlyMetric {
  month: string;
  avgRating: number;
  reviewCount: number;
  avgResponseHours: number;
  platformCounts: Record<FeedPlatform, number>;
}

export const MONTHLY_TREND: MonthlyMetric[] = [
  { month: "Feb", avgRating: 4.5, reviewCount: 132, avgResponseHours: 6.8, platformCounts: { google: 68, yelp: 41, facebook: 23 } },
  { month: "Mar", avgRating: 4.6, reviewCount: 148, avgResponseHours: 5.9, platformCounts: { google: 76, yelp: 44, facebook: 28 } },
  { month: "Apr", avgRating: 4.6, reviewCount: 156, avgResponseHours: 5.1, platformCounts: { google: 81, yelp: 45, facebook: 30 } },
  { month: "May", avgRating: 4.7, reviewCount: 171, avgResponseHours: 4.3, platformCounts: { google: 89, yelp: 48, facebook: 34 } },
  { month: "Jun", avgRating: 4.7, reviewCount: 189, avgResponseHours: 3.4, platformCounts: { google: 98, yelp: 52, facebook: 39 } },
  { month: "Jul", avgRating: 4.8, reviewCount: 204, avgResponseHours: 2.6, platformCounts: { google: 107, yelp: 55, facebook: 42 } },
];

export interface LocationMetric {
  avgRating: number;
  reviewCount: number;
  responseRate: number;
  pendingCount: number;
}

export const LOCATION_METRICS: Record<string, LocationMetric> = {
  "loc-downtown": { avgRating: 4.8, reviewCount: 612, responseRate: 96, pendingCount: 1 },
  "loc-riverside": { avgRating: 4.5, reviewCount: 341, responseRate: 89, pendingCount: 2 },
  "loc-uptown": { avgRating: 4.7, reviewCount: 331, responseRate: 94, pendingCount: 0 },
};
