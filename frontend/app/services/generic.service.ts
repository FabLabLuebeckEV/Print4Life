import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class GenericService {

  constructor(private location: Location) { }
  public back() {
    this.location.back();
  }
}
