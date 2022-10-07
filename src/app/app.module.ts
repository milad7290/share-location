import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MapModule } from 'src/components/map/map.module';
import { ShareLocationModalModule } from 'src/components/share-location-modal/share-location-modal.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
   declarations: [AppComponent],
   imports: [
      BrowserModule,
      AppRoutingModule,
      MapModule,
      ShareLocationModalModule,
      HttpClientModule,
   ],
   providers: [],
   bootstrap: [AppComponent],
})
export class AppModule {}
