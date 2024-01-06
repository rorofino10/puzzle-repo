import { Route } from '@angular/router';
import { DefaultLayoutComponent } from './layout/default-layout/default-layout.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home.component').then((c) => c.HomeComponent),
      },
      {
        path: 'play',
        loadChildren: () =>
          import('./pages/play/play.routes').then((x) => x.PlayRoutes),
      },
      { path: '**', redirectTo: 'home' },
    ],
  },
];
