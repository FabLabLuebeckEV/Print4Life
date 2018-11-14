import { Component, OnInit } from '@angular/core';
import { routes } from 'frontend/app/config/routes';
import { HttpClient, HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { ConfigService } from 'frontend/app/config/config.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  accept = '*';
  files: File[] = [];
  progress: number;
  hasBaseDropZoneOver = false;
  httpEmitter: Subscription;
  httpEvent: HttpEvent<Event>;
  lastFileAt: Date;
  checkIcon: FaIconComponent;
  warningIcon: FaIconComponent;
  deleteIcon: FaIconComponent;
  uploadIcon: FaIconComponent;

  constructor(public HttpClient: HttpClient, private configService: ConfigService) {
    const config: any = this.configService.getConfig();
    this.checkIcon = config.icons.toggleOn;
    this.warningIcon = config.icons.warning;
    this.deleteIcon = config.icons.delete;
    this.uploadIcon = config.icons.upload;

  }

  cancel() {
    this.progress = 0;
    if (this.httpEmitter) {
      this.httpEmitter.unsubscribe();
    }
  }

  uploadFilesToOrder(id: string): Subscription {
    const url = `${routes.backendUrl}/${routes.paths.backend.orders.root}/${id}/${routes.paths.backend.orders.upload}`;
    const formData: FormData = new FormData();
    this.files.forEach(file => {
      formData.append('file', file, file.name);
    });
    const req = new HttpRequest<FormData>('POST', url, formData, {
      reportProgress: true// , responseType: 'text'
    });

    return this.httpEmitter = this.HttpClient.request(req)
      .subscribe(
        (event: HttpEvent<Event>) => {
          this.httpEvent = event;

          if (event instanceof HttpResponse) {
            delete this.httpEmitter;
          }
        },
        error => console.log('Error Uploading', error)
      );
  }

  getDate() {
    return new Date();
  }


  ngOnInit() {
  }

}
