export class ShareLocationModel {
  constructor(id:string) {
    this.id = id;
}
  public id: string;
  public name: string;
  public type: string;
  public logo: string | ArrayBuffer ;
  public selectedLocation: { latitude: number; longitude: number };
}
