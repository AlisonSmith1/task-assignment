export interface LatestOverride {
  readonly timestamp: Date;
  readonly operatorId: string;
  readonly reason: string;
  fromDriverId: number;
}

export class Task {
  readonly id: number = 0;
  readonly createdAt: Date = new Date();

  title: string = '';
  description: string = '';
  priority: 'High' | 'Medium' | 'Low' = 'Low';
  status: 'Unassigned' | 'Assigned' | 'Accepted' = 'Unassigned';
  deadline?: Date;
  overrideHistory: LatestOverride[] = []; // 異常回溯
}
