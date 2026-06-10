/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'HR Admin' | 'Recruiter' | 'Hiring Manager' | 'Employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type CandidateStatus = 'Applied' | 'Reviewing' | 'Interviewing' | 'Offered' | 'Accepted' | 'Rejected';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  experience: number; // in years
  expectedSalary: string;
  resume?: string; // resume file path/name
  status: CandidateStatus;
  createdDate: string;
}

export type TemplateCategory = 'Professional' | 'Corporate' | 'Executive' | 'Technology' | 'Healthcare' | 'Finance' | 'Education' | 'Startup';
export type TemplateStyle = 'Classic' | 'Modern' | 'Minimalist' | 'Elegant' | 'Casual' | 'Tech-Bold';

export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  style: TemplateStyle;
  thumbnailColor: string; // Tailwind background gradient/class for card header
  header: string;
  companyName: string;
  logoUrl?: string;
  bodyContent: string;
  termsAndConditions: string;
  footer: string;
  themeColors: {
    header: string;
    text: string;
    primary: string;
    background: string;
  };
  fontFamily: string;
  fontSize: string;
  signatureBlocks: {
    title: string;
    name: string;
    showLine: boolean;
  }[];
  visibilityControls: {
    showHeader: boolean;
    showLogo: boolean;
    showTerms: boolean;
    showFooter: boolean;
    showSignatures: boolean;
  };
  createdDate: string;
  updatedDate: string;
}

export type OfferLetterStatus = 
  | 'Draft' 
  | 'Pending Hiring Manager Approval' 
  | 'Pending HR Admin Approval' 
  | 'Final Approved' 
  | 'Sent' 
  | 'Accepted' 
  | 'Rejected' 
  | 'Changes Requested';

export interface ApprovalHistoryItem {
  id: string;
  step: 'Recruiter' | 'Hiring Manager' | 'HR Admin' | 'Final';
  action: 'Created' | 'Approved' | 'Rejected' | 'Changes Requested' | 'Sent';
  actorName: string;
  actorRole: UserRole;
  comments: string;
  timestamp: string;
}

export interface OfferLetter {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  companyName: string;
  position: string;
  department: string;
  salary: string;
  joiningDate: string;
  reportingManager: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  benefits: string;
  termsAndConditions: string;
  status: OfferLetterStatus;
  templateId: string;
  header: string;
  bodyContent: string;
  footer: string;
  fontFamily: string;
  fontSize: string;
  themeColors: {
    header: string;
    text: string;
    primary: string;
    background: string;
  };
  signatureBlocks: {
    title: string;
    name: string;
    signatureData?: string; // base64 or drawn name
    signedAt?: string;
  }[];
  visibilityControls: {
    showHeader: boolean;
    showLogo: boolean;
    showTerms: boolean;
    showFooter: boolean;
    showSignatures: boolean;
  };
  createdDate: string;
  updatedDate: string;
  history: ApprovalHistoryItem[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  category: 'Candidate' | 'Offer' | 'Template' | 'General';
  isRead: boolean;
  timestamp: string;
}

export interface Activitylog {
  id: string;
  user: string;
  role: UserRole;
  action: string;
  target: string;
  timestamp: string;
}

export interface CompanySettings {
  companyName: string;
  companyLogo: string; // Base64 or initials
  address: string;
  email: string;
  phone: string;
  website: string;
}

export interface SystemSettings {
  theme: 'Dark' | 'Light';
  notificationPreferences: {
    newCandidate: boolean;
    offerSent: boolean;
    offerApproved: boolean;
    offerRejected: boolean;
    templateUpdated: boolean;
  };
}
