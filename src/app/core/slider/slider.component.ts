/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
// eslint-disable-next-line no-var
declare var $: any;

@Component({
  selector: 'cdk-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {
  constructor(
    private router: Router
  ) { }

  @Input() slides: number;
  @Input() last?: boolean = false;
  @Input() videos;
  @ViewChild('container', { static: true }) containerRef: ElementRef;
  @ViewChild('content', { static: true }) contentRef: ElementRef;

  private isDragging = false;
  private startX: number;
  private scrollLeft: number;
  mousePosition = {
    x: 0,
    y: 0
  };

  slideConfig = {
    "slidesToShow": 10,
    "slidesToScroll": 1,
    "swipeToSlide": true,
    "touchThreshold": 100,
    "draggable": true,
    "infinite": false,
    "arrows": false,
    "useCSS": true,
    "cssEase": "linear",
    // "variableWidth": true,

    //"focusOnSelect": true,
    responsive: [
      {
        breakpoint: 4000,
        settings: {
          slidesToShow: 12,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 2400,
        settings: {
          slidesToShow: 10,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1800,
        settings: {
          slidesToShow: 8,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 7,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4.5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3.5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 425,
        settings: {
          slidesToShow: 2.3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 390,
        settings: {
          slidesToShow: 1.7,
          slidesToScroll: 1,
        },
      },
    ],
  };

  afterChange(e) {
    // console.log('afterChange');
  }

  beforeChange(e) {
    // console.log('beforeChange');
  }

  gotoPlayer($event: any, video: any) {
    //console.log("hello")
    this.router.navigate(['user/player', video.Episodes[0].id])
  }

  onMouseDown($event: MouseEvent) {
    this.mousePosition.x = $event.screenX;
    this.mousePosition.y = $event.screenY;
  }

  ngOnInit(): void {
    // $('.slider-nav').slick({
    //   slidesToShow: this.slides,
    //   slidesToScroll: 1,
    //   swipeToSlide: true,
    //   touchThreshold: 100,
    //   finite: true,
    //   arrows: false,
    //   focusOnSelect: true
    // });

    // $('a[data-slide]').click(function (e) {
    //   e.preventDefault();
    //   var slideno = $(this).data('slide');
    //   $('.slider-nav').slick('slickGoTo', slideno - 1);
    // });
    // this.slideConfig.slidesToShow = this.slides;
    // const container = this.containerRef.nativeElement;
    // const content = this.contentRef.nativeElement;

    // container.addEventListener('mousedown', (e: MouseEvent) => {
    //   e.preventDefault();
    //   this.isDragging = true;
    //   this.startX = e.pageX - container.offsetLeft;
    //   this.scrollLeft = container.scrollLeft;
    // });

    // container.addEventListener('mouseleave', () => {
    //   this.isDragging = false;
    // });

    // container.addEventListener('mouseup', () => {
    //   this.isDragging = false;
    // });

    // container.addEventListener('mousemove', (e: MouseEvent) => {
    //   e.preventDefault()
    //   if (!this.isDragging) return;

    //   e.preventDefault();
    //   const x = e.pageX - container.offsetLeft;
    //   const walk = (x - this.startX) * 3; // Adjust the scrolling speed
    //   container.scrollLeft = this.scrollLeft - walk;
    // });
  }
}
