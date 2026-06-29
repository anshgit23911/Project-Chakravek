export interface User {
  id: string;
  name: string;
  organization: string;
  email: string;
  role: 'Auditor' | 'Caudit' | 'Super Admin';
}

export interface Vendor {
  id: string; // e.g. V-101
  name: string;
  category: string;
  riskScore: number; // 0-100
  flaggedContractsCount: number;
  status: 'Active' | 'Flagged' | 'Blacklisted' | 'Under Investigation';
  registeredAt: string;
  taxId: string;
  ownerNationality: string;
  address: string;
  matchesPeAs: boolean; // Politically Exposed Persons indicators
  connectedVendors: string[]; // Grouping linked entities
}

export interface Contract {
  id: string; // e.g. C-7310
  title: string;
  vendorId: string;
  vendorName: string;
  description: string;
  amount: number; // in INR e.g. crore
  department: string; // e.g. Navy, Aerospace, Infantry
  category: string; // e.g. Ammunition, Surveillance, Jet Fuel
  status: 'Draft' | 'Approved' | 'Executed' | 'Suspended' | 'Under Audit';
  riskScore: number; // 0-100
  flagReasons: string[];
  flaggedCount: number;
  anomalyScore: number; // 0-100
  unitPriceDeviation: number; // percentage deviation from market average
  registeredDate: string;
  evidence: string[]; // audit trails
  aiExplanation: string;
}

export interface RiskScoreBreakdown {
  id: string;
  contractId: string;
  overallRisk: number;
  vendorRisk: number;
  directFlagRisk: number;
  priceRisk: number;
  entityNetworkRisk: number;
  analyzedAt: string;
}

export interface AuditReport {
  id: string;
  title: string;
  contractId: string;
  contractTitle: string;
  generatedContent: string;
  generatedBy: string;
  status: 'Draft' | 'Finalized';
  createdAt: string;
}

export interface AuditObservation {
  id: string;
  contractId: string;
  contractTitle: string;
  vendorId: string;
  vendorName: string;
  formalTitle: string;
  regulatoryReference: string; // e.g., "CAG Audit Guideline 2024 Section 12"
  observationText: string;
  recommendation: string;
  generatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  query: string;
  response: string;
  citation?: {
    files: string[];
    contracts: string[];
  };
  createdAt: string;
}

export interface UploadedFile {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  indexedAt: string;
  status: 'Pending' | 'Success' | 'Failed';
  rowCount?: number;
}

export interface Investigation {
  id: string;
  contractId: string;
  contractTitle: string;
  investigatorName: string;
  status: 'Open' | 'Resolved' | 'Escalated';
  notes: string;
  startedAt: string;
}
