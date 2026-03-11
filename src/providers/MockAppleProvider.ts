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
        dueDate: new Date('2026-03-22T12:00:00'),
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
      {
        id: 'a-003',
        title: 'Swim class',
        source: this.getProviderName(),
        type: 'event',
        status: 'pending',
        priority: 'urgent',
        assignedTo: 'tiny1',
        dueDate: new Date('2026-03-30T12:00:00'),
      },
    ];
  }
}
