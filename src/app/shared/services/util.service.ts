import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  range = (start: number, end: number): number[] => {
    return [...Array(end - start).keys()].map(key => key + start);
  }

  pluck = (element: any[], field: string): any[] => {
    return element.map(el => el[field]);
  }
}
