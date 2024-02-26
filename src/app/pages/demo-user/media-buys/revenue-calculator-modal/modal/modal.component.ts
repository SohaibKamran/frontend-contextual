import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbDropdown, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  providers: [DecimalPipe]
})
export class RevenueCalculatorModalComponent {
  @Input() totalViews
  @Input() impressionCPM: number;
  @Input() CPC: number;
  @Input() retargetingCPM: number;
  @Input() savePercentage: number;
  @Input() clickPercentage: number;
  @Input() adImpressionPerPause: number;
  @Input() avgPausesPerVideo: number;
  @Input() shoppingConversionRate: number;
  @Input() retargetingViews: number;

   @Output() numbers = new EventEmitter<any>();

    constructor(private activeModal: NgbActiveModal, private decimalPipe: DecimalPipe) { }


  computeRevenue(){
    this.numbers.emit({
      totalViews: this.totalViews,
      impressionCPM: this.impressionCPM,
      CPC: this.CPC,
      retargetingCPM: this.retargetingCPM,
      savePercentage: this.savePercentage,
      clickPercentage: this.clickPercentage,
      adImpressionPerPause: this.adImpressionPerPause,
      avgPausePerVideo: this.avgPausesPerVideo,
      retargetingViews: this.retargetingViews,
      shoppingConversionRate: this.shoppingConversionRate
    })
    this.CloseModal()
  }

  CloseModal() {
    this.activeModal.close('close')
  }

  getDefaultSettings(){
    this.totalViews = 1000000
    this.impressionCPM = 35.00
    this.CPC = 1.00
    this.retargetingCPM = 70.00
    this.savePercentage = 10
    this.clickPercentage = 10
    this.adImpressionPerPause = 2
    this.avgPausesPerVideo = 2
    this.shoppingConversionRate = 20
    this.retargetingViews = 3
    //console.log("Default Settings", this.totalViews, this.impressionCPM, this.CPC, this.retargetingCPM, this.savePercentage, this.clickPercentage, this.adImpressionPerPause, this.avgPausesPerVideo, this.shoppingConversionRate, this.retargetingViews)
    //this.computeRevenue()
  }

  formatNumber(value: number): string {
    return this.decimalPipe.transform(value, '1.0-0');
  }

  // Method to parse the formatted string back into a raw number and update the model
  parseNumber(event: Event, property: string): void {
    // Cast the event.target to an HTMLInputElement to access its value
    const input = event.target as HTMLInputElement;
    const rawNumber = Number(input.value.replace(/[^0-9.-]+/g, ''));
    this[property] = rawNumber;
  }


  formatPercentage(value: number): string {
    // Check for null and undefined
    if (value == null) {
      return '';
    }
    // Format the number as a percentage without the "%" symbol
    // as the DecimalPipe doesn't add it by default
    const formatted = this.decimalPipe.transform(value, '1.0-2');
    // Return the formatted string with a "%" symbol appended
    return formatted ? `${formatted}%` : '';
  }

  // Method to parse the percentage string back into a raw number
  parsePercentage(event: Event, property: string): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    // Remove the "%" symbol and any non-numeric characters before parsing
    const rawNumber = Number(value.replace(/[^0-9.]+/g, ''));
    // Update the appropriate property with the raw number value
    this[property] = rawNumber;
  }

  // Method to format the currency and add a "$" symbol
  formatCurrency(value: number): string {
    // Check for null and undefined
    if (value == null) {
      return '';
    }
    // Format the number as currency
    const formatted = this.decimalPipe.transform(value, '1.2-2');
    // Return the formatted string with a "$" symbol appended
    return formatted ? `$${formatted}` : '';
  }

  // Method to parse the currency string back into a raw number
  parseCurrency(event: Event, property: string): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    // Remove the "$" symbol and any non-numeric characters before parsing
    const rawNumber = Number(value.replace(/[^0-9.]+/g, ''));
    // Update the appropriate property with the raw number value
    this[property] = rawNumber;
  }

  
  
}



