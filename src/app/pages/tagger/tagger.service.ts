/* eslint-disable no-var */
/* eslint-disable prefer-const */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { addProductOfScene, addTag, getActors, getAllProducts, getAllScenesOfShow, getAllShows, getCorrectUrlForPR, getFileBuffer, getProductsForTagger, getProductsOfScene, getRecentProxies, getRecentSuperProxies, getTags, getVideoDetailByID, removeCoordinate } from './../../core/constants';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TaggerService {
  public coordinateIds = new BehaviorSubject<any>(null)
  public showId = new BehaviorSubject<any>(null)
  constructor(private http: HttpClient, private apiService: ApiService) { }

  currentItemSelected: any;
  selectActor() {
    // console.log(this.currentItemSelected);
  }

  getProductsForTagger(): Observable<any> {
    let body = {
      "pageNo": "1",
      "limit": "1000"
    }
    return this.apiService.sendRequest(getProductsForTagger, 'post', body)
  }

  getRecentProxies() {
    let body = {
      "pageNo": 1,
      "limit": 1000
    }
    return this.apiService.sendRequest(getRecentProxies, 'post', body)
  }

  getRecentSuperProxies(showId:any) {
    let body = {
      "pageNo": 1,
      "limit": 1000,
      "showId": showId
    }
    return this.apiService.sendRequest(getRecentSuperProxies, 'post', body)
  }
  apiForFetchingCorrectLinkForPR(inputUrl: any)
  {
    let body = {
      "previousURL" : inputUrl
    }
    return this.apiService.sendRequest(getCorrectUrlForPR, 'post', body)
  }
  getActors() {
    let body = {
      "pageNo": 1,
      "limit": 1000
    }
    return this.apiService.sendRequest(getActors, 'post', body)
  }

  getGoogleSearch(query: any, page: any): Observable<any> {
    var url = 'https://www.googleapis.com/customsearch/v1?key=' + 'AIzaSyCzfEHp5uJUHqV1Momcb9pyz2On-KL15G8' + '&cx=' + '543db9ada46984dbf' + '&searchType=image' + '&start=' + page + '&q=' + query
    return this.apiService.sendRequest(url, 'get')
  }

  getAllScenesOfShow(body) {
    // let body = {
    //   "showId": parseInt(showId),
    //   "pageNo": page,
    //   "limit": 20
    // }

    // body.showId=parseInt(showId)
    // body.pageNo=page
    // body.limit=20
    // if(sceneId)
    //   body.clickedOnSceneId = sceneId
    // console.log(body)
    return this.apiService.sendRequest(getAllScenesOfShow, 'post', body)
  }

  getProductsOfScene(sceneId: any) {
    let body = {
      "sceneId": sceneId,
      "limit": 1000,
      "pageNo": 1
    }
    return this.apiService.sendRequest(getProductsOfScene, 'post', body)
  }

  addProductOfScene(obj: any) {
    // console.log(obj);
    // delete obj?.Actor;
    // delete obj?.CoordinateHasProducts;
    // delete obj?.Tags;
    // delete obj?.id;
    // delete obj?.xCoordinate;
    // delete obj?.yCoordinate;
    if (obj.actorId == -1) {
      obj.actorId = null
      delete obj.Actor
      delete obj.actorId
    }
    // if(obj.actorSnapshot)
    // {
    //   obj.actorSnapshot=undefined
    // }
    delete obj.actorSnapshot
    if (obj.Actor == null) {
      obj.Actor = {}
    }
    if (obj.CoordinateHasProducts && obj.products) {
      for (let x in obj.CoordinateHasProducts) {
        obj.products[x]['productTag'] = obj.CoordinateHasProducts[x]['Product']['title']
      }
    }
    return this.apiService.sendRequest(addProductOfScene, 'post', obj)
  }

  removeCoordinate(body: any) {
    return this.apiService.sendRequest(removeCoordinate, 'post', body)
  }

  getShowById(showId: any) {
    let body = {
      "id": showId
    }
    return this.apiService.sendRequest(getVideoDetailByID, 'post', body)
  }

  getAllShows() {
    let body = {
      "pageNo": "1",
      "limit": "1000",
      "searchText": "a"
    }
    return this.apiService.sendRequest(getAllShows, 'post', body)
  }
  addTag(tag: any, parentTagId: any) {
    let body = [
      {
        "name": tag,
        "isHelper": "0",
        "level": 3,
        "parentTagId": parentTagId,
        "weight": 0.2,
        "isTuner": false
      },
    ]
    return this.apiService.sendRequest(addTag, 'post', body)
  }
  getAllProducts() {
    let body = {
      "pageNo": "1",
      "limit": "1000"
    }
    return this.apiService.sendRequest(getAllProducts, 'post', body)
  }
  getFileBuffer(url) {
    const body = {
      url: url
    }
    return this.http.post(getFileBuffer, body, {
      responseType: "arraybuffer"
    })
  }
  getTags() {
    let body = {
      "pageNo": "1",
      "limit": "1000",
      "level": '1'
    }
    return this.apiService.sendRequest(getTags, 'post', body)
  }

}
