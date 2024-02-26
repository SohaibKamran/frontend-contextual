import { Options } from '@angular-slider/ngx-slider';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { DatabaseService } from '../database.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { Subject, take } from 'rxjs';
import { ScrollEndDirective } from 'src/app/core/directives/scrollend.directive';

@Component({
  selector: 'app-database-filters',
  templateUrl: './database-filters.component.html',
  styleUrls: ['./database-filters.component.scss']
})
export class DatabaseFiltersComponent {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  @Output() setIsToggled = new EventEmitter<string>();
  @Input() $videoFilter: Observable<any>;
  @Input() isToggled: any;
  isAlive = new Subject<any>()
  // real work
  seriesPagination: { pageNo: number, limit: number, offset?: number, seriesName?: string } = { pageNo: 1, limit: 10 }
  seasonPagination: { pageNo: number, limit: number, offset?: number } = { pageNo: 1, limit: 1000 }
  episodePagination: { pageNo: number, limit: number, offset?: number } = { pageNo: 1, limit: 1000 }
  seriesLoader: boolean = false
  annotatorLoader: boolean = false
  actorLoader: boolean = false
  fetchedSeasonCount = 0
  totalSeasonCount = 0
  totalEpisodeCount = 0
  fetchedEpisodeCount = 0
  episodeIds = []
  filterForm: FormGroup
  seriesNames = [];
  selectedSeries = [];
  seasons = [];
  seriesId: number
  seasonArray: any = []
  episodes = [];
  tagger = [];
  multiSelectArray = []
  selectedItems = [];
  dropdownSettings = {};
  PRdropdownSettings = {}
  dropdownList = [];
  submitEpisodes = [];
  taggerArray = [];
  actor: any;
  prStatus = [];
  minValue = 0;
  maxValue = 100;
  value = 100;
  options: Options = {
    floor: 0,
    ceil: 100
  };
  minValue1 = 0;
  maxValue1 = 100;
  value1 = 100;
  options1: Options = {
    floor: 0,
    ceil: 100
  };
  selectedSeriesNames = []
  selectedEpisodes = []
  selectedSeasons = []
  body: any = {}
  actorBody: any = {}
  actorPagination: { pageNo: number, limit: number, offset?: number, actorNameLike?: string } = { limit: 10, pageNo: 1 }
  totalSeriesCount = 0
  fetchedSeriesCount = 0
  fetchedTaggerCount = 0
  totalTaggerCount = 0
  setToggled(toggle): void {
    this.setIsToggled.next(toggle);
  }
  taggerPagination: { pageNo: number, limit: number, offset?: number, taggerName?: string } = { pageNo: 1, limit: 10 }
  totalActorsFetched = 0
  actorsCount = 0
  PRStatuses = []
  pagination: { pageNo: number, limit: number, offset?: number } = { limit: 10, pageNo: 1 }
  actors = [];
  selectedActors = []
  constructor(public modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private databaseService: DatabaseService,
    private sharedService: SharedService) {
  }
  ngOnInit(): void {
    this.setPagination()
    this.PRStatuses = this.sharedService.getPRStatuses()
    this.getTagger();
    this.getActors();
    this.getSeriesName();
    this.initForm();

    this.dropdownSettings = {
      // singleSelection: false,
      idField: 'id',
      textField: 'text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3,
    };
    this.PRdropdownSettings = {
      // singleSelection: false,
      idField: 'id',
      textField: 'title',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3,
    };
  }

  setPagination() {
    this.pagination.pageNo = 1
    this.pagination.limit = 10
    this.body = {
      ...this.body,
      pageNo: this.pagination.pageNo,
      limit: this.pagination.limit,
    }
  }
  checkSelectedFilter() {
    const series = JSON.parse(sessionStorage.getItem('series'));
    const actor = JSON.parse(sessionStorage.getItem('actor'))
    if (series)
      this.selectedSeries.push(series);
    else if (actor)
      this.actor.push(actor);
    sessionStorage.removeItem('series')
    sessionStorage.removeItem('actor')
  }


