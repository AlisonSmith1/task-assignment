import { Task } from './task.model';

export interface Driver {
  id: number;
  name: string;
  tasks: Task[];
}
