import type { ICalendarProvider } from '../providers/ICalendarProvider.ts';
import type { Task } from '../models/task.ts';

export class TaskAggregator {
  constructor(private providers: ICalendarProvider[]) {}

  async getAllTasks(): Promise<Task[]> {
    // Get tasks from all providers in parallel
    const results = await Promise.all(this.providers.map((p) => p.getTasks()));
    // Sort results by due date
    return results.flat().sort((a, b) => {
      if (!a.dueDate) return 1; // no due date - push a to the end
      if (!b.dueDate) return -1; // no due date - push b to the end
      return a.dueDate.getTime() - b.dueDate.getTime(); // earlier date first
    });
  }
}
