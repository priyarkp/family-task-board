import type { ICalendarProvider } from '../providers/ICalendarProvider.ts';
import type { FamilyMembers, Task } from '../models/task.ts';

export class TaskAggregator {
  constructor(private providers: ICalendarProvider[]) {}

  async getAllTasks(): Promise<Task[]> {
    // Get tasks from available providers in parallel, capture success/failure status of each
    const results = await Promise.allSettled(
      this.providers.map((p) =>
        this.withRetry(() => p.getTasks(), p.getProviderName())
      )
    );
    const tasks = results
      .filter(
        (r): r is PromiseFulfilledResult<Task[]> => r.status === 'fulfilled'
      ) // Keep only successful providers, discard failed ones
      .flatMap((r) => r.value);
    return this.dedupe(tasks).sort(this.sortByDueDate);
  }

  // Retry mechanism to handle network blips
  private async withRetry<T>(
    fn: () => Promise<T>,
    providerName: string,
    retries: number = 3 // 3 retry attempts by default
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries === 0) {
        console.error(
          `Provider "${providerName}" failed after all retries`,
          error
        );
        throw error;
      }
      console.warn(
        `Provider "${providerName}" failed. Retrying... ${retries} retries left`
      );
      return this.withRetry(fn, providerName, retries - 1);
    }
  }

  // Remove duplicates from multiple providers - filter by title and due date
  private dedupe(items: Task[]): Task[] {
    const seen = new Set<string>();
    return items.filter((item) => {
      const key = `${item.title}-${item.dueDate?.toDateString()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // Sort results by due date, undated tasks go last
  private sortByDueDate(a: Task, b: Task): number {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.getTime() - b.dueDate.getTime(); // earlier date first
  }

  public async getTasksFor(member: FamilyMembers): Promise<Task[]> {
    const tasks = await this.getAllTasks();
    return tasks.filter((task) => task.assignedTo === member);
  }

  public async getTasksForWeek(): Promise<Task[]> {
    const today = new Date();
    const weekFromNow = new Date();
    weekFromNow.setDate(today.getDate() + 7);

    const tasks = await this.getAllTasks();
    return tasks.filter(
      (task) =>
        task.dueDate && task.dueDate >= today && task.dueDate <= weekFromNow
    );
  }
}
