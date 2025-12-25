import { Routes } from '@angular/router';
import { AmlFormConfig } from './components/aml-form-config/aml-form-config';
import { AmlDynamicFormComponent } from './components/aml-dynamic-form-component/aml-dynamic-form-component';
import { Test } from './components/test/test';
import { AmlPageView } from './components/aml-page-view/aml-page-view';
import { AmlPageListComponent } from './components/aml-page-list-component/aml-page-list-component';
import { NavigationService } from './services/navigation-service';
import { AmlPageConfigComponent } from './components/aml-page-config-component/aml-page-config-component';

export const routes: Routes = [

  {
    path: '',
    component: AmlPageListComponent
  },

  {
    path:NavigationService.PAGE_CONFIG_LIST,
    component:AmlPageListComponent

  },

  {
    path: NavigationService.PAGE_CONFIG_CREATE,
    component: AmlPageConfigComponent
  },



  {
    path: 'test',
    component: AmlDynamicFormComponent
  },
  {
    path: 'test2',
    component: Test
  },
  {
    path: 'test3',
    component: AmlPageView
  },
  {
    path: "test4",
    component: AmlFormConfig
  }


];
