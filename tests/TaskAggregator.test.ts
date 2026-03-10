import { describe, it, expect, beforeAll } from 'vitest';
import { MockGoogleProvider } from '../src/providers/MockGoogleProvider.js';
import { MockAppleProvider } from '../src/providers/MockAppleProvider.js';
import { TaskAggregator } from '../src/services/TaskAggregator.js';
import type { Task } from '../src/models/task.js';

describe('Task Aggregator', () => {
  let tasks: Task[];

  beforeAll(async () => {
    const providers = [new MockAppleProvider(), new MockGoogleProvider()];
    const aggregator = new TaskAggregator(providers);
    tasks = await aggregator.getAllTasks();
  });

  it('should return all tasks from all providers', async () => {
    expect(tasks.length).toBe(3);
  });

  it('should sort tasks by due date ascending', async () => {
    const datedTasks = tasks.filter((t) => t.dueDate);
    for (let i = 0; i < datedTasks.length - 1; i++) {
      expect(datedTasks[i]!.dueDate!.getTime()).toBeLessThanOrEqual(
        datedTasks[i + 1]!.dueDate!.getTime()
      );
    }
  });

  it('should show tasks with no due date at the end', async () => {
    expect(tasks[tasks.length - 1]?.id).toBe('a-002');
  });
});
