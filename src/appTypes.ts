export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}


export type FieldType = 'text' | 'TextArea' | 'date' | 'select' | 'checkbox' | 'radio' | 'uploadFile' | 'submit' | 'cancel';

// version 2

// Définition des constantes pour faciliter la maintenance
const SCORE_MIN = 0;
const SCORE_MAX = 10;
export type InputType = 'select' | 'checkbox' | 'radio' | 'uploadFile';
export type IconType = "success" | "error" | "warning" | "info" | "question";

export interface AmlFormConfig {
  id?: number,
  formName: string,
  formTitle: string,
  formDescription: string,
  order: number,
  inputConfigs: AmlInputConfig[],
}

export interface AmlInputConfig {
  id?: string;
  type: InputType;
  name: string; // Added property for the form control name it must be unique
  score?: number;// used for upload
  facteur: number,
  required: boolean;
  labelMessage: string;
  placeholder?: string;
  options?: AMLInputOption[]; // for select , radio , checkbox
  errorMessage?: string;
  customStyle?: string;
  defaultValue?: any;
  displayOrer?: number;
  optionsLayout?: 'block' | 'inline';
}

// used for the check box
export interface AMLInputOption {
  id?: string;
  name?: string;
  AmlInputConfigId?: number;
  value: string;
  score: number;
  order?: number;
}

export interface AmlInputValue {
  id?: number,
  amlFormConfig?: number;
  InputConfigID: string;
  value: string;
}

// each validation result for a field
export interface AmlFormResult {
  id?: number;
  amlFormConfigID?: number;
  totalScore?: number;
  riskLevel?: 'Faible' | 'Modéré' | 'Élevé';
  AmlPageConfigValues?: AmlInputValue[];
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  duration: number;
}










