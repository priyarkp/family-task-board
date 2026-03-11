import { describe, it, expect, beforeAll } from 'vitest';
import { MockGoogleProvider } from '../src/providers/MockGoogleProvider.js';
import { MockAppleProvider } from '../src/providers/MockAppleProvider.js';
import { TaskAggregator } from '../src/services/TaskAggregator.js';
import type { Task } from '../src/models/task.js';
import { isOverdue } from '../src/models/task.js';
import type { ICalendarProvider } from '../src/providers/ICalendarProvider.js';

describe('Task Aggregator', () => {
  let tasks: Task[];
  let momTasks: Task[];
  let weeklyTasks: Task[];

  beforeAll(async () => {
    const providers = [new MockAppleProvider(), new MockGoogleProvider()];
    const aggregator = new TaskAggregator(providers);
    tasks = await aggregator.getAllTasks();
    momTasks = await aggregator.getTasksFor('mom');
    weeklyTasks = await aggregator.getTasksForWeek();
  });

  it('should return all unique tasks from all providers', () => {
    expect(tasks.length).toBe(5);
  });

  it('should filter out duplicate tasks', async () => {
    // Create two mock providers with the same task
    const duplicateProvider1: ICalendarProvider = {
      getProviderName: () => 'google' as const,
      getTasks: async () => [
        {
          id: 'dup-001',
          title: 'Duplicate Task',
          source: 'google' as const,
          type: 'event' as const,
          status: 'pending' as const,
          priority: 'urgent' as const,
          dueDate: new Date('2026-03-30'),
        },
      ],
    };

    const duplicateProvider2: ICalendarProvider = {
      getProviderName: () => 'apple' as const,
      getTasks: async () => [
        {
          id: 'dup-002',
          title: 'Duplicate Task', // same title
          source: 'apple' as const,
          type: 'event' as const,
          status: 'pending' as const,
          priority: 'urgent' as const,
          dueDate: new Date('2026-03-30'), // same date
        },
      ],
    };

    const dedupAggregator = new TaskAggregator([
      duplicateProvider1,
      duplicateProvider2,
    ]);
    const dedupedTasks = await dedupAggregator.getAllTasks();

    expect(dedupedTasks.length).toBe(1);
  });

  it('should sort tasks by due date ascending', () => {
    const datedTasks = tasks.filter((t) => t.dueDate);
    for (let i = 0; i < datedTasks.length - 1; i++) {
      expect(datedTasks[i]!.dueDate!.getTime()).toBeLessThanOrEqual(
        datedTasks[i + 1]!.dueDate!.getTime()
      );
    }
  });

  it('should show tasks with no due date at the end', () => {
    expect(tasks[tasks.length - 1]?.id).toBe('a-002');
  });

  it('should show tasks only for mom', () => {
    momTasks.forEach((task) => {
      expect(task.assignedTo).toBe('mom');
    });
  });

  it('should show tasks due in the next 7 days', () => {
    const today = new Date();
    const weekFromNow = new Date();
    weekFromNow.setDate(today.getDate() + 7);

    weeklyTasks.forEach((task) => {
      expect(task.dueDate).toBeDefined();
      expect(task.dueDate!.getTime()).toBeGreaterThanOrEqual(today.getTime());
      expect(task.dueDate!.getTime()).toBeLessThanOrEqual(
        weekFromNow.getTime()
      );
    });
  });

  it('should show overdue flag when due date is past today', () => {
    const today = new Date();

    tasks.forEach((task) => {
      if (isOverdue(task)) {
        expect(task.status).toBe('pending');
        expect(task.dueDate).toBeDefined();
        expect(task.dueDate!.getTime()).toBeLessThanOrEqual(today.getTime());
      }
    });
  });
});
