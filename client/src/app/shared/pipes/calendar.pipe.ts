import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment'

@Pipe({
  name: 'calendar'
})
export class CalendarPipe implements PipeTransform {

  transform(date: string, ...args: any[]): any {
    if(!date) return date
    moment.locale('es')
    const parsed = moment(date)
    const today = moment()
    if(parsed.date() < today.date() - 1 || parsed.date() > today.date() + 6) {
      return parsed.format('D MMM h:mma')
    }
    const calendar = parsed.calendar(null, {
      sameDay: '[Hoy], h:mma',
      nextDay: '[Mañana], h:mma',
      nextWeek: 'dddd, h:mma',
      lastDay: '[Ayer], h:mma'
    })
    return calendar.charAt(0).toUpperCase() + calendar.slice(1)
  }

}
