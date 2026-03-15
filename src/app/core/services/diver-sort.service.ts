import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Driver } from '../models/driver.model';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class DiverSortService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/drivers';

  private _drivers = signal<Driver[]>([]);

  driversCompare = computed(() => {
    const drivers = this._drivers();
    return this.sortDrivers(drivers);
  });

  setDrivers(drivers: Driver[]) {
    this._drivers.set(drivers);
  }

  getTasks() {
    return this.http.get<Driver[]>(this.apiUrl);
  }

  // DiverSortService.ts

  // removeTaskFromDriver(taskId: string) {
  //   this._drivers.update((drivers) =>
  //     drivers.map((d) => {
  //       const hasTask = d.tasks.some((t) => String(t.id) === String(taskId));

  //       if (!hasTask) return d;

  //       return {
  //         ...d,
  //         tasks: d.tasks.filter((t) => String(t.id) !== String(taskId)),
  //       };
  //     }),
  //   );
  // }
  removeTaskFromDriver(taskId: string) {
    this._drivers.update((drivers) => {
      return drivers.map((d) => {
        if (!d.tasks.some((t) => String(t.id) === String(taskId))) return d;

        return {
          ...d,
          tasks: d.tasks.filter((t) => String(t.id) !== String(taskId)),
        };
      });
    });
  }

  addTaskToDriver(driverId: Number, task: Task) {
    this._drivers.update((drivers) =>
      drivers.map((d) => {
        if (d.id === driverId) {
          const exists = d.tasks.some((t) => t.id === task.id);
          return {
            ...d,
            tasks: exists ? d.tasks : [...d.tasks, task],
          };
        }
        return d;
      }),
    );
  }

  sortDrivers(drivers: Driver[]): Driver[] {
    return [...drivers].sort((a, b) => a.tasks.length - b.tasks.length);
  }
}
