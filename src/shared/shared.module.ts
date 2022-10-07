// import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
// import { ProductPartialScrollComponent } from "./product-partial-scroll/product-partial-scroll.component";

@NgModule({
  imports: [CommonModule, FormsModule],
  exports: [
    CommonModule,
    FormsModule,
  ],
})
export class SharedModule {}
