import { Routes } from '@angular/router';

export const PlayRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./play.component').then((x) => x.PlayComponent),
  },
  {
    path: 'daily',
    loadComponent: () =>
      import('./levels/daily/level-daily.component').then(
        (x) => x.LevelDailyComponent
      ),
  },
  {
    path: 'level/12',
    redirectTo: 'level/A1A3A5C5E5/E1/C3',
  },

  {
    path: 'level/:normie_pieces/:golden_piece/:golden_square',
    loadComponent: () =>
      import('./levels/level-n/level-n.component').then(
        (x) => x.LevelNComponent
      ),
  },
];
