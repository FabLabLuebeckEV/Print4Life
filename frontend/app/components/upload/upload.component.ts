import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { routes } from 'frontend/app/config/routes';
import { HttpClient, HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { ConfigService } from 'frontend/app/config/config.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'frontend/environments/environment.staging';

import { TranslationModel } from '../../models/translation.model';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  @Output() uploadingEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() fileChangeEvent: EventEmitter<number> = new EventEmitter();
  accept = '*';
  files: File[] = [];
  config: any;
  progress: number;
  hasBaseDropZoneOver = false;
  httpEmitter: Subscription;
  httpEvent: HttpEvent<Event>;
  lastFileAt: Date;
  checkIcon: FaIconComponent;
  warningIcon: FaIconComponent;
  deleteIcon: FaIconComponent;
  uploadIcon: FaIconComponent;
  maxSize: number;
  lastInvalids: any;
  baseDropValid: any;
  dragFiles: any;
  translationFields: TranslationModel.Upload;


  constructor(
    public HttpClient: HttpClient,
    private configService: ConfigService,
    private translateService: TranslateService
  ) {
    console.log('test');
    this.config = this.configService.getConfig();
    this.checkIcon = this.config.icons.toggleOn;
    this.warningIcon = this.config.icons.warning;
    this.deleteIcon = this.config.icons.delete;
    this.uploadIcon = this.config.icons.upload;
    this.maxSize = environment.upload.maxSize;

  }

  cancel() {
    this.progress = 0;
    if (this.httpEmitter) {
      this.httpEmitter.unsubscribe();
    }
  }

  uploadFilesToOrder(id: string, cb?: Function, shared?: boolean): Subscription {
    let url;
    if (shared) {
      url = `${routes.backendUrl}/${routes.paths.backend.orders.root}/`
        + `${routes.paths.backend.orders.shared}/${id}/${routes.paths.backend.orders.files}`;
    } else {
      url = `${routes.backendUrl}/${routes.paths.backend.orders.root}/${id}/${routes.paths.backend.orders.files}`;
    }
    const formData: FormData = new FormData();
    this.files.forEach(file => {
      formData.append('file', file, file.name);
    });
    const req = new HttpRequest<FormData>('POST', url, formData, {
      reportProgress: true// , responseType: 'text'
    });

    this.emit(true);

    return this.httpEmitter = this.HttpClient.request(req)
      .subscribe(
        (event: HttpEvent<Event>) => {
          this.httpEvent = event;
          if (event instanceof HttpResponse) {
            delete this.httpEmitter;
          }
        },
        error => console.log('Error Uploading', error),
        () => {
          this.emit(false);
          if (cb) {
            cb();
          }
        }
      );
  }

  getDate() {
    return new Date();
  }


  ngOnInit() {
    this.translateService.onLangChange.subscribe(() => {
      this._translate();
    });
    this._translate();
  }

  public emit(uploading) {
    this.uploadingEvent.emit(uploading);
  }

  public emitFileChange(files) {
    if (files && files.length) {
      this.fileChangeEvent.emit(files.length);
    } else {
      this.fileChangeEvent.emit(0);
    }
  }

  private _translate() {
    this.translateService.get(['upload']).subscribe((translations => {
      if (translations.hasOwnProperty('upload') && translations.upload.hasOwnProperty('labels')) {
        this.translationFields = TranslationModel.translationUnroll(translations);
      }
    }));
  }

}
