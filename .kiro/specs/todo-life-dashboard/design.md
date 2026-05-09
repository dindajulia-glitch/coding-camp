# Design Document: To-Do Life Dashboard

## Overview

The To-Do Life Dashboard is a single-page, client-side web application built with HTML, CSS, and Vanilla JavaScript. It provides four functional panels on one screen: a Greeting Panel (live clock + personalized greeting), a Focus Timer (Pomodoro-style countdown), a To-Do List (task management), and a Quick Links panel (favorite website shortcuts). All state is persisted in the browser's Local Storage. The app requires no server, no build step, and works directly from the file system via `file://`.

### Design Goals

- **Zero dependencies**: No frameworks, no libraries, no CDN imports.
- **Offline-first**: Fully functional without a network connection.
- **Portable**: A single folder that can be opened on any modern browser.
- **Maintainable**: Clear separation of concerns through well-named functions with single responsibilities.

---

## Architecture

The application follows a simple **event-driven, module-function** architecture. There is no virtual DOM, no reactive state system, and no component framework. Instead, the JavaScript file is organized into logical sections (modules by convention), each owning a specific feature area.

```
todo-life-dashboard/
├── index.html          # Single HTML entry point, all markup
├── css/
│   └── style.css       # All styles, light/dark theme via CSS custom properties
└── js/
    └── app.js          # All JavaScript logic, organized into named function groups
```

### Data Flow

```
User Interaction
      │
      ▼
Event Listener (app.js)
      │
      ▼
Handler Function  ──► Validate Input
      │
      ▼
Update In-Memory State
      │
      ├──► Persist to Local Storage
      │
      └──► Re-render DOM
```

### Rendering Strategy

The app uses **direct DOM manipulation** — no templating engine. Each feature section has a dedicated render function (e.g., `renderTasks()`, `renderLinks()`) that rebuilds the relevant DOM nodes from the current in-memory state array. This keeps rendering predictable and easy to reason about.

---

## Components and Interfaces

### 1. Clock / Greeting Panel

**Responsibility**: Display live time, date, and a time-of-day greeting with the user's name.

**Key functions**:
- `startClock()` — sets up a `setInterval` that calls `updateClock()` every 1000 ms.
- `updateClock()` — reads `new Date()`, formats time (HH:MM:SS) and date (weekday, day month year), writes to DOM.
- `getGreeting(hour)` — pure function; maps an hour (0–23) to a greeting string.
- `renderGreeting()` — reads `state.userName` and calls `getGreeting()` to compose and display the full greeting.

**Greeting hour ranges**:
| Range | Message |
|---|---|
| 05–11 | Good Morning |
| 12–17 | Good Afternoon |
| 18–20 | Good Evening |
| 21–04 | Good Night |

---

### 2. Custom Name

**Responsibility**: Allow the user to enter and persist a display name.

**Key functions**:
- `loadUserName()` — reads `localStorage.getItem('userName')`, populates the name input field and `state.userName`.
- `saveUserName(name)` — validates non-empty (1–30 chars), writes to `localStorage`, updates `state.userName`, calls `renderGreeting()`.
- `validateUserName(name)` — pure function; returns `{ valid: boolean, error: string }`.

---

### 3. Focus Timer (Pomodoro)

**Responsibility**: Countdown timer with start, stop, and reset controls.

**Key functions**:
- `loadPomoDuration()` — reads `localStorage.getItem('pomoDuration')`, falls back to 25 minutes.
- `savePomoDuration(minutes)` — validates range 1–120, persists, resets timer if not running.
- `startTimer()` — sets `state.timerRunning = true`, starts `setInterval` calling `tickTimer()` every 1000 ms, updates button states.
- `stopTimer()` — clears interval, sets `state.timerRunning = false`, updates button states.
- `resetTimer()` — calls `stopTimer()`, restores `state.timerRemaining` to configured duration, updates display.
- `tickTimer()` — decrements `state.timerRemaining` by 1; if 0, calls `timerComplete()`.
- `timerComplete()` — stops timer, shows visual notification (e.g., flashing display or alert banner).
- `formatTime(seconds)` — pure function; converts total seconds to `MM:SS` string.
- `updateTimerDisplay()` — writes formatted time to DOM, updates button enabled/disabled states.

