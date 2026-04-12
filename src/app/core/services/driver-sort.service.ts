import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Driver } from '../models/driver.model';
import { Task } from '../models/task.model';
import { concatMap, filter, interval, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DriverSortService {
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

  addTaskToDriver(driverId: number, task: Task): Observable<any> {
    const targetDriver = this._drivers().find((d) => String(d.id) === String(driverId));
    if (!targetDriver) return of(null);

    const isExists = targetDriver.tasks.some((t) => t.id === task.id);
    const updatedTasks = isExists
      ? targetDriver.tasks.map((t) => (t.id === task.id ? { ...task } : t))
      : [...targetDriver.tasks, task];

    return this.http.patch(`${this.apiUrl}/${driverId}`, { tasks: updatedTasks }).pipe(
      tap(() => {
        this._drivers.update((drivers) =>
          drivers.map((d) => (d.id === driverId ? { ...d, tasks: updatedTasks } : d)),
        );
      }),
    );
  }

  sortDrivers(drivers: Driver[]): Driver[] {
    return [...drivers].sort((a, b) => a.tasks.length - b.tasks.length);
  }

  // 模擬司機「自動接受任務」的邏輯，會每 30 秒從目前的司機資料中隨機抽選一個「已指派任務」，然後把它的狀態改成「已接受」
  startSimulation() {
    return interval(30000).pipe(
      map(() => this._drivers()),

      // http發送改記憶體更新
      map((drivers) =>
        drivers
          .flatMap((d) => d.tasks.map((t) => ({ ...t, parentDriverId: d.id })))
          .filter((t) => t.status === 'Assigned'),
      ),

      filter((tasks) => tasks.length > 0),

      map((tasks) => {
        const selectedTask = tasks[Math.floor(Math.random() * tasks.length)];
        return {
          updatedTask: { ...selectedTask, status: 'Accepted' as const },
          driverId: selectedTask.parentDriverId,
        };
      }),

      concatMap(({ updatedTask, driverId }) => this.addTaskToDriver(driverId, updatedTask)),
    );
  }

  startSimulationComplete() {
    return interval(45000).pipe(
      map(() => this._drivers()),

      // http發送改記憶體更新
      map((drivers) =>
        drivers
          .flatMap((d) => d.tasks.map((t) => ({ ...t, parentDriverId: d.id })))
          .filter((t) => t.status === 'Accepted'),
      ),

      filter((tasks) => tasks.length > 0),

      map((tasks) => {
        const selectedTask = tasks[Math.floor(Math.random() * tasks.length)];
        return {
          updatedTask: { ...selectedTask, status: 'Completed' as const },
          driverId: selectedTask.parentDriverId,
        };
      }),

      concatMap(({ updatedTask, driverId }) => this.addTaskToDriver(driverId, updatedTask)),
    );
  }
}
