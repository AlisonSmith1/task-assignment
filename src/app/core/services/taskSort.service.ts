import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskSortService {
  private getPriorityWeight(priority: 'High' | 'Medium' | 'Low'): number {
    const weights = { High: 3, Medium: 2, Low: 1 };
    return weights[priority] || 0;
  }
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/tasks';

  getTasks() {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((tasks) =>
        tasks.map((task) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          deadline: task.deadline ? new Date(task.deadline) : null,
        })),
      ),
    );
  }

  updateTask(task: any) {
    return this.http.patch(`${this.apiUrl}/${task.id}`, task);
  }

  sortTasks(tasks: Task[]): Task[] {
    return tasks.slice().sort((a, b) => {
      // Priority
      const priorityDiff = this.getPriorityWeight(b.priority) - this.getPriorityWeight(a.priority);
      if (priorityDiff !== 0) return priorityDiff;

      // Deadline
      const timeA = a.deadline ? a.deadline.getTime() : new Date('9999-12-31').getTime();
      const timeB = b.deadline ? b.deadline.getTime() : new Date('9999-12-31').getTime();
      if (timeA !== timeB) return timeA - timeB;

      // CreatedAt
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
  }
}
