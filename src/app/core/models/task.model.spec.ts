import { Task } from './task.model';

describe('Task', () => {
  it('should have a type definition', () => {
    const task: Task = {
      id: 1,
      createdAt: new Date(),
      title: 'Test Task',
      description: 'Test Desc',
      priority: 'High',
      status: 'Unassigned',
      overrideHistory: []
    };
    expect(task).toBeTruthy();
  });
});
