export interface FormField {
  checked?: boolean;
  description?: string;
  disabled?: boolean;
  label: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  rowIndex: number;
  type: string;
  value?: string;
  varient: 'Input' | 'CheckBox' | 'Select';
  options?: { label: string; value: string }[];
  dependsOn?: {
    field: string;
    condition: 'equals' | 'greaterThan' | 'lessThan';
    value: any;
  };
}

export interface FormData {
  [key: string]: string | boolean | number;
}

export interface FormStats {
  interactions: { [key: string]: number };
  totalInteractions: number;
}