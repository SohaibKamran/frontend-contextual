import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'cdk-slider-ai',
  templateUrl: './slider-ai.component.html',
  styleUrls: ['./slider-ai.component.scss']
})
export class SliderAiComponent implements OnInit {
  @Input() data;
  slideConfig = {
    "slidesToShow": 4,
    "slidesToScroll": 1,
    "swipeToSlide": true,
    "touchThreshold": 100,
    "finite": true,
    "arrows": false,
    //"focusOnSelect": true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 390,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };


  afterChange(e) {
    // // console.log('afterChange');
  }

  beforeChange(e) {
    // // console.log('beforeChange');
  }
  constructor() { }

  ngOnInit(): void {
    // console.log('this is data in slider-ai',this.data);
    
  }

}


