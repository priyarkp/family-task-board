import type { Task, TaskSource } from '../models/task.ts';

export interface ICalendarProvider {
  getProviderName(): TaskSource;
  getTasks(): Promise<Task[]>;
}
