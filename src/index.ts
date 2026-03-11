import { MockAppleProvider } from './providers/MockAppleProvider.js';
import { MockGoogleProvider } from './providers/MockGoogleProvider.js';
import { TaskAggregator } from './services/TaskAggregator.js';
import { isOverdue } from './models/task.js';

async function main() {
  const providers = [new MockAppleProvider(), new MockGoogleProvider()];
  const aggregator = new TaskAggregator(providers);
  const tasks = await aggregator.getAllTasks();
  console.log('---Family Tasks---');
  tasks.forEach((task) => {
    const overdueFlag = isOverdue(task) ? '⚠️ OVERDUE ' : '';
    console.log(
      `- [${task.priority.toUpperCase()}] ${overdueFlag}${task.title} | ${task.assignedTo ?? 'unassigned'} | due: ${task.dueDate?.toDateString() ?? 'no date'} | source: ${task.source}`
    );
  });

  // Show only mom's tasks
  const momTasks = await aggregator.getTasksFor('mom');
  console.log(`---Mom's Tasks---`);
  momTasks.forEach((task) => {
    console.log(
      `- [${task.priority.toUpperCase()}] ${task.title} | due: ${task.dueDate?.toDateString() ?? 'no date'} | source: ${task.source}`
    );
  });

  // Show all tasks in the next 7 days
  const weeklyTasks = await aggregator.getTasksForWeek();
  console.log(`---This Week's Tasks---`);
  weeklyTasks.forEach((task) => {
    console.log(
      `- [${task.priority.toUpperCase()}] ${task.title} | ${task.assignedTo ?? 'unassigned'} | due: ${task.dueDate?.toDateString() ?? 'no date'} | source: ${task.source}`
    );
  });

  const overdueCount = tasks.filter((t) => isOverdue(t)).length;
  const thisWeekCount = weeklyTasks.length;

  console.log(
    `\n✅ ${tasks.length} tasks loaded from ${providers.length} providers | ${overdueCount} overdue | ${thisWeekCount} due this week`
  );
}

main();
