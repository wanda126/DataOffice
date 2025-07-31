export interface User {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'admin' | 'analyst';
  company?: string;
  maturity_level?: number;
  maturity_assessment?: MaturityAssessment;
  avatar?: string;
  avatar_url?: string;
  company_logo_url?: string;
  free_consultations_used: number;
  created_at?: string;
  updated_at?: string;
}

export interface Consultation {
  id: string;
  clientId: string;
  title: string;
  description: string;
  status: 'analyzing' | 'proposal' | 'delivered' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  deadline: string;
  createdAt: string;
  updatedAt: string;
  assignedAnalyst?: string;
  files?: FileAttachment[];
  proposal?: Proposal;
  is_free?: boolean;
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface Proposal {
  id: string;
  consultationId: string;
  executiveSummary: string;
  recommendations: string[];
  kpis: KPI[];
  createdAt: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
}

export interface KPI {
  name: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  description: string;
}

export interface Message {
  id: string;
  consultationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file';
}

export interface MaturityAssessment {
  dataGovernance: number;
  analyticsCapability: number;
  technologyInfrastructure: number;
  dataLiteracy: number;
  businessAlignment: number;
}

export interface Review {
  id: string;
  consultation_id: string;
  client_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface ServiceRecommendation {
  title: string;
  description: string;
  price: string;
  features: string[];
  recommended: boolean;
}