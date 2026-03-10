import { MockAppleProvider } from './providers/MockAppleProvider.js';
import { MockGoogleProvider } from './providers/MockGoogleProvider.js';
import { TaskAggregator } from './services/TaskAggregator.js';

async function main() {
  const providers = [new MockAppleProvider(), new MockGoogleProvider()];
  const aggregator = new TaskAggregator(providers);
  const tasks = await aggregator.getAllTasks();
  console.log('---My Tasks---');
  tasks.forEach((task) => {
    console.log(
      `- [${task.priority.toUpperCase()}] ${task.title} | ${task.assignedTo ?? 'unassigned'} | due: ${task.dueDate?.toDateString() ?? 'no date'} | source: ${task.source}`
    );
  });
}

main();
