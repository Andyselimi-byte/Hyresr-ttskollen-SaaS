export type SubscriptionStatus = "free" | "premium";

export interface Profile {
  id: string;
  email: string;
  subscription_status: SubscriptionStatus;
  stripe_customer_id: string | null;
  created_at: string;
}

export interface RentInput {
  rooms: number;
  area: number;
  city: string;
  currentRent: number;
}

export interface RentResult {
  currentRent: number;
  referenceRent: number;
  difference: number;
  differencePercent: number;
  status: "ok" | "warn" | "danger";
  label: string;
}

export interface ContractClause {
  title: string;
  status: "ok" | "warn" | "flag";
  finding: string;
  information: string;
  lawRef: string;
}

export interface ContractAnalysis {
  clauses: ContractClause[];
  summary: string;
}

export interface RightsTopicData {
  id: string;
  title: string;
  tag: string;
  icon: string;
  emoji: string;
  summary: string;
  content: string;
  lawRef: string;
}

export interface LetterTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  fields: LetterField[];
  template: (fields: Record<string, string>) => string;
}

export interface LetterField {
  key: string;
  label: string;
  placeholder: string;
  type?: "text" | "date" | "textarea";
}
