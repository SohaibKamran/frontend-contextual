import { Component, EventEmitter, Input, OnInit, Output,ElementRef, ViewChild } from '@angular/core';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'cdk-slider-proxy',
  templateUrl: './slider-proxy.component.html',
  styleUrls: ['./slider-proxy.component.scss']
})
export class SliderProxyComponent implements OnInit {
  @ViewChild('sliderElement') sliderElement!: ElementRef<HTMLDivElement>;
  startScrollLeft = 0;
  selectedProxy: any = null;
  @Input() recentProxies: any[] = [];
  @Input() allowDrag = true;
  @Output() dragStart: EventEmitter<any> = new EventEmitter<any>();
  @Output() dragEnd: EventEmitter<any> = new EventEmitter<any>();

  slideConfig = {
    "slidesToShow": 7,
    "slidesToScroll": 1,
    "swipeToSlide": true,
    "touchThreshold": 100,
    "finite": true,
    "arrows": false,
    //"focusOnSelect": true
    responsive: [
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
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 390,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  imgmoving = false;
  proxyDragStart($event,image) {
    console.log("sssssssssssss",image);
    this.imgmoving = true;
    this.mouseDown = false;
    this.dragStart.emit([$event,image])
  }

  proxyDragEnd($event) {
    this.imgmoving = false;
    // this.sharedService.droppedSuperProxyImage.next(true)
    this.dragEnd.emit($event)
  }

  afterChange(e) {
    // console.log('afterChange');
  }

  beforeChange(e) {
    // console.log('beforeChange');
  }
  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
  }

  mouseDown = false;
  startX: any;
  scrollLeft: any;
  scrollTagStart(event: any) {
    // let slider: any = document.getElementById('proxy-slider');
    // this.mouseDown = true;
    // this.startX = event.pageX - slider.offsetLeft;
    // this.scrollLeft = slider.scrollLeft;
    const slider: HTMLDivElement = this.sliderElement.nativeElement;
    this.mouseDown = true;
    this.startX = event.pageX;
    this.startScrollLeft = slider.scrollLeft;
  }
  scrollTagMove(event: any) {
    // if(this.imgmoving) return;
    // let slider: any = document.getElementById('proxy-slider');
    // if (!this.mouseDown) return;
    // event.preventDefault();
    // const x = event.pageX - slider.offsetLeft;
    // const walk = (x - this.startX) * 1; //scroll-fast
    // slider.scrollLeft = this.scrollLeft - walk;
    if (!this.mouseDown) return;
    const slider: HTMLDivElement = this.sliderElement.nativeElement;
    const mouseX = event.pageX;
    const movementX = mouseX - this.startX;
    slider.scrollLeft = this.startScrollLeft - movementX;
  }
  scrollTagEnd(event: any) {
    this.mouseDown = false;
  }
  onProxyMouseDown(event: MouseEvent, proxy: any): void {
    this.selectedProxy = proxy;
    this.selectedProxy.isDragging = true; // Flag to indicate dragging
    this.selectedProxy.startX = event.pageX;
    const target = event.target as HTMLElement;
    this.selectedProxy.startLeft = target.offsetLeft;
    document.addEventListener('mousemove', this.onDocumentMouseMove);
    document.addEventListener('mouseup', this.onDocumentMouseUp);
  }
  onDocumentMouseMove = (event: MouseEvent): void => {
    if (!this.selectedProxy || !this.selectedProxy.isDragging) return;
    const mouseX = event.pageX;
    const movementX = mouseX - this.selectedProxy.startX;
    const newLeft = this.selectedProxy.startLeft + movementX;
    this.selectedProxy.left = newLeft; // Update proxy's left position
  }

  onDocumentMouseUp = (): void => {
    if (!this.selectedProxy || !this.selectedProxy.isDragging) return;
    this.selectedProxy.isDragging = false;
    this.selectedProxy = null;
    document.removeEventListener('mousemove', this.onDocumentMouseMove);
    document.removeEventListener('mouseup', this.onDocumentMouseUp);
  }
}
