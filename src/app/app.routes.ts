import { Routes } from '@angular/router';
import { Shell } from './features/shell/shell';

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', loadChildren: () => import('./features/home/home.routes') },
      { path: 'detail', loadChildren: () => import('./features/detail/detail.routes') },
    ],
  },
  { path: '**', redirectTo: '' },
];
