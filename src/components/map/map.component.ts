import { AfterViewInit, Component } from '@angular/core';
import { icon, Map, map, Marker, tileLayer } from 'leaflet';
import { Subscription } from 'rxjs';
import { ShareLocationModel } from 'src/models/forms/share-location.model';
import { SharedLocationsService } from 'src/services/share-location/shared-locations.service';
import { MarkerService } from '../../services/share-location/marker.service';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = icon({
   iconRetinaUrl,
   iconUrl,
   shadowUrl,
   iconSize: [25, 41],
   iconAnchor: [12, 41],
   popupAnchor: [1, -34],
   tooltipAnchor: [16, -28],
   shadowSize: [41, 41],
});
Marker.prototype.options.icon = iconDefault;

@Component({
   selector: 'app-map',
   templateUrl: './map.component.html',
   styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {
   private map: Map;

   sharedLocations: ShareLocationModel[] = [];
   subscription: Subscription;
   constructor(
      private markerService: MarkerService,
      private sharedLocationsService: SharedLocationsService,
   ) {}

   private initMap(): void {
      this.map = map('map', {
         center: [29.8282, -28.5795],
         zoom: 3,
      });

      const tiles = tileLayer(
         'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
         {
            maxZoom: 18,
            minZoom: 3,
            attribution:
               '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
         },
      );

      tiles.addTo(this.map);

      this.subscription =
         this.sharedLocationsService.sharedLocationSourceObservable.subscribe(
            (locations) => {
               this.markerService.clearAllLocationMark();
               this.sharedLocations = locations;
               this.markerService.markSpecificLocations(
                  this.map,
                  this.sharedLocations,
               );
            },
         );
   }

   ngAfterViewInit(): void {
      this.initMap();
   }
}
