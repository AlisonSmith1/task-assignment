import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { AboutComponent } from './about/about';
import { ServeComponent } from './serve/serve';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'assignment', pathMatch: 'full' },
      { path: 'about', component: AboutComponent },
      { path: 'serve', component: ServeComponent },
      {
        path: 'assignment',
        loadComponent: () =>
          import('./task-assignment/task-assignment').then((m) => m.TaskAssignment),
      },
    ],
  },
  { path: '**', redirectTo: '/dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
