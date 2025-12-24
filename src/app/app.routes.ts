import { Routes } from '@angular/router';
import { AmlFormConfig } from './components/aml-form-config/aml-form-config';
import { AmlDynamicFormComponent } from './components/aml-dynamic-form-component/aml-dynamic-form-component';
import { Test } from './components/test/test';
import { AmlPageView } from './components/aml-page-view/aml-page-view';

export const routes: Routes = [

  {
    path: '',
    component:AmlFormConfig
  },
  {
    path: 'test',
    component:AmlDynamicFormComponent
  },
  {
    path: 'test2',
    component:Test
  },
  {
    path: 'test3',
    component:AmlPageView
  }


];