  private initForm() {
    this.filterForm = this.formBuilder.group({
      series: [null, [Validators.required]],
      seasons: [null, [Validators.required]],
      episodes: [null, [Validators.required]],
      tagStatus: [null, [Validators.required]],
      min: [0, [Validators.required]],
      VZoTSlider: [[0, 0]],
      max: [100, [Validators.required]],
      minimum: [0, [Validators.required]],
      maximum: [100, [Validators.required]],
      tagger: [[], [Validators.required]],
      actor: [null, [Validators.required]],
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
    this.getActors(null,$event.term)
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

  getSeriesName(seriesName?: string) {
    const series = []
    this.seriesLoader = true
    if (this.totalSeriesCount != this.fetchedSeriesCount || this.totalSeriesCount == 0){
      this.apiService.sendRequest(requests.getSeriesName, 'post', this.seriesPagination).subscribe(async (res: any) => {
        this.seriesLoader = false
        this.totalSeriesCount = await res?.data?.count
        if (seriesName || seriesName === '') {
          this.seriesNames = []
        }
        for (let i = 0; i < res?.data?.rows?.length; i++) {
          series.push(res?.data?.rows[i])
          this.fetchedSeriesCount++
        }

        console.log(series, "SERIESSS")
        this.seriesNames = this.seriesNames.concat(series)
        this.totalSeriesCount = res?.data?.count
        console.log(this.seriesNames, "SERIES NAMESSSS");
        this.fetchDatabaseFilters()

      });
    }
    else
      this.seriesLoader = false

  }

  resetFilters() {
    this.selectedSeries = [];
    this.seasons = [];
    this.minValue = 0;
    this.maxValue = 0;
    this.minValue1 = 0;
    this.maxValue1 = 0;
    this.episodes = [];
    this.taggerArray = [];
    this.prStatus = []
    this.actor = {};
    this.selectedEpisodes = []
    this.selectedSeasons = []
    this.prStatus = []
    this.selectedActors = []
    this.initForm()
    this.pagination.pageNo = 1
    this.pagination.limit = 10
    this.body = {
      pageNo: this.pagination.pageNo,
      limit: this.pagination.limit
    }
    this.databaseService.databaseRecords.next(this.body)
  }

  // nameSearch() {
  //   this.databaseService.nameSearch.next(this.filterForm.value.series)
  // }
  selectSeries(series: any) {
    this.setPagination()
    // console.log("Value: ", event.value)
    if (this.seriesPagination.seriesName) {
      this.seriesPagination.seriesName = undefined
      this.getSeriesName('')
    }
    this.filterForm.controls['series'].setValue(series.title)
    this.selectedSeries = [series.id]
    this.filterForm.controls['seasons'].setValue([])
    this.filterForm.controls['episodes'].setValue([])
    this.seasons = []
    this.episodes = []
    this.fetchedSeasonCount = 0
    this.selectedSeries[0] = series
    this.seriesId = series.id;
    this.body = {
      ...this.body,
      seriesIds: [series.id]
    }

    this.getSeasons()
    this.databaseService.databaseRecords.next(this.body)
  }
  getSeasons() {
    const body = {
      showIds: this.selectedSeries.map(item => item.id),
      pageNo: this.seasonPagination.pageNo,
      limit: this.seasonPagination.limit
    }
    this.setPagination()
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
    // console.log("Season", season)
    this.setPagination()
    console.log(this.filterForm.value.seasons, "SEASONSS")
    this.selectedSeasons = this.filterForm.value.seasons.map(item => item.id)
    this.fetchedEpisodeCount = 0
    if (this.selectedSeasons.length == 0) {
      console.log("hh")
      this.filterForm.controls['episodes'].setValue([])
      this.episodes = []
      this.body = {
        ...this.body,
        seasonNo: undefined,
        episodeNo: undefined
      }
    }
    else {
      // console.log(this.selectedSeasons)
      this.episodes = []
      this.body = {
        ...this.body,
        seasonNo: this.selectedSeasons
      }
      this.getEpisodes()
    }

    this.databaseService.databaseRecords.next(this.body)
    // console.log("ABC")

  }

  getEpisodes() {
    const body = {
      showId: this.selectedSeries.map(item => item.id),
      seasonNo: this.selectedSeasons,
      pageNo: this.pagination.pageNo,
      limit: this.pagination.limit
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
        this.episodes = this.episodes.concat(epi);
        this.episodes = this.sharedService.removeDuplicatesByProperty(this.episodes, 'text')      // console.log(this.episodes);
      })
    }
  }
  selectEpisode(episode: any) {
    this.setPagination()
    this.selectedEpisodes = this.filterForm.value.episodes.map(item => item.text.replace(/^\D+/g, ''))
    console.log(this.selectedEpisodes)
    this.selectedEpisodes.length != 0 ? this.body = {
      ...this.body,
      episodeNo: this.selectedEpisodes
    } : this.body = {
      ...this.body,
      episodeNo: undefined
    }
    this.databaseService.databaseRecords.next(this.body)
  }

  selectAllSeason(items: any) {
    // console.log("Items: ", items);
    // this.multiSelectArray.push(items.id)
    for (const item of items) {
      // console.log("ID: ", item.id);
      this.selectedSeasons.push(item.id)
      // console.log(this.multiSelectArray)
    }
    this.body = {
      ...this.body,
      seasonNo: this.selectedSeasons
    }
    this.databaseService.databaseRecords.next(this.body)
    // console.log("ABC")
    this.getEpisodes()
  }

  temp = [{
    fullName: "Waleed",
    id: 1
  }
  ]
  getTagger(searchTagger?: string) {
    this.annotatorLoader=true
    if (this.totalTaggerCount != this.fetchedTaggerCount || this.totalTaggerCount == 0) {
      this.apiService.sendRequest(requests.getTagger, 'post', this.taggerPagination).subscribe(async (res: any) => {
        this.totalTaggerCount = await res?.data?.count
        this.annotatorLoader=false
        if (searchTagger || searchTagger === '')
          this.tagger = []
        for (let i = 0; i < res?.data?.rows?.length; i++) {
          const obj = {
            id: res?.data?.rows[i]?.id, fullName: res?.data?.rows[i]?.fullName
          }
          this.tagger = [...this.tagger, obj]
          this.fetchedTaggerCount++
        }
      })
    }
    else
      this.annotatorLoader=false
  }

  getActors(pageNo?: number, actorName?:string) {
    if (pageNo) {
      this.actorPagination.pageNo = pageNo
    }
    this.actorLoader=true
    if (this.totalActorsFetched != this.actorsCount || this.actorsCount == 0) {
      this.apiService.sendRequest(requests.getActors, 'post', this.actorPagination).subscribe(async (res: any) => {
        this.actorLoader=false
        this.actorsCount = await res?.data?.count
        if(actorName || actorName==''){
          this.actors=[]
        }
        for (let i = 0; i < res?.data?.rows?.length; i++) {
          const actor={ id: res?.data.rows[i].id, text: res.data.rows[i].name }
          this.actors=[...this.actors,actor]
          this.totalActorsFetched++
          // this.actorsCount = res?.count
        }
        // // console.log("actors Api res",res.data)
      })
    }
    else
      this.actorLoader=false

  }
  onSelectAll(items: any) {
    // console.log(items);
  }
  onSelect(item: any) {
    // item.split(' ')[3]
    this.submitEpisodes.push(item.text[item.text.length - 1])
    // console.log("Episode Submit: ", this.submitEpisodes);
  }
  selectAll(items: any) {
    this.selectedEpisodes = this.episodes.map((e) => e.id)
    this.filterForm.controls['episodes'].setValue(this.episodes)
    this.body = {
      ...this.body,
      episodeNo: this.selectedEpisodes
    }
    this.databaseService.databaseRecords.next(this.body)
    // console.log(items);
  }
  seasonDeSelect(ev: any) {
    // console.log(ev);
    console.log(this.seasons)
    this.multiSelectArray.forEach((element, index) => {
      if (element == ev.id) this.multiSelectArray.splice(index, 1);
      // console.log("element: ", element);
      // console.log("array: ", this.multiSelectArray);
    });
  }

  onUnSelectAll(ev: any) {
    this.selectedSeasons = []
    this.body = {
      ...this.body, seasonNo: undefined
    }
    this.filterForm.controls['seasons'].setValue([])
    this.filterForm.controls['episodes'].setValue([])
    this.episodes = []
    this.databaseService.databaseRecords.next(this.body)
    // console.log("onUnSelectAll", ev)
  }
  unSelectAllStatuses($event) {
    this.filterForm.controls['tagStatus'].setValue([])
    this.body = {
      ...this.body,
      taggingStatusId: undefined
    }
    this.databaseService.databaseRecords.next(this.body)
  }
  UnSelectAllEpisodes(event: any) {
    this.filterForm.controls['episodes'].setValue([])
    this.selectedEpisodes = []
    this.body = {
      ...this.body,
      episodeNo: undefined
    }
    this.databaseService.databaseRecords.next(this.body)
  }

  episodeDeSelect(ev: any) {
    // console.log(ev);
  }

  taggerDeSelect(ev: any) {
    // console.log(ev);
  }

  submitFilter() {
    let showName = "";
    for (let i = 0; i < this.seriesNames?.length; i++) {
      if (this.filterForm.value.series == this.seriesNames[i].id) {
        showName = this.seriesNames[i].title
        // console.log(showName)
        break;
      }
    }
    const body = {
      pageNo: this.pagination.pageNo,
      limit: this.pagination.limit,
      ...(showName ? { seriesName: showName } : null),
      ...(this.multiSelectArray && this.multiSelectArray.length > 0 ? { seasonNo: this.multiSelectArray } : null),
      ...(this.submitEpisodes && this.submitEpisodes.length > 0 ? { episodeNo: this.submitEpisodes } : null),
      // episodeNo: this.submitEpisodes,
      ...(this.filterForm.value.tagStatus ? { taggingStatusId: parseInt(this.filterForm.value.tagStatus) } : null),
      // taggingStatusId: this.filterForm.value.tagStatus,
      ...(this.taggerArray && this.taggerArray.length > 0 ? { taggerId: this.taggerArray } : null),
      // taggerId: this.taggerArray,
      ...((this.minValue1 || this.minValue1 == 0) && this.maxValue1 ? {
        seriesComplete: {
          min: this.minValue1,
          max: this.maxValue1,
        }
      } : null),
      // vzotScore: {
      //   min: this.minValue,
      //   max: this.maxValue,
      // }
      ...((this.minValue || this.minValue == 0) && this.maxValue ? {
        vzotScore: {
          min: this.minValue,
          max: this.maxValue,
        }
      } : null),
      ...(this.filterForm.value.actorId ? { actorId: parseInt(this.filterForm.value.actorId) } : null),


    }
    this.passEntry.emit(body);
    // this.apiService.sendRequest(requests.getAllShowListing, 'post', body).subscribe((res: any)=>{
    //   // console.log(res);
    // })
  }
  onSelectStatus(item) {
    this.setPagination()
    this.body = {
      ...this.body,
      taggingStatusId: this.filterForm.value.tagStatus.map(item => item.id)
    }
    this.databaseService.databaseRecords.next(this.body)
  }

  selectAllStatus(item) {
    this.body = {
      ...this.body,
      taggingStatusId: this.PRStatuses.map(item => item.id)
    }
    this.databaseService.databaseRecords.next(this.body)
  }
  fetchDatabaseFilters() {
    this.databaseService.databaseRecords.pipe(take(1)).subscribe((res) => {
      this.isAlive.next(false)
      const filter = res
      console.log(res)
      if (res)
        this.body = res
      this.selectedSeries = []
      this.selectedSeasons = []
      this.selectedEpisodes = []
      this.selectedActors = []
      this.taggerArray = []
      this.prStatus = []
      if (filter) {
        console.log("filter recived", filter);
        if (filter?.seriesIds) {
          console.log(this.seriesNames, "SERIES NAMES")
          for (let i = 0, j = 0; i < this.seriesNames?.length; i++) {
            //console.log(this.selectedSeries)
            if (filter.seriesIds[j] === this.seriesNames[i].id) {
              this.selectedSeries.push(this.seriesNames[i])
              this.seriesId = this.seriesNames[i].id
              console.log(this.selectedSeries, "Selected Series")
              this.filterForm.controls['series'].setValue(this.seriesNames[i].title)
              this.getSeasons()
              j++
              break;
            }
            else {
              if (filter?.seriesName) {
                this.filterForm.controls['series'].setValue(filter?.seriesName)
                this.selectedSeries.push({ id: filter?.seriesIds[j], title: filter?.seriesName })
              }
              break;
            }
          }
        }
        let tempArray = []
        console.log(this.selectedSeries)
        filter?.seasonNo?.forEach(element => {
          this.selectedSeasons.push(element)
          tempArray.push({
            id: element,
            text: "S" + element
          })
          let seriesIds = this.selectedSeries.map((item) => {
            return item.id
          })
          const episodeBody = {
            showId: seriesIds,
            seasonNo: this.selectedSeasons,
            pageNo: this.episodePagination.pageNo,
            limit: this.episodePagination.limit
          }
          this.getEpisodes()
        });
        if (tempArray.length != 0) {
          this.filterForm.controls['seasons'].setValue(tempArray)
          tempArray = []
        }
        if (filter?.vzotScore) {
          this.filterForm.controls['min'].setValue(filter?.vzotScore.min),
            this.filterForm.controls['max'].setValue(filter?.vzotScore.max)
        }
        if (filter?.seriesComplete) {
          this.minValue1 = filter?.seriesComplete.min,
            this.maxValue1 = filter?.seriesComplete.max
        }
        filter?.episodeNo?.forEach(element => {
          this.selectedEpisodes.push(element)
          tempArray.push({
            id: element,
            text: 'E' + element
          })
        });
        if (tempArray.length != 0) {
          this.filterForm.controls['episodes'].setValue(tempArray)
          tempArray = []
        }
        let taggerArray = []
        if (filter?.taggers) {
          this.filterForm.controls['tagger'].setValue(filter?.taggers)
        }
        // console.log(tagger)

        // let actors=[]
        let actor
        console.log(this.actors)

        if (filter?.actors) {
          this.filterForm.controls['actor'].setValue(filter?.actors)
        }
        filter?.taggingStatusId?.forEach(element => {
          const prStatus = this.PRStatuses?.find((t: any) => t.id === element)
          this.prStatus.push(prStatus)
        })
        this.filterForm.controls['tagStatus'].setValue(this.prStatus)
        // this.actor = this.actors.find((a) => a.id === filter.actorId)
      }
    })
  }

  removeSeries(id: number) {
    this.setPagination()
    this.selectedSeries = this.selectedSeries.filter((item) => {
      return item.id != id
    })
    this.filterForm.controls['seasons'].setValue([])
    this.filterForm.controls['episodes'].setValue([])
    this.selectedEpisodes = []
    this.selectedSeasons = []
    const tempSeries = this.selectedSeries.map(item => item.id)
    if (this.selectedSeries.length == 0) {
      this.body = {
        ...this.body, seriesIds: undefined,
        seasonNo: undefined,
        episodeNo: undefined
      }
      this.seasons = null
      this.episodes = null
    }
    else
      this.body = { ...this.body, seriesIds: tempSeries }
    this.databaseService.databaseRecords.next(this.body)
  }
  removeSeason(seasonNo: any) {
    this.setPagination()
    this.episodes = []
    this.filterForm.controls['episodes'].setValue([])
    const selectedSeasons = this.filterForm.value.seasons
    selectedSeasons.forEach((element, index) => {
      if (element.id == seasonNo.id) {
        selectedSeasons.splice(index, 1)
      }
    }),
      this.filterForm.controls['seasons'].setValue(selectedSeasons)
    this.selectedSeasons = this.selectedSeasons.filter(item => item != seasonNo.id)
    if (this.selectedSeasons.length == 0) {
      this.body = {
        ...this.body, seasonNo: undefined,
        episodeNo: undefined
      }
      this.selectedEpisodes = []
    }
    else {
      this.body = { ...this.body, seasonNo: this.selectedSeasons }
      this.getEpisodes()
    }
    this.databaseService.databaseRecords.next(this.body)

  }
  removeEpisode(episodeNo: any) {
    this.setPagination()
    console.log(episodeNo)
    episodeNo = episodeNo?.text?.replace(/^\D+/g, '');
    const selectedEpisodes = this.filterForm.value.episodes
    selectedEpisodes.forEach((element, index) => {
      if (element.text?.replace(/^\D+/g, '') == episodeNo) {
        selectedEpisodes.splice(index, 1)
      }
    })
    console.log(this.selectedEpisodes)
    this.filterForm.controls['episodes'].setValue(selectedEpisodes)
    this.selectedEpisodes = this.selectedEpisodes.filter(item => item != episodeNo)
    if (this.selectedEpisodes.length == 0)
      this.body = { ...this.body, episodeNo: undefined }
    else
      this.body = { ...this.body, episodeNo: this.selectedEpisodes }
    this.databaseService.databaseRecords.next(this.body)
  }

  selectTagger(tagger: any) {
    this.setPagination()
    console.log(tagger)
    console.log('Form', this.filterForm.value.tagger)
    this.taggerArray.push(tagger)
    if (this.filterForm.value.tagger.length == 0) {
      this.body = {
        ...this.body,
        taggerIds: undefined
      }

    }
    else {
      this.body = {
        ...this.body,
        taggerIds: this.filterForm.value.tagger.map(item => item.id)
      }
      console.log(this.body)
    }
    this.databaseService.databaseRecords.next(this.body)
  }
  removeTagger(tagger: any) {
    this.setPagination()
    console.log(tagger)
    this.filterForm.controls['tagger'].setValue(this.filterForm.value.tagger.filter(item => item.id != tagger.id))
    if (this.filterForm.value.tagger.length == 0)
      this.body = { ...this.body, taggerIds: undefined }
    else
      this.body = { ...this.body, taggerIds: this.taggerArray.map(item => item.id) }
    this.databaseService.databaseRecords.next(this.body)
  }
  removeStatus(status: any) {
    this.setPagination()
    this.prStatus = this.filterForm.value.tagStatus.filter(item => item.id != status.id)
    this.filterForm.controls['tagStatus'].setValue(this.prStatus)
    if (this.prStatus.length == 0)
      this.body = { ...this.body, taggingStatusId: undefined }
    else
      this.body = { ...this.body, taggingStatusId: this.prStatus.map(item => item.id) }
    this.databaseService.databaseRecords.next(this.body)
  }
  selectAllTaggers($event) {
    this.taggerArray = this.tagger
    this.filterForm.controls['tagger'].setValue(this.tagger)
    this.body = {
      ...this.body,
      taggerIds: this.taggerArray.map(item => item.id)
    }
    this.databaseService.databaseRecords.next(this.body)
  }
  removeAllTaggers($event) {
    this.taggerArray = []
    this.filterForm.controls['tagger'].setValue([])
    this.body = {
      ...this.body,
      taggerIds: undefined
    }
    this.databaseService.databaseRecords.next(this.body)

  }
  selectVZoT(event: any = null) {
    this.setPagination()
    console.log(event)
    if (event) {
      this.filterForm.controls['min'].setValue(event.value)
      this.filterForm.controls['max'].setValue(event.highValue)
    }
    console.log(this.body)
    this.body = {
      ...this.body,
      vzotScore: { min: this.filterForm.value.min, max: this.filterForm.value.max }
    }
    console.log(this.body)
    this.databaseService.databaseRecords.next(this.body)
  }
  selectSeriesCompleteness(event: any = null) {
    this.setPagination()
    if (event) {
      this.filterForm.controls['minimum'].setValue(event.value)
      this.filterForm.controls['maximum'].setValue(event.highValue)
    }
    this.body = {
      ...this.body,
      seriesComplete: { min: this.filterForm.value.minimum, max: this.filterForm.value.maximum }
    }
    this.databaseService.databaseRecords.next(this.body)
  }

  selectActor(actor: any) {
    this.setPagination()
    // console.log(event)
    if (this.filterForm.value.actor.length == 0) {
      this.body = {
        ...this.body,
        actorIds: undefined
      }
    }
    else {
      this.body = {
        ...this.body,
        actorIds: this.filterForm.value.actor.map(item => item.id)
      }
    }
    this.databaseService.databaseRecords.next(this.body)
  }
  removeActor(actor: any) {
    console.log(this.selectedActors)
    console.log(actor)
    this.filterForm.controls['actor'].setValue(this.filterForm.value.actor.filter(item => item.id != actor.id))

    if (this.filterForm.value.actor.length == 0)
      this.body = { ...this.body, actorIds: undefined }
    else
      this.body = { ...this.body, actorIds: this.filterForm.value.actor.map(item => item.id) }
    this.databaseService.databaseRecords.next(this.body)
  }
  removeAllActors($event) {
    this.selectedActors = []
    this.filterForm.controls['actor'].setValue([])
    this.body = {
      ...this.body,
      actorIds: undefined
    }
    this.databaseService.databaseRecords.next(this.body)
  }
  selectAllActors($event) {
    this.selectedActors = this.actors
    this.filterForm.controls['actor'].setValue(this.selectedActors)
    this.body = {
      ...this.body,
      actorIds: this.selectedActors.map(actor => actor.id)
    }
    this.databaseService.databaseRecords.next(this.body)
  }

  modifyEpisode(value: string) {
    // console.log(value)
    const episode = value.replace(/^\D+/g, '');
    // console.log(episode)
    return episode
  }
  onScrollEnd(e) {
    console.log(e)
    // console.log(e.endReached);
    if (e.endReached) {
      console.log(e.endReached);
    }
  }
  onSeriesScrollEnd(e) {
    this.seriesPagination.pageNo++
    this.getSeriesName()
  }
  onSeasonScrollEnd($event) {
    this.seasonPagination.pageNo++
    this.getSeasons()
  }
  onEpisodeScrollEnd($event) {
    this.seasonPagination.pageNo++
    this.getEpisodes()
  }
  onTaggerScrollEnd($event) {
    this.taggerPagination.pageNo++
    this.getTagger()
  }
}