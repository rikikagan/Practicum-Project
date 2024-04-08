import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate',
  standalone: true
})
export class CustomDatePipe implements PipeTransform {

  transform(value: any): any {
    if (value) {
      const datePipe = new DatePipe('en-US');
      return datePipe.transform(value, 'dd/MM/yyyy'); // כאן ניתן לשנות את הפורמט לפי הצורך
    }
    return '-';
  }

}
