import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'name'
})
export class NamePipe implements PipeTransform {

  transform(value: string): any {
    if(!value || value.length == 0) return value
    const splitted = value.split(' ')
    let str = splitted[0] + ' '
    str += splitted.length >= 4 ? splitted[2] : splitted[1]
    return str;
  }

}
