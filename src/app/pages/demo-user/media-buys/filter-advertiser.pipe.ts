import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterAdvertiser'
})
export class FilterAdvertiserPipe implements PipeTransform {

  transform(advertisers: any[], searchText: string): any[] {
    if (!advertisers || !searchText) {
      return advertisers;
    }

    return advertisers.filter(advertiser => 
      advertiser.Retailer.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }

}
