import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class GenericService {
  config;
  constructor(private location: Location) {
  }

  public back() {
    this.location.back();
  }

  public translateCreatedAt(objCreatedAt, currentLang, dateTimeFormat) {
    let createdAt = moment(objCreatedAt).locale(currentLang).format(dateTimeFormat);
    createdAt = currentLang === 'de' ? createdAt + ' Uhr' : createdAt;
    return createdAt;
  }
}
