export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}


// Define types for alignment options
type HorizontalAlignment = 'start' | 'end' | 'center' | 'stretch';
type VerticalAlignment = 'start' | 'end' | 'center' | 'baseline' | 'stretch';
// define type for field types
export type FieldType = 'text' | 'TextArea' | 'date' | 'select' | 'checkbox' | 'radio' | 'uploadFile' | 'submit' | 'cancel';
export interface FormElement {
  id: number | undefined;
  uiid?: number;
  type: FieldType;
  name: string; // Added property for the form control name
  required: boolean;
  label: string;
  placeholder?: string;
  options?: string[]; // for select , radio , checkbox
  errorMessage?: string;
  customStyle?: string;
  rowStart: number;
  rowEnd: number;
  colStart: number;
  colEnd: number;
  score?: number;
  facteur?: number;
  defaultValue?: any;
  optionsLayout?: 'block' | 'inline';
  // NEW: Alignment properties (Justify controls vertical, Align controls horizontal since container is flex-col)
  justify?: HorizontalAlignment;
  align?: VerticalAlignment;

}

export interface User {

}
// version 2

// Définition des constantes pour faciliter la maintenance
const SCORE_MIN = 0;
const SCORE_MAX = 10;
export type InputType = 'select' | 'checkbox' | 'radio' | 'uploadFile';

export type IconType = "success" | "error" | "warning" | "info"|"question";


// used for the check box
export interface Option {
  id?: string;
  name?: string;
  InputTypeConfigId?: number;
  value: string;
  score: number;
  order?: number;
}

export interface InputTypeConfig {
  id?: string;
  type: InputType;
  name: string; // Added property for the form control name it must be unique
  score?:number;// used for upload
  facteur: number,
  required: boolean;
  labelMessage: string;
  placeholder?: string;
  options?: Option[]; // for select , radio , checkbox
  errorMessage?: string;
  customStyle?: string;
  defaultValue?: any;
  displayOrer?: number;
  optionsLayout?: 'block' | 'inline';
}

export interface AmlPageConfig {
  id?: number ,
  pageName: string,
  pageTitle: string,
  pageDescription: string,
  order: number,
  formConfig: InputTypeConfig[],
}


export interface AlertConfig {
  id?: number;// used to identify alert instances
  type: 'error' | 'warning' | 'info' | 'success' | 'confirm';
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export interface AmlPageConfigValue {
  id?:number,
  amlPageConfigID?: number;
  InputTypeConfigID: string;
  value: string;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  duration: number;
}








