import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MarkerService } from "src/services/share-location/marker.service";
import { SharedLocationsService } from "src/services/share-location/shared-locations.service/shared-locations.service";
import { SharedModule } from "src/shared/shared.module";
import { ShareLocationModalComponent } from "./share-location-modal.component";

@NgModule({
  declarations: [ShareLocationModalModule.rootComponent],
  entryComponents: [ShareLocationModalModule.rootComponent],
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
  providers: [MarkerService, SharedLocationsService],
  exports: [ShareLocationModalComponent],
})
export class ShareLocationModalModule {
  static rootComponent = ShareLocationModalComponent;
}
