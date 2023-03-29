import { ShareLocationModel } from "src/models/forms/share-location.model";
import { StorageService } from "src/services/storage.service";
import { SharedLocationsService } from "./shared-locations.service";

describe("SharedLocationsService", () => {
  let service: SharedLocationsService;
  let storageService: StorageService = new StorageService();
  const testId = "test-id";
  const testName = "milad test location";
  const testNameUpdated = "milad test location updated";
  const shareLocation = new ShareLocationModel(testId, testName, "test");

  beforeEach(() => {
    service = new SharedLocationsService(storageService);
  });

  beforeEach(() => {
    let store = {} as any;
    const mockLocalStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };

    spyOn(localStorage, "getItem").and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, "setItem").and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, "removeItem").and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, "clear").and.callFake(mockLocalStorage.clear);
  });

  it("should create a location", () => {
    let resultLocations: ShareLocationModel[] = [];

    service.sharedLocationSourceObservable.subscribe((locations) => {
      resultLocations = locations;
    });

    service.addNewLocation(shareLocation);

    service.sharedLocationSourceObservable.subscribe((locations) => {
      resultLocations = locations;
    });

    const foundLocationIndex = resultLocations.findIndex(
      (item) => item.id === testId
    );

    expect(foundLocationIndex).not.toEqual(-1);
  });

  it("should update a location", () => {
    let resultLocations: ShareLocationModel[] = [];
    service.addNewLocation(shareLocation);
    service.sharedLocationSourceObservable.subscribe((locations) => {
      resultLocations = locations;
    });

    const foundLocationIndex = resultLocations.findIndex(
      (item) => item.id === testId
    );

    resultLocations[foundLocationIndex].name = testNameUpdated;
    service.updateNewLocation(resultLocations[foundLocationIndex]);

    service.sharedLocationSourceObservable.subscribe((locations) => {
      resultLocations = locations;
    });

    expect(resultLocations[foundLocationIndex].name).toEqual(testNameUpdated);
  });

  it("should update selected location for update", () => {
    service.addNewLocation(shareLocation);
    let selectedLocation: ShareLocationModel | null = null;

    service.setLocationForUpdate(testId);

    service.sharedLocationForUpdateObservable.subscribe((location) => {
      selectedLocation = location;
    });

    if (selectedLocation) {
      expect(selectedLocation["id"]).toEqual(testId);
    }
  });
});
