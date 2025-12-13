import { Injectable } from '@angular/core';
import { AbstractCrudService } from './genericService/abstract-crud.service';
import { FormElement } from '../../appTypes';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FormElementService extends AbstractCrudService<FormElement> {
  protected apiUrl = environment.apiUrl + "/formELements"

  constructor(http: HttpClient) {
    super(http);
  }


}
