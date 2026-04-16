// 歷史紀錄模型
export interface LatestOverride {
  readonly timestamp: Date;
  readonly operatorId: string;
  readonly reason: string;
  fromDriverId: number;
}

// 任務模型
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
