import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor() {}

  /**
   * function used to sort array of objects in ascending order
   * @param obj1 first object
   * @param obj2 second object
   * @param key sorting based on key
   * @returns sorting order ascending
   */
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

  /**
   * function used to sort array of objects in descending order
   * @param obj1 first object
   * @param obj2 second object
   * @param key sorting based on key
   * @returns sorting order descending
   */
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

  /**
   * function used to add any missing keys from source to target object
   * @param source source object
   * @param target target object
   */
  public addMissingValues(source: any, target: any): void {
    for (const key in source) {
      if (!target[key] && key !== 'editMode') {
        target[key] = source[key];
      }
    }
  }
}
