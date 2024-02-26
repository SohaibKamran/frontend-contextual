import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'cdk-home-cover',
  templateUrl: './home-cover.component.html',
  styleUrls: ['./home-cover.component.scss'],
})
export class HomeCoverComponent implements OnInit {
  currentItem = 0;
  timer: any;
  carouselItems = [
    'assets/videos/modern_family_shopping_trailer_wide.mp4',
    'assets/images/homepage_carousel/hero-banner-friends.jpg',
    'assets/images/homepage_carousel/hero-banner-pretty-little-liars.jpg',
    'assets/images/homepage_carousel/hero-banner-new-girl.jpg',
    'assets/images/homepage_carousel/hero-banner-the-good-wife.jpg',
   ]

  carouselVideoIds = [394 /*modern family*/, 370 /*Friends*/, 429 /*Pretty Little Liars*/,375, 417 /*The Good Wife*/]
  
  @ViewChild('videoElement') videoElement: ElementRef<HTMLVideoElement>;
  constructor(
    private router:Router
  ) {
    
   }

   gotoPlayer($event: any) {
    
    this.router.navigate(['user/player', this.carouselVideoIds[this.currentItem]])
  }

  /*goToItem(index: number): void {
    this.currentItem = index;
    this.timer = setTimeout(() => this.nextItem(), 5000); // 5 seconds
  }
*/
  
  ngOnInit(): void {
    this.startCarousel();
  }

  startVideo() {
    const video = document.querySelector('video');
    if (video) {
      video.play();
    }
  }



  startCarousel() {
    this.currentItem = 0;
    this.startVideo()
  }

  nextItem() {
    this.currentItem++;
    if (this.currentItem > this.carouselItems.length - 1){
      this.currentItem = 0;
      this.startVideo()
    }

    if (this.currentItem !== 0) {
      this.timer = setTimeout(() => this.nextItem(), 10000); // 10 seconds
    }
  }


  ngAfterViewInit() {
    this.videoElement.nativeElement.muted = true;
  }

  ngOnDestroy() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

}
