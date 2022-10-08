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
import { FormBuilder, Validators } from '@angular/forms';
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

   types = ['Business', 'Home'];

   private map: Map;
   isSubmitted = false;

   constructor(
      private markerService: MarkerService,
      private sharedLocationsService: SharedLocationsService,
      public fb: FormBuilder,
   ) {
      const newUuid = uuidv4();
      this.shareLocation = new ShareLocationModel(newUuid);
   }

   shareForm = this.fb.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
   });

   get type() {
      return this.shareForm.get('type');
   }

   get name() {
      return this.shareForm.get('name');
   }

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

         this.locationError = false;
      });
   }

   loadingCurrentLocation = false;
   errorCurrentLocation = '';
   locationError = false;
   logoError = false;
   ngOnInit(): void {
      if (this.shareLocationForUpdate) {
         this.shareLocation = this.shareLocationForUpdate;

         this.shareForm.setValue({
            name: this.shareLocationForUpdate.name,
            type: this.shareLocationForUpdate.type,
         });
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
               this.locationError = false;
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
         this.locationError = false;
      }
   }

   onCloseModal() {
      this.onModalClosed.emit();
      if (this.shareLocationForUpdate) {
         this.sharedLocationsService.setLocationForUpdate(null);
      }
   }

   saveSharedLocation() {
      this.isSubmitted = true;
      if (!this.shareForm.valid) {
         return false;
      }

      if (!this.shareLocation.selectedLocation) {
         this.locationError = true;
         return false;
      }
      if (!this.shareLocation.logo) {
         this.logoError = true;
         return false;
      }
      this.shareLocation.name = this.shareForm.value.name;
      this.shareLocation.type = this.shareForm.value.type;
      if (this.shareLocationForUpdate) {
         this.sharedLocationsService.updateNewLocation(this.shareLocation);
      } else {
         this.sharedLocationsService.addNewLocation(this.shareLocation);
      }
      this.onCloseModal();
   }

   onSelectingType(event) {
      this.type.setValue(event.target.value, {
         onlySelf: true,
      });
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
            this.logoError = false;
         }
      }
   }
}
