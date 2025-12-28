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

  public static readonly PAGE_CONFIG_LIST = "page-config-list";
  public static readonly PAGE_CONFIG_CREATE = "page-config/create";
  public static readonly PAGE_CONFIG_EDIT = "page-config/edite/:id";


  public navigateToPageConfigList(): void {
    this.router.navigate(['/', NavigationService.PAGE_CONFIG_LIST]);
  }

  public navigateToNewPageConfig(): void {
    this.router.navigate(['/', ...NavigationService.PAGE_CONFIG_CREATE.split('/')]);
  }


  public navigateToEditPageConfig(id: number): void {
    let targetUrl = NavigationService.PAGE_CONFIG_EDIT.replace(":id", id.toString());
    this.router.navigate(['/', ...targetUrl.split("/")]);

  }






}
