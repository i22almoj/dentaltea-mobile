import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatesPage } from './dates.page';
import { NgCalendarModule  } from 'ionic2-calendar';
import { DatesPageRoutingModule } from './dates-routing.module';



@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    DatesPageRoutingModule,
    NgCalendarModule
  ],
  declarations: [DatesPage]
})
export class DatesPageModule {}
