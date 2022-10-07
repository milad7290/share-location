export class ShareLocationModel {
  constructor() {
    this.name = '';
    this.type = '';
}
  public name: string;
  public type: string;
  public logo?: string | ArrayBuffer ;
  public selectedLocation: { latitude: number; longitude: number };
}
