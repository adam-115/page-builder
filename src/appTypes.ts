export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}
export interface PageConfig {
  id: number | null,
  gridNumberOfCols: number,
  gridNumberOfRows: number,
  gridRowHighInPX: number;
  gridCustomStyle: string,

  formElements: FormElement[],
  order: number,
  step: number,

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


// used for the check box
export interface Option {
  id?: number;
  name?: string;
  InputTypeConfigId?: number | null;
  value: string;
  score: number;
  order?: number;
}

export interface InputTypeConfig {
  id: number | null,
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
  id: number | null,
  pageName: string,
  pageTitle: string,
  pageDescription: string,
  formConfig: InputTypeConfig[],
  order: number,
}


export interface AlertConfig {
  id?: number;// used to identify alert instances
  type: 'error' | 'warning' | 'info' | 'success' | 'confirm';
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}






