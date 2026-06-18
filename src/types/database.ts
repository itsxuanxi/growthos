export type Plan = "free" | "pro" | "team";
export type LeadStatus = "new" | "contacted" | "qualified" | "won" | "lost";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  company: string | null;
  plan: Plan;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: string | null;
  ai_generations_used: number;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  user_id: string;
  name: string;
  company: string | null;
  email: string | null;
  status: LeadStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Prospect {
  name: string;
  title: string;
  company: string;
  reason: string;
}

export interface LeadFinderResult {
  id: string;
  user_id: string;
  industry: string;
  location: string;
  company_size: string;
  customer_profile: string;
  prospects: Prospect[];
  outreach_strategy: string;
  created_at: string;
}

export interface GeneratedEmail {
  id: string;
  user_id: string;
  company_name: string;
  prospect_name: string;
  product_description: string;
  cold_email: string;
  linkedin_dm: string;
  follow_up_email: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}
