# Family Task Board

As a busy mom, I juggle appointments, school events, and family to-dos scattered across multiple calendars. The Family Task Board is a TypeScript application that aggregates tasks and events from multiple calendar sources (Google, Apple, Outlook) into a single unified view for the whole family.

This project is a working vertical slice of a larger system — built with real-world integrations and scalability in mind.

## How to Run

**Install dependencies**

```bash
npm install
```

**Run the board**

```bash
npx tsx src/index.ts
```

**Run tests**

```bash
npm test
```

## Project Structure

```
src/
  models/
    task.ts                  # Task interface, shared types, and isOverdue helper
  providers/
    ICalendarProvider.ts     # Interface contract all calendar providers must implement
    MockGoogleProvider.ts    # Simulates Google Calendar data
    MockAppleProvider.ts     # Simulates Apple Calendar data
  services/
    TaskAggregator.ts        # Fetches, deduplicates, and sorts tasks from all providers
  index.ts                   # Entry point — wires providers together and displays the board
tests/
  TaskAggregator.test.ts     # Integration and unit tests
```

## Design Decisions

**Provider interface pattern**
All calendar sources implement a common `ICalendarProvider` interface, making it plug-and-play to add new integrations. A real `GoogleCalendarProvider` could replace the mock without changing any other part of the system. This also means a real provider would include a mapping layer to translate the raw API response (e.g. Google's `summary` and `start.dateTime`) into the common `Task` shape.

**Promise.allSettled over Promise.all**
Services go down. `Promise.allSettled` ensures that if one provider fails, the board still displays tasks from the remaining sources — rather than failing entirely. Failed providers are logged by name for visibility.

**Retry mechanism**
Network blips and third-party delays are common. Each provider call is wrapped in a retry mechanism (3 attempts by default) before being marked as failed, making the system more resilient to transient errors.

**Dedupe logic**
Many family calendars are synced with each other, so the same event can appear from multiple sources. Tasks are deduplicated by `title + dueDate` to keep the board clean and readable.

## What I'd Add Next

- Integration with real calendar APIs
- Caching the aggregated task list to avoid redundant provider fetches when filtering by member or date range
- A write-back layer so tasks can be marked complete and synced back to the source calendar
- A web interface to display the board and host it for the family to access
- CI/CD pipeline with automated test runs on every push

## Tech Stack

- **TypeScript** — strong typing catches errors early and makes the codebase easier to reason about
- **Node.js** — lightweight runtime, no framework overhead needed for this project
- **Vitest** — native ESM and TypeScript support with minimal configuration
