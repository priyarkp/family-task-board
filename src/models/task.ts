export type TaskSource = 'google' | 'apple' | 'outlook' | 'manual';
export type TaskType = 'event' | 'todo';
export type TaskStatus = 'pending' | 'completed';
export type FamilyMembers = 'mom' | 'dad' | 'tiny1' | 'tiny2';
export type Priority = 'urgent' | 'whenever' | 'meh';
export interface Task {
    readonly id : string;
    title : string;
    source: TaskSource;
    type: TaskType;
    status: TaskStatus;
    assignedTo: FamilyMembers;
    priority: Priority;
    dueDate ?: Date;
    description?: string;
}