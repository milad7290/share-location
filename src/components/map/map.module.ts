import { NgModule } from '@angular/core';
import { MarkerService } from 'src/services/marker.service';
import { SharedModule } from 'src/shared/shared.module';
import { PopupService } from './../../services/popup.service';
import { MapComponent } from './map.component';

@NgModule({
   declarations: [MapModule.rootComponent],
   entryComponents: [MapModule.rootComponent],
   imports: [SharedModule],
   providers: [MarkerService, PopupService],
   exports: [MapComponent],
})
// export class MapModule {}
export class MapModule {
   static rootComponent = MapComponent;
}
