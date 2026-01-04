import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AmlPageConfigValue } from '../../appTypes';
import { environment } from '../../environments/environment';
import { AbstractCrudService } from './genericService/abstract-crud.service';
@Injectable({
  providedIn: 'root',
})
export class AmlPageConfigValueService  extends AbstractCrudService<AmlPageConfigValue>{

  protected apiUrl = environment.apiUrl+'AmlPageConfigValue'; // Provide your API URL

  constructor(http: HttpClient) {
    super(http);
  }

}
