import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (c) => c.DashboardComponent
      ),
  },
  {
    path: 'ngonchanges',
    loadComponent: () =>
      import(
        './components/ng-on-changes-demo/ng-on-changes-demo.component'
      ).then((c) => c.NgOnChangesDemoComponent),
  },
  {
    path: 'nginit',
    loadComponent: () =>
      import('./components/ng-on-init-demo/ng-on-init-demo.component').then(
        (c) => c.NgOnInitDemoComponent
      ),
  },
  {
    path: 'ngdocheck',
    loadComponent: () =>
      import('./components/ng-do-check-demo/ng-do-check-demo.component').then(
        (c) => c.NgDoCheckDemoComponent
      ),
  },
  {
    path: 'ngaftercontentinit',
    loadComponent: () =>
      import(
        './components/ng-after-content-init-demo/ng-after-content-init-demo.component'
      ).then((c) => c.NgAfterContentInitDemoComponent),
  },
  {
    path: 'ngaftercontentchecked',
    loadComponent: () =>
      import(
        './components/ng-after-content-checked-demo/ng-after-content-checked-demo.component'
      ).then((c) => c.NgAfterContentCheckedDemoComponent),
  },
  {
    path: 'ngafterviewinit',
    loadComponent: () =>
      import(
        './components/ng-after-view-init-demo/ng-after-view-init-demo.component'
      ).then((c) => c.NgAfterViewInitDemoComponent),
  },
  {
    path: 'ngafterviewchecked',
    loadComponent: () =>
      import(
        './components/ng-after-view-checked-demo/ng-after-view-checked-demo.component'
      ).then((c) => c.NgAfterViewCheckedDemoComponent),
  },
  {
    path: 'ngondestroy',
    loadComponent: () =>
      import(
        './components/ng-on-destroy-demo/ng-on-destroy-demo.component'
      ).then((c) => c.NgOnDestroyDemoComponent),
  },
  {
    path: 'all-hooks',
    loadComponent: () =>
      import('./components/all-hooks-demo/all-hooks-demo.component').then(
        (c) => c.AllHooksDemoComponent
      ),
  },
  { path: '**', redirectTo: '/dashboard' },
];
