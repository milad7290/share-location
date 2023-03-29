export class ShareLocationModel {
  constructor(
    id: string,
    name?: string,
    type?: string,
    logo?: string,
    selectedLocation?: { latitude: number; longitude: number }
  ) {
    this.id = id;
    this.name = name || null;
    this.type = type || null;
    this.logo = logo || null;
    this.selectedLocation = selectedLocation || null;
  }
  public id: string;
  public name: string | null;
  public type: string | null;
  public logo: string | ArrayBuffer | null;
  public selectedLocation: { latitude: number; longitude: number } | null;
}
