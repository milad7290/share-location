import {
   AfterViewInit,
   Component,
   ElementRef,
   EventEmitter,
   Input,
   OnInit,
   Output,
   ViewChild
} from '@angular/core';
import { icon, LatLng, Map, map, Marker, tileLayer } from 'leaflet';
import { ShareLocationModel } from 'src/models/forms/share-location.model';
import { MarkerService } from 'src/services/share-location/marker.service';
import { SharedLocationsService } from 'src/services/share-location/shared-locations.service';
import { v4 as uuidv4 } from 'uuid';

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

   @Input() shareLocationForUpdate: ShareLocationModel | null;

   shareLocation: ShareLocationModel;

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
         doubleClickZoom: false,
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
         this.markerService.clearLocationMark();
         this.shareLocation.selectedLocation = {
            latitude: e.latlng.lat,
            longitude: e.latlng.lng,
         };
         this.markerService.markSpecificLocation(
            this.map,
            this.shareLocation.selectedLocation,
         );
      });
   }

   constructor(
      private markerService: MarkerService,
      private sharedLocationsService: SharedLocationsService,
   ) {
      const newUuid = uuidv4();
      this.shareLocation = new ShareLocationModel(newUuid);
      this.shareLocation.type = this.types[0].name;
   }

   loadingCurrentLocation = false;
   errorCurrentLocation = '';
   ngOnInit(): void {
      if (this.shareLocationForUpdate) {
         this.shareLocation = this.shareLocationForUpdate;
      }
      if (!navigator.geolocation) {
         this.errorCurrentLocation =
            'Location does not support (or permitted) on your device.';
      }

      if (!this.shareLocationForUpdate) {
         this.loadingCurrentLocation = true;

         navigator.geolocation.getCurrentPosition(
            (position) => {
               this.markerService.clearLocationMark();

               this.shareLocation.selectedLocation = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
               };
               this.map.panTo(
                  new LatLng(
                     this.shareLocation.selectedLocation.latitude,
                     this.shareLocation.selectedLocation.longitude,
                  ),
               );
               this.markerService.markSpecificLocation(
                  this.map,
                  this.shareLocation.selectedLocation,
               );
               this.errorCurrentLocation = '';
               this.loadingCurrentLocation = false;
            },
            () => {
               this.errorCurrentLocation =
                  'It seems you have a network issue, check that out then try again';
               this.loadingCurrentLocation = false;
            },
         );
      }
   }

   ngAfterViewInit(): void {
      this.initMap();
      if (this.shareLocationForUpdate) {
         this.map.panTo(
            new LatLng(
               this.shareLocation.selectedLocation.latitude,
               this.shareLocation.selectedLocation.longitude,
            ),
         );
         this.markerService.markSpecificLocation(
            this.map,
            this.shareLocation.selectedLocation,
         );
         this.errorCurrentLocation = '';
         this.loadingCurrentLocation = false;
         // this.markerService.makeCapitalMarkers(this.map);
      }
   }

   onCloseModal() {
      this.onModalClosed.emit();
   }

   saveSharedLocation() {
      if (this.shareLocationForUpdate) {
         this.sharedLocationsService.updateNewLocation(this.shareLocation);
      } else {
         this.sharedLocationsService.addNewLocation(this.shareLocation);
      }
      this.onCloseModal();
   }

   onSelectingType(event) {
      this.shareLocation.type = event.target.value;
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
               this.shareLocation.logo = reader.result;
            };
            reader.readAsDataURL(selectedFile);
         }
      }
   }
}
