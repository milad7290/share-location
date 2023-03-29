import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ShareLocationModel } from "src/models/forms/share-location.model";
import { MarkerService } from "src/services/share-location/marker.service";
import { PopupService } from "src/services/share-location/popup.service";
import { SharedLocationsService } from "src/services/share-location/shared-locations.service/shared-locations.service";
import { MapComponent } from "./map.component";

describe("MapComponent", () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;
  const shareLocation = new ShareLocationModel("test", "test", "test");

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      providers: [MarkerService, SharedLocationsService],
      declarations: [MapComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should use the sharedLocations from the service", () => {
    const sharedLocationsService = fixture.debugElement.injector.get(
      SharedLocationsService
    );
    fixture.detectChanges();

    let resultLocations: ShareLocationModel[] = [];

    sharedLocationsService.addNewLocation(shareLocation);

    sharedLocationsService.sharedLocationSourceObservable.subscribe(
      (locations) => {
        resultLocations = locations;
      }
    );

    expect(resultLocations).toEqual(component.sharedLocations);
  });
});
