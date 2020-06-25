import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {
  constructor (
    private navigationService: NavigationService
  ) {

  }

  ngOnInit () {
    this.navigationService.setStatic(true);

    document.querySelectorAll('.toc a').forEach((el) => {
      el.addEventListener('click', (ev) => {
        ev.preventDefault();

        const selector = el.getAttribute('href');
        const anchor = document.getElementById(selector.replace('#', ''));
        if (anchor) {
          window.scroll({ top: anchor.offsetTop - 50, left: 0, behavior: 'smooth' });
        }
      });
    });
  }
}
