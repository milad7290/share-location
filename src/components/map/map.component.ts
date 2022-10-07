import { AfterViewInit, Component, OnInit } from '@angular/core';
import { icon, Map, map, Marker, tileLayer } from 'leaflet';
import { MarkerService } from '../../services/marker.service';

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
export class MapComponent implements OnInit, AfterViewInit {
   private map: Map;

   private initMap(): void {
      this.map = map('map', {
         center: [39.8282, -98.5795],
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

      this.map.on('click', (e) => {
         console.log('e.latlng',e.latlng); // e is an event object (MouseEvent in this case)
      });
   }
   constructor(private markerService: MarkerService) {}

   ngOnInit(): void {}

   ngAfterViewInit(): void {
      this.initMap();
      this.markerService.makeCapitalMarkers(this.map);
   }
}
