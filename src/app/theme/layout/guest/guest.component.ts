import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.scss']
  // imports: [AdminBreadcrumbComponent]
})
export class GuestComponent implements OnDestroy {
  // Life cycle events
  ngOnDestroy() {
    document.querySelector('body').classList.remove('landing-page');
  }
}
