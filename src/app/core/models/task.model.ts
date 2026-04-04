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
  driverId?: number;
  description: string = '';
  priority: 'High' | 'Medium' | 'Low' = 'Low';
  status: 'Unassigned' | 'Assigned' | 'Accepted' | 'Completed' = 'Unassigned';
  deadline?: Date;
  overrideHistory: LatestOverride[] = [];
  snapshot?: {
    title: string;
    description: string;
  };
}
