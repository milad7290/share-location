import { Component } from '@angular/core';

@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.css'],
})
export class AppComponent {
   openShareModal = false;
   onOpenShareView() {
      this.openShareModal = true;
   }
   onCloseShareView() {
    this.openShareModal = false;
 }
}
