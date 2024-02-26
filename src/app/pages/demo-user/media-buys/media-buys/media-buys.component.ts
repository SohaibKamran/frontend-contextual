import { Component, OnInit, Input, ViewChildren, QueryList, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MediaBuysModalComponent } from '../media-buys-modal/media-buys-modal.component';
import { RevenueCalculatorModalComponent } from '../revenue-calculator-modal/modal/modal.component';
import { Subscription } from 'rxjs';
import { forkJoin } from 'rxjs';
//import jsPDF from 'jspdf';
//import html2canvas from 'html2canvas';

//import 'jspdf-autotable'; // This should extend jsPDF with autoTable

import { ExportPDFModalComponent } from '../export-pdfmodal/export-pdfmodal.component';
import { UserWatchService } from '../../user.service';
// declare module 'jspdf' {
//   interface jsPDF {
//     autoTable: (options: UserOptions) => jsPDF;
//   }
// }


@Component({
  selector: 'app-media-buys',
  templateUrl: './media-buys.component.html',
  styleUrls: ['./media-buys.component.scss'],
})
export class MediaBuysComponent {
  @ViewChildren('adPlacement') adPlacements: QueryList<ElementRef>;
  @ViewChild('exportableContent') exportableContent: ElementRef;
  @ViewChild('uniqueTableBody') uniqueTableBody: ElementRef;
  @ViewChildren('adPlacement') uniqueAdRow: QueryList<ElementRef>;
  
  breadCrumbItems: ({ label: string; active?: undefined; } | { label: string; active: boolean; })[];
  searchText: string = '';
  trendingShows = [];
  body: any
  totalSeries = 0
  thumbnail: any
  showId: any
  title: any
  episodeTitle: any
  episodeId: any
  seasonNo: any
  episodeNo: any
  loader: any
  advertisers = []
  totalViews = 1000000
  impressionCPM = 35.00
  CPC = 1.00
  retargetingCPM = 70.00
  savePercentage = 0.10
  clickPercentage = 0.10
  adImpressionPerPause = 2
  avgPausesPerVideo = 2
  shoppingConversionRate = 0.2
  retargetingViews = 3
  selectedAdvertiser : any
  retailerImg: any
  retailerName: any
  retailerAdMatches :any
  retailerPenetration :any
  retailerId: any
  today = new Date()
  totalAdvertisers = 0
  selectedRowIndex: number = 0;
  private videoChangeSubscription: Subscription;
  private numbers: Subscription;
  
  totalScenes: any
  adMatches = []
  selectedScene: any

  loading = false;
  
  
  constructor(private apiService: ApiService, private router: Router, public modalService: NgbModal, private renderer: Renderer2, private userService:UserWatchService,){
    
  }
  

  ngOnInit() {
    this.body = {
      pageNo: 1,
      limit: 100,
      onlyActive: true
    }
        
    const body2 = {
      showId: 370
    }
    this.loading = true;

    forkJoin({
          trendingShows: this.apiService.sendRequest(requests.getTrendingShows, 'post', this.body),
          advertisersMatches: this.apiService.sendRequest(requests.getAdvertisersMatchesByShowId, 'post', body2)
      }).subscribe(({ trendingShows, advertisersMatches }) => {
          // Process the results from getTrendingShows
          this.processTrendingShows(trendingShows);

          // Process the results from getAdvertisersMatchesByShowId
          this.processAdvertisersMatches(advertisersMatches);

          // Now that both requests have completed, call getAdsByAdvertiser
          this.getAdsByAdvertiser(this.retailerId);

          
    });

    
  }

