import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import { requests } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) {
  }

  /**
   * Generate a url using the environments
   * @param {any} url
   * @returns string
   */

  /**
   * Sends a request on server side. Default switch case will be used for GET requests.
   * @param {any} url
   * @param {string} type
   * @param {any} formData
   * @returns Promise
   */
  sendRequest(url: any, type: string, formData: any = {}) {
    
    const params = this.transformFormDataToParams(formData || {});
    switch (type.toLowerCase()) {
      case 'post':
        return this.httpClient.post(url, formData);
      case 'put':
        return this.httpClient.put(url, formData);
      case 'patch':
        return this.httpClient.patch(url, formData);
      case 'delete':
        return this.httpClient.delete(url, {params: params});
      case 'upload_file':
        return this.httpClient.post(url, formData)
      default:
        return this.httpClient.get(url, {params: params});
    }
  }

  /**
   * Makes params from form data
   * @param any
   * @returns HttpParams
   */
  private transformFormDataToParams(formData: any) {
    let params = new HttpParams();
    if (Object.keys(formData).length) {
      Object.keys(formData).forEach((key) => {
        if (Array.isArray(formData[key])) {
          formData[key].forEach((k: any) => {
            params = params.append(key + '[]', k);
          });
        } else {
          params = params.append(key, formData[key]);
        }
      });
    }
    return params;
  }

  // file uploader

  uploadFileProgress(file:any, description?:any, config?:any, configSquareThumbnail?:any) {
    const formData: FormData = Object.assign(new FormData());
    const fileType = file.type.toString();
    formData.append("file", file);
    formData.append("title", file.name);
    if(description) {
      formData.append("description", description);
    }
    formData.append("attachmentType", file.name.match(/\.(jpg|jpeg|png|gif|jfif|JPG|JPEG|PNG|GIF|JFIF)$/) ? 'IMAGE': file.name.match(/\.(mp3|wav|aac|mpeg)$/) ? 'AUDIO': 'VIDEO');
    formData.append("tags", 'news');
    formData.append("channel", 'news');
    formData.append("toBePublished", 'true');
    formData.append("toBePrivate", 'false');
    formData.append("isCreatedForKids", 'false');
    if(configSquareThumbnail && file.name.match(/\.(jpg|jpeg|png|gif|jfif|JPG|JPEG|PNG|GIF|JFIF)$/)) {
      formData.append("source", configSquareThumbnail.source);
      formData.append("resize", 'true');
      formData.append("width", configSquareThumbnail.width);
      formData.append("height", configSquareThumbnail.height);
      // formData.append("width", config.resizeQuality);
    }
    else if(config && file.name.match(/\.(mp4|3gp|avi|mpeg|mov|webm)$/)) {
      formData.append("source", config.source);
    }
    else if(config && file.name.match(/\.(jpg|jpeg|png|gif|jfif|JPG|JPEG|PNG|GIF|JFIF)$/)) {
      formData.append("source", config.source);
      formData.append("resize", 'true');
      formData.append("width", '630');
    }
    else if(!config && !configSquareThumbnail && file.name.match(/\.(mp3|wav|aac|mpeg)$/)) {
      formData.append("source", 'alexa');
    }
    // if (recorded) {
    //   formData.append("recorded", recorded);
    // }
    return this.httpClient.post(requests.addNewAttachment, formData, {
      reportProgress: true,
      observe: 'events'
    })
  }
}
