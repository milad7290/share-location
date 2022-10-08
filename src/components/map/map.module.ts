import { NgModule } from '@angular/core';
import { MarkerService } from 'src/services/share-location/marker.service';
import { PopupService } from 'src/services/share-location/popup.service';
import { SharedLocationsService } from 'src/services/share-location/shared-locations.service';
import { SharedModule } from 'src/shared/shared.module';
import { MapComponent } from './map.component';

@NgModule({
   declarations: [MapModule.rootComponent],
   entryComponents: [MapModule.rootComponent],
   imports: [SharedModule],
   providers: [MarkerService, PopupService, SharedLocationsService],
   exports: [MapComponent],
})
// export class MapModule {}
export class MapModule {
   static rootComponent = MapComponent;
}
