import type { Task, TaskSource } from '../models/task.ts';
import type { ICalendarProvider } from './ICalendarProvider.ts';

export class MockAppleProvider implements ICalendarProvider {
  getProviderName(): TaskSource {
    return 'apple';
  }
  async getTasks(): Promise<Task[]> {
    return [
      {
        id: 'a-001',
        title: 'Drop-off easter baskets',
        source: this.getProviderName(),
        type: 'todo',
        status: 'pending',
        priority: 'whenever',
        assignedTo: 'mom',
        dueDate: new Date('2026-03-22'),
      },
      {
        id: 'a-002',
        title: 'Grocery shopping',
        source: this.getProviderName(),
        type: 'todo',
        status: 'pending',
        priority: 'whenever',
        assignedTo: 'mom',
        description: 'milk, eggs',
      },
    ];
  }
}
