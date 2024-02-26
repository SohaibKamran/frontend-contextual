import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomsThemeService {
  customsTheme = new ReplaySubject<string>(9);
  navbarCollapsed = false;
}