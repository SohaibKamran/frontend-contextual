import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  droppedImageUrl: string;
  imgUrl: string;
  showToolbar = true;
  sceneObject: {
    sceneId: null,
    thumbnailUrl: '',
  }
  public navbar = new BehaviorSubject<any>(false);
  public sceneId = new BehaviorSubject<any>(null);
  public showId = new BehaviorSubject<any>(null);
  public videoData = new BehaviorSubject<any>(null);
  public screen = new BehaviorSubject<any>(null);
  public taggerId = new BehaviorSubject<any>(null);
  public proxyCordinateId = new BehaviorSubject<any>(null);
  public tagIds = new BehaviorSubject<any>(null);
  public sceneBodyFilters = new BehaviorSubject<any>(null)
  public sceneThumbnail = new BehaviorSubject<any>(null)
  public selectedTags = new BehaviorSubject<any>(null)
  public scenesFilter = new BehaviorSubject<any>(null)
  public cordinateX = new BehaviorSubject<any>(null)
  public cordinateY = new BehaviorSubject<any>(null)
  public tags = new BehaviorSubject<any>(null)
  public proxyImageId = [];
  public returnedPageNo: number;
  public nameSearch = new BehaviorSubject<any>(null)
  public lastMonth = new BehaviorSubject<any>(undefined)
  public taggerIds = new BehaviorSubject<any>(null)
  public taggerFilterBody = new BehaviorSubject<any>(null)
  public refreshPage = new BehaviorSubject<any>(null)
  public isTagAdded = new BehaviorSubject<any>(null)
  public isAddAttributeCall = new BehaviorSubject<any>(null)
  // public droppedSuperProxyImage = new BehaviorSubject<any>(undefined)
  public userId = new BehaviorSubject<any>(null)
  public countries = new BehaviorSubject<[]>(null)
  public removeProxyCoordinate = new BehaviorSubject<any>(null)
  public incrementRecord = new BehaviorSubject<number>(null)
  public filters: any
  public userAdded=new BehaviorSubject<any>(null)
  public seasonId= new BehaviorSubject<any>(null)

  Statuses = [
    {
      title: "Active",
      class: "approved"
    },
    {
      title: "Inactive",
      class: "returned"
    },
    {
      title: "Onboarding",
      class: "inprogress"
    },
  ]
  PRStatuses = [
    {
      id: 3,
      title: 'PR In Review',
      class: 'review'
    },
    {
      id: 4,
      title: 'PR Returned',
      class: 'returned'
    },
    {
      id: 5,
      title: 'PR Approved',
      class: 'approved'
    }
  ]

  taggingStatuses = [

    {
      id: 1,
      title: "Scene To Do",
      class: "todo",
    },
    {
      id: 2,
      title: "Scene In Progress",
      class: "inprogress"
    },
    {
      id: 3,
      title: "Scene In Review",
      class: "review"
    },
    {
      id: 4,
      title: "Scene Returned",
      class: "returned"
    },
    {
      id: 5,
      title: "Scene Approved",
      class: "approved"
    },
  ]

  constructor(@Inject(DOCUMENT) private document: Document
  ) {
    // console.log();

  }

  getStatuses() {
    return this.Statuses
  }
  getTaggingStatuses() {

    return this.taggingStatuses
  }
  getPRStatuses() {
    return this.PRStatuses
  }
  convertSeasonToNumeric(season: any) {
    season = season + ''
    var thenum = season.replace(/^\D+/g, ''); // Replace all leading non-digits with nothing
    // console.log(thenum)
    thenum = parseInt(thenum)
    if (thenum < 9)
      return "S0" + thenum
    else
      return "S" + thenum
  }
  convertEpisodeToNumeric(episode: any) {
    episode = episode + ''
    var thenum = episode.replace(/^\D+/g, ''); // Replace all leading non-digits with nothing
    // console.log(thenum)
    thenum = parseInt(thenum)
    if (thenum < 9)
      return "E0" + thenum
    else
      return "E" + thenum
  }
  public promptForVideo(): Promise<File> {
    return new Promise<File>((resolve, reject) => {
      // make file input element in memory
      const fileInput: HTMLInputElement = this.document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'video/*';
      fileInput.setAttribute('capture', 'camera');
      // fileInput['capture'] = 'camera';
      fileInput.addEventListener('error', event => {
        reject(event.error);
      });
      fileInput.addEventListener('change', event => {
        resolve(fileInput.files[0]);
      });
      // prompt for video file
      fileInput.click();
    });
  }

  public generateThumbnail(videoFile: Blob): Promise<string> {
    const video: HTMLVideoElement = this.document.createElement('video');
    const canvas: HTMLCanvasElement = this.document.createElement('canvas');
    const context: CanvasRenderingContext2D = canvas.getContext('2d');
    return new Promise<string>((resolve, reject) => {
      canvas.addEventListener('error', reject);
      video.addEventListener('error', reject);
      video.addEventListener('canplay', event => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        resolve(canvas.toDataURL());
      });
      if (videoFile.type) {
        video.setAttribute('type', videoFile.type);
      }
      video.preload = 'auto';
      video.src = window.URL.createObjectURL(videoFile);
      video.load();
    });
  }

  setFilters(filters: any) {
    this.filters = filters
  }
  getFilters() {
    return this.filters
  }
  removeDuplicatesByProperty<T, K extends keyof T>(arr: T[], property: string): T[] {
    const uniqueValues: Set<T[K]> = new Set();
    return arr.filter((obj) => {
      const value = obj[property];
      if (uniqueValues.has(value)) {
        return false;
      } else {
        uniqueValues.add(value);
        return true;
      }
    });
  }

}
