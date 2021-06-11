import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor() {}

  public ascending(obj1: any, obj2: any, key: string): number {
    const first = obj1[key].toUpperCase();
    const second = obj2[key].toUpperCase();
    if (first < second) {
      return -1;
    }
    if (first > second) {
      return 1;
    }
    return 0;
  }

  public descending(obj1: any, obj2: any, key: string): number {
    const first = obj1[key].toUpperCase();
    const second = obj2[key].toUpperCase();
    if (first > second) {
      return -1;
    }
    if (first < second) {
      return 1;
    }
    return 0;
  }

  public addMissingValues(source: any, target: any): void {
    for (const key in source) {
      if (!target[key] && key !== 'editMode') {
        target[key] = source[key];
      }
    }
  }
}
