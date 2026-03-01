import { Task } from './core/models/task.model';

const getPriorityWeight = (priority: 'High' | 'Medium' | 'Low'): number => {
  switch (priority) {
    case 'High':
      return 3;
    case 'Medium':
      return 2;
    case 'Low':
      return 1;
    default:
      return 0;
  }
};

// 主要的排序比較函數
const taskComparator = (a: Task, b: Task): number => {
  // 第一層：比優先級 (Priority) - 權重大的排前面
  const priorityDiff = getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
  if (priorityDiff !== 0) {
    return priorityDiff;
  }

  // 第二層：如果優先級一樣，比截止日期 (Deadline)
  // 技巧：沒日期的給它一個超大的時間戳記 (9999年)，讓它排在最後面
  const timeA = a.deadline ? a.deadline.getTime() : new Date('9999-12-31').getTime();
  const timeB = b.deadline ? b.deadline.getTime() : new Date('9999-12-31').getTime();

  if (timeA !== timeB) {
    return timeA - timeB;
  }

  // 第三層：如果前兩項都平手，比建立時間 (CreatedAt)
  return a.createdAt.getTime() - b.createdAt.getTime(); // 早建立的排前面
};
