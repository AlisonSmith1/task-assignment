import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
  DestroyRef,
  // signal,
  effect,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'; // Angular 16+ 新功能
import { MatDialog } from '@angular/material/dialog';
import { LatestOverride, Task } from '../core/models/task.model';
import { filter, map, tap } from 'rxjs';
import { ReasonDialog } from '../reason-dialog/reason-dialog';
import { MOCK_TASKS } from '../core/mocks/mock-data';
import { TaskSortService } from '../core/services/taskSort.service';
import { MOCK_DRIVERS } from '../core/mocks/mock-drivers';
import { DiverSortService } from '../core/services/diver-sort.service';
// import { Driver } from '../core/models/driver.model';
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
  simulation: any;
  simulationClompete: any;

  // 16+ Angular 新功能：使用 inject() 取代 constructor 注入
  // constructor(
  //   private taskSortService: TaskSortService,
  //   private dialog: MatDialog,
  //   private diverSortService: DiverSortService,
  //   private cdr: ChangeDetectorRef,
  // ) {}

  constructor() {
    effect(() => {
      const currentTasks = this.unassignedTasks();
      const currentDrivers = this.driversCompare();
      console.log(`[畫面更新] 任務池現在有 ${currentTasks.length} 個任務`);
      console.log(
        '任務池 ID 清單:',
        currentTasks.map((t) => t.id),
      );
      console.log(
        '司機資料:',
        currentDrivers.map((d) => ({ name: d.name, tasks: d.tasks.map((t) => t.id) })),
      );
      console.log('-----------------------------------');
    });
  }

  private taskSortService = inject(TaskSortService);
  private diverSortService = inject(DiverSortService);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  unassignedTasks = this.taskSortService.unassignedTasks;
  driversCompare = this.diverSortService.driversCompare;

  // ngOnInit(): void {
  //   // Tasks
  //   this.taskSortService
  //     .fetchTasks()
  //     .pipe(
  //       takeUntilDestroyed(this.destroyRef),
  //       tap((tasks) => console.log('Fetched tasks:', tasks)),
  //     )
  //     .subscribe({
  //       next: (data) => (this.unassignedTasks = this.taskSortService.sortTasks(data)),
  //       error: (err) => {
  //         console.error('API 失敗，切換至 MOCK 資料', err);
  //         this.unassignedTasks = this.taskSortService.sortTasks(MOCK_TASKS);
  //       },
  //     });

  //   //  Drivers
  //   this.diverSortService
  //     .getTasks()
  //     .pipe(
  //       takeUntilDestroyed(this.destroyRef),
  //       tap((drivers) => console.log('Fetched drivers:', drivers)),
  //     )
  //     .subscribe({
  //       next: (data) => (this.driversCompare = this.diverSortService.sortDrivers(data)),
  //       error: (err) => {
  //         console.error('API 司機資料失敗，切換至 MOCK 資料', err);
  //         this.driversCompare = this.diverSortService.sortDrivers(MOCK_DRIVERS);
  //       },
  //     });
  // }
  ngOnInit(): void {
    this.simulation = this.taskSortService.startSimulation().subscribe({
      next: () => console.log('模擬器：偵測中...'),
      error: (err) => console.error('模擬器錯誤:', err),
    });

    this.simulationClompete = this.diverSortService.startSimulation().subscribe({
      next: () => console.log('模擬器：偵測中...'),
      error: (err) => console.error('模擬器錯誤:', err),
    });

    if (this.unassignedTasks().length === 0) {
      this.taskSortService
        .fetchTasks()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (data) => {
            this.taskSortService.setTasks(data);
          },

          error: () => {
            this.taskSortService.setTasks(MOCK_TASKS);
          },
        });
    }

    if (this.driversCompare().length === 0) {
      this.diverSortService
        .getTasks()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (data) => {
            this.diverSortService.setDrivers(data);
          },
          error: () => this.diverSortService.setDrivers(MOCK_DRIVERS),
        });
    }
  }

  ngOnDestroy() {
    if (this.simulation) {
      this.simulation.unsubscribe();
      console.log('模擬器已安全關閉');
    }

    if (this.simulationClompete) {
      this.simulationClompete.unsubscribe();
      console.log('模擬器已安全關閉');
    }
  }

  editUnassigment(task: Task) {}

  // reasonDialog(task: Task) {
  //   const dialogRef = this.dialog.open(ReasonDialog, {
  //     data: { task },
  //     width: '400px',
  //   });

  //   dialogRef
  //     .afterClosed()
  //     .pipe(
  //       takeUntilDestroyed(this.destroyRef),
  //       filter(
  //         (result): result is LatestOverride =>
  //           !!result && !!result.reason && result.reason.trim() !== '',
  //       ),
  //       tap((result) => console.log('Dialog result:', result)),
  //     )
  //     .subscribe((reasonData: LatestOverride) => {
  //       const updatedTask: Task = {
  //         ...task,
  //         status: 'Unassigned',
  //         priority: 'High',
  //         overrideHistory: [reasonData, ...task.overrideHistory],
  //       };

  //       this.driversCompare = this.driversCompare.map((driver) => ({
  //         ...driver,
  //         tasks: (driver.tasks ?? []).filter((t) => t.id !== task.id),
  //       }));

  //       this.unassignedTasks = this.taskSortService.sortTasks([
  //         ...this.unassignedTasks,
  //         updatedTask,
  //       ]);

  //       console.log('任務已取消並返回待分配:', updatedTask);
  //       this.cdr.markForCheck();
  //     });
  // }
  reasonDialog(task: Task) {
    const dialogRef = this.dialog.open(ReasonDialog, { data: { task }, width: '400px' });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result): result is LatestOverride => !!result && !!result.reason?.trim()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((reasonData) => {
        const updatedTask: Task = {
          ...task,
          priority: 'High',
          status: 'Unassigned',
          overrideHistory: [reasonData, ...task.overrideHistory],
        };

        this.taskSortService.updateTask(updatedTask).subscribe({
          next: () => {
            this.diverSortService.removeTaskFromDriver(task.id.toString());
          },
        });
      });
  }

  // 將任務池的任務移動到司機身上
  // drop(event: CdkDragDrop<Task[]>) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     transferArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex,
  //     );

  //     const movedTask = event.container.data[event.currentIndex];
  //     this.handleTaskAssignmentChange(event, movedTask);
  //   }
  // }

  // drop(event: CdkDragDrop<Task[]>, driver?: Driver) {
  //   const previousData = [...event.previousContainer.data];
  //   const currentData = [...event.container.data];

  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(currentData, event.previousIndex, event.currentIndex);

  //     if (event.container.id === 'todoList') {
  //       this.taskSortService.sortTasks(currentData);
  //     }
  //   } else {
  //     transferArrayItem(previousData, currentData, event.previousIndex, event.currentIndex);

  //     const movedTask = currentData[event.currentIndex];
  //     this.handleTaskAssignmentChange(event, movedTask);
  //   }
  // }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      return;
    } else {
      const movedTask = event.previousContainer.data[event.previousIndex];
      const targetId = event.container.id;

      if (targetId !== 'todoList') {
        this.diverSortService.addTaskToDriver(Number(targetId), movedTask);
      }

      this.handleTaskAssignmentChange(event, movedTask);
    }
  }

  // private handleTaskAssignmentChange(event: CdkDragDrop<Task[]>, task: Task) {
  //   task.status = event.container.id !== 'todoList' ? 'Assigned' : 'Unassigned';

  //   this.taskSortService
  //     .updateTask(task)
  //     .pipe(
  //       takeUntilDestroyed(this.destroyRef),
  //       tap(() => console.log(`同步任務狀態變更: ${task.title} -> ${task.status}`)),
  //     )
  //     .subscribe(() => {
  //       console.log(`後端同步成功: ${task.title}`);
  //     });
  // }

  // private handleTaskAssignmentChange(event: CdkDragDrop<Task[]>, task: Task) {
  //   const newStatus: Task['status'] = event.container.id !== 'todoList' ? 'Assigned' : 'Unassigned';

  //   const updatedTask: Task = {
  //     ...task,
  //     status: newStatus,
  //   };

  //   this.taskSortService
  //     .updateTask(updatedTask)
  //     .pipe(takeUntilDestroyed(this.destroyRef))
  //     .subscribe(() => {
  //       console.log(`[${newStatus}] 同步成功: ${task.title}`);
  //     });
  // }

  private handleTaskAssignmentChange(event: CdkDragDrop<Task[]>, task: Task) {
    const targetId = event.container.id;
    const isAssigning = targetId !== 'todoList';

    if (isAssigning && task.status !== 'Unassigned') {
      console.warn('該任務已被指派或狀態異常，無法重複指派');
      return;
    }

    if (!isAssigning && task.status === 'Unassigned') {
      return;
    }

    const newStatus: Task['status'] = isAssigning ? 'Assigned' : 'Unassigned';

    const updatedTask: Task = {
      ...task,
      status: newStatus,
    };

    this.taskSortService.updateTask(updatedTask).subscribe();

    if (isAssigning) {
      this.diverSortService.addTaskToDriver(Number(targetId), updatedTask);
    }
  }
}
