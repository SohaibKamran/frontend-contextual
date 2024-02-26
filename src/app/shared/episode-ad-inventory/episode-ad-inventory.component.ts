import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdAddToCardModalComponent } from '../ad-add-to-card-modal/ad-add-to-card-modal.component';
import { NgbActiveModal, NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { requests } from 'src/app/core/config/config';
import { ApiService } from 'src/app/core/api.service';
import episodeAdModal from './episode-ad-Model';
import { EpisodePreviewComponent } from 'src/app/pages/episode-preview/episode-preview.component';
import { SharedService } from 'src/app/core/services/shared.service';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { CoreModule } from 'src/app/core/core.module';
@Component({
  selector: 'app-episode-ad-inventory',
  standalone: true,
  imports: [CommonModule, NgSelectModule, FormsModule, NgbPaginationModule, CoreModule],
  templateUrl: './episode-ad-inventory.component.html',
  styleUrls: ['./episode-ad-inventory.component.scss']
})
export class EpisodeAdInventoryComponent implements OnInit {
  @Input() body: any
  @Input() thumbnail: string
  @Input() retailerName: string
  @Input() episodeId: number
  @Input() seriesName: string
  @Input() seriesThumbnail: string
  @Input() retailerId:number
  @Input() isDemo: boolean
  episodeAdListing = []
  episodeComp: episodeAdModal
  constructor(private modalService: NgbModal, private modal: NgbActiveModal, private apiService: ApiService, private sharedService: SharedService) { }
  ngOnInit(): void {
    this.init()
  }
  init() {
    this.episodeComp = new episodeAdModal()
    this.mapBody()
    this.getAllSeries()
    this.getAllAdvertisers()
    this.fetchData()

  }
  openAddToCartModal(id: number, productImageId: number, proxyCoordinateId:number,sceneId:number, url) {
    const activeModal = this.modalService.open(AdAddToCardModalComponent, {
      windowClass: "modal-lg",
      backdrop: "static",
      size: 'lg',
      keyboard: true,
      centered: true,
    })
    console.log(this.episodeComp.selectedRetailer)
    activeModal.componentInstance.id = id
    activeModal.componentInstance.productImageId = productImageId
    activeModal.componentInstance.proxyCoordinateId=proxyCoordinateId
    activeModal.componentInstance.retailerId=this.episodeComp.selectedRetailer?.id
    activeModal.componentInstance.showId=this.episodeComp.selectedEpisode?.id
    activeModal.componentInstance.sceneId=sceneId
    activeModal.componentInstance.retailerName=this.episodeComp.selectedRetailer?.name
    activeModal.componentInstance.matchedImageUrl=url

  }
  close() {
    this.modal.close()
  }
  fetchData() {
    this.episodeComp.loader = true
    this.apiService.sendRequest(requests.getCoordinateListingForAdInventory, 'post', this.body).pipe(takeUntil(this.episodeComp.isAlive)).subscribe((res: any) => {
      this.episodeComp.loader = false
      this.episodeAdListing = res?.data?.rows
      this.episodeComp.totalCount = res?.data?.count
      if (this.episodeComp.apiCount == 0) {
        this.episodeComp.apiCount++
        this.getAllSeasonsOfShow()
        if (this.episodeComp.selectedSeason?.id)
          this.getAllEpisodes(this.episodeComp.selectedSeason.id)
        // const thumbnail = this.episodeAdListing[0]?.Scene?.Show?.Series?.thumbnail
        // if (thumbnail)
        //   this.episodeComp.selectedSeries.thumbnail = thumbnail
        // else
        //   this.episodeComp.seriesThumbnail = "../../../assets/images/default-video-frame.svg"
      }
    })
  }
  mapBody() {
    console.log(this.body)
    this.body = {
      ...this.body,
      pageNo: this.episodeComp.pagination.pageNo,
      limit: this.episodeComp.pagination.limit
    }
    this.episodeComp.selectedSeason = { title: "Season " + this.body.seasonNo[0], id: this.body.seasonNo[0] }
    this.episodeComp.selectedEpisode = { title: "Episode " + this.body.episodeNo[0], id: this.episodeId }
    this.episodeComp.selectedRetailer = {
      id: this.retailerId,
      name: this.retailerName
    }
    this.episodeComp.selectedSeries = { title: this.seriesName, id: this.body.seriesIds[0] }
    this.episodeComp.selectedSeries.thumbnail = this.seriesThumbnail
    console.log(this.episodeComp.seriesThumbnail, "THUMBNAIL")

  }

  searchSeries($event) {
    this.episodeComp.fetchedSeriesCount = 0
    if ($event.term != '')
      this.episodeComp.seriesPagination.seriesName = $event.term
    else
      this.episodeComp.seriesPagination.seriesName = undefined
    this.episodeComp.seriesPagination.pageNo = 1
    this.getAllSeries($event.term)
    console.log($event)
  }
  getAllSeries(seriesName?: string) {
    this.episodeComp.seriesLoader = true
    if (this.episodeComp.seriesCount != this.episodeComp.fetchedSeriesCount || this.episodeComp.seriesCount == 0) {
      this.apiService.sendRequest(requests.getSeriesName, 'post', this.episodeComp.seriesPagination).pipe(takeUntil(this.episodeComp.isAlive)).subscribe(async (res: any) => {
        // this.episodeComp.allSeries = res?.data
        const series = []
        if (seriesName || seriesName === '') {
          this.episodeComp.allSeries = []
        }
        this.episodeComp.seriesLoader = false
        this.episodeComp.seriesCount = await res?.data?.count
        for (let i = 0; i < res?.data?.rows?.length; i++) {
          const obj = {
            title: res?.data?.rows[i]?.title,
            id: res?.data?.rows[i]?.id,
            thumbnail: res?.data?.rows[i]?.thumbnail
          }
          this.episodeComp.allSeries = [...this.episodeComp.allSeries, obj]
          this.episodeComp.fetchedSeriesCount++
        }
      })
    }
  }
  getAllSeasonsOfShow() {
    const body = {
      showIds: [this.episodeComp.selectedSeries.id],
      pageNo: this.episodeComp.seriesPagination.pageNo,
      limit: this.episodeComp.seasonPagination.limit
    }
    let seasons = []
    this.apiService.sendRequest(requests.getAllSeasonofSeries, 'post', body).pipe((takeUntil(this.episodeComp.isAlive))).subscribe(async (res: any) => {
      console.log(res, "response")
      this.episodeComp.seasonCount = await res?.data?.count
      for (let i = 0; i < res?.data?.rows?.length; i++) {
        seasons.push({
          id: res?.data?.rows[i]?.seasonNo,
          title: "Season " + res?.data?.rows[i]?.seasonNo
        })

      }
      if (!this.episodeComp.selectedSeason) {
        console.log("SEASONN")
        this.episodeComp.selectedSeason = seasons[0]
        this.episodeComp.fetchedEpisodeCount = 0
        this.getAllEpisodes(seasons[0].id)
      }
      this.episodeComp.allSeasons = this.episodeComp.allSeasons.concat(seasons)
    })

  }
  getAllEpisodes(seasonId: number) {
    const body = {
      showId: [this.episodeComp.selectedSeries?.id],
      seasonNo: [seasonId],
      pageNo: this.episodeComp.episodePagination.pageNo,
      limit: this.episodeComp.episodePagination.limit,
      onlyBrokenScene:true
    }
    if (this.episodeComp.episodeCount != this.episodeComp.fetchedEpisodeCount || this.episodeComp.fetchedEpisodeCount == 0) {
      this.apiService.sendRequest(requests.getEpisodes, 'post', body).pipe((takeUntil(this.episodeComp.isAlive))).subscribe((res: any) => {
        let epi = []
        this.episodeComp.episodeCount = res?.data?.count
        for (let i = 0; i < res?.data?.rows?.length; i++) {
          this.episodeComp.fetchedEpisodeCount++
          epi.push({
            id: res?.data?.rows[i]?.id,
            title: "Episode " + res?.data?.rows[i]?.episodeNo
          });
        }
        if (!this.episodeComp.selectedEpisode) {
          console.log("Episodeeee")
          this.episodeComp.selectedEpisode = epi[0]
        }
        this.episodeComp.allEpisodes = epi
      })
    }
  }
  selectSeries(event: any) {
    console.log(event)
    this.episodeComp.selectedSeries = event
    this.episodeComp.selectedSeason = null
    this.episodeComp.selectedEpisode = null
    this.episodeComp.allSeasons = []
    this.episodeComp.allEpisodes = []
    if (event?.videoTypeId == 3) {
      this.episodeComp.showSandE = true
    }
    else {
      this.episodeComp.showSandE = false
      this.getAllSeasonsOfShow()
    }
    this.body = {
      ...this.body,
      seriesIds: [event.id],
      seasonNo: undefined,
      episodeNo: undefined
    }
    this.fetchData()
  }
  selectSeason(event: any) {
    this.episodeComp.selectedEpisode = null
    this.episodeComp.fetchedEpisodeCount = 0
    this.body = {
      ...this.body,
      seasonNo: [event.id],
      episodeNo: undefined
    }
    this.getAllEpisodes(event?.id)
    this.fetchData()
  }
  selectEpisode(event: any) {
    console.log(event)
    this.body = {
      ...this.body,
      episodeNo: event?.title ? [event.title.replace(/^\D+/g, '')] : undefined
    }
    this.fetchData()
  }
  openEpisodePreviewModal(sceneId?: number, showId?: number) {
    console.log(sceneId,showId);
    console.log(this.episodeAdListing);
    if (sceneId) {
      if(showId) sessionStorage.setItem('showId',JSON.stringify(showId))
      this.sharedService.sceneId.next(sceneId)
      this.sharedService.videoData.next(showId)
    }
    else {
      console.log("hhhe")
      this.sharedService.sceneId.next(0)
      console.log(this.episodeComp.selectedEpisode)
      if (this.episodeComp.selectedEpisode)
      {
        this.sharedService.videoData.next(this.episodeComp.selectedEpisode.id)
        sessionStorage.setItem('showId',JSON.stringify(this.episodeComp.selectedEpisode.id))
      }

      else
        this.sharedService.videoData.next(this.episodeComp.selectedSeries.id)
    }
    const episodePreviewModal = this.modalService.open(EpisodePreviewComponent, {
      windowClass: "modal-xl",
      backdrop: "static",
      keyboard: true,
      centered: true,
    });
    episodePreviewModal.componentInstance.isDemo = this.isDemo;
  }
  selectRetailer($event) {
    console.log($event)
    this.body = {
      ...this.body,
      advertiserId: $event.id
    }
    this.retailerName = $event.name
    this.thumbnail = $event.imageUrl
    this.fetchData()
  }
  getAllAdvertisers() {
    this.apiService.sendRequest(requests.getAllAdvertiser, 'post', {pageNo:1,limit:1000}).pipe(takeUntil(this.episodeComp.isAlive)).subscribe((res: any) => {
      // console.log(res)
      let retailers = []
      for (let i = 0; i < res?.data?.length; i++) {
        const obj = {
          id:res?.data[i].id,
          name:res?.data[i].name,
          imageUrl:res?.data[i].imageUrl
        }
        this.episodeComp.allRetailers=[...this.episodeComp.allRetailers,obj]
      }
      console.log(this.episodeComp.allRetailers)
    })
  }

  onPageChange($event) {
    this.episodeComp.pagination.pageNo = $event
    this.body = {
      ...this.body,
      pageNo: this.episodeComp.pagination.pageNo
    }
    this.fetchData()
  }
  selectPage($event) {
    console.log($event)
  }
  formatInput($event) {

  }
  changeLimit() {
    this.body = {
      ...this.body,
      pageNo: this.episodeComp.pagination.limit
    }
  }
  onSeriesScrollEnd(e) {
    this.episodeComp.seriesPagination.pageNo++
    this.getAllSeries()
  }
  ngOnDestroy() {
    this.episodeComp.isAlive.next(false)
  }


}
