import {
   AfterViewInit,
   Component,
   ElementRef,
   EventEmitter,
   OnInit,
   Output,
   ViewChild
} from '@angular/core';
import { icon, Marker } from 'leaflet';
import { ShareLocationModel } from 'src/models/forms/share-location.model';

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

   shareLocationModel: ShareLocationModel;
   constructor() {
      this.shareLocationModel = new ShareLocationModel();
      this.shareLocationModel.type = this.types[1].name;
   }

   ngOnInit(): void {}

   ngAfterViewInit(): void {}

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
