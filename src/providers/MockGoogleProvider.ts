import type { Task, TaskSource } from '../models/task.ts';
import type { ICalendarProvider } from './ICalendarProvider.ts';

export class MockGoogleProvider implements ICalendarProvider {
  getProviderName(): TaskSource {
    return 'google';
  }
  async getTasks(): Promise<Task[]> {
    return [
      {
        id: 'E001',
        title: 'Swim class',
        source: this.getProviderName(),
        type: 'event',
        status: 'pending',
        priority: 'urgent',
        assignedTo: 'tiny1',
        dueDate: new Date('2026-03-30'),
      },
    ];
  }
}
