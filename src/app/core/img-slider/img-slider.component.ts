import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'cdk-img-slider',
  templateUrl: './img-slider.component.html',
  styleUrls: ['./img-slider.component.scss']
})
export class ImgSliderComponent implements OnInit {
  @Input() title: string;
  @Input() last?: boolean = false;
  @Input() videos;
  public slides = 6
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

}
