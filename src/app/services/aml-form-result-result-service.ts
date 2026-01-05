import { Injectable } from '@angular/core';
import { AmlFormResult } from '../../appTypes';
import { AbstractCrudService } from './genericService/abstract-crud.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AmlFormResultService extends AbstractCrudService<AmlFormResult>{
  protected apiUrl = environment.apiUrl+'AmlFormResult'; // Provide your API URL



  constructor(http: HttpClient) {
    super(http);
  }

}
