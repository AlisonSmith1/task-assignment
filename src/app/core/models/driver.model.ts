import { Task } from './task.model';

// 司機模型
export interface Driver {
  id: number;
  name: string;
  tasks: Task[];
}
