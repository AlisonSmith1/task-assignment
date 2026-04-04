import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task.model';
import {
  catchError,
  concatMap,
  filter,
  interval,
  map,
  Observable,
  shareReplay,
  switchMap,
  tap,
  throwError,
  timer,
} from 'rxjs';
import { DiverSortService } from './diver-sort.service';

@Injectable({
  providedIn: 'root',
})
export class TaskSortService {
  private diverSortService = inject(DiverSortService);
  private getPriorityWeight(priority: 'High' | 'Medium' | 'Low'): number {
    const weights = { High: 3, Medium: 2, Low: 1 };
    return weights[priority] || 0;
  }
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/tasks';

  private _tasks = signal<Task[]>([]);

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
  fetchTasks() {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((tasks) =>
        tasks.map((task) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          deadline: task.deadline ? new Date(task.deadline) : null,
        })),
      ),
      tap((tasks) => this._tasks.set(tasks)),
    );
  }

  // updateTask(task: any) {
  //   return this.http.patch(`${this.apiUrl}/${task.id}`, task);
  // }
  updateTask(task: Task) {
    return this.http.patch<Task>(`${this.apiUrl}/${task.id}`, task).pipe(
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

  startSimulation() {
    return interval(10000).pipe(
      // switchMap(() => this.getTasks()),
      map(() => this._tasks()),
      map((tasks) => tasks.filter((t) => t.status === 'Unassigned')),
      filter((availableTasks) => availableTasks.length > 0),
      map((availableTasks) => {
        const task = availableTasks[Math.floor(Math.random() * availableTasks.length)];
        const randomDriverId = Math.floor(Math.random() * 6) + 1;
        return {
          assignedTask: { ...task, status: 'Assigned' as const, driverId: randomDriverId },
          driverId: randomDriverId,
        };
      }),
      concatMap(({ assignedTask, driverId }) =>
        this.updateTask(assignedTask).pipe(
          switchMap(() => this.diverSortService.addTaskToDriver(driverId, assignedTask)),
        ),
      ),
    );
  }
}