  ngAfterViewInit() {
    
  }
  onTableScroll(event: any): void {
    const scrollTop = event.target.scrollTop;
    const scrollHeight = event.target.scrollHeight;
    const clientHeight = event.target.clientHeight;
  
    let cumulativeOffset = 0;
    let lastSceneWithProductsIndex = -1;
  
    // Calculate the index of the last scene with products
    this.adMatches.forEach((scene, index) => {
      if (scene.products && scene.products.length > 0) {
        lastSceneWithProductsIndex = index; // Use the index of the adMatch
      }
    });
  
    const adPlacementElements = this.adPlacements.toArray();
  
    // Iterate over the adPlacementElements to determine which adMatch is in view
    for (let i = 0, adMatchIndex = 0; i < adPlacementElements.length && adMatchIndex < this.adMatches.length; adMatchIndex++) {
      const products = this.adMatches[adMatchIndex].products;
  
      for (let productIndex = 0; productIndex < products.length; productIndex++, i++) {
        const el = adPlacementElements[i].nativeElement;
        cumulativeOffset += el.offsetHeight;
  
        // Check if scrolled to the bottom of the container
        if (scrollTop + clientHeight >= scrollHeight) {
          // Select the last scene with products, ensuring it's the last adMatch containing products
          this.selectedScene = lastSceneWithProductsIndex;
          return; // Exit the function as the last scene is selected
        }
  
        // For other positions, set the selected scene based on the adMatch in view
        if (cumulativeOffset >= scrollTop) {
          this.selectedScene = adMatchIndex; // Set the selected scene index to the adMatch in view
          return; // Exit the loop once the adMatch in view is found
        }
      }
    }
  }
  
  
  
  
  
  

  processAdvertisersMatches(res: any){
       //save the first advertiser
       for(let i=0; i<res?.data?.length; i++){
        if (i==0){
          this.retailerImg = res?.data[i].Retailer.imageUrl
          
          this.retailerName = res?.data[i].Retailer.name
          this.retailerAdMatches = res?.data[i].matches
          this.retailerId = res?.data[i].retailerId
          this.retailerPenetration = res?.data[i].matches / this.totalScenes;
          
        }
        if(res?.data[i].retailerId !== 55){
          this.advertisers[this.totalAdvertisers] = res?.data[i]
          this.totalAdvertisers++
        }
      }
      this.computeAdRevenue()
  }

  processTrendingShows(trendingShows: any){
    
      
      for (let i = 0; i < trendingShows?.data?.rows?.length; i++) {
        if(i==0){
          //console.log(res?.data?.rows[i])
          //save the default series
          this.showId = trendingShows?.data?.rows[i].id
          this.thumbnail = trendingShows?.data?.rows[i].thumbnail
          this.title = trendingShows?.data?.rows[i].title
          this.seasonNo = trendingShows?.data?.rows[i].Episodes[0].seasonNo
          this.episodeNo = trendingShows?.data?.rows[i].Episodes[0].episodeNo
          this.episodeId = trendingShows?.data?.rows[i].Episodes[0].id
          this.episodeTitle = trendingShows?.data?.rows[i].Episodes[0].title
          this.totalScenes = trendingShows?.data?.rows[i].Episodes[0].totalScenes
          
        }
        this.trendingShows[this.totalSeries] = trendingShows?.data?.rows[i]
        
        this.totalSeries++
      }
      //console.log("SHOWS", this.trendingShows)
    
    
  }



  onRowClicked(index: number, advertiser: any) {
    this.selectedRowIndex = index;
    this.selectedAdvertiser = advertiser
    this.retailerImg = advertiser.Retailer.imageUrl
    this.retailerName = advertiser.Retailer.name
    this.retailerAdMatches = advertiser.matches
    this.retailerPenetration = advertiser.matches / this.totalScenes;
    this.retailerId = advertiser.retailerId
    this.getAdsByAdvertiser(advertiser.retailerId)
  }

