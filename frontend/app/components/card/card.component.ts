import { Component, OnInit, Input } from '@angular/core';

export class CardItem {
  id: String;
  title: String;
  subtitle: String;
  subsubtitle: String;
  description: String;
  pictureUrl: String;
  pictureAltText: String;
  editHref: String;
  deleteHref: String;
}

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Input() item: CardItem;

  constructor() { }

  ngOnInit() {
  }

}
