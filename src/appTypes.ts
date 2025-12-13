export interface User {
  id: number;
  name: string;
  email: string;
  password:string;
}
export interface PageConfig {
  id:number | null ,
  gridNumberOfCols:number,
  gridNumberOfRows:number,
  gridRowHighInPX :number;
  gridCustomStyle:string,

  formElements:FormElement[],
  order:number,
  step:number,

}

// Define types for alignment options
type HorizontalAlignment = 'start' | 'end' | 'center' | 'stretch';
type VerticalAlignment = 'start' | 'end' | 'center' | 'baseline' | 'stretch';
// define type for field types
export type FieldType = 'text' | 'TextArea' | 'date' | 'select' | 'checkbox' | 'radio' | 'uploadFile' | 'submit' | 'cancel';
export interface FormElement {
  id: number | undefined ;
  uiid?:number;
  type: FieldType;
  name: string; // Added property for the form control name
  required: boolean;
  label: string;
  placeholder?: string;
  options?: string[]; // for select , radio , checkbox
  errorMessage?: string;
  customStyle ?: string;
  rowStart: number;
  rowEnd: number;
  colStart: number;
  colEnd: number;
  score?:number;
  facteur?:number;
  defaultValue?: any;
  optionsLayout?: 'block' | 'inline';
  // NEW: Alignment properties (Justify controls vertical, Align controls horizontal since container is flex-col)
  justify?: HorizontalAlignment;
  align?: VerticalAlignment;

}