---

### 4. To-Do List

**Responsibility**: Add, edit, complete, delete, and sort tasks.

**Key functions**:
- `loadTasks()` — reads `localStorage.getItem('tasks')`, parses JSON, populates `state.tasks`.
- `saveTasks()` — serializes `state.tasks` to JSON, writes to `localStorage`.
- `addTask(title)` — validates non-empty, checks for duplicates (case-insensitive), creates task object, pushes to `state.tasks`, calls `saveTasks()` and `renderTasks()`.
- `deleteTask(id)` — filters `state.tasks` by id, calls `saveTasks()` and `renderTasks()`.
- `toggleTask(id)` — flips `completed` boolean on matching task, calls `saveTasks()` and `renderTasks()`.
- `beginEditTask(id)` — replaces task title element with an `<input>` pre-filled with current title.
- `confirmEditTask(id, newTitle)` — validates non-empty and no duplicate (excluding self), updates task, calls `saveTasks()` and `renderTasks()`.
- `getSortedTasks(tasks, sortOption)` — pure function; returns a sorted copy of the tasks array without mutating the original.
- `renderTasks()` — reads `state.activeSortOption`, calls `getSortedTasks()`, rebuilds task list DOM.
- `isDuplicateTitle(title, excludeId)` — pure function; case-insensitive check against `state.tasks`.

**Task object shape**:
```js
{
  id: string,        // crypto.randomUUID() or Date.now().toString()
  title: string,
  completed: boolean,
  createdAt: number  // Unix timestamp ms
}
```

---

### 5. Quick Links

**Responsibility**: Add, display, and delete shortcut links.

**Key functions**:
- `loadLinks()` — reads `localStorage.getItem('quickLinks')`, parses JSON, populates `state.links`.
- `saveLinks()` — serializes `state.links` to JSON, writes to `localStorage`.
- `addLink(label, url)` — validates non-empty label and url, normalizes URL (prepend `https://` if missing scheme), creates link object, calls `saveLinks()` and `renderLinks()`.
- `deleteLink(id)` — filters `state.links` by id, calls `saveLinks()` and `renderLinks()`.
- `normalizeUrl(url)` — pure function; prepends `https://` if url does not start with `http://` or `https://`.
- `renderLinks()` — rebuilds quick links DOM from `state.links`.

**Link object shape**:
```js
{
  id: string,
  label: string,
  url: string
}
```

---

### 6. Theme Controller

**Responsibility**: Toggle and persist light/dark theme.

**Key functions**:
- `loadTheme()` — reads `localStorage.getItem('theme')`, applies theme class to `<body>` before first paint.
- `toggleTheme()` — flips `state.theme` between `'light'` and `'dark'`, applies class to `<body>`, persists to `localStorage`.
- `applyTheme(theme)` — sets/removes `data-theme="dark"` attribute on `<html>` element.

---

### 7. Storage / State

**Responsibility**: Centralized in-memory state object and storage helpers.

**In-memory state object**:
```js
const state = {
  userName: '',
  tasks: [],
  links: [],
  pomoDuration: 25,      // minutes
  timerRemaining: 1500,  // seconds
  timerRunning: false,
  timerId: null,
  theme: 'light',
  activeSortOption: 'default'
};
```

**Storage keys**:
| Key | Type | Default |
|---|---|---|
| `userName` | string | `''` |
| `tasks` | JSON array | `[]` |
| `quickLinks` | JSON array | `[]` |
| `pomoDuration` | number (string in LS) | `25` |
| `theme` | `'light'` \| `'dark'` | `'light'` |

**Storage helpers**:
- `loadAll()` — called on `DOMContentLoaded`; reads all keys, populates `state`, renders all panels.
- `safeParseJSON(value, fallback)` — pure function; wraps `JSON.parse` in try/catch, returns `fallback` on error or null.

---

## Data Models

### Task

