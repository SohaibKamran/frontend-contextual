import { Component, ElementRef, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // public props
  title = 'mantis';

  // Constructor
  constructor(private router: Router, private elementRef: ElementRef) { }

  // Life cycle events
  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        if (evt['url'] == "/auth/tagger-login" ||
          evt['url'] == "/auth/login" ||
          evt['url'] == "/login" ||
          evt['url'] == "/auth/tagger-register" ||
          evt['url'] == "/auth/register" ||
          evt['url'] == "/register"
        ) {
          //this.elementRef.nativeElement.ownerDocument
           // .body.style.backgroundColor = '#fff';
        }
        if (evt['url'] && evt['url'] !== "/indexer" &&
          evt['url'] !== "/tagger/tag-video" && evt['url'] !== "/tagger"
        ) {
          localStorage.removeItem('simulatedtaggerid')
        }
        if (evt['url'] && !evt['url'].includes('user')) {
          localStorage.removeItem('simulateduserid')
        }
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
