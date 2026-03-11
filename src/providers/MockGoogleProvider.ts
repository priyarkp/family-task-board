import type { Task, TaskSource } from '../models/task.ts';
import type { ICalendarProvider } from './ICalendarProvider.ts';

export class MockGoogleProvider implements ICalendarProvider {
  getProviderName(): TaskSource {
    return 'google';
  }
  async getTasks(): Promise<Task[]> {
    return [
      {
        id: 'g-001',
        title: 'Swim class',
        source: this.getProviderName(),
        type: 'event',
        status: 'pending',
        priority: 'urgent',
        assignedTo: 'tiny1',
        dueDate: new Date('2026-03-30T12:00:00'),
      },
      {
        id: 'g-002',
        title: 'Soccer practice',
        source: this.getProviderName(),
        type: 'event',
        status: 'pending',
        priority: 'urgent',
        assignedTo: 'tiny1',
        dueDate: new Date('2026-03-16T12:00:00'),
      },
      {
        id: 'g-003',
        title: 'Field trip form',
        source: this.getProviderName(),
        type: 'event',
        status: 'pending',
        priority: 'urgent',
        assignedTo: 'tiny2',
        dueDate: new Date('2026-03-10T12:00:00'),
      },
    ];
  }
}
