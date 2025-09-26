
export interface Country {
  code: string;
  country: string;
  flag: string;
}

export interface UserInfo {
  name: string;
  citizenships: string[]; // Array of country codes
}

export interface Stay {
  id: string;
  countryCode: string;
  entryDate: string;
  exitDate: string;
}

export interface EntryRule {
  entry_id: string;
  rule_name: string;
  visa_type: string;
  max_days: number;
  period_of_stay_type: string;
}

export interface RuleApplicability {
  entry_country_code: string;
}

export interface RuleMapping {
  visa_required: boolean;
}

export interface Rule {
  entryRule: EntryRule;
  applicability: RuleApplicability;
  mapping: RuleMapping;
}

export interface PassportDocument {
  doc_id: string;
  country: string;
  code: string;
  doc_type: string;
  flag: string;
}

export interface PassportRules {
  document: PassportDocument;
  rules: Rule[];
}

export type StoredRules = Record<string, PassportRules>;
