import { Routes } from '@angular/router';
import { AmlFormConfig } from './components/aml-form-config/aml-form-config';
import { AmlDynamicFormComponent } from './components/aml-dynamic-form-component/aml-dynamic-form-component';

export const routes: Routes = [

  {
    path: '',
    component:AmlFormConfig
  },
  {
    path: 'test',
    component:AmlDynamicFormComponent
  }


];
