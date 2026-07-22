export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Platform = "google" | "yelp" | "facebook";
export type ReviewStatus = "pending" | "approved" | "posted";
export type SubscriptionTier = "free" | "starter" | "pro" | "enterprise";
export type ReportFrequency = "weekly" | "monthly" | "off";
export type RiskLevel = "low" | "medium" | "high";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          company_name: string | null;
          stripe_customer_id: string | null;
          subscription_tier: SubscriptionTier;
          onboarding_completed_at: string | null;
          welcome_email_sent_at: string | null;
          report_frequency: ReportFrequency;
          alert_phone_number: string | null;
          competitor_name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          company_name?: string | null;
          stripe_customer_id?: string | null;
          subscription_tier?: SubscriptionTier;
          onboarding_completed_at?: string | null;
          welcome_email_sent_at?: string | null;
          report_frequency?: ReportFrequency;
          alert_phone_number?: string | null;
          competitor_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          company_name?: string | null;
          stripe_customer_id?: string | null;
          subscription_tier?: SubscriptionTier;
          onboarding_completed_at?: string | null;
          welcome_email_sent_at?: string | null;
          report_frequency?: ReportFrequency;
          alert_phone_number?: string | null;
          competitor_name?: string | null;
          created_at?: string;
        };
      };
      locations: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          address: string | null;
          google_place_id: string | null;
          yelp_business_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          address?: string | null;
          google_place_id?: string | null;
          yelp_business_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          address?: string | null;
          google_place_id?: string | null;
          yelp_business_id?: string | null;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          location_id: string;
          platform: Platform;
          reviewer_name: string | null;
          rating: number;
          review_text: string | null;
          review_date: string | null;
          response_text: string | null;
          status: ReviewStatus;
          risk_level: RiskLevel | null;
          flagged_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          location_id: string;
          platform: Platform;
          reviewer_name?: string | null;
          rating: number;
          review_text?: string | null;
          review_date?: string | null;
          response_text?: string | null;
          status?: ReviewStatus;
          risk_level?: RiskLevel | null;
          flagged_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          location_id?: string;
          platform?: Platform;
          reviewer_name?: string | null;
          rating?: number;
          review_text?: string | null;
          review_date?: string | null;
          response_text?: string | null;
          status?: ReviewStatus;
          risk_level?: RiskLevel | null;
          flagged_at?: string | null;
          created_at?: string;
        };
      };
      ai_settings: {
        Row: {
          id: string;
          location_id: string;
          auto_approve_5star: boolean;
          tone_instructions: string | null;
          sign_off_name: string | null;
        };
        Insert: {
          id?: string;
          location_id: string;
          auto_approve_5star?: boolean;
          tone_instructions?: string | null;
          sign_off_name?: string | null;
        };
        Update: {
          id?: string;
          location_id?: string;
          auto_approve_5star?: boolean;
          tone_instructions?: string | null;
          sign_off_name?: string | null;
        };
      };
      leads: {
        Row: {
          id: string;
          email: string;
          source: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          source?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          source?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
