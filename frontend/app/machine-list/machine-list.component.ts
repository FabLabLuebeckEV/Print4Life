import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {config} from '../config/config';

@Component({
  selector: 'app-machine-list',
  templateUrl: './machine-list.component.html',
  styleUrls: ['./machine-list.component.css']
})
export class MachineListComponent implements OnInit {

  machines: Array<Object>;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.getAllPrinters();
  }

  getAllPrinters(): any {
    this.http.get(config.backendUrl + '/machines/printer').subscribe(((res: any) => {
      this.machines = res.printers;
      return this.machines;
    }));
  }
}