```
Task {
  id:        string   — unique identifier (UUID or timestamp string)
  title:     string   — task description (non-empty, unique case-insensitively)
  completed: boolean  — whether the task is done
  createdAt: number   — Unix timestamp (ms) of creation
}
```

### Link

```
Link {
  id:    string  — unique identifier
  label: string  — display text for the button (non-empty)
  url:   string  — fully-qualified URL (always starts with http:// or https://)
}
```

### Validation Rules Summary

| Field | Rule |
|---|---|
| `userName` | 1–30 characters, non-empty |
| `task.title` | Non-empty, case-insensitively unique across all tasks |
| `pomoDuration` | Integer 1–120 (minutes) |
| `link.label` | Non-empty |
| `link.url` | Non-empty; normalized to include `https://` scheme |

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Greeting maps every hour to exactly one message

*For any* integer hour in the range 0–23, `getGreeting(hour)` SHALL return exactly one of the four greeting strings ("Good Morning", "Good Afternoon", "Good Evening", "Good Night") and never return an empty string or an unrecognized value.

**Validates: Requirements 1.3, 1.4, 1.5, 1.6**

---

### Property 2: User name validation rejects out-of-range lengths

*For any* string whose length is 0 or greater than 30, `validateUserName(name)` SHALL return `{ valid: false }`. *For any* string whose length is between 1 and 30 (inclusive), it SHALL return `{ valid: true }`.

**Validates: Requirements 2.4, 2.5**

---

### Property 3: Timer format round-trip

*For any* integer number of seconds in the range 0–7200 (0 to 120 minutes), `formatTime(seconds)` SHALL return a string matching the pattern `MM:SS` where `MM` and `SS` are zero-padded two-digit numbers, and parsing that string back to total seconds SHALL yield the original value.

**Validates: Requirements 3.1**

---

### Property 4: Pomodoro duration validation rejects out-of-range values

*For any* numeric input outside the range 1–120, the duration validator SHALL reject it. *For any* integer in 1–120, it SHALL accept it.

**Validates: Requirements 4.2, 4.5**

---

### Property 5: Adding a task grows the list and persists it

*For any* task list state and any valid (non-empty, non-duplicate) task title, calling `addTask(title)` SHALL increase `state.tasks.length` by exactly 1, and the new task SHALL be retrievable from the serialized Storage value.

**Validates: Requirements 5.2**

---

### Property 6: Empty and whitespace-only task titles are rejected

*For any* string composed entirely of whitespace characters (including the empty string), `addTask` SHALL not add a task and `state.tasks` SHALL remain unchanged.

**Validates: Requirements 5.3**

---

### Property 7: Duplicate task titles are rejected (case-insensitive)

*For any* existing task title T in `state.tasks`, attempting to add a new task whose title equals T under case-insensitive comparison SHALL be rejected, and `state.tasks.length` SHALL remain unchanged.

**Validates: Requirements 6.1, 6.2**

---

### Property 8: Edit duplicate check excludes the task being edited

*For any* task T being edited, if the new title equals T's own current title (case-insensitively), the edit SHALL be accepted. The duplicate check SHALL only compare against all *other* tasks.

**Validates: Requirements 6.3, 6.4**

---

### Property 9: Sorting does not mutate the stored task order

*For any* task list and any sort option, calling `getSortedTasks(tasks, sortOption)` SHALL return a new array with the correct order and SHALL NOT modify the original `tasks` array or the value stored in Local Storage.

**Validates: Requirements 7.2, 7.4**

---

### Property 10: URL normalization always produces a valid scheme

*For any* URL string, `normalizeUrl(url)` SHALL return a string that starts with either `http://` or `https://`. If the input already has a valid scheme, it SHALL be returned unchanged.

**Validates: Requirements 8.4**

---

### Property 11: Storage round-trip preserves task data

*For any* array of Task objects, serializing with `JSON.stringify` and deserializing with `safeParseJSON` SHALL produce an array that is deeply equal to the original (same ids, titles, completion states, and timestamps).

**Validates: Requirements 10.1, 10.3**

---

### Property 12: safeParseJSON returns fallback on invalid input

