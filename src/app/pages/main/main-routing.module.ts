import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: 'app',
    component: MainPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'consejos',
        loadChildren: () => import('../advices/advices.module').then(m => m.AdvicesPageModule)
      },
      {
        path: 'citas',
        loadChildren: () => import('../dates/dates.module').then(m => m.DatesPageModule)
      },
      {
        path: 'apoyos-visuales',
        loadChildren: () => import('../sequences/sequences.module').then(m => m.SequencesPageModule)
      },
      {
        path: 'mi-cuenta',
        loadChildren: () => import('../account/account.module').then(m => m.AccountPageModule)
      },
      {
        path: 'sobre-dentaltea',
        loadChildren: () => import('../about/about.module').then(m => m.AboutPageModule)
      },
      {
        path: '',
        redirectTo: '/app/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/app/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class MainPageRoutingModule {}
