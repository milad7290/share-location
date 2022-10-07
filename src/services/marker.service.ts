import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Map, marker as leafMarker } from 'leaflet';
import { PopupService } from './popup.service';

@Injectable({
   providedIn: 'root',
})
export class MarkerService {
   capitals: string = '/assets/json/capitals.json';

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
}
