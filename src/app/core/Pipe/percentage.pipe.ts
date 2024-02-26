import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentage',
  standalone:true
})
export class PercentagePipe implements PipeTransform {

  transform(value: any): unknown {
    return parseInt(value);
  }

}
