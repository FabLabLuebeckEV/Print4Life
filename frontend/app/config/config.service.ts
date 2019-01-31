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
  faExclamationCircle,
  faCalendarAlt,
  faSearch,
  faCogs
} from '@fortawesome/free-solid-svg-icons';

export class SpinnerConfig {
  loadingText: string;
  bdColor: string;
  size: string;
  color: string;
  type: string;

  constructor(loadingText: string, bdColor: string, size: string, color: string, type: string) {
    this.loadingText = loadingText;
    this.bdColor = bdColor;
    this.size = size;
    this.color = color;
    this.type = type;
  }
}

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
      upload: faCloudUploadAlt,
      calendar: faCalendarAlt,
      search: faSearch,
      processIcon: faCogs
    },
    spinnerConfig: new SpinnerConfig('', 'rgba(51, 51, 51, 0.8)', 'large', '#fff', 'ball-climbing-dot')
  };
  constructor() { }

  public getConfig() {
    return this.config;
  }

}
