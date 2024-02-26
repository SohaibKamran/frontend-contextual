import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-alert.component.html',
  styleUrls: ['./admin-alert.component.scss']
})
export class AdminAlertComponent {
  @Input() type: string;
  @Input() dismiss: string;

  dismissAlert(element) {
    element.remove();
  }
}
