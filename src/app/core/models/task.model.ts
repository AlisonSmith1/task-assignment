export interface LatestOverride {
  readonly timestamp: Date;
  readonly operatorId: string;
  readonly reason: string;
  fromDriverId: number;
}

export interface Task {
  readonly id: number;
  readonly createdAt: Date;

  title: string;
  driverId?: number;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Unassigned' | 'Assigned' | 'Accepted' | 'Completed';
  deadline?: Date;
  overrideHistory: LatestOverride[];
  snapshot?: {
    title: string;
    description: string;
  };
}