*For any* string that is not valid JSON, `safeParseJSON(value, fallback)` SHALL return the `fallback` value without throwing an exception.

**Validates: Requirements 10.4**

---

## Error Handling

### Validation Errors (User-Facing)

All validation errors are displayed inline near the relevant input field. No `alert()` or `confirm()` dialogs are used.

| Scenario | Message |
|---|---|
| Empty task title | "Task title cannot be empty." |
| Duplicate task title | "A task with this name already exists." |
| Empty user name | "Name cannot be empty." |
| User name too long | "Name must be 30 characters or fewer." |
| Invalid Pomodoro duration | "Duration must be between 1 and 120 minutes." |
| Empty link label | "Link label cannot be empty." |
| Empty link URL | "Link URL cannot be empty." |

Validation messages are cleared when the user begins typing in the relevant field.

### Storage Errors

- `safeParseJSON` wraps all `JSON.parse` calls. On failure, the feature falls back to its default value (empty array, default duration, etc.).
- If `localStorage` is unavailable (e.g., private browsing with storage blocked), the app degrades gracefully: it still functions in-memory for the session but does not persist data. A console warning is emitted.

### Timer Edge Cases

- If the timer reaches 0 while the tab is in the background, the `timerComplete()` handler fires correctly on the next tick.
- Rapid clicking of Start/Stop is safe because `startTimer()` checks `state.timerRunning` before creating a new interval.

---

## Testing Strategy

### Approach

Because this is a pure HTML/CSS/Vanilla JS application with no build step, tests are written as standalone JavaScript test files that can be run in a browser console or with Node.js (for pure functions). The recommended library is **[fast-check](https://github.com/dubzzz/fast-check)** for property-based testing of pure functions.

### Unit Tests (Example-Based)

Focus on specific behaviors and integration points:

- Clock renders correct HH:MM:SS format for a known `Date` object.
- `getGreeting(10)` returns "Good Morning".
- `addTask` with a valid title adds exactly one task.
- `toggleTask` flips the `completed` flag.
- `deleteTask` removes the correct task by id.
- `loadAll()` with empty storage initializes all defaults correctly.
- Theme toggle applies and removes the `data-theme` attribute.
- Timer buttons are correctly enabled/disabled in each state.

### Property-Based Tests

Using **fast-check**, each correctness property from the design is implemented as a single property test with a minimum of **100 iterations**.

Each test is tagged with a comment in the format:
`// Feature: todo-life-dashboard, Property N: <property_text>`

| Property | Test Description |
|---|---|
| P1 | `fc.integer({min:0, max:23})` → `getGreeting` always returns one of 4 known strings |
| P2 | `fc.string()` → `validateUserName` accepts iff length is 1–30 |
| P3 | `fc.integer({min:0, max:7200})` → `formatTime` produces valid MM:SS, round-trips correctly |
| P4 | `fc.integer()` → duration validator accepts iff value is 1–120 |
| P5 | `fc.array(taskArb)` + `fc.string({minLength:1})` → `addTask` grows list by 1 and persists |
| P6 | `fc.string()` filtered to whitespace-only → `addTask` rejects and list unchanged |
| P7 | `fc.array(taskArb, {minLength:1})` → adding duplicate title rejected |
| P8 | `fc.array(taskArb, {minLength:1})` → editing task to its own title accepted |
| P9 | `fc.array(taskArb)` + `fc.constantFrom(sortOptions)` → `getSortedTasks` does not mutate original |
| P10 | `fc.string()` → `normalizeUrl` always returns string starting with `http://` or `https://` |
| P11 | `fc.array(taskArb)` → JSON round-trip preserves all fields |
| P12 | `fc.string()` filtered to invalid JSON → `safeParseJSON` returns fallback |

### Integration / Smoke Tests

- Open `index.html` in each target browser (Chrome, Firefox, Edge, Safari) and verify:
  - Clock ticks every second.
  - Theme persists across page reload.
  - Tasks and links survive a page reload.
  - Timer completes and shows notification at 00:00.
  - All four panels render without console errors.
