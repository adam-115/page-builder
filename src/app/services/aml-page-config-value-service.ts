import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AmlInputValue } from '../../appTypes';
import { environment } from '../../environments/environment';
import { AbstractCrudService } from './genericService/abstract-crud.service';
@Injectable({
  providedIn: 'root',
})
export class AmlInputValueService  extends AbstractCrudService<AmlInputValue>{

  protected apiUrl = environment.apiUrl+'AmlInputValue'; // Provide your API URL

  constructor(http: HttpClient) {
    super(http);
  }

}
