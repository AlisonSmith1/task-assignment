import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { TaskAssignment } from './task-assignment/task-assignment';
import { Navbar } from './navbar/navbar';
import { DashboardComponent } from './dashboard/dashboard';
import { ReasonDialog } from './reason-dialog/reason-dialog';
import { AboutComponent } from './about/about';
import { ServeComponent } from './serve/serve';
import { provideHttpClient, withFetch } from '@angular/common/http';

@NgModule({
  declarations: [App, Navbar, DashboardComponent, AboutComponent, ServeComponent],
  imports: [BrowserModule, AppRoutingModule, TaskAssignment, ReasonDialog],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
  ],
  bootstrap: [App],
})
export class AppModule {}