  getAdvertisersMatchesByShowId(showIdNumber: any){
    const body = {
      showId: showIdNumber
    }
    this.totalAdvertisers = 0
   
    this.apiService.sendRequest(requests.getAdvertisersMatchesByShowId, 'post', body).subscribe((res: any) => {
      
      //save the first advertiser
      for(let i=0; i<res?.data?.length; i++){
        if (i==0){ 
          this.retailerImg = res?.data[i].Retailer.imageUrl
          
          this.retailerName = res?.data[i].Retailer.name
          this.retailerAdMatches = res?.data[i].matches
          this.retailerId = res?.data[i].retailerId
          this.retailerPenetration = res?.data[i].matches / this.totalScenes;
     
        }
        
        if(res?.data[i].retailerId !== 55){
          this.advertisers[this.totalAdvertisers] = res?.data[i]
          this.totalAdvertisers++
        }
      }
      this.computeAdRevenue()
      this.getAdsByAdvertiser(this.retailerId)
  });
  }



  
  getAdsByAdvertiser(retailerId: any){
    if (retailerId == null) {
      retailerId = 1
    }
    const body = {
      retailerId: retailerId,
      showId: this.episodeId,

      
    }
    this.loading = true;
    this.apiService.sendRequest(requests.getScenesByRetailerAndTopAds, 'post', body).subscribe((res: any) => {
      
      this.adMatches = res?.data.map((ad) => {
        return {
          Scene : {
            relativeSceneNo: ad.relativeSceneNo,
            startTime : ad.startTime,
            sceneId: ad.sceneId,
            id: ad.id,
            endTime: ad.endTime,
            taggingStatusId: ad.taggingStatusId,
            taggingStatusValue: ad.taggingStatusValue,

            
          },
          thumbnail: ad.thumbnail,
          products: ad.products
        }
        
      })
      //this.adMatches = res?.data
      this.selectedScene = this.adMatches.find(scene => scene.products.length > 0)?.relativeSceneNo - 1; 
      console.log(this.adMatches, "AD MATCHES") 
      this.loading = false;
  });
  }

  get scenesArray() {
    return Array(this.totalScenes).fill(0).map((x, i) => i);
  }

  changeShow(showId:any){
    const activeModal = this.modalService.open(MediaBuysModalComponent, {
      windowClass: "modal-md",
      backdrop: "static",
      keyboard: true,
      centered: true,
    })
    //console.log(this.trendingShows)
    activeModal.componentInstance.trendingShows = this.trendingShows
    activeModal.componentInstance.videoChange.subscribe((selectedData) => {
      // Use the emitted showId and episodeId
      this.showId = selectedData.showId;
      this.episodeId = selectedData.episodeId;
      
      this.thumbnail = this.trendingShows.find(show => show.id === this.showId).thumbnail
      this.title = selectedData.title
      this.seasonNo = selectedData.seasonNo
      this.episodeNo = selectedData.episodeNo
      
      this.episodeTitle = this.trendingShows.find(show => show.id === this.showId).Episodes.find(episode => episode.id === this.episodeId).title
      this.totalScenes = this.trendingShows.find(show => show.id === this.showId).Episodes.find(episode => episode.id === this.episodeId).totalScenes
    
      this.computeAdRevenue()
      this.getAdvertisersMatchesByShowId(this.episodeId)
    });
    
  }

  exportPDF(){
    this.modalService.open(ExportPDFModalComponent, {
      windowClass: "modal-md",
      backdrop: "static",
      keyboard: true,
      centered: true,
    })
    
    const user = localStorage.getItem('userId');
    console.log(localStorage)
    this.apiService.sendRequest(requests.sendMediaBuyEmail, 'post', {
      userId: user,
      showId: this.showId, 
      retailerId: this.retailerId, 
      episodeId:this.episodeId,
      totalViews: this.totalViews,
      impressionCPM: this.impressionCPM,
      CPC: this.CPC,
      retargetingCPM: this.retargetingCPM,
      savePercentage: this.savePercentage,
      clickPercentage: this.clickPercentage,
      adImpressionPerPause: this.adImpressionPerPause,
      avgPausesPerVideo: this.avgPausesPerVideo,
      shoppingConversionRate: this.shoppingConversionRate,
      retargetingViews: this.retargetingViews
    }).subscribe((res: any) => {
     
    })
  }

