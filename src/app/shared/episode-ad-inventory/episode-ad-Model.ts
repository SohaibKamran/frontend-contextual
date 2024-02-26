import { Subject } from "rxjs"
export default class episodeAdModal{
    selectedSeries:any
    selectedSeason:any
    selectedEpisode:any
    selectedRetailer:any
    isAlive = new Subject<any>()
    allSeries:any[]
    allSeasons:any[]
    allEpisodes:any[]
    apiCount:number
    pagination: { pageNo: number, limit: number, offset?: number }
    seriesPagination: { pageNo: number, limit: number, offset?: number, seriesName?:string }
    episodePagination: { pageNo: number, limit: number, offset?: number }
    seasonPagination: { pageNo: number, limit: number, offset?: number }
    seriesLoader:boolean
    allRetailers:any[]
    loader:boolean
    seriesThumbnail:string
    totalCount:number
    seriesCount:number
    fetchedSeriesCount:number
    episodeCount:number
    fetchedEpisodeCount:number
    seasonCount:number
    fetchedSeasonCount:number
    showSandE:boolean
    constructor(){
        this.selectedEpisode={title:"Episode"+0,id:0}
        this.selectedSeason={title:"Season"+0,id:0}
        this.selectedSeries={title:'Change Series',id:-1}
        this.selectedRetailer={name:"Change Advertiser",id:-1}
        this.isAlive.next(true)
        this.pagination={pageNo:1,limit:10}
        this.seriesPagination={pageNo:1,limit:10}
        this.episodePagination={pageNo:1,limit:10}
        this.seasonPagination={pageNo:1,limit:10}
        this.allSeries=[]
        this.allSeasons=[]
        this.allEpisodes=[]
        this.apiCount=0
        this.allRetailers=[]
        this.loader=false
        this.seriesThumbnail=""
        this.totalCount=0
        this.fetchedSeriesCount=0
        this.seriesCount=0
        this.fetchedSeasonCount=0
        this.seasonCount=0
        this.fetchedEpisodeCount=0
        this.episodeCount=0
        this.showSandE=false
        this.seriesLoader=false
    }
}