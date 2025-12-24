import { Injectable } from '@angular/core';
import { AmlPageConfig } from '../../appTypes';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AbstractCrudService } from './genericService/abstract-crud.service';

@Injectable({
  providedIn: 'root',
})
export class PageConfigService extends AbstractCrudService<AmlPageConfig> {

   protected apiUrl = environment.apiUrl+'PageConfig'; // Provide your API URL

  constructor(http: HttpClient) {
    super(http);
  }

}
