import { Location } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,

} from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { MediaObserver } from '@angular/flex-layout';
import { Router } from '@angular/router';
import { VgApiService } from '@videogular/ngx-videogular/core';
// import { SharedService } from '../core/services/shared.service';
import { PlayerService } from './player.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from 'src/app/core/services/shared.service';
import { requests } from 'src/app/core/config/config';
import { ApiService } from 'src/app/core/services/api.service';
import { getAdRetailersOfShow } from 'src/app/core/constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EpisodeAdInventoryComponent } from 'src/app/shared/episode-ad-inventory/episode-ad-inventory.component';
import { UserWatchService } from '../../user.service';
@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('retailerColumns') retailerColumns: ElementRef;
  breadCrumbItems: ({ label: string; active?: undefined; } | { label: string; active: boolean; })[];
  seeked: boolean = true
  userRole:any
  isFullScreen = false;
  videoId = null;
  sceneProductsData = [];
  currentSeason = null;
  selectedEpisode = null;
  currentEpisode = null;
  seasonList = null;
  episodesList: any = [];
  seasonDetails: any;
  // @ViewChild('videoFileContainer', { static: false }) videoFileContainer;
  allSeasons: any = [];
  allEpisodes: any = [];
  videoDetailsOriginal: any;
  episodeRetailers: any;
  retailerIds: any = [];
  showWishlistSuccess: boolean = false
  skipClicked: boolean = true
  progress: string = '0%';
  buttonPosition: string = '0%';
  startTime: any
  timePaused: any
  maxAdsCount: number;
  isUserDemo = true;
  shouldBeVisible: boolean = false;
  posters = [
    'assets/images/homepage_carousel/hero-banner-modern-family.jpg',
    'assets/images/homepage_carousel/hero-banner-friends.jpg',
    'assets/images/homepage_carousel/hero-banner-pretty-little-liars.jpg',
    'assets/images/homepage_carousel/hero-banner-new-girl.jpg',
    'assets/images/homepage_carousel/hero-banner-the-good-wife.jpg'
   ]

   selectAll: boolean = true;

  posterIds =  {394: 0 /*modern family*/,  370:1 /*Friends*/,  429:2 /*Pretty Little Liars*/, 376:3, 417:4 /*The Good Wife*/}
  pauseWanted: boolean = false;
  constructor(
    public api: VgApiService,
    private router: Router,
    public playerService: PlayerService,
    private ref: ChangeDetectorRef,
    private sharedService: SharedService,
    private location: Location,
    private media: MediaObserver,
    private _Activatedroute: ActivatedRoute,
    private loader: NgxSpinnerService,
    private apiService: ApiService,
    public modalService: NgbModal,
    private userService: UserWatchService
  ) {
    this.breadCrumbItems = [
      { label: 'Demo' },
      { label: 'Videos', active: false },
      { label: 'Friends', active: true }
    ];
    this.videoId = this._Activatedroute.snapshot.paramMap.get("id");
  }
  @ViewChild('videoFileContainer', { static: true }) videoPlayer: ElementRef;

  // variables
  mouseUpSubscription: Subscription;
  isPlaying = false;
  showAdds = false;
  addsFetched: any;
  videoDetails: any;
  progressButtonLeft: string = '0%';
  sceneId: number
  ngOnInit(): void {
    this.sharedService.navbar.next(true)
    const body = {
      userId: localStorage.getItem('userId')
    }
    this.apiService.sendRequest(requests.updateVideoPlays, 'post', body).subscribe((res: any) => {});
    this.userRole=localStorage.getItem('role')
    if (this.router.url.includes('/player')) {
      this.sharedService.showToolbar = false;
    }
    // this.resizeScreen()
    if (this.videoId == ":id")
      this.videoId = 1;
    this.loader.show();

    this.getVideoDetails({ id: this.videoId })

    if(this.userRole == '4' || this.userRole == '3' || this.userRole == '2'){
      this.isUserDemo = true;
    }else{
      this.isUserDemo = false;
    }
  }



  progressBarWidth: string = '0%';
  isDragging: boolean = false;

  ngAfterViewInit() {
    
    // this.videoPlayer.nativeElement.addEventListener('timeupdate', () => {
    //   if (!this.isDragging) {
    //     const currentTime = this.videoPlayer.nativeElement.currentTime;
    //     if (currentTime) {
    //       const duration = this.videoPlayer.nativeElement.duration;
    //       this.progressBarWidth = (currentTime / duration * 100) + '%';
    //       this.progressButtonLeft = this.progressBarWidth;
    //     }
    //     else{
    //       this.progressButtonLeft = '0%'
    //       this.progressBarWidth = '0%'
    //     }
    //     console.log(this.progressBarWidth)
    //   }
    // });
  }

  // updateProgressBar() {
  //   if (!this.isDragging) {
  //     const currentTime = this.videoPlayer.nativeElement.currentTime;
  //     const duration = this.videoPlayer.nativeElement.duration;
  //     this.progressBarWidth = (currentTime / duration * 100) + '%';
  //     this.progressButtonLeft = this.progressBarWidth;
  //   }
  // }

  // startDrag(event: MouseEvent) {
  //   this.isDragging = true;
  //   this.onDrag(event);
  //   this.pauseVideo()
  // }

  // onDrag(event: MouseEvent) {
  //   if (this.isDragging) {
  //     const progressBar = this.videoPlayer.nativeElement.getBoundingClientRect();
  //     const offsetX = event.clientX - progressBar.left;
  //     const percentage = (offsetX / progressBar.width) * 100;
  //     this.progressBarWidth = Math.max(0, Math.min(percentage, 100)) + '%';
  //     const duration = this.videoPlayer.nativeElement.duration;
  //     const seekTime = (parseFloat(this.progressBarWidth) / 100) * duration;
  //     this.videoPlayer.nativeElement.currentTime = seekTime;
  //     this.mouseUpSubscription = fromEvent(document, 'mouseup').subscribe(() => {
  //       this.endDrag();
  //     });

  //   }
  // }

  // endDrag() {
  //   if (this.isDragging) {
  //     // const duration = this.videoPlayer.nativeElement.duration;
  //     // const seekTime = (parseFloat(this.progressBarWidth) / 100) * duration;
  //     // this.videoPlayer.nativeElement.currentTime = seekTime;
  //     this.isDragging = false;
  //     if (this.mouseUpSubscription) {
  //       this.mouseUpSubscription.unsubscribe();
  //     }
  //     this.playVideo()
  //   }
  // }
  showAddToWishlistPopup(event) {
    this.showWishlistSuccess = true;
    setTimeout(() => {
      this.showWishlistSuccess = false;
    }, 2000);
  }
  changeEpisode(data) {
    this.progressButtonLeft = '0%'
    this.progressBarWidth = '0%'
    //console.log(this.progressBarWidth, "Width")
    //console.log(data, "DATA")
    let body = {
      id: data
    };

    this.loader.show();
    this.getVideoDetails(body);

  }
  // onPlayerReady(initializeMediaAPI: VgApiService): void {
  //   console.log('Player ready!!');
  //   this.api = initializeMediaAPI;
  //   console.log(this.api);
  //   initializeMediaAPI.getDefaultMedia().subscriptions.timeUpdate.subscribe(e => {
  //     console.log(e.target.duration);
  //     // let timePaused = new Date(video.currentTime.toString().split('.')[0] * 1000)
  //     //   .toISOString()
  //     //   .slice(11, 19);

  //     if(this.startTime){
  //       this.videoPlayer.nativeElement.currentTime=this.startTime
  //       this.startTime=null
  //     }
  //     if (!this.isPlaying) {
  //       var video: any = document.getElementById('mediaPlayed');
  //       // let timePaused = new Date(video.currentTime.toString().split('.')[0] * 1000)
  //       //   .toISOString()
  //       //   .slice(11, 19);
  //       let timePaused = video.currentTime;
  //       this.timePaused = timePaused * 1000;
  //       console.log('time paused', timePaused);
  //       this.getAdds(timePaused);
  //     }
  //   })
  // }

  playVideo(event): void {
   
    this.showAdds = false;
    this.isPlaying = true;
  }

  // rePlayVideo(): void {
  //   this.api.play();
  //   this.isPlaying = true;
  //   this.api.getDefaultMedia().isCompleted = false;
  //   console.log(this.api.getDefaultMedia().isCompleted);
  // }

  // forwardVideo(): void {
  //   const secsToSkip = 10;
  //   var video: any = document.getElementById('mediaPlayed');
  //   video.currentTime += secsToSkip;
  //   this.seeked = false
  //   this.skipClicked = true

  // }

  // rewindVideo(): void {
  //   const rewindSec = 10;
  //   var video: any = document.getElementById('mediaPlayed');
  //   video.currentTime -= rewindSec;
  //   this.seeked = false
  //   this.skipClicked = true
  // }


  async pauseVideo($event?: any) {
    //console.log("Video paused")
    //console.log($event)
      this.sceneProductsData = []
      this.timePaused = parseFloat($event) * 1000
      this.isPlaying = false
      // this.api.pause();
      // this.isPlaying = false;
      // // this.showAdds = true;
      // var video: any = document.getElementById('mediaPlayed');
      // video.pause()
      // // let timePaused = new Date(video.currentTime.toString().split('.')[0] * 1000)
      // //   .toISOString()
      // //   .slice(11, 19);
      // let timePaused = video.currentTime;
      // this.timePaused = timePaused * 1000;
      // console.log('time paused', timePaused);
      if(!this.shouldBeVisible){
        this.pauseWanted = true
      }else{
        //console.log("GET RETAILER", this.retailerIds)
        await this.getAdds(this.timePaused, this.retailerIds);
        //console.log(this.sceneProductsData, "Scene Product Data")
      }
  }

  async pauseAfterRetailerFetch(){
    await this.getAdds(this.timePaused, this.retailerIds);
  }

  convertToMilliseconds(hours, mins, seconds) {
    return (hours * 60 * 60 + mins * 60 + seconds) * 1000;
  }

  async getAdds(pausedTime?: any, retailer?: []): Promise<any> {
    this.showAdds = false
    // console.log('get the adds at which the video is paused');
    // return `adds will be returned ${pausedTime}`;
    // var timeFormat = pausedTime.split(':')
    // var pausedTimeInMilliseconds = this.convertToMilliseconds(timeFormat[0], timeFormat[1], timeFormat[2])

    if(this.retailerIds.length == 0){
      this.sceneProductsData = []
      return
    }
    const body = {
      showId: this.currentEpisode?.id,
      pausedAtMilliseconds: this.timePaused,
      approvedOnly: true,
      retailerId: retailer ?? undefined,
      caller: 'viewer'
    };
    this.playerService.getSceneProducts(body).subscribe(
      (resp: any) => {
        //console.log("🚀 ~ file: player.component.ts:120 ~ PlayerComponent ~ getAdds ~ resp", resp)
        // if (resp.data) {
        //   this.showAdds = true;
        //   this.addsFetched = resp.data;
        // }
        this.sceneProductsData = resp?.data
        // if (this.sceneProductsData[0].ProxyCoordinates.length !== 0)

        //console.log("🚀 ~ file: player.component.ts:114 ~ PlayerComponent ~ getAdds ~ this.sceneProductsData", this.sceneProductsData)
      },
      (err) => {
        console.log(err);
        this.sceneProductsData = []
        this.showAdds = false
      },
      () => {
        
        const hasProducts= this.sceneProductsData['ProxyCoordinates'].some(proxyCoord => 
          proxyCoord['CoordinateHasProducts'] && proxyCoord['CoordinateHasProducts'].length > 0
       
        );
        this.sceneProductsData['ProxyCoordinates'] = this.sceneProductsData['ProxyCoordinates'].filter(proxyCoord =>{
          return proxyCoord['CoordinateHasProducts'] && proxyCoord['CoordinateHasProducts'].length > 0
        })
        if (this.sceneProductsData?.length != 0 && this.sceneProductsData != null && hasProducts)
          this.showAdds = true;

      }
    );
  }

  adjustVolume(event: any): void {
    console.log(event.target.value);
    this.api.volume = event.target.value;
  }
  barLength(retailer: any, i: number) {
    let adsCount = +retailer?.showAdCount;
    if(i === 0) {
      this.maxAdsCount = Math.ceil(adsCount / 100) * 100;
      this.maxAdsCount = this.maxAdsCount === 0 ? 100 : this.maxAdsCount;
    }
    return `${(adsCount / this.maxAdsCount) * 100}%`;
  }
  episodeAdInventory(retailer: any) {
    console.log(retailer, "RETAILER")
    let body = {
      limit: 10,
      pageNo: 1,
      // showIds:[this.videoDetails?.showId || this.videoDetails?.id],
      // episodeNo:[this.currentEpisode?.episodeNo],
      // seasonNo:[this.currentEpisode?.seasonNo],
      // advertiserId:retailer?.id,
      // seriesIds:[this.videoDetails?.showId | this.videoDetails?.id]
      episodeNo: [this.currentEpisode?.episodeNo],
      seasonNo: [this.currentEpisode?.seasonNo],
      advertiserId: retailer?.id,
      seriesIds: [this.currentEpisode?.Series?.id]
    }
    const activeModal = this.modalService.open(EpisodeAdInventoryComponent, {
      windowClass: "modal-xl",
      backdrop: "static",
      keyboard: true,
      centered: true,
    })
    console.log(this.currentEpisode?.Series, "SCDSCC")
    activeModal.componentInstance.isDemo = true
    activeModal.componentInstance.body = body
    activeModal.componentInstance.thumbnail = retailer?.imageUrl
    activeModal.componentInstance.retailerName = retailer?.name
    activeModal.componentInstance.retailerId=retailer?.id
    activeModal.componentInstance.episodeId = this.currentEpisode?.id
    activeModal.componentInstance.seriesName = this.currentEpisode?.Series?.title
    activeModal.componentInstance.seriesThumbnail = this.currentEpisode?.Series?.thumbnail
  }
  toggleSound(action: string) {
    let element = document.getElementById("toggle-animation")
    if (action == 'mute') {
      this.api.volume = 0;
      element.style.transition = "transform .3s ease-in-out"
    } else {
      this.api.volume = 1;
      element.style.transition = "transform .3s ease-in-out"
    }
  }

  // @HostListener("window:resize", [])
  // private onResize() {
  //   this.setScreenSize()
  // }

  setScreenSize() {
    const element = document.getElementById("wrap-video");
    if (this.media.isActive('lt-sm')) {
      element.style.transform = "rotate(90deg)";
      element.style.transformOrigin = "bottom left"
      element.style.width = "100vh"
      element.style.height = "100vw"
      element.style.marginTop = "-100vw"
      element.style.position = "absolute"
      element.style.zIndex = "4"
      element.style.visibility = "visible"
      element.style.objectFit = "cover"
      // element.style.top = "100%"
    }
    else if (this.media.isActive('gt-sm') || this.media.isActive('gt-xs')) {
      element.style.transform = "none";
      element.style.transformOrigin = "initial"
      element.style.width = "100%"
      // element.style.height = "405px"
      element.style.marginTop = "0"
      element.style.position = "relative"
      element.style.zIndex = "4"
      element.style.visibility = "visible"
      element.style.objectFit = "cover"
      // element.style.top = "auto"
    }
  }

  private getVideoDetails(body: { id: any; }) {
    this.playerService.getVideoDetailByID(body).subscribe(
      (resp: any) => {
        if (resp.data) {
          // this.api.getDefaultMedia().isCompleted = false
          this.videoDetails = resp.data;
          this.videoDetailsOriginal = resp.data;
          this.currentEpisode=this.videoDetails
          if (this.videoDetails?.Episodes?.length > 0) {
            // this.currentEpisode = this.videoDetails?.Episodes[0];
            // this.currentEpisode.Series = {
            //   id: resp?.data?.id,
            //   title: resp?.data?.title,
            //   thumbnail: resp?.data?.thumbnail
            // }
            // this.getSeasonAndEpisodes();
            // this.getSeasonsList()
          }

          else {
            //console.log(body.id, "IDDDDDDDD")
            // const idx = this.videoDetails?.Series?.Episodes.findIndex(item => item.id == body.id)
            // console.log(idx, "INDEXX")
            // if (idx != -1) {
            //   this.currentEpisode = this.videoDetails?.Series?.Episodes[idx]
            //   this.currentEpisode.Series = {
            //     id: resp?.data?.Series?.id,
            //     title: resp?.data?.Series?.title,
            //     thumbnail: resp?.data?.Series?.thumbnail
            //   }
            // }

            this.currentEpisode = this.videoDetails
            // this.currentEpisode={
            //   ...this.currentEpisode,
            //   Series:{
            //     id:resp?.data?.id,
            //     title:resp?.data?.title,
            //     thumbnail:resp?.data?.thumbnail
            //   }
            // }
          }

          //console.log(this.currentEpisode, "EPISODEEEEEE")
          this.currentEpisode.videoType = "video/mp4"
          //console.log(this.currentEpisode.videoType, "Video type")
          
          this.getSeasonAndEpisodes();
          this.getSeasonsList()
          this.getAdRetailersOfShow()
          this.loader.hide();

          
        }
      },
      (err) => {
        this.loader.hide();
        console.log(err);
      }
    );
  }

  // onEpisodeChange(event) {
  //   let body = {
  //     id: +event.value
  //   };
  //   console.log(event, "HELLOO")
  //   this.selectedEpisode = event.value
  //   this.playerService.getVideoDetailByID(body).subscribe(
  //     (resp: any) => {
  //       this.api.getDefaultMedia().isCompleted = false;
  //       if (resp.data) {
  //         this.currentEpisode = resp.data;
  //         if (this.videoFileContainer) {
  //           this.videoFileContainer.nativeElement.load();
  //         }
  //       }
  //     })
  // }

  // onSeasonChange(event) {
  //   this.episodesList = this.seasonList[event.value]
  //   this.currentSeason = event.value
  //   this.selectedEpisode = this.episodesList[0]?.id
  //   this.currentEpisode = this.episodesList[0]
  //   if (this.videoFileContainer) {
  //     this.videoFileContainer.nativeElement.load();
  //   }
  // }
  getAdRetailersOfShow() {
    this.apiService.sendRequest(getAdRetailersOfShow, 'post', { "showId": this.currentEpisode?.id }).subscribe((res: any) => {
      this.episodeRetailers = res.data.filter(item => item.showAdCount > 0);
      for (let i = 0; i < this.episodeRetailers.length; i++) {
        this.episodeRetailers[i].checked = true
        this.retailerIds.push(this.episodeRetailers[i].id)
      }
      if(localStorage.getItem('retailerId')){
      
        const retailerId = localStorage.getItem('retailerId');
        //console.log(retailerId, "RETAILER ID")
        this.episodeRetailers.forEach(retailer => {
          //console.log(retailer, "RETAILER")
          if(retailer.id == retailerId){
            retailer.checked = true;
           
          }else{
            retailer.checked = false;
          }
        });
  
        this.selectAll = false;
        
      
        this.retailerIds = [localStorage.getItem('retailerId')];
        localStorage.removeItem('retailerId');
      }
      this.shouldBeVisible = true
      if(this.pauseWanted){
        this.pauseAfterRetailerFetch()
        this.pauseWanted = false
      }
      
    })
  }
  selectRetailers(index: number) {
    //this.episodeRetailers[index].checked = !this.episodeRetailers[index].checked
    this.retailerIds = this.episodeRetailers.filter(item => item.checked != false).map(item => item.id)
    if(this.retailerIds.length !== 0){
      this.getAdds(null, this.retailerIds)
    }else{
      this.sceneProductsData = []
    }
  }

  getSeasonsList() {
    this.apiService.sendRequest(requests.getSeasons, 'post', { "showIds": [this.videoDetails?.showId || this.videoId], pageNo: 1, limit: 100 }).subscribe((res: any) => {
      this.allSeasons = res.data?.rows;
      this.getEpisodeOfSeason()
    })
  }
  getEpisodeOfSeason() {
    this.apiService.sendRequest(requests.getEpisodes, 'post', { "showId": [this.videoDetails?.showId || this.videoId], seasonNo: [this.currentEpisode.seasonNo], pageNo: 1, limit: 100,  onlyBrokenScene:true}).subscribe((res: any) => {
      this.allEpisodes = res.data?.rows;
    })
  }
  getSeasonAndEpisodes() {
    let body = {
      id: this.videoDetails?.showId 
    };
    sessionStorage.setItem('showId',this.videoDetails?.showId)
    this.sharedService.showId.next(this.videoDetails?.showId)
    this.loader.show();
    this.playerService.getSeasonsAndEpisodes(body).subscribe(
      (resp: any) => {
        if (resp.data) {
          const obj1 = {};
          if (resp.data.Episodes.length !== 0) {
            resp.data.Episodes.forEach((episode) => {
              const seasonExists = obj1[`Season ${episode.seasonNo}`];
              if (!seasonExists) {
                obj1[`Season ${episode.seasonNo}`] = [episode]
              } else {
                obj1[`Season ${episode.seasonNo}`] = [...seasonExists, episode]
              }
            });
            this.seasonList = obj1;
            this.currentSeason = Object.keys(this.seasonList)[0]
            this.episodesList = Object.values(this.seasonList)[0]
            this.selectedEpisode = this.episodesList[0].id
          }
          else {
            this.currentEpisode = resp.data
            this.selectedEpisode = this.currentEpisode.id
          }
          this.loader.hide();
        }
      },
      (err) => {
        this.loader.hide();
        console.log(err);
      }
    );
  }

  goBackToPrevPage(): void {
    this.location.back()
  }



  toggleFullScreen($event: any) {
    this.isFullScreen = !(this.isFullScreen)
  }

  // ngAfterContentChecked() {
  //   this.ref.detectChanges();
  // }
  time($event) {
    //   if (!this.skipClicked)
    //     this.pauseVideo()
    //   else
    //     this.skipClicked = false
    //   console.log($event)
    // }
  }

  toggleSelectAll(event: any) { 
    this.episodeRetailers.forEach(retailer => {
      retailer.checked = this.selectAll;

    });

    this.updateRetailerSelection();
  }

  updateRetailerSelection() {
    
    this.retailerIds = this.episodeRetailers.filter(item => item.checked !=false).map(item => item.id);
    
    // Call the method to fetch ads or update the UI based on the selected retailers
    if(this.retailerIds.length !== 0) {
      this.getAdds(null, this.retailerIds);
    }else{
      this.sceneProductsData = []
    }
  }


  ngOnDestroy(): void {
    this.sharedService.navbar.next(false)

  }

}



