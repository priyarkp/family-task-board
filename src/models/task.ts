export type TaskSource = 'google' | 'apple' | 'outlook' | 'manual';
export type TaskType = 'event' | 'todo';
export type TaskStatus = 'pending' | 'completed';
export type FamilyMembers = 'mom' | 'dad' | 'tiny1' | 'tiny2';
export type Priority = 'urgent' | 'whenever' | 'meh';
export interface Task {
  readonly id: string;
  title: string;
  source: TaskSource;
  type: TaskType;
  status: TaskStatus;
  priority: Priority;
  assignedTo?: FamilyMembers;
  dueDate?: Date;
  description?: string;
}

export function isOverdue(task: Task): boolean {
  const today = new Date();
  return (
    task.status === 'pending' &&
    task.dueDate !== undefined &&
    task.dueDate < today
  );
}
