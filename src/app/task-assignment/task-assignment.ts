import { ChangeDetectorRef, Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'; // Angular 16+ 新功能
import { MatDialog } from '@angular/material/dialog';
import { LatestOverride, Task } from '../core/models/task.model';
import { filter, map, tap } from 'rxjs';
import { ReasonDialog } from '../reason-dialog/reason-dialog';
import { MOCK_TASKS } from '../core/mocks/mock-data';
import { TaskSortService } from '../core/services/taskSort.service';
import { MOCK_DRIVERS } from '../core/mocks/mock-drivers';
import { DiverSortService } from '../core/services/diver-sort.service';
import { Driver } from '../core/models/driver.model';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
  DragDropModule,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-assignment',
  standalone: true,
  templateUrl: './task-assignment.html',
  styleUrl: './task-assignment.scss',
  imports: [CdkDrag, CdkDropList, DragDropModule],
})
export class TaskAssignment implements OnInit {
  unassignedTasks: Task[] = [];
  driversCompare: Driver[] = [];

  private destroyRef = inject(DestroyRef);

  constructor(
    private taskSortService: TaskSortService,
    private dialog: MatDialog,
    private diverSortService: DiverSortService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // Tasks
    this.taskSortService
      .getTasks()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((tasks) => console.log('Fetched tasks:', tasks)),
      )
      .subscribe({
        next: (data) => (this.unassignedTasks = this.taskSortService.sortTasks(data)),
        error: (err) => {
          console.error('API 失敗，切換至 MOCK 資料', err);
          this.unassignedTasks = this.taskSortService.sortTasks(MOCK_TASKS);
        },
      });

    //  Drivers
    this.diverSortService
      .getTasks()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((drivers) => console.log('Fetched drivers:', drivers)),
      )
      .subscribe({
        next: (data) => (this.driversCompare = this.diverSortService.sortDrivers(data)),
        error: (err) => {
          console.error('API 司機資料失敗，切換至 MOCK 資料', err);
          this.driversCompare = this.diverSortService.sortDrivers(MOCK_DRIVERS);
        },
      });
  }

  editUnassigment(task: Task) {}

  reasonDialog(task: Task) {
    const dialogRef = this.dialog.open(ReasonDialog, {
      data: { task },
      width: '400px',
    });

    dialogRef
      .afterClosed()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(
          (result): result is LatestOverride =>
            !!result && !!result.reason && result.reason.trim() !== '',
        ),
        tap((result) => console.log('Dialog result:', result)),
      )
      .subscribe((reasonData: LatestOverride) => {
        const updatedTask: Task = {
          ...task,
          status: 'Unassigned',
          priority: 'High',
          overrideHistory: [reasonData, ...task.overrideHistory],
        };

        this.driversCompare = this.driversCompare.map((driver) => ({
          ...driver,
          tasks: (driver.tasks ?? []).filter((t) => t.id !== task.id),
        }));

        this.unassignedTasks = this.taskSortService.sortTasks([
          ...this.unassignedTasks,
          updatedTask,
        ]);

        console.log('任務已取消並返回待分配:', updatedTask);
        this.cdr.markForCheck();
      });
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      const movedTask = event.container.data[event.currentIndex];
      this.handleTaskAssignmentChange(event, movedTask);
    }
  }

  private handleTaskAssignmentChange(event: CdkDragDrop<Task[]>, task: Task) {
    task.status = event.container.id !== 'todoList' ? 'Assigned' : 'Unassigned';

    this.taskSortService
      .updateTask(task)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => console.log(`同步任務狀態變更: ${task.title} -> ${task.status}`)),
      )
      .subscribe(() => {
        console.log(`後端同步成功: ${task.title}`);
      });
  }
}
