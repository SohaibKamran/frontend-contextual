export class ProductRecordModal {
    state: string | number;
    startDate: Date;
    endDate: Date;
    isOnGoing: boolean;
    startTime: Date;
    endTime: Date;
    englishTitle: string;
    arabicTitle: string;
    englishContent: string;
    arabicContent: string;
    file: any;

    address?:string;
    zoom?:string;
    radius:string;

    constructor() {
        this.state = ""
        this.startDate = null
        this.endDate = null
        this.isOnGoing = false
        this.startTime = null
        this.endTime = null
        this.englishTitle = ""
        this.arabicTitle = ""
        this.englishContent = ""
        this.arabicContent = ""
        this.file = null
    }

    toServerModel(eventForm: any, latitude: number, longitude: number, statusId) {

      
        return {
            latitude: latitude,
            longitude: longitude,
            eventTranslations: [
                {
                    "title": eventForm.englishTitle,
                    "description": eventForm.englishContent,
                    "languageCode": "EN"
                },
                {
                    "title": eventForm.arabicTitle,
                    "description": eventForm.arabicContent,
                    "languageCode": "AR"
                }
            ],
            startDate: eventForm.startDate,
            endDate: eventForm.endDate,
            isOnGoing: eventForm.isOnGoing,
            eventTiming: eventForm.eventTiming,
            media: [1],
            stateId: parseInt(eventForm.state),
            statusId: statusId,
            radius:this.radius,
            address:this.address,
            zoom:this.zoom

            // 
            //     sceneId: 1,
            //     proxyImageUrl: "https://cnbc-production-images-bucket.s3.me-south-1.amazonaws.com/content/images/5cf1012b310.jpg",
            //     coordinates: {
            //         "x": 1,
            //         "y": 200
            //     },
            //     "products": [
            //         {
            //             "productId": 1,
            //             "retailerId": 1,
            //             "vzotScore": 84,
            //             "minimumVzotScore": 80,
            //             "productTag": "shirt, blue, denim",
            //             "superProxy": true
            //         },
            //         {
            //             "productId": 1,
            //             "retailerId": 1,
            //             "vzotScore": 84,
            //             "minimumVzotScore": 80,
            //             "productTag": "jacket, leather",
            //             "superProxy": false
            //         }
            //     ],
            //     tagIds: [1, 2, 3],
            //     actorId: 1,
            //     color: "blue",
            //     gender: "male",
            //     pattern: "dotted",
            //     coordinateColor: "red"
            // 
        }

    }

    // toList(events: Array<any>) {
    //     let listHolidays = [];
    //     events && events.forEach(events => {
    //         listHolidays.push({
    //             type: events.type ? events.type:'',
    //             arTitle:events.eventTranslations && events.eventTranslations.length > 0 ? events.eventTranslations.find(x=>x.languageCode=="AR").title:'',
    //             enTitle:events.eventTranslations && events.eventTranslations.length > 0 ? events.eventTranslations.find(x=>x.languageCode=="EN").title:'',
    //             createdDate:events.createdAt,
    //             startDate:events.startDate,
    //             endDate:events.endDate,
    //             isOnGoing:events.isOnGoing,
    //             state:events.state ? events.state:'',
    //             stateId:events.stateId,
    //             statusId:events.statusId,
    //             id:events.id
    //         }
    //         )
    //     })
    //     return listHolidays;
    // }
}