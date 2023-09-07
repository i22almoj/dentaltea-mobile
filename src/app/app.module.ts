import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { NgCalendarModule  } from 'ionic2-calendar';

import { Push } from '@awesome-cordova-plugins/push/ngx';

registerLocaleData(es);

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, NgCalendarModule, HttpClientModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, Storage, Push, { provide: LOCALE_ID, useValue: 'es-*' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
