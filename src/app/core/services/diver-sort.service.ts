import { inject, Injectable } from '@angular/core';
import { Driver } from '../models/driver.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DiverSortService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/drivers';

  getTasks() {
    return this.http.get<any[]>(this.apiUrl);
  }

  sortDrivers(drivers: Driver[]): Driver[] {
    return drivers.slice().sort((a, b) => a.tasks.length - b.tasks.length);
  }
}
