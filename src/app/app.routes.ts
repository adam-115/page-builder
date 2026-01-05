import { Routes } from '@angular/router';
import { AmlFormViewComponent } from './components/aml-dynamic-form-component/aml-dynamic-form-component';
import { AmlFormConfigComponent } from './components/aml-form-config-component/aml-form-config-component';
import { AmlFormListComponent } from './components/aml-form-list-component/aml-form-list-component';
import { AmlPageView } from './components/aml-page-view/aml-page-view';
import { AmlFormResultComponent } from './components/aml-form-result.component/aml-result-page.component';
import { NavigationService } from './services/navigation-service';

export const routes: Routes = [
  {
    path: '',
    component: AmlFormListComponent
  },
  {
    path: NavigationService.FORM_CONFIG_LIST,
    component: AmlFormListComponent

  },
  {
    path: NavigationService.FORM_CONFIG_CREATE,
    component: AmlFormConfigComponent
  },
  {
    path: NavigationService.FORM_CONFIG_EDIT,
    component: AmlFormConfigComponent
  },

  {
    path: NavigationService.FORM_CONFIG_VIEW,
    component: AmlFormViewComponent
  },
  {
    path: NavigationService.FORM_RESULT_VIEW,
    component: AmlFormResultComponent
  },

  {
    path: 'test',
    component: AmlFormViewComponent
  },
  {
    path: 'test2',
    component: AmlFormResultComponent
  },
  {
    path: 'test3',
    component: AmlPageView
  },



];
