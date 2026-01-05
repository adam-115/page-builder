import { Injectable } from '@angular/core';
import { AmlInputConfig } from '../../appTypes';
import { HttpClient } from '@angular/common/http';
import { AbstractCrudService } from './genericService/abstract-crud.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InputTypeConfigService extends AbstractCrudService<AmlInputConfig> {

  protected apiUrl = environment.apiUrl+'InputTypeConfig'; // Provide your API URL

  constructor(http: HttpClient) {
    super(http);
  }

}
