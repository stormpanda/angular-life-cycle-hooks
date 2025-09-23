import { Routes } from '@angular/router';
import { LifecycleDemoComponent } from './lifecycle-demo/lifecycle-demo.component';

export const routes: Routes = [
  { path: 'lifecycle-demo', component: LifecycleDemoComponent },
  { path: '**', redirectTo: 'lifecycle-demo' },
];
