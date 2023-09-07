import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatesPage } from './dates.page';

const routes: Routes = [
  {
    path: '',
    component: DatesPage,
  },
  {
    path: 'ver/:id', 
    loadChildren: () => import('./item/item.module').then( m => m.ItemPageModule)
  },
  {
    path: 'nueva', 
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
export class DatesPageRoutingModule {}
