
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, concatMap, map, retry } from 'rxjs/operators';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  fileUrl: any;

  episodeUploadProgress = new BehaviorSubject<any>(null)
  movieUploadProgress = new BehaviorSubject<any>(null)
  uploadProgress = new BehaviorSubject<any>(null)
  constructor(private httpClient: HttpClient,
    private apiService: ApiService) { }

  uploadEpisode(data: any) {
    const filesToReturn = []
    if (data && data?.file) {
      return this.getSignedUrl(data).pipe(
        concatMap((urlData: any) => {
          // console.log("signed url", urlData);

          const presignedUrl = urlData?.data?.url;
          this.fileUrl = urlData?.data?.fileUrl;
          // console.log("File Url", this.fileUrl);

          filesToReturn.push(this.fileUrl);
          // console.log("filesToReturn", filesToReturn);
          const headers = new HttpHeaders()
            .set('Content-Type', data.file.file.type)
          return this.httpClient.put(presignedUrl, data.file.file, {
            headers: headers,
            reportProgress: true,
            observe: "events"
          })
          // }), concatMap((res: any) => {
          //   // console.log("final response", res);
          //   return this.apiService.sendRequest(requests.postSignedUrl, 'post', {
          //     "fileName": fileUrl,
          //     "mimeType": data.file.type,

          //     "fileSize": parseInt((data.file.size / 1024).toFixed(0))
          //   })s
        }), map((res: any) => {

          // console.log(res)
          if (res?.type == 1 && res?.loaded && res?.total) {
            this.episodeUploadProgress.next(Math.round(100 * (res?.loaded / res?.total)));
          }
          // demo file response
          //   "data": {
          //     "id": 83,
          //     "fileName": "95736-oil_3-19ac-1669097527728.jpeg",
          //     "fileDescriptor": "https://kalba-dev-bucket.s3.amazonaws.com/document/95736-oil_3-19ac-1669097527728.jpeg?AWSAccessKeyId=AKIAXJGDHWUJZYZR3VMP&Expires=1669097921&Signature=DkqujKrTUCdtSkbS%2FOBYffLoy1U%3D",
          //     "mimeType": "image/jpeg",
          //     "updatedAt": "2022-11-22T06:13:41.301Z",
          //     "createdAt": "2022-11-22T06:13:41.301Z"
          // }
          // console.log("second signed url response: " + res);

          return res?.data ? res.data : filesToReturn
        }), catchError(res => {
          throw new Error(res);

        })
      );
    } else {
      return of(false);
    }
  }

  uploadMovie(data: any) {
    const filesToReturn = []
    if (data && data?.file) {
      return this.getSignedUrl(data).pipe(
        concatMap((urlData: any) => {
          data = data.file

          const presignedUrl = urlData?.data?.url;
          this.fileUrl = urlData?.data?.fileUrl;
          // console.log("File Url", this.fileUrl);

          filesToReturn.push(this.fileUrl);
          // console.log("filesToReturn", filesToReturn);
          const headers = new HttpHeaders()
            .set('Content-Type', data.file.type)
          return this.httpClient.put(presignedUrl, data.file, {
            headers: headers,
            reportProgress: true,
            observe: "events"
          })
          // }), concatMap((res: any) => {
          //   // console.log("final response", res);
          //   return this.apiService.sendRequest(requests.postSignedUrl, 'post', {
          //     "fileName": fileUrl,
          //     "mimeType": data.file.type,

          //     "fileSize": parseInt((data.file.size / 1024).toFixed(0))
          //   })s
        }), map((res: any) => {

          // console.log(res)
          if (res?.type == 1 && res?.loaded && res?.total) {
            this.movieUploadProgress.next(Math.round(100 * (res?.loaded / res?.total)));
          }
          // demo file response
          //   "data": {
          //     "id": 83,
          //     "fileName": "95736-oil_3-19ac-1669097527728.jpeg",
          //     "fileDescriptor": "https://kalba-dev-bucket.s3.amazonaws.com/document/95736-oil_3-19ac-1669097527728.jpeg?AWSAccessKeyId=AKIAXJGDHWUJZYZR3VMP&Expires=1669097921&Signature=DkqujKrTUCdtSkbS%2FOBYffLoy1U%3D",
          //     "mimeType": "image/jpeg",
          //     "updatedAt": "2022-11-22T06:13:41.301Z",
          //     "createdAt": "2022-11-22T06:13:41.301Z"
          // }
          // console.log("second signed url response: " + res);

          return res?.data ? res.data : filesToReturn
        }), catchError(res => {
          throw new Error(res);

        })
      );
    } else {
      return of(false);
    }
  }

  upload(data: any) {
    const filesToReturn = []
    if (data && data?.file) {
      return this.getSignedUrl(data).pipe(
        concatMap((urlData: any) => {
          // console.log("signed url", urlData);

          const presignedUrl = urlData?.data?.url;
          this.fileUrl = urlData?.data?.fileUrl;
          // console.log("File Url", this.fileUrl);

          filesToReturn.push(this.fileUrl);
          // console.log("filesToReturn", filesToReturn);
          const headers = new HttpHeaders()
            .set('Content-Type', data.file.type)
          return this.httpClient.put(presignedUrl, data.file, {
            headers: headers,
            reportProgress: true,
            observe: "events"
          })
          // }), concatMap((res: any) => {
          //   // console.log("final response", res);
          //   return this.apiService.sendRequest(requests.postSignedUrl, 'post', {
          //     "fileName": fileUrl,
          //     "mimeType": data.file.type,

          //     "fileSize": parseInt((data.file.size / 1024).toFixed(0))
          //   })s
        }), map((res: any) => {

          // console.log(res)
          if (res?.type == 1 && res?.loaded && res?.total) {
            this.uploadProgress.next(Math.round(100 * (res?.loaded / res?.total)));
          }
          // demo file response
          //   "data": {
          //     "id": 83,
          //     "fileName": "95736-oil_3-19ac-1669097527728.jpeg",
          //     "fileDescriptor": "https://kalba-dev-bucket.s3.amazonaws.com/document/95736-oil_3-19ac-1669097527728.jpeg?AWSAccessKeyId=AKIAXJGDHWUJZYZR3VMP&Expires=1669097921&Signature=DkqujKrTUCdtSkbS%2FOBYffLoy1U%3D",
          //     "mimeType": "image/jpeg",
          //     "updatedAt": "2022-11-22T06:13:41.301Z",
          //     "createdAt": "2022-11-22T06:13:41.301Z"
          // }
          // console.log("second signed url response: " + res);

          return res?.data ? res.data : filesToReturn
        }), catchError(res => {
          throw new Error(res);

        })
      );
    } else {
      return of(false);
    }
  }
  uploadSeries(data: any) {
    const filesToReturn = []
    if (data && data?.file) {
      return this.getSignedUrl(data).pipe(
        concatMap((urlData: any) => {
          data = data.file

          const presignedUrl = urlData?.data?.url;
          this.fileUrl = urlData?.data?.fileUrl;
          // console.log("File Url", this.fileUrl);

          filesToReturn.push(this.fileUrl);
          // console.log("filesToReturn", filesToReturn);
          const headers = new HttpHeaders()
            .set('Content-Type', data.file.type)
          return this.httpClient.put(presignedUrl, data.file, {
            headers: headers,
            reportProgress: true,
            observe: "events"
          })
          // }), concatMap((res: any) => {
          //   // console.log("final response", res);
          //   return this.apiService.sendRequest(requests.postSignedUrl, 'post', {
          //     "fileName": fileUrl,
          //     "mimeType": data.file.type,

          //     "fileSize": parseInt((data.file.size / 1024).toFixed(0))
          //   })s
        }), map((res: any) => {

          // console.log(res)
          if (res?.type == 1 && res?.loaded && res?.total) {
            this.uploadProgress.next(Math.round(100 * (res?.loaded / res?.total)));
          }
          // demo file response
          //   "data": {
          //     "id": 83,
          //     "fileName": "95736-oil_3-19ac-1669097527728.jpeg",
          //     "fileDescriptor": "https://kalba-dev-bucket.s3.amazonaws.com/document/95736-oil_3-19ac-1669097527728.jpeg?AWSAccessKeyId=AKIAXJGDHWUJZYZR3VMP&Expires=1669097921&Signature=DkqujKrTUCdtSkbS%2FOBYffLoy1U%3D",
          //     "mimeType": "image/jpeg",
          //     "updatedAt": "2022-11-22T06:13:41.301Z",
          //     "createdAt": "2022-11-22T06:13:41.301Z"
          // }
          // console.log("second signed url response: " + res);
          return res
        }), catchError(res => {
          throw new Error(res);

        })
      );
    } else {
      return of(false);
    }
  }

  uploadFile(data: any) {
    const filesToReturn = []
    if (data && data?.file) {
      return this.getSignedUrl(data).pipe(
        concatMap((urlData: any) => {
          const presignedUrl = urlData?.data?.url;
          this.fileUrl = urlData?.data?.fileUrl;
          filesToReturn.push(this.fileUrl);
          const headers = new HttpHeaders()
            .set('Content-Type', data.file.type)
          return this.httpClient.put(presignedUrl, data.file, {
            headers: headers,
          })
        }), map((res: any) => {
          return res?.data ? res.data : filesToReturn
        }), catchError(res => {
          return res;
        })
      );
    } else {
      return of(false);
    }
  }

  uploadProfilePicture(data: any) {
    const filesToReturn = []
    if (data && data?.file) {
      return this.getSignedUrl(data).pipe(
        concatMap((urlData: any) => {
          // console.log("signed url", urlData);

          const presignedUrl = urlData?.data?.url;
          this.fileUrl = urlData?.data?.fileUrl;
          // console.log("File Url", this.fileUrl);

          filesToReturn.push(this.fileUrl);
          // console.log("filesToReturn", filesToReturn);
          const headers = new HttpHeaders()
            .set('Content-Type', data.file.type)
          return this.httpClient.put(presignedUrl, data.file, {
            headers: headers,
            reportProgress: true,
            observe: "events"
          })
          // }), concatMap((res: any) => {
          //   // console.log("final response", res);
          //   return this.apiService.sendRequest(requests.postSignedUrl, 'post', {
          //     "fileName": fileUrl,
          //     "mimeType": data.file.type,

          //     "fileSize": parseInt((data.file.size / 1024).toFixed(0))
          //   })s
        }), map((res: any) => {

          // // console.log(res)
          // if (res?.type == 1 && res?.loaded && res?.total) {
          //   this.movieUploadProgress.next(Math.round(100 * (res?.loaded / res?.total)));
          // }
          // demo file response
          //   "data": {
          //     "id": 83,
          //     "fileName": "95736-oil_3-19ac-1669097527728.jpeg",
          //     "fileDescriptor": "https://kalba-dev-bucket.s3.amazonaws.com/document/95736-oil_3-19ac-1669097527728.jpeg?AWSAccessKeyId=AKIAXJGDHWUJZYZR3VMP&Expires=1669097921&Signature=DkqujKrTUCdtSkbS%2FOBYffLoy1U%3D",
          //     "mimeType": "image/jpeg",
          //     "updatedAt": "2022-11-22T06:13:41.301Z",
          //     "createdAt": "2022-11-22T06:13:41.301Z"
          // }
          // console.log("second signed url response: " + res);

          return res?.data ? res.data : filesToReturn
        }), catchError(res => {
          throw new Error(res);

        })
      );
    } else {
      return of(false);
    }
  }

  catchError(err: Observable<unknown>): import("rxjs").Observable<unknown> {
    throw new Error('Method not implemented.');
  }

  getSignedUrl(fileInfo?: any) {
    let fileName;
    if (fileInfo?.file?.hasOwnProperty('customName') && fileInfo?.file?.hasOwnProperty('type')) {
      fileName = fileInfo.file.type === 'poster' ? 
        `../posters/${fileInfo.file.customName}.jpg` : fileInfo.file.type === 'frame' ?
          `../posters/${fileInfo.file.customName}_keyframe.jpg` : fileInfo.file.customName
      fileInfo = fileInfo.file
    } 

    return this.apiService.sendRequest(requests.getImageUrl, 'post', {
      "fileName": fileName ?? fileInfo.file.name,
      "mimeType": fileInfo.file.type,
      // "fileSize": 2
      "fileSize": parseInt((fileInfo.file.size / 1024).toFixed(0))
      // "fileSize": fileInfo.file.size
    }).pipe(map((res: any) => {
      // // console.log('signed url is ', res.data.presignedUrl);
      // console.log("Urls for image",res.data)
      return res
      // return this.apiService.sendRequest(res?.data?.presignedUrl, 'post')
    }))
  }
}


