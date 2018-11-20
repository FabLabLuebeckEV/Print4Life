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
  faTimesCircle,
  faCloudUploadAlt,
  faExclamationCircle
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
      warning: faExclamationCircle,
      delete: faTrashAlt,
      toggleOn: faCheckCircle,
      toggleOff: faTimesCircle,
      disable: faFrown,
      add: faPlus,
      forward: faArrowRight,
      public: faGlobeAmericas,
      upload: faCloudUploadAlt
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
