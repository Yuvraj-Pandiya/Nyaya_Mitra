export interface BilingualText {
  en: string;
  hi: string;
}
export interface LawSection {
  section: string;
  act: string;
  summary: BilingualText;
  fullText: string;
}
export interface ChecklistItem {
  id: string;
  item: BilingualText;
  required: boolean;
}
export interface ProcedureStep {
  stepNumber: number;
  title: BilingualText;
  description: BilingualText;
  tip: BilingualText;
}
export interface Right {
  title: BilingualText;
  description: BilingualText;
}
export interface Situation {
  id: string;
  category: string;
  icon: string;
  title: BilingualText;
  description: BilingualText;
  rights: Right[];
  laws: LawSection[];
  checklist: ChecklistItem[];
  steps: ProcedureStep[];
  templateType: 'rti' | 'complaint' | 'fir' | 'labor' | 'consumer';
}
export interface Lawyer {
  id: string;
  name: string;
  specializations: string[];
  state: string;
  city: string;
  phone: string;
  email: string;
  organization: string;
  languages: string[];
  proBono: boolean;
  experience: number;
  barCouncilId: string;
  availableFor: string[];
  rating: number;
  lat?: number;
  lng?: number;
}
export interface DocumentFormData {
  name: string;
  address: string;
  phone: string;
  date: string;
  incidentDate: string;
  description: string;
  amount?: string;
  respondentName?: string;
  respondentAddress?: string;
  authority?: string;
  infoRequested?: string;
  // FIR specific
  incidentTime?: string;
  incidentLocation?: string;
  accusedNames?: string;
  witnessNames?: string;
  evidenceList?: string;
  complainantId?: string;
}
export type Language = 'en' | 'hi';
