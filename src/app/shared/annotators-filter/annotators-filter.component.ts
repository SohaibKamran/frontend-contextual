import { Options } from '@angular-slider/ngx-slider';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { SharedService } from 'src/app/core/services/shared.service';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { VideoSeriesDetailsComponent } from 'src/app/pages/videos/video-series-details/video-series-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FilterService } from './filter.service';

interface RangeSliderModel {
  minValue: number;
  maxValue: number;
  options: Options;
}

@Component({

  selector: 'app-annotators-filter',
  templateUrl: './annotators-filter.component.html',
  styleUrls: ['./annotators-filter.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgMultiSelectDropDownModule, NgxSliderModule, NgbModule, FormsModule, CoreModule, NgSelectModule],
})
export class AnnotatorsFilterComponent {
  searchSeriesName: any
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  @Input() screen: string
  actorPagination: { pageNo: number, limit: number, offset?: number, actorNameLike?: string } = { limit: 10, pageNo: 1 }
  actorLoader: boolean = false
  taggingStauses = []
  PRStatuses = []
  totalActorsFetched = 0
  actorsCount = 0
  filterForm: FormGroup
  seriesNames = [];
  seasons: any = [];
  episodes = [];
  tagger = [];
  multiSelectArray = []
  body: any
  options: Options = {
    floor: 0,
    ceil: 100
  };
  options1: Options = {
    floor: 0,
    ceil: 100
  };
  pagination: { pageNo: number, limit: number, offset?: number } = { limit: 10, pageNo: 1 }
  actors = [];
  checked = true
  totalSeriesCount = 0
  fetchedSeriesCount = 0
  seriesLoader: boolean = false
  seriesPagination: { pageNo: number, limit: number, offset?: number, seriesName?: string } = { pageNo: 1, limit: 10 }
  taggerPagination: { pageNo: number, limit: number, offset?: number, taggerName?: string } = { pageNo: 1, limit: 10 }
  taggerLoader: boolean = false
  seasonPagination: { pageNo: number, limit: number, offset?: number } = { pageNo: 1, limit: 10 }
  episodePagination: { pageNo: number, limit: number, offset?: number } = { pageNo: 1, limit: 10 }
  fetchedTaggerCount = 0
  totalTaggerCount = 0
  fetchedSeasonCount = 0
  totalSeasonCount = 0
  totalEpisodeCount = 0
  fetchedEpisodeCount = 0
  constructor(public modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private sharedService: SharedService,
    private router: Router,
    private filterService: FilterService) {
  }

  ngOnInit(): void {
    this.checkPreviousData()
    this.getSeriesName();
    this.getTagger();
    this.getActors();
    this.taggingStauses = this.sharedService.getTaggingStatuses()
    this.PRStatuses = this.sharedService.getPRStatuses()
  }
  checkPreviousData() {
    const body = this.filterService.getFilterBody(this.screen)
    if (!body) {
      this.initForm();
    }
    else {
      console.log(body, "FORM")
      this.filterForm = body
      if (this.filterForm.value.seriesId?.length > 0) {
        this.getSeasons()
      }
      if (this.filterForm.value.seasons?.length > 0) {
        this.getEpisodes()
      }
    }
    console.log(this.filterForm, "FILTER FORM")
  }
  private initForm() {
    this.filterForm = this.formBuilder.group({
      series: [undefined,],
      seriesId: [undefined],
      seasons: [[],],
      episodes: [[],],
      tagStatus: [undefined,],
      min: [0,],
      max: [100,],
      minimum: [0,],
      maximum: [100,],
      tagger: [[],],
      actor: [[],],
      checked: [1]
    })
  }
  openAddSeriesModal(addModal?: any) {
    const componentRef = this.modalService.open(VideoSeriesDetailsComponent, {
      windowClass: "modal-xl",
      backdrop: "static",
      keyboard: false,
      centered: true,
    });
    componentRef.componentInstance.passEntry?.subscribe((res) => {
      console.log(res)
      const seriesObject = {
        title: res?.title,
        id: res?.id
      }
      this.filterForm.controls['seriesId'].setValue([seriesObject.id])
      this.filterForm.controls['series'].setValue(seriesObject)
      this.getSeriesName()
    })
  }

  searchSeries($event) {
    this.seriesPagination.pageNo=1
    if ($event.term != '')
      this.seriesPagination.seriesName = $event.term
    else
      this.seriesPagination.seriesName = undefined
    this.seriesPagination.pageNo = 1
    this.getSeriesName($event.term)
    console.log($event)
  }

  searchActor($event) {
    this.actorPagination.pageNo=1
    this.totalActorsFetched = 0
    if ($event.term != '')
      this.actorPagination.actorNameLike = $event.term
    else
      this.actorPagination.actorNameLike = undefined
    this.getActors($event.term)
  }
  getSeriesName(seriesName?: string) {
    this.seriesLoader = true
    if (this.totalSeriesCount != this.fetchedSeriesCount || this.totalSeriesCount == 0) {
      this.apiService.sendRequest(requests.getSeriesName, 'post', this.seriesPagination).subscribe((res: any) => {
        if (seriesName || seriesName === '') {
          this.seriesNames = []
        }
        this.seriesLoader = false
        this.totalSeriesCount = res?.data?.count
        for (let i = 0; i < res?.data?.rows?.length; i++) {
          const obj = {
            title: res?.data?.rows[i].title,
            id: res?.data?.rows[i].id
          }
          this.seriesNames = [...this.seriesNames, obj]
          this.fetchedSeriesCount++
        }
        // console.log(this.seriesNames);
      });
    }
    else  
      this.seriesLoader = false


  }
  selectTaggingStatus(status: any) {
    // this.selectedTaggingStatus = status
    console.log(status)
  }
  selectPRStatus(status: any) {
    console.log(status)
    // this.selectedPRStatus = status
    // console.log(this.selectedPRStatus)
  }
  selectSeries(series: any) {
    // console.log("Value: ", event.value)
    if (this.seriesPagination.seriesName != null) {
      this.seriesPagination.seriesName = undefined
      this.getSeriesName('')
    }

    this.episodes = []
    this.seasons = []
    this.fetchedSeasonCount = 0
    this.fetchedEpisodeCount = 0
    this.filterForm.controls['seasons'].setValue([])
    this.filterForm.controls['episodes'].setValue([])
    if (series.length != 0) {
      this.filterForm.controls['seriesId'].setValue([series.id])
      this.getSeasons()
      this.filterForm.controls['series'].setValue(series.title)

    }
    else {
      this.filterForm.controls['seriesId'].setValue(undefined)
      this.filterForm.controls['series'].setValue(undefined)
    }
  }

  getSeasons() {
    const body = {
      showIds: this.filterForm.value.seriesId,
      pageNo: this.seasonPagination.pageNo,
      limit: this.seasonPagination.limit
    }
    const temp = [];
    if (this.totalSeasonCount != this.fetchedSeasonCount || this.fetchedSeasonCount == 0) {
      this.apiService.sendRequest(requests.getAllSeasonofSeries, 'post', body)
        .subscribe((res: any) => {
          // console.log(res)
          this.totalSeasonCount = res?.data?.count
          for (let i = 0; i < res?.data?.rows?.length; i++) {
            temp.push({
              id: res?.data?.rows?.[i].seasonNo,
              text: "Season " + res?.data?.rows[i]?.seasonNo
            })
            this.fetchedSeasonCount++
            // const checking = temp[temp.length - 1].split("Season ")[1];
            // // console.log("checking",checking);
          }
          this.seasons = temp;
          // console.log("seasons", this.seasons);
        })
    }
  }
  selectSeason(season: any) {
    console.log("Season", season)
    this.multiSelectArray = this.filterForm.value.seasons.map((item) => item.id)
    this.fetchedEpisodeCount = 0
    console.log(this.multiSelectArray)
    this.getEpisodes()
    // console.log("ABC")
  }

  getEpisodes() {
    const body = {
      showId: this.filterForm.value.seriesId,
      seasonNo: this.filterForm.value.seasons.map((item) => item.id),
      pageNo: this.episodePagination.pageNo,
      limit: this.episodePagination.limit
    }
    if (this.fetchedEpisodeCount != this.totalEpisodeCount || this.fetchedEpisodeCount == 0) {
      const epi = []
      this.apiService.sendRequest(requests.getAllEpisodesofSeason, 'post', body).subscribe((res: any) => {
        this.totalEpisodeCount = this.totalEpisodeCount + res?.data?.count
        for (let i = 0; i < res.data?.rows?.length; i++) {
          epi.push({
            id: res?.data?.rows[i]?.id,
            text: "Episode " + res?.data?.rows[i].episodeNo
          });
          this.fetchedEpisodeCount++
        }
        console.log(epi)
        this.episodes = this.episodes.concat(epi);
        this.episodes = this.sharedService.removeDuplicatesByProperty(this.episodes, 'text')      // console.log(this.episodes);
      })
    }
  }

  searchTagger($event) {
    this.taggerPagination.pageNo=1
    this.fetchedTaggerCount = 0
    if ($event.term != '')
      this.taggerPagination.taggerName = $event.term
    else
      this.taggerPagination.taggerName = undefined
    this.getTagger($event.term)
  }
  getTagger(searchTagger?: string) {
    const tag = []
    this.taggerLoader = true
    if (this.totalTaggerCount != this.fetchedTaggerCount || this.totalTaggerCount == 0) {
      this.apiService.sendRequest(requests.getTagger, 'post', this.taggerPagination).subscribe((res: any) => {
        if (searchTagger || searchTagger === '')
          this.tagger = []
        this.taggerLoader = false
        this.totalTaggerCount = res?.data?.count
        for (let i = 0; i < res?.data?.rows?.length; i++) {
          const obj = {
            id: res?.data?.rows[i]?.id, fullName: res?.data?.rows[i]?.fullName
          }
          this.tagger = [...this.tagger, obj]
          this.fetchedTaggerCount++
          console.log(tag[i])
        }
        console.log(this.tagger)
      })
    }
    else
      this.taggerLoader=false
  }
  clearSearch(){
    this.taggerPagination={pageNo:1,limit:10,taggerName:undefined}
    this.getTagger('')
  }
  getActors(actorName?: string, pageNo?: number) {
    const tag = []
    if (pageNo) {
      this.actorPagination.pageNo = pageNo
    }
    this.actorLoader = true
    if (this.totalActorsFetched != this.actorsCount || this.actorsCount == 0) {

      this.apiService.sendRequest(requests.getActors, 'post', this.actorPagination).subscribe(async (res: any) => {
        this.actorLoader = false
        if (actorName || actorName == '') {
          this.actors = []
        }
        for (let i = 0; i < res?.data?.rows?.length; i++) {
          const actor = { id: res?.data.rows[i].id, text: res.data.rows[i].name }
          this.actors = [...this.actors, actor]
          this.totalActorsFetched++
          // this.actorsCount = res?.count
        }
        console.log(this.actors);
        // // console.log("actors Api res",res.data)
      })
    }
    else
      this.actorLoader=false
  }
  onItemSelect(item: any) {
    // console.log(item);
    // this.taggerArray = this.filterForm.value.tagger.map((item) => item.id)
    // console.log("tagger", this.taggerArray)
  }
  onSelect(item: any) {
    // item.split(' ')[3]
    console.log(item)
    // console.log("Episode Submit: ", this.submitEpisodes);
  }
  submitFilter() {
    this.filterService.submitted = true
    let body: any = {
      pageNo: this.pagination.pageNo,
      limit: this.pagination.limit,
      ...(this.filterForm.value.series  ? { seriesName: this.filterForm.value.series } : undefined),
      ...(this.screen == 'Catalog' ? { showStatusId: this.filterForm.value.checked } : undefined),
      ...(this.filterForm.value.seriesId ? { seriesId: this.filterForm.value.seriesId[0] } : undefined),
      ...(this.filterForm.value.seasons?.length > 0 ? { seasonNo: this.filterForm.value.seasons.map((item) => +item.id) } : undefined),
      ...(this.filterForm.value.episodes?.length > 0 ? { episodeNo: this.filterForm.value.episodes.map(item => +item.text.replace(/^\D+/g, '')) } : undefined),
      // episodeNo: this.submitEpisodes,
      ...(this.filterForm.value.tagStatus ? { taggingStatusId: this.filterForm.value.tagStatus.id } : undefined),
      ...(this.filterForm.value.tagStatus ? { taggingStatusId: [this.filterForm.value.tagStatus.id] } : undefined),
      // taggingStatusId: this.filterForm.value.tagStatus,
      ...(this.filterForm.value.tagger?.length > 0 ? { taggerIds: this.filterForm.value.tagger.map((item) => +item.id) } : undefined),
      // taggerId: this.taggerArray,
      ...(this.screen == 'Databcc' ? {
        seriesComplete: {
          min: this.filterForm.value.minimum,
          max: this.filterForm.value.maximum,
        }
      } : null),
      // vzotScore: {
      //   min: this.minValue,
      //   max: this.maxValue,
      // }
      ...(this.screen == 'Database' ? {
        vzotScore: {
          min: this.filterForm.value.min,
          max: this.filterForm.value.max,
        }
      } : null),
      ...(this.filterForm.value.actor?.length != 0 ? { actorIds: this.filterForm.value.actor.map((item) => item.id) } : undefined),
    }
    if (this.screen === 'Database') {
      if (this.filterForm.value.seriesId) {
        if (this.filterForm.value.seriesId?.length > 0) {
          body['seriesIds'] = this.filterForm.value.seriesId
        }
        delete body['seriesId']
      }
      if (this.filterForm.value.actor?.length != 0) {
        body = { ...body, actors: this.filterForm.value.actor }

      }
      if (this.filterForm.value.tagger?.length != 0) {
        body = { ...body, taggers: this.filterForm.value.tagger }
      }
      console.log(body, 'Filter')
      // this.sharedService.setFilters(body)
      this.router.navigate(['/database/filtered'])
    }
    this.passEntry.emit(body);
    this.filterService.setFilterBody(this.filterForm, this.screen)
    this.modalService.dismissAll()
    // this.apiService.sendRequest(requests.getAllShowListing, 'post', body).subscribe((res: any)=>{
    //   // console.log(res);
    // })
  }
  resetFilters() {
    this.pagination.pageNo = 1
    this.pagination.limit = 10
    this.body = {
      pageNo: this.pagination.pageNo,
      limit: this.pagination.limit,
    }
    this.filterService.submitted = false
    this.passEntry.emit(this.body);
    this.filterService.setFilterBody(null, this.screen)
    this.initForm()
    // this.showId = null
    // this.seriesId = null
    // //this.passEntry.emit(this.body);
    // this.minValue1 = 0
    // this.maxValue1 = 0
    // this.minValue = 0
    // this.maxValue = 0
    // this.taggerArray = []
    // this.seasons = []
    // this.submitEpisodes = []
    // this.multiSelectArray = []
    // this.filterForm.controls['actor'].setValue(null)
    // // this.filterForm.controls['tagStatus'].setValue(null)
    // this.filterForm.controls['series'].setValue('Select Series')
    // this.filterForm.controls['seasons'].setValue(null)
    // this.filterForm.controls['episodes'].setValue(null)
    // this.selectedActor = {
    //   id: null,
    //   name: 'Input Actor Name'
    // }
    // this.selectedActorIds = []
    // this.selectedTaggingStatus = {
    //   title: 'Tag Status',
    //   id: null,
    //   class: ''
    // }
    // this.selectedPRStatus = {
    //   title: 'PR Status',
    //   id: null,
    //   class: ''
    // }
    // if (this.screen == 'Catalog')
    //   this.videoStatus = 1
    // this.sharedService.setFilters(null)
    // this.sharedService.taggerFilterBody.next(this.body)
  }
  filterUsingStatus(event) {
    console.log(event.target.checked)
    if (event.target.checked) {
      this.filterForm.controls['checked'].setValue(1)
      this.checked = true
    }
    else {
      this.filterForm.controls['checked'].setValue(2)
      this.checked = false
    }
  }
  selectActor(actors: any) {
    console.log(actors)
    // if (this.filterForm.value.actor.length == 0) {
    //   this.selectedActorIds = []
    // }
    // else {
    //   this.selectedActorIds = this.filterForm.value.actor.map((actor) => actor.id)
    // }
    // this.selectedActor=actor
  }

  clearActor($event){
    this.actorPagination.pageNo=1
    this.actorPagination.limit=10
  }
  onSeriesScrollEnd(e) {
    this.seriesPagination.pageNo++
    this.getSeriesName()

  }
  onTaggerScrollEnd(e) {
    this.taggerPagination.pageNo++
    this.getTagger()
  }
  onSeasonScrollEnd($event) {
    this.seasonPagination.pageNo++
    this.getSeasons()
  }
  onEpisodeScrollEnd($event) {
    this.seasonPagination.pageNo++
    this.getEpisodes()
  }
  close() {
    if (!this.filterService.submitted) {
      this.filterService.setFilterBody(null, this.screen)
    }
    this.modalService.dismissAll('Close click')
  }
}