  computeAdRevenue() {
    

    this.advertisers = this.advertisers.map(advertiser => {
      const penetration = advertiser.matches / this.totalScenes;
      const pauseAdViewed = this.totalViews * this.adImpressionPerPause * penetration * this.avgPausesPerVideo;
      const pauseAdRevenue = pauseAdViewed / 1000 * this.impressionCPM;
      const totalSaves = this.savePercentage * pauseAdViewed;
      const wishlistViews = totalSaves * this.shoppingConversionRate;
      const retargetingAdRevenue = wishlistViews * this.retargetingViews * this.retargetingCPM / 1000;
      const totalClicks = totalSaves * this.retargetingViews * this.clickPercentage;
      const clickRevenue = totalClicks * this.CPC;

      return {
        ...advertiser,
        totalRevenue: pauseAdRevenue + retargetingAdRevenue + clickRevenue
      };
    });

}


  changeSettings(){
    const activeModal = this.modalService.open(RevenueCalculatorModalComponent, {
      windowClass: "modal-lg",
      backdrop: "static",
      keyboard: true,
      centered: true,
    })

    activeModal.componentInstance.totalViews = this.totalViews
    activeModal.componentInstance.impressionCPM = this.impressionCPM
    activeModal.componentInstance.CPC = this.CPC
    activeModal.componentInstance.retargetingCPM = this.retargetingCPM
    activeModal.componentInstance.savePercentage = this.savePercentage *100
    activeModal.componentInstance.clickPercentage = this.clickPercentage *100
    activeModal.componentInstance.adImpressionPerPause = this.adImpressionPerPause
    activeModal.componentInstance.avgPausesPerVideo = this.avgPausesPerVideo
    activeModal.componentInstance.retargetingViews = this.retargetingViews
    activeModal.componentInstance.shoppingConversionRate = this.shoppingConversionRate * 100

    activeModal.componentInstance.numbers.subscribe((selectedData) => {
      // Use the emitted showId and episodeId
      this.totalViews = selectedData.totalViews;
      this.impressionCPM = selectedData.impressionCPM;
      this.CPC = selectedData.CPC;
      this.retargetingCPM = selectedData.retargetingCPM;
      this.savePercentage = selectedData.savePercentage/100;
      this.clickPercentage = selectedData.clickPercentage/100;
      this.adImpressionPerPause = selectedData.adImpressionPerPause;
      this.avgPausesPerVideo = selectedData.avgPausePerVideo;
      this.shoppingConversionRate = selectedData.shoppingConversionRate/100;
      this.computeAdRevenue()
    });
  }

  gotoScene(index){
    this.selectedScene = index;
    let realdIndex = 0
    for(let i=0; i<index; i++){
      for(let j=0; j<this.adMatches[i].products.length; j++){
        realdIndex++
      }
    }
    const adPlacementElements = this.adPlacements.toArray();
    if (adPlacementElements[realdIndex]) {
      const element = adPlacementElements[realdIndex].nativeElement;

      // Use scrollIntoView to scroll the element into view within the scrollable container
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    this.adPlacements.forEach((placement, i) => {
      const element = placement.nativeElement;
      
      if (i === realdIndex) {
        // Apply the highlight style
        this.renderer.setStyle(element, 'backgroundColor', '#E6F7FF');  // Use your desired highlight color
        //this.renderer.setStyle(element, 'opacity', '1');
        //this.renderer.setStyle(element, 'transition', 'opacity 5s');
  
        // Set a timeout to fade out the highlight
        setTimeout(() => {
  
          // Optionally, reset the background color after the fade-out effect completes
          setTimeout(() => this.renderer.removeStyle(element, 'backgroundColor'), 5000);  // Timing should match the transition
        }, 3000);  // Adjust the duration as needed
      } else {
        // For all other elements, ensure they are not highlighted
        this.renderer.removeStyle(element, 'backgroundColor');
        this.renderer.removeStyle(element, 'opacity');
      }
    });
  
  }

  setVideoData(scene, proxyCoorddinateId, flag?:boolean){
    // this.userService
    if(flag){
      //this.userService.scene.next(scene)
      //this.userService.proxyCoorddinateId.next(proxyCoorddinateId)
      localStorage.setItem('scene', JSON.stringify(scene));
      localStorage.setItem('proxyCoorddinateId', proxyCoorddinateId);
      localStorage.setItem('retailerId', this.retailerId)
    }
    //this.router.navigate(['user/player/'+this.episodeId])
    window.open('/user/player/'+ this.episodeId, '_blank');
  }

  private loadImageAsBase64(url: string, maxWidth: number, maxHeight: number): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous'; // Needed for external URLs
        img.onload = () => {
            // Create a canvas with the desired dimensions
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Calculate the new dimensions
            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // Convert to base64
            const dataURL = canvas.toDataURL('image/png');
            resolve(dataURL);
        };
        img.onerror = () => reject(new Error(`Failed to load image at ${url}`));
        img.src = url;
    });
}


