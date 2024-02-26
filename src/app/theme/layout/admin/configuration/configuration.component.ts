import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { MantisConfig } from 'src/app/app-config';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  rtlLayout: boolean;
  bodyColor: string;
  darkLayout: boolean;
  boxLayout: boolean;
  fontFamily: string;

  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    if ((this.rtlLayout = MantisConfig.isRtlLayout)) {
      this.renderer.addClass(document.body, 'mantis-rtl');
    }
    if ((this.fontFamily = MantisConfig.font_family)) {
      this.renderer.addClass(document.body, this.fontFamily);
    }
    if ((this.darkLayout = MantisConfig.isDarkLayout)) {
      this.document.body.classList.add('mantis-dark');
      this.document.querySelector('.coded-navbar').classList.add('navbar-dark');
    }
    if ((this.boxLayout = MantisConfig.isBox_container)) {
      this.document.querySelector('.coded-content').classList.add('container');
    }
    if ((this.bodyColor = MantisConfig.theme_color)) {
      this.document.body.part.add(this.bodyColor);
    }
  }
}
