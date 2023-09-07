import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SequencesPage } from './sequences.page';

import { SequencesPageRoutingModule } from './sequences-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SequencesPageRoutingModule
  ],
  declarations: [SequencesPage]
})
export class SequencesPageModule {}
