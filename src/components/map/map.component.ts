import { AfterViewInit, Component } from "@angular/core";
import { icon, Map, map, Marker, tileLayer } from "leaflet";
import { Subscription } from "rxjs";
import { ShareLocationModel } from "src/models/forms/share-location.model";
import { SharedLocationsService } from "src/services/share-location/shared-locations.service/shared-locations.service";
import { MarkerService } from "../../services/share-location/marker.service";
import { environment } from "../../environments/environment";

const iconRetinaUrl = environment.iconRetinaUrl;
const iconUrl = environment.iconUrl;
const shadowUrl = environment.shadowUrl;
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
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.css"],
})
export class MapComponent implements AfterViewInit {
  private map: Map | null = null;

  sharedLocations: ShareLocationModel[] = [];
  locationSubscription: Subscription | null = null;
  constructor(
    private markerService: MarkerService,
    private sharedLocationsService: SharedLocationsService
  ) {}

  private initMap(): void {
    this.map = map("map", {
      center: [29.8282, -28.5795],
      zoom: 3,
    });

    const tiles = tileLayer(environment.tileLayerUrlTemplate, {
      maxZoom: 18,
      minZoom: 3,
      attribution: environment.tileLayerOptionAttribution,
    });

    tiles.addTo(this.map);

    this.locationSubscription =
      this.sharedLocationsService.sharedLocationSourceObservable.subscribe(
        (locations) => {
          if (this.map) {
            this.markerService.clearAllLocationMark();
            this.sharedLocations = locations;
            this.markerService.markGroupOfLocations(
              this.map,
              this.sharedLocations
            );
          }
        }
      );
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }
  }
}
