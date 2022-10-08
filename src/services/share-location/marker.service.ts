import { Injectable } from '@angular/core';
import { layerGroup, Map, marker as leafMarker } from 'leaflet';
import { ShareLocationModel } from 'src/models/forms/share-location.model';
import { PopupService } from './popup.service';
import { SharedLocationsService } from './shared-locations.service';

@Injectable({
   providedIn: 'root',
})
export class MarkerService {
   layerGroupSelectedLocation;
   layerGroupMainMap;

   constructor(
      private popupService: PopupService,
      private sharedLocationsService: SharedLocationsService,
   ) {}

   markSpecificLocations(map: Map, locations: ShareLocationModel[]): void {
      const _this = this;
      for (const location of locations) {
         const lon = location.selectedLocation.longitude;
         const lat = location.selectedLocation.latitude;
         const marker = leafMarker([lat, lon]);

         marker
            .bindPopup(this.popupService.makeLocationPopup(location))
            .on('popupopen', (a) => {
               var popUp = a.target.getPopup();
               popUp
                  .getElement()
                  .querySelector('.editBtn')
                  .addEventListener('click', (e) => {
                     _this.editLocation(location.id);
                  });
            });
         this.layerGroupMainMap = layerGroup().addTo(map);

         marker.addTo(this.layerGroupMainMap);
      }
   }

   markSpecificLocation(
      map: Map,
      location: { latitude: number; longitude: number },
   ): void {
      const lon = location.longitude;
      const lat = location.latitude;
      const marker = leafMarker([lat, lon]);

      this.layerGroupSelectedLocation = layerGroup().addTo(map);

      marker.addTo(this.layerGroupSelectedLocation);
   }

   editLocation(id: string) {
      this.sharedLocationsService.setLocationForUpdate(id);
   }

   clearLocationMark() {
      if (this.layerGroupSelectedLocation) {
         this.layerGroupSelectedLocation.clearLayers();
         this.layerGroupSelectedLocation = undefined;
      }
   }

   clearAllLocationMark() {
      if (this.layerGroupMainMap) {
         this.layerGroupMainMap.clearLayers();
         this.layerGroupMainMap = undefined;
      }
   }
}
