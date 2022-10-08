import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
   private get ourStorage(): Storage {
      return localStorage;
   }

   setItem(key: string, value: any) {
      this.ourStorage.setItem(key, JSON.stringify(value));
   }

   getItem(key: string): any {
      const value: any = this.ourStorage.getItem(key);
      if (!value) {
         return null;
      }
      const _value = JSON.parse(value);

      return _value;
   }

   removeItem(key: string) {
      this.ourStorage.removeItem(key);
   }
}
