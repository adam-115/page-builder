import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { AbstractCrudService } from './genericService/abstract-crud.service';
import { PageConfig } from '../../appTypes';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PageConfigService extends AbstractCrudService<PageConfig> {
  protected apiUrl = environment.apiUrl + "pageConfigs"

  constructor(http: HttpClient) {
    super(http);
  }

}
