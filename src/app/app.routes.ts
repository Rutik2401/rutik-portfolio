import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
    title: 'Rutik Pimpale — Full-Stack Developer',
  },
  {
    path: 'resources',
    loadComponent: () =>
      import('./components/resources/resources.component').then((m) => m.ResourcesComponent),
    title: 'Resources — Premium Notes by Rutik Pimpale',
  },
  {
    path: 'resources/:slug',
    loadComponent: () =>
      import('./components/resource-viewer/resource-viewer.component').then(
        (m) => m.ResourceViewerComponent,
      ),
    title: 'Resource — Rutik Pimpale',
  },
  { path: '**', redirectTo: '' },
];
