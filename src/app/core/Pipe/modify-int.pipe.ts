import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'modifyInt',
  standalone:true
})
export class ModifyIntPipe implements PipeTransform {

  transform(num,type): unknown {
    type=type.toUpperCase()
    return num<10?type+"0"+num:type+num
  }

}
