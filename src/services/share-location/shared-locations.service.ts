import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ShareLocationModel } from 'src/models/forms/share-location.model';
import { StorageService } from '../storage.service';

@Injectable({
   providedIn: 'root',
})
export class SharedLocationsService {
   sharedLocations: ShareLocationModel[] = [];
   localStorageKey = 'locations';
   private sharedLocationSource = new BehaviorSubject<ShareLocationModel[]>(
      this.sharedLocations,
   );

   sharedLocationSourceObservable = this.sharedLocationSource.asObservable();

   private sharedLocationForUpdate =
      new BehaviorSubject<ShareLocationModel | null>(null);

   sharedLocationForUpdateObservable =
      this.sharedLocationForUpdate.asObservable();

   constructor(private storageService: StorageService) {
      const locations: ShareLocationModel[] | null =
         this.storageService.getItem(this.localStorageKey);

      if (locations && locations.length > 0) {
         this.sharedLocationSource.next(locations);
         this.sharedLocations = locations;
      }
   }

   setLocationForUpdate(id: string) {
      const foundLocation = this.sharedLocations.find((item) => item.id === id);

      if (foundLocation) {
         this.sharedLocationForUpdate.next(foundLocation);
      } else {
         this.sharedLocationForUpdate.next(null);
      }
   }

   addNewLocation(location: ShareLocationModel) {
      this.sharedLocations.push(location);
      this.sharedLocationSource.next(this.sharedLocations);
      this.storageService.setItem(this.localStorageKey, this.sharedLocations);
   }

   updateNewLocation(location: ShareLocationModel) {
      const updatedLocations = this.sharedLocations.map((item) => {
         if (location.id === item.id) {
            return location;
         }
         return item;
      });

      this.sharedLocationSource.next(updatedLocations);
      this.sharedLocationForUpdate.next(null);
      this.storageService.setItem(this.localStorageKey, updatedLocations);
   }
}
