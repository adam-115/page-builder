import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AmlFormConfig } from '../../appTypes';
import { environment } from '../../environments/environment';
import { AbstractCrudService } from './genericService/abstract-crud.service';

@Injectable({
  providedIn: 'root',
})
export class AmlFormConfigService extends AbstractCrudService<AmlFormConfig> {

  protected apiUrl = environment.apiUrl + 'AmlFormConfig'; // Provide your API URL

  constructor(http: HttpClient) {
    super(http);
  }

}
