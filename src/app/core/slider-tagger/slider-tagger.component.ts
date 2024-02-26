import { Component, EventEmitter, Input, OnInit, Output, ViewChild, SimpleChanges, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { TaggerService } from 'src/app/pages/tagger/tagger.service';
// import { TaggerService } from '../../tagger/tagger.service';
import { Observable, of, delay } from 'rxjs';
import { SharedService } from '../services/shared.service';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'cdk-slider-tagger',
  templateUrl: './slider-tagger.component.html',
  styleUrls: ['./slider-tagger.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class SliderTaggerComponent implements OnInit, OnDestroy {
  @Input() showId;
  @Input() currentSceneId
  clickedOnSceneId: any;
  @Input() $videoFilter: Observable<any>;
  @ViewChild('slickModal', { static: true }) slickModal: SlickCarouselComponent;
  sceneFilter: any
  body: any = {}
  @Output() sceneToSend: EventEmitter<any> = new EventEmitter<any>();
  @Input() sceneBody;
  first_Render: boolean = true;
  showIdObservable
  mousePosition = {
    x: 0,
    y: 0
  };
  page = 1
  slideConfig: any;
  click = 0;
  public observable;
  scenesCount: number
  currentScene: any

  onMouseDown($event: MouseEvent) {
    this.mousePosition.x = $event.screenX;
    this.mousePosition.y = $event.screenY;
  }

  sendImg($event: any, scene: any) {
    if (
      this.mousePosition.x === $event.screenX &&
      this.mousePosition.y === $event.screenY
    ) {
      this.currentScene = scene;
      sessionStorage.setItem("sceneId", scene?.id)
      this.sceneToSend.emit(scene)
    }
  }

  afterChange(e) {
    console.log('afterChange', e);
    if ((e.currentSlide == 15 || e.currentSlide == 16)) {
      this.page += 1
      e.currentSlide = 0
      this.fetchScenes()
    }
    else if (e.currentSlide == 0 && this.page > 1) {
      this.page--
      this.fetchScenes()
    }
  }

  beforeChange(e) {
    // console.log('beforeChange', e);
    e.event.stopPropagation();
  }
  constructor(private taggerService: TaggerService, private sharedService: SharedService) {
    this.slideConfig = {
      "slidesToShow": 9.5,
      "slidesToScroll": 1,
      "swipeToSlide": true,
      "touchThreshold": 100,
      "infinite": false,
      "draggable": true,
      "arrows": false,
      //"focusOnSelect": true,
      responsive: [
        {
          breakpoint: 2400,
          settings: {
            slidesToShow: 8.5,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 2000,
          settings: {
            slidesToShow: 7.5,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 1800,
          settings: {
            slidesToShow: 6.5,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 1600,
          settings: {
            slidesToShow: 5.5,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 1400,
          settings: {
            slidesToShow: 4.5,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 3.5,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 2.5,
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
          breakpoint: 390,
          settings: {
            slidesToShow: 1.5,
            slidesToScroll: 1,
          },
        },
      ],
    };
  }
  allScenes = []

  ngOnDestroy(): void {
    this.observable.unsubscribe();
  }

  ngOnInit(): void {
    this.clickedOnSceneId = parseInt(sessionStorage.getItem('sceneId'))
    this.fetchScenes();
    this.fetchShowId()
    this.fetchSceneId()
    this.updateProductRecordCount()
    this.fetchSceneFilters();
  }

  fetchShowId() {
    this.showIdObservable = this.taggerService.showId.subscribe((res) => {
      if (res) {
        if(this.showId !== JSON.parse(sessionStorage.getItem('showId'))){
          this.page = 1;
        }
        this.showId = res
        this.fetchScenes()
      }
    })
  }

  updateProductRecordCount() {
    this.sharedService.incrementRecord.subscribe((res) => {
      if (res !== null) {
        const scene = this.allScenes.find((s) => s.id == this.currentSceneId)
        if (scene) {
          const indexOfScene = this.allScenes.findIndex((s) => s.id == this.currentSceneId)
          res === 1 ? scene.productRecordsCount += 1 : scene.productRecordsCount = scene.productRecordsCount - 1;
          this.allScenes[indexOfScene] = scene;
          this.currentScene = scene;
        }
        res === -1 ? this.sceneToSend.emit(this.currentScene) : null
      }
    })
  }

  fetchSceneId() {
    this.observable = this.sharedService.refreshPage.subscribe(value => {
      const scene = this.allScenes.find((s) => s.id == value.currentSceneId)
      const indexOfScene = this.allScenes.findIndex((s) => s.id == value.currentSceneId)
      if (scene) {
        this.allScenes[indexOfScene] = scene;
        this.currentScene = scene;
        this.sceneToSend.emit(scene)
      }
    });
  }

  fetchSceneFilters() {
    this.sharedService.scenesFilter.subscribe((res) => {
      if (res) {
        this.body = res
        this.fetchScenes()
      }
    })
  }

  fetchScenes(res?: any) {
    this.allScenes = []
    this.body.showId = this.showId;
    this.body.pageNo = this.page;
    this.body.limit = 20;
    this.body.clickedOnSceneId = (this.clickedOnSceneId && this.first_Render) ? this.clickedOnSceneId : undefined

    this.taggerService.getAllScenesOfShow(this.body).subscribe((data: any) => {
      this.body = {}
      this.allScenes = data['data']['rows']
      this.page = data['data'].pageNo ?? this.page
      this.sharedService.returnedPageNo = undefined
      this.scenesCount = data['data']['count']
      const indexOfScene = this.allScenes.map(scene => scene.id).indexOf(this.clickedOnSceneId);
      let selectedScene;
      if (this.clickedOnSceneId) {
        if (this.first_Render) {
          const filteredScene = this.allScenes.find((scene) => scene.id == this.clickedOnSceneId)
          if (filteredScene) {
            selectedScene = filteredScene;
            this.currentScene = filteredScene;
          }
        }
        else {
          selectedScene = this.currentScene;
        }
      }
      else {
        // const currentscene = this.allScenes.find((scene) => scene.id == this.currentSceneId)
        // if (currentscene)
        //   selectedScene = currentscene
        // else
        //   selectedScene = this.allScenes[0]
        selectedScene = this.currentScene ?? this.allScenes[0];
      }
      setTimeout(() => {
        if (this.slickModal && this.slickModal.slickGoTo) {
          this.slickModal.slides = this.allScenes;
          this.slickModal.slickGoTo(indexOfScene);
        }
      }, 1000);
      this.first_Render = false;
      this.sceneToSend.emit(selectedScene)
    })
  }
}
