import { Injectable } from "@angular/core";
import { ShareLocationModel } from "src/models/forms/share-location.model";

@Injectable({
   providedIn: 'root',
})
export class PopupService {
  makeLocationPopup(data: ShareLocationModel): string {
    return (
      `<div>` +
      `<div class="details"><img width="30" alt="${data.name} Logo" src="${data.logo}">` +
      `<p><b>Name:</b> ${data.name}</p>` +
      `<p><b>Type:</b> ${data.type}</p></div>` +
      `<div><button class="editBtn">Edit</button></div>` +
      "</div>"
    );
  }
}
