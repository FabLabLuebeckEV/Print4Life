import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  public createCheckDate(date: { year: number, month: number, day: number }) {
    if (date && date.year &&
      date.month && date.day) {
      return new Date(date.year + '-'
        + date.month + '-' + date.day);
    } else {
      return undefined;
    }
  }

  public validateDate(startDay: { year: number, month: number, day: number }, endDay: { year: number, month: number, day: number }) {
    // check if start date is before end date
    if (startDay && endDay) {
      const startDate = this.createCheckDate(startDay);
      const endDate = this.createCheckDate(endDay);
      if (startDate && endDate && startDate > endDate) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }

  }

  public validateTime(startDate: Date, endDate: Date,
    startTime: { hour: number, minute: number }, endTime: { hour: number, minute: number }) {
    if (startDate && endDate && startTime && endTime) {
      // check if on the same day the start time is before the end time
      // else check if start time and end time is between 0 to 23 hours and 0 to 59 minutes
      if (startDate.valueOf() - endDate.valueOf() === 0 &&
        ((startTime.minute > endTime.minute && startTime.hour === endTime.hour) || startTime.hour > endTime.hour)) {
        return true;
      } else if (startTime.hour && startTime.minute && endTime.hour && endTime.minute
        && startTime.hour < 0 || startTime.hour > 23 || endTime.hour < 0 || endTime.hour > 23 || startTime.minute < 0
        || endTime.minute < 0 || startTime.minute > 59 || endTime.minute > 59
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
