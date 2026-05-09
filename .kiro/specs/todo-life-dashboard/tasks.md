# Tasks

## Task List

- [-] 1. Project scaffold and base HTML structure
  - [-] 1.1 Create `css/style.css` with CSS custom properties for light and dark themes, reset styles, and layout grid
  - [~] 1.2 Create `js/app.js` with the top-level `state` object and `safeParseJSON` helper
  - [~] 1.3 Build `index.html` with semantic markup for all four panels (Greeting, Focus Timer, To-Do List, Quick Links) and link the CSS and JS files

- [ ] 2. Storage and state initialization
  - [ ] 2.1 Implement `safeParseJSON(value, fallback)` — wraps `JSON.parse` in try/catch and returns `fallback` on error or null input
  - [ ] 2.2 Implement `loadAll()` — reads all five Local Storage keys (`userName`, `tasks`, `quickLinks`, `pomoDuration`, `theme`), populates `state`, and calls each panel's render/init function; called on `DOMContentLoaded`

- [ ] 3. Greeting Panel — clock and greeting
  - [ ] 3.1 Implement `formatClockTime(date)` — returns current time as `HH:MM:SS` string from a `Date` object
  - [ ] 3.2 Implement `formatClockDate(date)` — returns human-readable date string (e.g., "Monday, 5 May 2025") from a `Date` object
  - [ ] 3.3 Implement `getGreeting(hour)` — pure function mapping hour (0–23) to one of four greeting strings
  - [ ] 3.4 Implement `renderGreeting()` — composes greeting with `state.userName` and writes to DOM
  - [ ] 3.5 Implement `startClock()` — sets up `setInterval` (1000 ms) calling `updateClock()` which calls `formatClockTime`, `formatClockDate`, and `renderGreeting`

- [ ] 4. Custom name feature
  - [ ] 4.1 Implement `validateUserName(name)` — returns `{ valid: boolean, error: string }`; accepts 1–30 non-empty characters
  - [ ] 4.2 Implement `saveUserName(name)` — validates, writes to `localStorage` under key `userName`, updates `state.userName`, calls `renderGreeting()`
  - [ ] 4.3 Implement `loadUserName()` — reads `userName` from storage, populates `state.userName` and pre-fills the name input field
  - [ ] 4.4 Wire up the name input form: on submit call `saveUserName`, show inline validation error on failure, clear error on input

- [ ] 5. Focus Timer (Pomodoro)
  - [ ] 5.1 Implement `formatTime(seconds)` — pure function converting total seconds (0–7200) to `MM:SS` zero-padded string
  - [ ] 5.2 Implement `updateTimerDisplay()` — writes formatted time to DOM and sets Start/Stop/Reset button enabled states based on `state.timerRunning`
  - [ ] 5.3 Implement `startTimer()` — guards against double-start, sets `state.timerRunning = true`, starts `setInterval` calling `tickTimer()` every 1000 ms
  - [ ] 5.4 Implement `tickTimer()` — decrements `state.timerRemaining`; calls `timerComplete()` when it reaches 0
  - [ ] 5.5 Implement `stopTimer()` — clears interval, sets `state.timerRunning = false`, calls `updateTimerDisplay()`
  - [ ] 5.6 Implement `resetTimer()` — calls `stopTimer()`, restores `state.timerRemaining` to `state.pomoDuration * 60`, calls `updateTimerDisplay()`
  - [ ] 5.7 Implement `timerComplete()` — calls `stopTimer()`, shows a visual notification (e.g., flashing class or banner) in the timer panel
  - [ ] 5.8 Wire up Start, Stop, and Reset button click handlers

- [ ] 6. Configurable Pomodoro duration
  - [ ] 6.1 Implement `validatePomoDuration(value)` — returns `{ valid: boolean, error: string }`; accepts integers 1–120
  - [ ] 6.2 Implement `savePomoDuration(minutes)` — validates, writes to `localStorage` under key `pomoDuration`, updates `state.pomoDuration`; if timer is not running, calls `resetTimer()`
  - [ ] 6.3 Implement `loadPomoDuration()` — reads `pomoDuration` from storage (default 25), populates `state.pomoDuration` and pre-fills the duration input
  - [ ] 6.4 Wire up the duration input form: on submit call `savePomoDuration`, show inline validation error on failure

- [ ] 7. To-Do List — core CRUD
  - [ ] 7.1 Implement `isDuplicateTitle(title, excludeId)` — pure function; case-insensitive check of `title` against all tasks in `state.tasks` except the one with `excludeId`
  - [ ] 7.2 Implement `addTask(title)` — validates non-empty (trimmed), checks `isDuplicateTitle`, creates task object (`id`, `title`, `completed: false`, `createdAt`), pushes to `state.tasks`, calls `saveTasks()` and `renderTasks()`
  - [ ] 7.3 Implement `deleteTask(id)` — filters task from `state.tasks`, calls `saveTasks()` and `renderTasks()`
  - [ ] 7.4 Implement `toggleTask(id)` — flips `completed` on matching task, calls `saveTasks()` and `renderTasks()`
  - [ ] 7.5 Implement `beginEditTask(id)` — replaces the task title element in the DOM with a pre-filled `<input>` and confirm/cancel controls
  - [ ] 7.6 Implement `confirmEditTask(id, newTitle)` — validates non-empty and calls `isDuplicateTitle(newTitle, id)`, updates task title, calls `saveTasks()` and `renderTasks()`
  - [ ] 7.7 Implement `saveTasks()` — serializes `state.tasks` to JSON and writes to `localStorage` under key `tasks`
  - [ ] 7.8 Implement `loadTasks()` — reads `tasks` from storage, parses with `safeParseJSON`, populates `state.tasks`
  - [ ] 7.9 Implement `renderTasks()` — reads `state.activeSortOption`, calls `getSortedTasks`, rebuilds task list DOM with complete/edit/delete controls and strikethrough style for completed tasks
  - [ ] 7.10 Wire up the task input form and delegate click events for complete toggle, edit, and delete buttons

