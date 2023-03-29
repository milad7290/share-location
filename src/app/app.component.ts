import { Component } from "@angular/core";
import { Subscription } from "rxjs";
import { ShareLocationModel } from "src/models/forms/share-location.model";
import { SharedLocationsService } from "src/services/share-location/shared-locations.service/shared-locations.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "Share location";
  openShareModal = false;
  locationForUpdate: ShareLocationModel | null = null;
  sharedLocationForUpdateSubscription: Subscription;
  constructor(private sharedLocationsService: SharedLocationsService) {
    this.sharedLocationForUpdateSubscription =
      this.sharedLocationsService.sharedLocationForUpdateObservable.subscribe(
        (location) => {
          this.locationForUpdate = location;
          if (location) {
            this.onOpenShareView();
          } else {
            this.onCloseShareView();
          }
        }
      );
  }

  onOpenShareView() {
    this.openShareModal = true;
  }

  onCloseShareView() {
    this.openShareModal = false;
  }

  ngOnDestroy(): void {
    if (this.sharedLocationForUpdateSubscription) {
      this.sharedLocationForUpdateSubscription.unsubscribe();
    }
  }
}
