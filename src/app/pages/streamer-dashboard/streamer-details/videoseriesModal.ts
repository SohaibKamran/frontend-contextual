import { formatDate } from "@angular/common";


export class videoSeriesModal {
    seriesTitle: string;
    companyNameArray: [];
    availableOnPlatform: boolean;
    imageUrl: string;

    constructor() {
        this.seriesTitle = ""
        this.companyNameArray = null;
        this.availableOnPlatform = false
        this.imageUrl = ""
        
    }


    toServerModel(videoDetailsForm: any,companyName?:[], fileUrl?:string,id?:number) {
        return {
            id:id??undefined,
            title: videoDetailsForm.title?.trim(),
            companyNameArray: companyName,
            thumbnail: fileUrl,
            showStatusId: videoDetailsForm.showStatusId,
            availableOnPlatform:this.availableOnPlatform
        }

    }

}