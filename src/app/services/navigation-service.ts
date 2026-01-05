import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';


/****
 *
 * service to centrilise navigation
 */
@Injectable({
  providedIn: 'root',
})
export class NavigationService {

  router = inject(Router);

  public static readonly FORM_CONFIG_LIST = "aml-form-config-list";
  public static readonly FORM_CONFIG_CREATE = "form-config/create";
  public static readonly FORM_CONFIG_EDIT = "form-config/edit/:id";
  public static readonly FORM_CONFIG_VIEW = "form-config/view/:id";
  public static readonly FORM_RESULT_VIEW = "form-result/view/:id";


  public navigateToFormConfigList(): void {
    this.router.navigate(['/', NavigationService.FORM_CONFIG_LIST]);
  }

  public navigateToNewFormConfig(): void {
    this.router.navigate(['/', ...NavigationService.FORM_CONFIG_CREATE.split('/')]);
  }


  public navigateToEditFormConfig(id: number): void {
    let targetUrl = NavigationService.FORM_CONFIG_EDIT.replace(":id", id.toString());
    this.router.navigate(['/', ...targetUrl.split("/")]);

  }

  public navigateToViewFormConfig(id: number): void {
    let targetUrl = NavigationService.FORM_CONFIG_VIEW.replace(":id", id.toString());
    this.router.navigate(['/', ...targetUrl.split("/")]);
  }






}
