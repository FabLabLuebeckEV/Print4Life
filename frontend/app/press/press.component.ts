import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-press',
    templateUrl: './press.component.html',
    styleUrls: ['./press.component.css']
})
export class PressComponent implements OnInit {
    async ngOnInit() {


        document.querySelectorAll('.toc a').forEach(el => {
            el.addEventListener('click', ev => {
                ev.preventDefault();

                const selector = el.getAttribute('href');
                const anchor = document.getElementById(selector.replace('#', ''));
                if(anchor) {
                    window.scroll({top: anchor.offsetTop - 50, left: 0, behavior: 'smooth'});
                }
            })
        })
    }
}
