import { Routes } from '@angular/router';
import { AmlDynamicFormComponent } from './components/aml-dynamic-form-component/aml-dynamic-form-component';
import { AmlPageConfigComponent } from './components/aml-page-config-component/aml-page-config-component';
import { AmlPageListComponent } from './components/aml-page-list-component/aml-page-list-component';
import { AmlPageView } from './components/aml-page-view/aml-page-view';
import { AmlResultPageComponent } from './components/aml-result-page.component/aml-result-page.component';
import { NavigationService } from './services/navigation-service';

export const routes: Routes = [
  {
    path: '',
    component: AmlPageListComponent
  },
  {
    path: NavigationService.PAGE_CONFIG_LIST,
    component: AmlPageListComponent

  },
  {
    path: NavigationService.PAGE_CONFIG_CREATE,
    component: AmlPageConfigComponent
  },
  {
    path: NavigationService.PAGE_CONFIG_EDIT,
    component: AmlPageConfigComponent
  },

  {
    path: NavigationService.PAGE_CONFIG_VIEW,
    component: AmlDynamicFormComponent
  },
  {
    path: NavigationService.PAGE_RESULT_VIEW,
    component: AmlResultPageComponent
  },

  {
    path: 'test',
    component: AmlDynamicFormComponent
  },
  {
    path: 'test2',
    component: AmlResultPageComponent
  },
  {
    path: 'test3',
    component: AmlPageView
  },



];
