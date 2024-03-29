import { Injectable } from "@angular/core";
import { LayerGroup, layerGroup, Map, marker as leafMarker } from "leaflet";
import { ShareLocationModel } from "src/models/forms/share-location.model";
import { PopupService } from "./popup.service";
import { SharedLocationsService } from "./shared-locations.service/shared-locations.service";

@Injectable()
export class MarkerService {
  layerGroupSelectedLocation: LayerGroup<any> | undefined;
  layerGroupMainMap: LayerGroup<any> | undefined;

  constructor(
    private popupService: PopupService,
    private sharedLocationsService: SharedLocationsService
  ) {}

  markGroupOfLocations(map: Map, locations: ShareLocationModel[]): void {
    const _this = this;
    for (const location of locations) {
      if (location.selectedLocation) {
        const lon = location.selectedLocation.longitude;
        const lat = location.selectedLocation.latitude;
        const marker = leafMarker([lat, lon]);

        marker
          .bindPopup(this.popupService.makeLocationPopup(location))
          .on("popupopen", (a) => {
            var popUp = a.target.getPopup();
            popUp
              .getElement()
              .querySelector(".editBtn")
              .addEventListener("click", () => {
                _this.editLocation(location.id);
              });
          });
        this.layerGroupMainMap = layerGroup().addTo(map);

        marker.addTo(this.layerGroupMainMap);
      }
    }
  }

  markSpecificLocation(
    map: Map,
    location: { latitude: number; longitude: number }
  ): void {
    const lon = location.longitude;
    const lat = location.latitude;
    const marker = leafMarker([lat, lon]);

    this.layerGroupSelectedLocation = layerGroup().addTo(map);

    marker.addTo(this.layerGroupSelectedLocation);
  }

  editLocation(id: string) {
    this.sharedLocationsService.setLocationForUpdate(id);
  }

  clearLocationMark() {
    if (this.layerGroupSelectedLocation) {
      this.layerGroupSelectedLocation.clearLayers();
      this.layerGroupSelectedLocation = undefined;
    }
  }

  clearAllLocationMark() {
    if (this.layerGroupMainMap) {
      this.layerGroupMainMap.clearLayers();
      this.layerGroupMainMap = undefined;
    }
  }
}
