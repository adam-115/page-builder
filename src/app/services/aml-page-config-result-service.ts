import { Injectable } from '@angular/core';
import { AmlPageConfigResult } from '../../appTypes';
import { AbstractCrudService } from './genericService/abstract-crud.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AmlPageConfigResultService extends AbstractCrudService<AmlPageConfigResult>{
  protected apiUrl = environment.apiUrl+'AmlPageConfigResult'; // Provide your API URL



  constructor(http: HttpClient) {
    super(http);
  }

}
