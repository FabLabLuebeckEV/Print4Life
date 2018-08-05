import { Injectable } from '@angular/core';
import { faArrowLeft, faWrench, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: Object = {
    icons: {
      back: faArrowLeft,
      edit: faWrench,
      delete: faTrashAlt,
      add: faPlus
    },
    spinnerConfig: {
      bdColor: 'rgba(51, 51, 51, 0.8)',
      size: 'large',
      color: '#fff',
      type: 'ball-climbing-dot'
    },
  };
  constructor() { }

  public getConfig() {
    return this.config;
  }

}
