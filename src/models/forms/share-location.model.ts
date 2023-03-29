export class ShareLocationModel {
  constructor(id: string) {
    this.id = id;
    this.name = null;
    this.type = null;
    this.logo = null;
    this.selectedLocation = null;
  }
  public id: string;
  public name: string | null;
  public type: string | null;
  public logo: string | ArrayBuffer | null;
  public selectedLocation: { latitude: number; longitude: number } | null;
}
