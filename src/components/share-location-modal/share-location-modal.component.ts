import {
   AfterViewInit,
   Component,
   ElementRef,
   EventEmitter,
   OnInit,
   Output,
   ViewChild
} from '@angular/core';
import { icon, LatLng, Map, map, Marker, tileLayer } from 'leaflet';
import { ShareLocationModel } from 'src/models/forms/share-location.model';
import { MarkerService } from 'src/services/marker.service';

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
   selector: 'app-share-location-modal',
   templateUrl: './share-location-modal.component.html',
   styleUrls: ['./share-location-modal.component.css'],
})
export class ShareLocationModalComponent implements OnInit, AfterViewInit {
   @ViewChild('logoInput') logoInput: ElementRef;

   @Output()
   onModalClosed = new EventEmitter<string>();

   types = [
      {
         name: 'Business',
      },
      {
         name: 'Home',
      },
   ];

   private map: Map;

   // currentLocation: { latitude: number; longitude: number } = null;

   private initMap(): void {
      this.map = map('map-picker', {
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

      this.map.on('dblclick', (e) => {
         console.log('e.latlng', e.latlng); // e is an event object (MouseEvent in this case)

         this.markerService.clearLocationMark();
         this.shareLocationModel.selectedLocation = {
            latitude: e.latlng.lat,
            longitude: e.latlng.lng,
         };
         this.markerService.makeLocationMark(
            this.map,
            this.shareLocationModel.selectedLocation,
         );
      });
   }

   shareLocationModel: ShareLocationModel;
   constructor(private markerService: MarkerService) {
      this.shareLocationModel = new ShareLocationModel();
      this.shareLocationModel.type = this.types[1].name;
   }

   ngOnInit(): void {
      if (!navigator.geolocation) {
         console.log('location is not supported');
      }
      navigator.geolocation.getCurrentPosition((position) => {
         const coords = position.coords;
         const latLong = [coords.latitude, coords.longitude];
         console.log(
            `lat: ${position.coords.latitude}, lon: ${position.coords.longitude}`,
         );

         // this.markerService.clearLocationMark();

         this.shareLocationModel.selectedLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
         };
         this.map.panTo(
            new LatLng(
               this.shareLocationModel.selectedLocation.latitude,
               this.shareLocationModel.selectedLocation.longitude,
            ),
         );
         this.markerService.makeLocationMark(
            this.map,
            this.shareLocationModel.selectedLocation,
         );
      });
   }

   ngAfterViewInit(): void {
      this.initMap();
      // this.markerService.makeCapitalMarkers(this.map);
   }

   onCloseModal() {
      this.onModalClosed.emit();
   }

   saveSharedLocation() {
      console.log('shareLocationModel', this.shareLocationModel);
   }

   onSelectingType(event) {
      this.shareLocationModel.type = event.target.value;
   }

   uploadImage() {
      let el: HTMLElement = this.logoInput.nativeElement;
      el.click();
   }

   onFileChange(event) {
      if (event.target.files && event.target.files[0]) {
         const selectedFile = event.target.files[0];
         if (selectedFile.type.startsWith('image')) {
            const reader = new FileReader();
            reader.onload = (e) => {
               this.shareLocationModel.logo = reader.result;
            };
            reader.readAsDataURL(selectedFile);
         }
      }
   }
}
