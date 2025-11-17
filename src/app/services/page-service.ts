import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { AbstractCrudService } from './genericService/abstract-crud.service';
import { Page } from '../../appTypes';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PageService extends AbstractCrudService<Page> {
  protected apiUrl = environment.apiUrl + "/pages"

  constructor(http: HttpClient) {
    super(http);
  }

}