- [ ] 8. Sort tasks
  - [ ] 8.1 Implement `getSortedTasks(tasks, sortOption)` — pure function returning a sorted copy of the tasks array for options: `'default'` (creation order), `'az'`, `'za'`, `'completedLast'`, `'completedFirst'`; must not mutate the input array
  - [ ] 8.2 Add sort control (select element) to the task list panel with the five options
  - [ ] 8.3 Wire up the sort control `change` event: update `state.activeSortOption` and call `renderTasks()`

- [ ] 9. Prevent duplicate tasks
  - [ ] 9.1 Integrate `isDuplicateTitle` into `addTask` (already covered in task 7.2) — verify inline validation message is shown when a duplicate is detected
  - [ ] 9.2 Integrate `isDuplicateTitle` into `confirmEditTask` (already covered in task 7.6) — verify inline validation message is shown when an edited title duplicates another task

- [ ] 10. Quick Links
  - [ ] 10.1 Implement `normalizeUrl(url)` — pure function; prepends `https://` if the URL does not already start with `http://` or `https://`
  - [ ] 10.2 Implement `addLink(label, url)` — validates non-empty label and url, calls `normalizeUrl`, creates link object (`id`, `label`, `url`), pushes to `state.links`, calls `saveLinks()` and `renderLinks()`
  - [ ] 10.3 Implement `deleteLink(id)` — filters link from `state.links`, calls `saveLinks()` and `renderLinks()`
  - [ ] 10.4 Implement `saveLinks()` — serializes `state.links` to JSON and writes to `localStorage` under key `quickLinks`
  - [ ] 10.5 Implement `loadLinks()` — reads `quickLinks` from storage, parses with `safeParseJSON`, populates `state.links`
  - [ ] 10.6 Implement `renderLinks()` — rebuilds quick links DOM; each link renders as a button/anchor with `target="_blank"` and a delete button
  - [ ] 10.7 Wire up the link input form and delegate click events for delete buttons

- [ ] 11. Light / Dark mode
  - [ ] 11.1 Implement `applyTheme(theme)` — sets `data-theme` attribute on `<html>` element to `'light'` or `'dark'`
  - [ ] 11.2 Implement `loadTheme()` — reads `theme` from storage (default `'light'`), updates `state.theme`, calls `applyTheme` before first render to prevent flash of unstyled content
  - [ ] 11.3 Implement `toggleTheme()` — flips `state.theme`, calls `applyTheme`, persists to `localStorage` under key `theme`
  - [ ] 11.4 Add dark theme CSS variable overrides in `style.css` using `[data-theme="dark"]` selector
  - [ ] 11.5 Wire up the theme toggle button click handler

- [ ] 12. Validation messages and UX polish
  - [ ] 12.1 Add inline validation message elements (e.g., `<span class="error">`) near each input in the HTML
  - [ ] 12.2 Implement `showError(elementId, message)` and `clearError(elementId)` helpers used by all validation paths
  - [ ] 12.3 Wire up `input` event listeners on all text inputs to clear their associated error message when the user starts typing

- [ ] 13. Property-based tests
  - [ ] 13.1 Set up a test file (`js/app.test.js` or `tests/pbt.js`) that imports fast-check (via CDN script tag for browser, or npm for Node) and the pure functions under test
  - [ ] 13.2 Write property test for P1: `getGreeting` maps every hour 0–23 to exactly one of the four greeting strings (min 100 iterations)
  - [ ] 13.3 Write property test for P2: `validateUserName` accepts iff string length is 1–30 (min 100 iterations)
  - [ ] 13.4 Write property test for P3: `formatTime` produces valid MM:SS strings that round-trip correctly for any seconds 0–7200 (min 100 iterations)
  - [ ] 13.5 Write property test for P4: duration validator accepts iff integer is 1–120 (min 100 iterations)
  - [ ] 13.6 Write property test for P5: `addTask` with valid title grows `state.tasks` by 1 and persists to storage (min 100 iterations)
  - [ ] 13.7 Write property test for P6: whitespace-only strings are rejected by `addTask` and list is unchanged (min 100 iterations)
  - [ ] 13.8 Write property test for P7: adding a case-variant of an existing title is rejected (min 100 iterations)
  - [ ] 13.9 Write property test for P8: editing a task to its own current title is accepted; editing to another task's title is rejected (min 100 iterations)
  - [ ] 13.10 Write property test for P9: `getSortedTasks` returns correctly ordered copy and does not mutate the original array (min 100 iterations)
  - [ ] 13.11 Write property test for P10: `normalizeUrl` always returns a string starting with `http://` or `https://` (min 100 iterations)
  - [ ] 13.12 Write property test for P11: JSON round-trip via `JSON.stringify` / `safeParseJSON` preserves all task fields (min 100 iterations)
  - [ ] 13.13 Write property test for P12: `safeParseJSON` returns fallback for any invalid JSON string without throwing (min 100 iterations)

- [ ] 14. Cross-browser smoke testing and final polish
  - [ ] 14.1 Open `index.html` in Chrome, Firefox, Edge, and Safari; verify all panels render without console errors
  - [ ] 14.2 Verify clock ticks every second and greeting updates correctly across hour boundaries
  - [ ] 14.3 Verify all data (tasks, links, name, duration, theme) persists across page reloads
  - [ ] 14.4 Verify the app works correctly when opened via `file://` protocol (no server required)
  - [ ] 14.5 Verify no flash of unstyled content on load when dark theme is saved
