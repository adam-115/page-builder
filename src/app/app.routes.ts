import { Routes } from '@angular/router';
import { PageBuilderDisplay } from './page-builder-display/page-builder-display';
import { CreateUpdateInput } from './page-builder-type-2/create-update-input/create-update-input';

export const routes: Routes = [

  {
    path: '',
    component: PageBuilderDisplay
  },
  {
    path: 'cui',
    component: CreateUpdateInput
  }


];
