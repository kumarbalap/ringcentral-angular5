import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RingcentralModule } from './ringcentral/ringcentral.module';


import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RingcentralModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
