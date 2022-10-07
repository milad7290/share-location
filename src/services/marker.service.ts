import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { layerGroup, Map, marker as leafMarker } from 'leaflet';
import { PopupService } from './popup.service';

@Injectable({
   providedIn: 'root',
})
export class MarkerService {
   capitals: string = '/assets/json/capitals.json';

   layerGroup;
   constructor(private http: HttpClient, private popupService: PopupService) {}

   makeCapitalMarkers(map: Map): void {
      this.http.get(this.capitals).subscribe((res: any) => {
         for (const c of res.features) {
            const lon = c.geometry.coordinates[0];
            const lat = c.geometry.coordinates[1];
            const marker = leafMarker([lat, lon]);

            marker.bindPopup(this.popupService.makeCapitalPopup(c.properties));
            marker.addTo(map);
         }
      });
   }

   makeLocationMark(
      map: Map,
      location: { latitude: number; longitude: number },
   ): void {
      const lon = location.longitude;
      const lat = location.latitude;
      const marker = leafMarker([lat, lon]);

      this.layerGroup = layerGroup().addTo(map);

      marker.addTo(this.layerGroup);
   }

   clearLocationMark() {
      if (this.layerGroup) {
         this.layerGroup.clearLayers();
         this.layerGroup = undefined;
      }
   }
}
