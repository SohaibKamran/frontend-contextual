import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { title } from 'process';
import { Subscription } from 'rxjs';
import { CoreModule } from 'src/app/core/core.module';
import { SharedService } from 'src/app/core/services/shared.service';
import { UserWatchService } from 'src/app/pages/demo-user/user.service';
import { UserService } from 'src/app/theme/shared/service';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import 'videojs-landscape-fullscreen'
const titleBar = videojs.getComponent('TitleBar')
import { requests } from 'src/app/core/config/config';
import { ApiService } from 'src/app/core/services/api.service';
@Component({
  standalone: true,
  imports: [CommonModule, CoreModule],
  selector: 'app-vjs-player',
  templateUrl: './vjs-player.component.html',
  styleUrls: ['./vjs-player.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class VjsPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('target', { static: true }) target: ElementRef;
  @ViewChild('adsShown', { static: true }) ads: ElementRef;
  @ViewChild('sceneToolTip', { static: true }) sceneToolTip: ElementRef;
  @Input() successMessage: boolean
  @Output() newItemEvent = new EventEmitter<any>();
  @Output() toggleFullScreen = new EventEmitter<any>();
  @Input() pauseOnLoad = false;
  @Input() currentEpisode
  @Input() series
  @Input() verticalAds
  @Input() poster
  progress: any = 0
  modalId
  @Output() playEvent = new EventEmitter<any>();
  @Input() showAdds
  adModal: any
  successModal: any
  sceneObs: Subscription
  @Input() sceneProductsData
  @Input() isFullScreen
  @Input() isPlaying
  seekTimeout: any
  toolTip: any
  toolTipModal: any
  playerTime: any
  scenes: any = []
  isSeeking = false;
  // See options: https://videojs.com/guides/options
  adElement: any
  proxyCoordinateId: any
  @Input() options: {
    fluid?: boolean,
    aspectRatio?: string,
    autoplay?: boolean,
    controls: boolean,
    controlBar: {
      skipButtons: {
        forward: number,
        backward: number
      },
      fullscreenToggle?: boolean
    }
    noUITitleAttributes?: false,
    title: string,
    sources: {
      src: string,
      type?: string,
    }[],
        
  };

  @Input() sceneNumber: number = 1
  player: Player;

  constructor(
    private elementRef: ElementRef, private sharedService: SharedService, private userService: UserWatchService,
    private apiService: ApiService, 
  ) { }

  disabledSeekBar() {
    (this.player as any).controlBar.progressControl.disable();
  }

  enableSeekBar() {
    (this.player as any).controlBar.progressControl.enable();

  }
  blurControlBar() {
    const elems: any = document.getElementById('sceneToolTip')
    elems.focus()
  }

  setSceneToolTip() {
    this.toolTip = document.getElementById("sceneToolTip")
    const seekbar = document.getElementsByClassName('vjs-play-progress')
    const appendChild = seekbar[seekbar.length - 1].appendChild(this.sceneToolTip.nativeElement)
    appendChild.style.display = 'block'
    // for (let i = 0; i < seekbar.length; i++) {
    //   seekbar[i].appendChild(this.toolTip)
    //   console.log(seekbar[i])
    // }
    // document.getElementById('sceneSpan').removeChild(this.toolTip)
    //console.log(seekbar)

  }
  settoolTip() {
    let timeTooltip: any = (this.player as any)
      .getChild('controlBar')
      .getChild('progressControl')
      ?.getChild('seekBar')?.getChild('mouseTimeDisplay')
    if (timeTooltip) {
      timeTooltip = timeTooltip?.getChild('timeTooltip');
    }
    else {
      return;
    }
    timeTooltip.update = (seekBarRect, seekBarPoint, time) => {
      const milliseconds = this.timeToMilliseconds(time)
      const sceneNo = this.findClosestNumber(milliseconds, this.scenes)
      timeTooltip.write("Scene " + sceneNo)
    }
  }
  setInitialTime() {
    this.sceneObs = this.userService.scene.subscribe((res) => {
      if (res) {
        // console.log(res, "Start Time")
        // let time = Math.ceil(res?.startTime / 1000)
        // let originalTime = res?.startTime;
        // let mod = originalTime % 250;
        // let playerTime = 0;
        // if ((originalTime + mod) <= res?.endTime && originalTime != 0) {
        //   playerTime = (originalTime) + (250 - mod)
        // }
        //console.log("RESSS",res)
        this.sceneNumber = res?.relativeSceneNo
        this.playerTime = this.calculateTime(res?.startTime)
        
        this.player.currentTime((this.playerTime / 1000) + "")
        // this.sceneNumber = this.findClosestNumber(playerTime * 1000, this.scenes
        
        this.player.play().then(() => {
          this.player.pause()
        })
        
      }
    });
    this.userService.proxyCoorddinateId.subscribe((res) => {
      if(res){
       
        this.proxyCoordinateId=res
      }
    })
  }
  setFulScreenPlugIn() {
    (this.player as any).landscapeFullscreen({
      fullscreen: {
        enterOnRotate: true,
        exitOnRotate: true,
        alwaysInLandscapeMode: true,
        iOS: false
      }
    });
  }
  calculateTime(startTime) {
    let time = Math.ceil(startTime / 1000)
    let originalTime = startTime;
    let mod = originalTime % 250;
    let playerTime = 0;
    // if ((originalTime + mod) <= endTime && originalTime != 0) {
    //   playerTime = (originalTime) + (250 - mod)
    // }
    if (originalTime != 0) {
      playerTime = (originalTime) + (250 - mod)
    }
    return playerTime
  }
initializePlayer() {
    if (!this.player) {
      this.player = videojs(this.target.nativeElement, this.options, () => {
        //console.log('onPlayerReady', this);
        // Ensure the player is ready before setting up subscriptions and manipulating the player
        this.player.ready(() => {
          this.setSceneToolTip();
          // Setup subscriptions and player manipulations here
          this.setInitialTime();
          this.settoolTip();
        });
      });
    }else{
      //console.log('2222222', this.player);
      this.setSceneToolTip()
      this.setInitialTime();
        // this.setFulScreenPlugIn();
      this.settoolTip();
    }
    /* Full screen button removed */
    // const button = this.player.getChild('controlBar').addChild('Button',{
    //   className:'vjs-fullscreen-control',
    //   clickHandler:this.fullScreen
    // })
    // const myButtonDom = button.el()
    // myButtonDom.innerHTML = '<span class="vjs-fullscreen-control"></span>';

    //console.log(this.player)
    
    //console.log(this.playerTime)
    
    

  }
  fullScreenFlag() {
    const width = window.innerWidth
    if (width > 1024) {
      this.options.controlBar.fullscreenToggle = false
    }
    else
      this.options.controlBar.fullscreenToggle = true

  }
  getScenesOfShow() {
    this.apiService.sendRequest(requests.getAllScenes, 'post', {
      "showId": this.currentEpisode.id
    }).subscribe((res: any) => {
      //console.log(21456 % 1000, 'mod')
      this.scenes = res?.data?.rows.map(item => ({ startTime: item?.startTime, sceneNo: item?.relativeSceneNo }))
      //console.log(this.scenes)
    })
  }

  setTitle() {
    let description
    if (this.currentEpisode.seasonNo) {
      description = 'S' + this.currentEpisode.seasonNo + ' E' + this.currentEpisode.episodeNo + ': ' + this.currentEpisode.title;
    }
    else {
      description = ""
    }
    (this.player as any)?.titleBar?.setState({ title: this.series?.title, description: description })
  }
  showAddToWishlistPopup(event) {
    this.successMessage = true;
    this.successModal = this.player.createModal(this.modalId)
    setTimeout(() => {
      this.successMessage = false;
      this.successModal.close()
    }, 2000);
  }
  // Instantiate a Video.js player OnInit
  ngOnInit() {
    
   
    this.fullScreenFlag()
    this.getScenesOfShow()
    this.initializePlayer()
    this.setTitle()
    this.player.on('fullscreenchange', this.fullScreen);
    this.player.on('seeked', this.seeked)
    this.player.on('seeking', this.handleSeeking);


    this.modalId = document.getElementById('success-message');
    //console.log(this.modalId, "modal id")
    // this.player.addChild('TitleBar', );
    if(localStorage.getItem('scene') && localStorage.getItem('proxyCoorddinateId')){
      const scene = JSON.parse(localStorage.getItem('scene'));
      this.sceneNumber = scene.relativeSceneNo
      this.playerTime = this.calculateTime(scene.startTime)
      this.player.currentTime((this.playerTime / 1000) + "")
      this.proxyCoordinateId = localStorage.getItem('proxyCoorddinateId');
      
      this.player.play().then(() => {
        this.player.pause()
      })
      
      localStorage.removeItem('scene')
      localStorage.removeItem('proxyCoorddinateId')
    }
    

  }

  handleSeeking = () => {
    this.isSeeking = true;
  }


  seeked = () => {

    
    clearTimeout(this.seekTimeout)
    //console.log("seeked", this.player.paused())
    if (this.player.paused() ) {
      
      if (this.scenes.length != 0) {
        const time = this.calculateTime(this.player.currentTime() * 1000)
        this.sceneNumber = this.findClosestNumber(time, this.scenes)
        
      }
      //console.log("seeked223423")
      this.isSeeking = false;
      this.pauseFunctionCalled()
    }
    

    this.isSeeking = false;

  }

  pauseFunctionCalled(event?: any) {
    // this.blurControlBar()
    //console.log("PAUSE", this.player.paused())
    //console.log(this.isSeeking, "SEEKING PAUSE")
    {
    if (this.scenes / length != 0)
      this.sceneNumber = this.findClosestNumber(this.player.currentTime() * 1000, this.scenes)
    //console.log("pauseFunctionCalled", this.player.currentTime())
    this.newItemEvent.emit(this.player.currentTime())
    }
  }

  iterateScene(op: any, $event) {
    // $event.stopPropagation()
    //console.log("njdvmvd")
    //console.log(op)
    //console.log(this.sceneNumber)
    //console.log("nckndkjfdkj dvjk vkj f")
    setTimeout(() => {

      if (op == '+' && this.sceneNumber < this.scenes?.length)
        this.sceneNumber++
      else if (op == '-' && this.sceneNumber != 1)
        this.sceneNumber--
      const time = (this.calculateTime(this.scenes[this.sceneNumber - 1].startTime)) / 1000
      //console.log(time, "TIMEEEEEEEEEEEEEEEEEEEEEEEE")
      this.player.currentTime(time)
    })

  }
  playFunctionCalled(event) {
    if(!this.isSeeking){
      this.playEvent.emit(event)
      if (this.adModal)
        this.adModal.close()
      }
  }
  ngOnChanges(changes: any) {
    // console.log(changes)
    // if (changes.options && !changes.options.firstChange) {
    //   const newSources = changes.options.currentValue.sources[0]
    //   console.log(newSources)
    //   this.player.src(newSources)
    //   this.player.load();
    //   this.player.play();
    //   this.setTitle()
    // }
    if (changes.successMessage) {
      if (this.successMessage) {
        //console.log(this.successMessage, "Success")
        //console.log(this.successModal)
      }
      else {
        if (this.modalId)
          this.successModal.close()
        //console.log(this.successMessage, "Success Done")
      }
    }
    if (changes.showAdds) {
      const controlbar = document.getElementById("videoPlayerId");
      const abc = controlbar.getElementsByClassName('vjs-control-bar')
      if (this.showAdds) {
        // if (document.getElementById('adsShown'))
        //   this.adElement = document.getElementById('adsShown')
        // console.log(this.adElement, "element")
        this.adModal = this.player.createModal(this.ads.nativeElement, {

          uncloseable: true

        })
        if (this.adElement) {
          //console.log(this.ads)

          //console.log(this.sceneProductsData, 'ssssssssssssssssssssssss');
        }
      }

    }

  }

  updateProgress() {
    // console.log(this.progress, "Progress")
    // const video: any = document.getElementById('videoPlayerId')
    // // console.log(video)
    // const currentTime = this.player.currentTime();
    // console.log(currentTime)
    // const duration = this.player.duration()
    // if (!isNaN(currentTime) && !isNaN(duration)) {
    //   this.progress = (currentTime / duration) * 100;
    // }
  }
  fullScreen = () => {
    this.isFullScreen = !this.isFullScreen
    this.toggleFullScreen.emit(this.isFullScreen)

    console.log("hello")
  }
  // Binary search function to find the closest number (floor)
  findClosestNumber(inputNumber: number, array: any[]) {
    let left = 0;
    let right = array.length - 1;
    let closestNumber = array[0]?.startTime ?? 0;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      if (array[mid].startTime === inputNumber) {
        closestNumber = array[mid].sceneNo;
        break;
      } else if (array[mid].startTime < inputNumber) {
        closestNumber = array[mid].sceneNo;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return closestNumber ? closestNumber : 1;
  }
  timeToMilliseconds = (timeString) => {
    const parts = timeString.split(':').map(Number);

    if (parts.length < 1 || parts.length > 3 || parts.some(isNaN)) {
      throw new Error('Invalid time format');
    }

    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    if (parts.length === 1) {
      seconds = parts[0];
    } else if (parts.length === 2) {
      minutes = parts[0];
      seconds = parts[1];
    } else if (parts.length === 3) {
      hours = parts[0];
      minutes = parts[1];
      seconds = parts[2];
    }

    const milliseconds = (hours * 3600000) + (minutes * 60000) + (seconds * 1000);
    return milliseconds;
  }


  // Dispose the player OnDestroy
  ngOnDestroy() {
    this.userService.scene.next(null)
    this.sceneObs.unsubscribe()
    if (this.player) {
      this.player.dispose();
    }
  }

}