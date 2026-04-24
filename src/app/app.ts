import { Component, inject, signal } from '@angular/core';
import { Task } from './core/models/task.model';
import { TaskSortService } from './core/services/taskSort.service';
import { DriverSortService } from './core/services/driver-sort.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('task-assignment');

  private taskSortService = inject(TaskSortService);
  private driverSortService = inject(DriverSortService);

  addNewTasks = this.taskSortService.unassignedTasks;
  addNewDrivers = this.driverSortService.driversCompare;

  taskNameToDelete: string = '';
  driverNameToDelete: string = '';

  newTask = {
    title: '',
    description: '',
    priority: '',
  };

  newDriver = { name: '' };

  // 控制顯示任務列表或司機列表
  drawerMode: 'task' | 'driver' = 'task';

  toggleList() {
    this.drawerMode = this.drawerMode === 'task' ? 'driver' : 'task';
  }

  // 新增任務
  addTask() {
    if (!this.newTask.title || !this.newTask.description || !this.newTask.priority) {
      return;
    }

    this.taskSortService.addTask(this.newTask).subscribe({
      next: () => {
        this.newTask = { title: '', description: '', priority: '' };
      },
    });
  }

  // 新增司機
  addDriver() {
    if (!this.newDriver.name) {
      return;
    }
    this.driverSortService.addDriver(this.newDriver).subscribe({
      next: () => {
        this.newDriver = { name: '' };
      },
    });
  }

  // 刪除任務
  removeTask(taskNameToDelete: string) {
    this.taskSortService.removeTask(taskNameToDelete).subscribe({
      next: () => {
        this.taskNameToDelete = '';
      },
    });
  }

  // 刪除司機
  removeDriver(driverNameToDelete: string) {
    this.driverSortService.removeDriver(driverNameToDelete).subscribe({
      next: () => {
        this.driverNameToDelete = '';
      },
    });
  }
}
