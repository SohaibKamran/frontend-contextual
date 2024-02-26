import { Injectable } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { ErrorMessages } from '../data/errorsMessages';
@Injectable({
  providedIn: 'root'
})
export class GenericValidatorService {
  
  constructor() {}

  processMessages(container: FormGroup,submit:boolean,dynamicForms:boolean): {[key: string]: string } {
    const messages = {};
    for (const controlKey in container.controls) {

      if (container.controls.hasOwnProperty(controlKey)) {
        const controlProperty = container.controls[controlKey];
        if (controlProperty instanceof FormGroup) {
          const childMessages = this.processMessages(controlProperty,true,dynamicForms);
          Object.assign(messages, childMessages);
        } else {
          
          if (ErrorMessages[controlKey] && !dynamicForms) {
            messages[controlKey] = '';
            if (((controlProperty.dirty || controlProperty.touched) && controlProperty.errors) || (submit && controlProperty.errors)) {
              Object.keys(controlProperty.errors).map(messageKey => {
                if(controlProperty.errors['minlength'] && messageKey=='minlength')
                {
                  messages[controlKey] +='<span>Minimum '+controlProperty.errors['minlength'].requiredLength+' Characters'+ "</span><br>";
                }
                else if(controlProperty.errors['maxlength'] && messageKey=='maxlength'){
                  
                  messages[controlKey] +='<span>Maximum '+controlProperty.errors['maxlength'].requiredLength+' Characters'+ "</span><br>";
                  
                }
                else{
                  if (ErrorMessages[controlKey][messageKey]) {
                   
                    messages[controlKey] += '<span>'+ErrorMessages[controlKey][messageKey] + "</span><br>";
                  }
                }
              });
            }
          }
          else{

            if (controlProperty instanceof FormArray) {
              if (controlProperty.controls[0] instanceof FormGroup) {
                const childMessages = this.processMessages(controlProperty.controls[0],true,dynamicForms);
                Object.assign(messages, childMessages);
                
              }
            }
           
            if (((controlProperty.dirty || controlProperty.touched) && controlProperty.errors) || (submit && controlProperty.errors)) {
              // console.log('errors',controlProperty.errors);
              if(controlProperty.errors.required){
                messages[controlKey]= '<span>This Field Required</span><br>';
              }
              if (controlProperty.errors.maxlength) {
                // // console.log("max", controlProperty.errors.maxlength);
                messages[controlKey] ='<span>Maximum '+controlProperty.errors['maxlength'].requiredLength+' Characters'+ "</span><br>";
              }
              if (controlProperty.errors.minlength) {
                // // console.log("max", controlProperty.errors.minlength);
                messages[controlKey] ='<span>Minimum '+controlProperty.errors['minlength'].requiredLength+' Characters'+ "</span><br>";
              }
               if (!controlProperty.errors.maxlength && controlProperty.errors.pattern) {
                messages[controlKey] ='<span>Invalid Pattern</span><br>';
              }
              if (controlProperty.errors.requireOneCheckboxToBeChecked){
                messages[controlKey] ='<span>At least one right is required to check/span><br>';
              }
              // if (ErrorMessages[controlKey]['pattern']) {
                   
              //   messages[controlKey] += '<span>'+ErrorMessages[controlKey]['pattern'] + "</span><br>";
              // }
                
            }
          }
        }
      }
    }
    return messages;
  }
}
