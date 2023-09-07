import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SequencesPage } from './sequences.page';

const routes: Routes = [
  {
    path: '',
    component: SequencesPage,
  },
  {
    path: 'ver/:id', 
    loadChildren: () => import('./item/item.module').then( m => m.ItemPageModule)
  },
  {
    path: 'nuevo', 
    loadChildren: () => import('./add/add.module').then( m => m.AddPageModule)
  },
  {
    path: 'editar/:id', 
    loadChildren: () => import('./edit/edit.module').then( m => m.EditPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SequencesPageRoutingModule {}
