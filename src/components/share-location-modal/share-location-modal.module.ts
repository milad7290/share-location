import { NgModule } from '@angular/core';
import { MarkerService } from 'src/services/marker.service';
import { SharedModule } from 'src/shared/shared.module';
import { PopupService } from '../../services/popup.service';
import { ShareLocationModalComponent } from './share-location-modal.component';

@NgModule({
   declarations: [ShareLocationModalModule.rootComponent],
   entryComponents: [ShareLocationModalModule.rootComponent],
   imports: [SharedModule],
   providers: [MarkerService, PopupService],
   exports: [ShareLocationModalComponent],
})
// export class ShareLocationModalModule {}
export class ShareLocationModalModule {
   static rootComponent = ShareLocationModalComponent;
}
