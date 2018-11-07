import { Injectable } from '@angular/core';
import {
  faArrowLeft,
  faWrench,
  faTrashAlt,
  faPlus,
  faArrowRight,
  faGlobeAmericas,
  faFrown,
  faCheckCircle,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';

export enum RUN_ENV {
  DEV, PROD, STAGING
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: Object = {
    defaultLangStorageName: 'orderManagementLang',
    defaultLang: 'en',
    icons: {
      back: faArrowLeft,
      edit: faWrench,
      delete: faTrashAlt,
      toggleOn: faCheckCircle,
      toggleOff: faTimesCircle,
      disable: faFrown,
      add: faPlus,
      forward: faArrowRight,
      public: faGlobeAmericas
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