//this works
  // async exportPDF(): Promise<void> {
    
  //   const documentDefinition = {
  //     content: [],
  //     styles: {
  //       header: {
  //         fontSize: 18,
  //         bold: true,
  //         margin: [0, 0, 0, 10]
  //       },
  //       tableHeader: {
  //         bold: true,
  //         fontSize: 13,
  //         color: 'black'
  //       }
  //     }
  //   };

  //   // Table structure
  //   const table = {
  //     table: {
  //       headerRows: 1,
  //       widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
  //       body: [
  //         [
  //           { text: 'Scene No', style: 'tableHeader' },
  //           { text: 'Scene', style: 'tableHeader' },
  //           { text: 'Contextual Ad', style: 'tableHeader' },
  //           { text: 'Product Name', style: 'tableHeader' },
  //           { text: 'Price', style: 'tableHeader' }
  //         ],
  //         // Rows will be added here dynamically
  //       ]
  //     }
  //   };

  //   // Dynamically add rows to the table
  //   for (const match of this.adMatches) {
  //     for (const product of match.products) {
  //       const sceneImage = await this.loadImageAsBase64(match.thumbnail,100,60);
  //       const productImage = await this.loadImageAsBase64(product.matchedImageUrl,40,40);

  //       const row = [
  //         match.relativeSceneNo.toString(),
  //         { image: sceneImage, width: 50 },
  //         { image: productImage, width: 50 },
  //         product.title,
  //         product.actualPrice
  //       ];

  //       table.table.body.push(row);
  //     }
  //   }

  //   documentDefinition.content.push(table);

  //   // Create and download the PDF
  //   console.log("READU TO DOWNLOAD")
  //   pdfMake.createPdf(documentDefinition).download('proposed-media-buy.pdf');
  // }

  
  // captureFirstPartAndInitializePDF(): Promise<jsPDF> {
  //   return new Promise((resolve, reject) => {
  //     const data = document.getElementById('exportable-content'); // Adjust this to the id of your first content part
  //     html2canvas(data, {useCORS: true}).then(canvas => {
  //       const imgWidth = 208; // or any other width you need
  //       const imgHeight = canvas.height * imgWidth / canvas.width;
  
  //       const contentDataURL = canvas.toDataURL('image/png');
  //       const pdf = new jsPDF('p', 'mm', 'a4');
  //       pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
  //       resolve(pdf);
  //     }).catch(error => {
  //       reject(error);
  //     });
  //   });
  // }

  // async addTableToPDF(pdf: jsPDF): Promise<void> {
  //   // Assuming rowChunks is already populated with chunks of ElementRef objects
  //   const rowChunks = this.createRowChunks();
  
  //   // Iterate over each chunk
  //   for (let i = 0; i < rowChunks.length; i++) {
  //     const chunk = rowChunks[i];
  
  //     // Create a temporary container for the current chunk
  //     const tempContainer = document.createElement('div');
  //     tempContainer.style.display = 'inline-block'; // Ensure the container and its children are laid out correctly
  
  //     // Append cloned native elements of the current chunk to the temporary container
  //     chunk.forEach(elementRef => {
  //       const clonedElement = elementRef.nativeElement.cloneNode(true);
  //       tempContainer.appendChild(clonedElement);
  //     });

  //     console.log(tempContainer, "TEMP CONTAINER")
  
  //     // Use html2canvas to take a snapshot of the temporary container
  //     const canvas = await html2canvas(tempContainer, { useCORS: true, scale: 1 });
  
  //     // Add a new page for each chunk except the first one
  //     if (i > 0) {
  //       pdf.addPage();
  //     }
  
  //     const imgData = canvas.toDataURL('image/png');
  //     const imgWidth = 208; // or any other width you need
  //     const imgHeight = canvas.height * imgWidth / canvas.width;
  
  //     // Add the canvas image to the PDF
  //     pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  //   }
  // }
  
  // createRowChunks(): any[] {
  //   // Your logic to create chunks from this.uniqueAdRow.toArray()
  //   // Make sure it returns an array of arrays of ElementRef objects
  //   const rows = this.uniqueAdRow.toArray(); // Adjust this to your row class
  //   const rowChunks = [];
    
  //   // Chunk the rows into groups of 10
  //   for (let i = 0; i < rows.length; i += 10) {
  //     const chunk = rows.slice(i, i + 10);
  //     rowChunks.push(chunk);
  //   }
  
  //   return rowChunks;
  // }

  
  
  
  // setTableBodyHeightAuto(): void {
  //   const tableBodies = document.getElementsByClassName('unique-table-body');
  //   Array.from(tableBodies).forEach((tableBody: Element) => {
  //     (tableBody as HTMLElement).style.height = 'auto';
  //     (tableBody as HTMLElement).style.overflowY = 'unset'; // 'unset' might work better than 'visible' depending on your layout
  //   });
  // }
  
  // setTableBodyHeight67vh(): void {
  //   const tableBodies = document.getElementsByClassName('unique-table-body');
  //   Array.from(tableBodies).forEach((tableBody: Element) => {
  //     (tableBody as HTMLElement).style.height = '67vh';
  //     (tableBody as HTMLElement).style.overflowY = 'auto';
  //   });
  // }
  
  // async printDocument(): Promise<void> {
  //   this.setTableBodyHeightAuto();
  //   try {
  //     const pdf = await this.captureFirstPartAndInitializePDF();
  //     await this.addTableToPDF(pdf);
  //   console.log("READU TO DOWNLOAD")
  //     pdf.save('document.pdf'); // Save the PDF
  //   } catch (error) {
  //     console.error('Error generating the PDF:', error);
  //   } finally {

  //     this.setTableBodyHeight67vh(); // Revert the table body height after PDF operations
  //   }
  // }
  
  
  

  // exportPDF(): void {
  //   const data = document.getElementById('exportable-content'); // Your HTML container ID here
  //   html2canvas(data, { useCORS: true }).then(canvas => {
  //     const contentDataURL = canvas.toDataURL('image/png');
  //     const pdf = new jsPDF('p', 'mm', 'a4'); // Creates a new PDF document
  //     const pageWidth = pdf.internal.pageSize.getWidth();
  //     const pageHeight = pdf.internal.pageSize.getHeight();
  //     const widthRatio = pageWidth / canvas.width;
  //     const heightRatio = pageHeight / canvas.height;
  //     const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;
  //     const canvasWidth = canvas.width * ratio;
  //     const canvasHeight = canvas.height * ratio;
  //     const marginX = (pageWidth - canvasWidth) / 2;
  //     const marginY = (pageHeight - canvasHeight) / 2;
  //     pdf.addImage(contentDataURL, 'PNG', marginX, marginY, canvasWidth, canvasHeight);
  
  //     // Preload images for the table, then generate the table
  //     this.preloadImages(this.adMatches).then(preloadedAdMatches => {
  //       const bodyContent = preloadedAdMatches.flatMap(adMatch => 
  //         adMatch.products.map(product => ({
  //           sceneNo: ('0000' + adMatch.relativeSceneNo).slice(-4),
  //           sceneImage: adMatch.sceneImage, // Use the preloaded sceneImage directly
  //           adImage: product.adImage, // Use the preloaded adImage directly
  //           productName: product.title,
  //           price: product.actualPrice
  //         }))
  //       );
      
  //       // Define columns for the table
  //       const columns = [
  //         { header: 'Scene No', dataKey: 'sceneNo' },
  //         { header: 'Scene', dataKey: 'sceneImage' },
  //         { header: 'Contextual Ad', dataKey: 'adImage' },
  //         { header: 'Product Name', dataKey: 'productName' },
  //         { header: 'Price', dataKey: 'price' }
  //       ];
      
  //       // Add the table to the PDF
  //       pdf.autoTable({
  //         columns: columns,
  //         body: bodyContent,
  //         startY: marginY + canvasHeight + 10, // Add a small margin after the image
  //         theme: 'grid',
  //         didDrawCell: (data) => {
  //           if ((data.column.dataKey === 'sceneImage' || data.column.dataKey === 'adImage') && data.cell.raw instanceof Image) {
  //             const imgData = data.cell.raw;
  //             pdf.addImage(imgData, 'png', data.cell.x, data.cell.y, data.cell.width, data.cell.height);
  //           }
  //         },
  //         didParseCell: data => {
  //           // Implement cell parsing logic as needed
  //         },
  //         margin: { top: 10, right: 10, bottom: 10, left: 10 },
  //         // Ensure the text is not overflowing the cell
  //         styles: { cellWidth: 'wrap' },
  //         columnStyles: {
  //           sceneNo: { cellWidth: 'auto' },
  //           productName: { cellWidth: 'auto' },
  //           price: { cellWidth: 'auto' },
  //           // Set the width for image columns to fit the image
  //           sceneImage: { cellWidth: 40 }, // Adjust the width to match the image width
  //           adImage: { cellWidth: 30 } // Adjust the width to match the image width
  //         }
  //       });
      
  //       pdf.save('document.pdf'); // Generates PDF and prompts download
  //     });
  //   });
  // }
  
  // async preloadImages(adMatches: any[]): Promise<any[]> {
  //   return Promise.all(adMatches.map(async (adMatch) => {
  //     // Load and resize the scene image
  //     const sceneImage = await this.loadImage(adMatch.thumbnail, 100, 60).catch(() => null);
  //     console.log(sceneImage, "SCENE IMAGE")
  //     // Load and resize product images
  //     const productsWithPreloadedImages = await Promise.all(adMatch.products.map(async (product) => {
  //       const adImage = await this.loadImage(product.matchedImageUrl, 60, 60).catch(() => null);
  //       return { ...product, adImage };
  //     }));
  //     return { ...adMatch, sceneImage, products: productsWithPreloadedImages};
  //   }));
  // }
  
  
  
  // loadImage(url: string, maxWidth: number, maxHeight: number): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     const img = new Image();
  //     img.crossOrigin = 'Anonymous'; // Handle CORS
  //     img.onload = () => {
  //       // Create a canvas and set its width and height
  //       const canvas = document.createElement('canvas');
  //       let width = img.width;
  //       let height = img.height;
  
  //       // Calculate the new size maintaining aspect ratio
  //       const ratio = Math.min(maxWidth / width, maxHeight / height);
  //       width = width * ratio;
  //       height = height * ratio;
  
  //       canvas.width = width;
  //       canvas.height = height;
  
  //       // Draw the image onto the canvas
  //       const ctx = canvas.getContext('2d');
  //       ctx.drawImage(img, 0, 0, width, height);
  
  //       // Convert the canvas to a data URL and resolve the promise
  //       resolve(canvas.toDataURL('image/jpeg', 0.7)); // Use a lower quality to reduce size
  //     };
  //     img.onerror = () => {
  //       console.error('Error loading image:', url);
  //       reject(new Error(`Failed to load image at ${url}`));
  //     };
  //     img.crossOrigin = 'anonymous';
  //     img.src = url;
  //   });
  // }
  
  
  
  
  

  ngOnDestroy() {
    // Unsubscribe to ensure no memory leaks
    if (this.videoChangeSubscription) {
      this.videoChangeSubscription.unsubscribe();
    }
  }
}
