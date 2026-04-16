import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task.model';
import {
  catchError,
  concatMap,
  delay,
  filter,
  interval,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
  throwError,
  timer,
} from 'rxjs';
import { DriverSortService } from './driver-sort.service';
import { MOCK_TASKS } from '../mocks/mock-data';

@Injectable({
  providedIn: 'root',
})
export class TaskSortService {
  private driverSortService = inject(DriverSortService);
  // 根據任務的優先級、截止日期和創建時間進行排序
  private getPriorityWeight(priority: 'High' | 'Medium' | 'Low'): number {
    const weights = { High: 3, Medium: 2, Low: 1 };
    return weights[priority] || 0;
  }
  // private http = inject(HttpClient);
  // private readonly apiUrl = 'http://localhost:3000/tasks';

  private _tasks = signal<Task[]>([]);

  // 從任務列表中篩選出狀態為「Unassigned」的任務，並根據優先級、截止日期和創建時間進行排序
  unassignedTasks = computed(() => {
    const allTasks = this._tasks();
    const filtered = allTasks.filter((t) => t.status === 'Unassigned');
    return this.sortTasks(filtered);
  });

  setTasks(tasks: Task[]) {
    this._tasks.set(tasks);
  }

  // getTasks() {
  //   return this.http.get<any[]>(this.apiUrl).pipe(
  //     map((tasks) =>
  //       tasks.map((task) => ({
  //         ...task,
  //         createdAt: new Date(task.createdAt),
  //         deadline: task.deadline ? new Date(task.deadline) : null,
  //       })),
  //     ),
  //   );
  // }

  // 從 MOCK_TASKS 取得任務資料，並將其轉換為 Task 物件的格式，最後將資料存入 _tasks 信號中
  fetchTasks(): Observable<any> {
    // return this.http.get<any[]>(this.apiUrl).pipe(
    return of(MOCK_TASKS).pipe(
      delay(300),
      // map((tasks) =>
      //   tasks.map((task) => ({
      //     ...task,
      //     createdAt: new Date(task.createdAt),
      //     deadline: task.deadline,
      //   })),
      // ),
      tap((tasks) => this._tasks.set(tasks)),
    );
  }

  // updateTask(task: any) {
  //   return this.http.patch(`${this.apiUrl}/${task.id}`, task);
  // }

  // 更新任務的狀態或其他屬性，並在更新成功後將最新的任務資料反映在本地的 _tasks 信號中
  updateTask(task: Task): Observable<any> {
    // return this.http.patch<Task>(`${this.apiUrl}/${task.id}`, task).pipe(
    return of({ ...task }).pipe(
      tap((updatedTaskFromServer) => {
        this._tasks.update((prevTasks) => {
          return prevTasks.map((oldTask) =>
            String(oldTask.id) === String(updatedTaskFromServer.id)
              ? { ...updatedTaskFromServer }
              : oldTask,
          );
        });
      }),
    );
  }

  // sortTasks(tasks: Task[]): Task[] {
  //   return tasks.slice().sort((a, b) => {
  //     // Priority
  //     const priorityDiff = this.getPriorityWeight(b.priority) - this.getPriorityWeight(a.priority);
  //     if (priorityDiff !== 0) return priorityDiff;

  //     // Deadline
  //     const timeA = a.deadline ? a.deadline.getTime() : new Date('9999-12-31').getTime();
  //     const timeB = b.deadline ? b.deadline.getTime() : new Date('9999-12-31').getTime();
  //     if (timeA !== timeB) return timeA - timeB;

  //     // CreatedAt
  //     return a.createdAt.getTime() - b.createdAt.getTime();
  //   });
  // }

  // 根據任務的優先級、截止日期和創建時間進行排序
  sortTasks(tasks: Task[]): Task[] {
    return tasks.slice().sort((a, b) => {
      const priorityDiff = this.getPriorityWeight(b.priority) - this.getPriorityWeight(a.priority);
      if (priorityDiff !== 0) return priorityDiff;

      const getTime = (date: any) => {
        if (!date) return new Date('9999-12-31').getTime();

        const d = date instanceof Date ? date : new Date(date);
        return d.getTime();
      };

      const timeA = getTime(a.deadline);
      const timeB = getTime(b.deadline);

      if (timeA !== timeB) return timeA - timeB;

      const timeCreatedA =
        a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
      const timeCreatedB =
        b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();

      return timeCreatedA - timeCreatedB;
    });
  }

  // startSimulation() {
  //   return interval(10000).pipe(
  //     // switchMap(() => this.getTasks()),
  //     map(() => this._tasks()),
  //     map((tasks) => tasks.filter((t) => t.status === 'Unassigned')),
  //     filter((availableTasks) => availableTasks.length > 0),
  //     map((availableTasks) => {
  //       const task = availableTasks[Math.floor(Math.random() * availableTasks.length)];
  //       const randomDriverId = task.id;
  //       return {
  //         assignedTask: { ...task, status: 'Assigned' as const, driverId: randomDriverId },
  //         driverId: randomDriverId,
  //       };
  //     }),
  //     concatMap(({ assignedTask, driverId }) =>
  //       this.updateTask(assignedTask).pipe(
  //         switchMap(() => this.driverSortService.addTaskToDriver(driverId, assignedTask)),
  //       ),
  //     ),
  //   );
  // }

  startSimulation() {
    return interval(10000).pipe(
      map(() => this._tasks()),
      map((tasks) => tasks.filter((t) => t.status === 'Unassigned')),
      filter(
        (availableTasks) =>
          availableTasks.length > 0 && this.driverSortService.driversCompare().length > 0,
      ),
      map((availableTasks) => {
        const task = availableTasks[Math.floor(Math.random() * availableTasks.length)];

        const currentDrivers = this.driverSortService.driversCompare();
        const randomDriver = currentDrivers[Math.floor(Math.random() * currentDrivers.length)];
        const randomDriverId = randomDriver.id;

        return {
          assignedTask: { ...task, status: 'Assigned' as const, driverId: randomDriverId },
          driverId: randomDriverId,
        };
      }),
      concatMap(({ assignedTask, driverId }) =>
        this.updateTask(assignedTask).pipe(
          switchMap(() => this.driverSortService.addTaskToDriver(driverId, assignedTask)),
        ),
      ),
    );
  }
}
