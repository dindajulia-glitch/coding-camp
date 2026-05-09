# Requirements Document

## Introduction

The To-Do Life Dashboard is a client-side web application that helps users organize their day from a single page. It displays the current time and date with a personalized greeting, a Pomodoro-style focus timer, a task list, and a quick-links panel. All data is persisted in the browser's Local Storage — no backend or build step is required. The application is built with plain HTML, CSS, and Vanilla JavaScript and must work in all modern browsers.

The user has selected the following three optional challenges to implement:
- Light / Dark mode toggle
- Custom name in greeting
- Change Pomodoro duration

---

## Glossary

- **Dashboard**: The single-page web application described in this document.
- **User**: The person using the Dashboard in a browser.
- **Greeting_Panel**: The UI section that displays the clock, date, and personalized greeting.
- **Timer**: The Pomodoro-style countdown timer component.
- **Task_Manager**: The UI section that manages the to-do list.
- **Task**: A single to-do item with a title and a completion status.
- **Link_Manager**: The UI section that manages quick-access website links.
- **Link**: A saved website entry consisting of a label and a URL.
- **Local_Storage**: The browser's `localStorage` API used for client-side data persistence.
- **Theme_Controller**: The component responsible for switching between light and dark visual themes.
- **Pomodoro**: A time-management technique using a focused work interval (default 25 minutes).
- **Duplicate**: A task whose title, after trimming leading and trailing whitespace and ignoring letter case, is identical to an existing task in the list.

---

## Requirements

### Requirement 1: Real-Time Clock and Date Display

**User Story:** As a User, I want to see the current time and date at a glance, so that I can stay aware of the time without switching tabs.

#### Acceptance Criteria

1. THE Greeting_Panel SHALL display the current time in HH:MM:SS format, updated every second.
2. THE Greeting_Panel SHALL display the current date in a human-readable format (e.g., "Monday, 5 May 2025").
3. WHEN the Dashboard page loads, THE Greeting_Panel SHALL begin updating the clock immediately without requiring any user interaction.
4. WHILE the Dashboard page is open, THE Greeting_Panel SHALL keep the displayed time synchronized with the system clock within a tolerance of ±1 second.

---

### Requirement 2: Time-Based Greeting

**User Story:** As a User, I want to see a greeting that reflects the time of day, so that the Dashboard feels personal and contextually relevant.

#### Acceptance Criteria

1. WHEN the current hour is between 05:00 and 11:59 (inclusive), THE Greeting_Panel SHALL display the greeting "Good Morning".
2. WHEN the current hour is between 12:00 and 17:59 (inclusive), THE Greeting_Panel SHALL display the greeting "Good Afternoon".
3. WHEN the current hour is between 18:00 and 21:59 (inclusive), THE Greeting_Panel SHALL display the greeting "Good Evening".
4. WHEN the current hour is between 22:00 and 04:59 (inclusive), THE Greeting_Panel SHALL display the greeting "Good Night".
5. WHEN the greeting changes due to a time-of-day boundary being crossed, THE Greeting_Panel SHALL update the displayed greeting without requiring a page reload.

---

### Requirement 3: Custom Name in Greeting

**User Story:** As a User, I want to enter my name so that the greeting addresses me personally.

#### Acceptance Criteria

1. THE Greeting_Panel SHALL provide a text input field and a save button for the User to enter a custom name.
2. WHEN the User submits a non-empty name, THE Greeting_Panel SHALL append the name to the greeting (e.g., "Good Morning, Dinda!").
3. WHEN the User submits an empty or whitespace-only name, THE Greeting_Panel SHALL display the greeting without a name suffix.
4. WHEN the User saves a name, THE Dashboard SHALL persist the name to Local_Storage so that it is restored on the next page load.
5. WHEN the Dashboard loads and a saved name exists in Local_Storage, THE Greeting_Panel SHALL display the personalized greeting immediately.

---

### Requirement 4: Focus Timer

**User Story:** As a User, I want a countdown timer I can start, stop, and reset, so that I can use the Pomodoro technique to stay focused.

#### Acceptance Criteria

1. THE Timer SHALL initialize with a default duration of 25 minutes (1500 seconds).
2. THE Timer SHALL display the remaining time in MM:SS format.
3. WHEN the User activates the Start button, THE Timer SHALL begin counting down one second per second.
4. WHEN the User activates the Stop button, THE Timer SHALL pause the countdown and retain the remaining time.
5. WHEN the User activates the Reset button, THE Timer SHALL stop the countdown and restore the remaining time to the configured Pomodoro duration.
6. WHEN the Timer countdown reaches 00:00, THE Timer SHALL stop automatically and notify the User that the session is complete.
7. WHILE the Timer is running, THE Timer SHALL disable the Start button and enable the Stop and Reset buttons.
8. WHILE the Timer is stopped or paused, THE Timer SHALL enable the Start button and disable the Stop button.

---

### Requirement 5: Configurable Pomodoro Duration

**User Story:** As a User, I want to set a custom Pomodoro duration, so that I can adapt the timer to my preferred work intervals.

#### Acceptance Criteria

1. THE Timer SHALL provide a numeric input field and a set button that allow the User to specify a custom duration in minutes.
2. WHEN the User submits a valid duration (a whole number between 1 and 180 inclusive), THE Timer SHALL update the Pomodoro duration and reset the countdown to the new duration.
3. IF the User submits a duration outside the range of 1 to 180 minutes, THEN THE Timer SHALL display an inline validation error and retain the previous duration.
4. WHEN a custom duration is saved, THE Dashboard SHALL persist the duration value to Local_Storage so that it is restored on the next page load.
5. WHILE the Timer is running, THE Timer SHALL disable the duration input and set button to prevent mid-session changes.

---

### Requirement 6: Task Management

**User Story:** As a User, I want to add, edit, complete, and delete tasks, so that I can track what I need to accomplish during the day.

#### Acceptance Criteria

1. THE Task_Manager SHALL provide a text input field and an add button for creating new tasks.
2. WHEN the User submits a non-empty task title, THE Task_Manager SHALL add the task to the list and clear the input field.
3. IF the User submits an empty or whitespace-only task title, THEN THE Task_Manager SHALL display an inline validation error and not add a task.
4. WHEN the User activates the complete toggle for a task, THE Task_Manager SHALL mark the task as completed and apply a visual strikethrough to the task title.
5. WHEN the User activates the complete toggle on an already-completed task, THE Task_Manager SHALL restore the task to an incomplete state.
6. WHEN the User activates the edit action for a task, THE Task_Manager SHALL replace the task title with an editable input field pre-filled with the current title.
7. WHEN the User confirms an edit with a non-empty title, THE Task_Manager SHALL update the task title and return to the display view.
8. IF the User confirms an edit with an empty or whitespace-only title, THEN THE Task_Manager SHALL display an inline validation error and retain the original title.
9. WHEN the User activates the delete action for a task, THE Task_Manager SHALL remove the task from the list permanently.
10. WHEN any task is added, edited, completed, or deleted, THE Dashboard SHALL persist the updated task list to Local_Storage.
11. WHEN the Dashboard loads, THE Task_Manager SHALL restore all previously saved tasks from Local_Storage.

---

### Requirement 7: Duplicate Task Prevention

**User Story:** As a User, I want the dashboard to prevent me from adding duplicate tasks, so that my task list stays clean and unambiguous.

#### Acceptance Criteria

1. IF the User submits a task title that, after trimming whitespace and ignoring letter case, matches an existing task title, THEN THE Task_Manager SHALL display an inline error message indicating the task already exists and not add the duplicate.
2. IF the User edits a task title to a value that, after trimming whitespace and ignoring letter case, matches a different existing task title, THEN THE Task_Manager SHALL display an inline error message and not save the edit.

---

### Requirement 8: Task Sorting

**User Story:** As a User, I want to sort my task list, so that I can view tasks in the order most useful to me.

#### Acceptance Criteria

1. THE Task_Manager SHALL provide a sort control with at least the following options: Default (insertion order), A–Z (alphabetical ascending), Z–A (alphabetical descending), Completed Last, and Completed First.
2. WHEN the User selects a sort option, THE Task_Manager SHALL reorder the displayed task list according to the selected option immediately.
3. THE Task_Manager SHALL apply sorting to the display only and SHALL NOT alter the underlying insertion order stored in Local_Storage.
4. WHEN the Dashboard loads, THE Task_Manager SHALL restore the previously selected sort option from Local_Storage and apply it to the task list.

---

### Requirement 9: Quick Links Management

**User Story:** As a User, I want to save and access my favorite websites from the Dashboard, so that I can navigate to them quickly without typing URLs.

#### Acceptance Criteria

1. THE Link_Manager SHALL provide a label input field, a URL input field, and an add button for creating new links.
2. WHEN the User submits a valid label (non-empty) and a valid URL (non-empty, well-formed), THE Link_Manager SHALL add the link to the panel.
3. IF the User submits an empty label or an invalid URL, THEN THE Link_Manager SHALL display an inline validation error for the offending field and not add the link.
4. WHEN the User activates a link button, THE Link_Manager SHALL open the saved URL in a new browser tab.
5. WHEN the User activates the delete action for a link, THE Link_Manager SHALL remove the link from the panel permanently.
6. WHEN any link is added or deleted, THE Dashboard SHALL persist the updated link list to Local_Storage.
7. WHEN the Dashboard loads, THE Link_Manager SHALL restore all previously saved links from Local_Storage.

---

### Requirement 10: Light / Dark Mode

**User Story:** As a User, I want to switch between a light and a dark visual theme, so that I can use the Dashboard comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE Theme_Controller SHALL provide a toggle button that switches the Dashboard between light mode and dark mode.
2. WHEN the User activates the theme toggle, THE Theme_Controller SHALL apply the selected theme to the entire Dashboard immediately without a page reload.
3. WHEN the User activates the theme toggle, THE Dashboard SHALL persist the selected theme to Local_Storage.
4. WHEN the Dashboard loads, THE Theme_Controller SHALL restore the previously saved theme from Local_Storage.
5. IF no theme preference is saved in Local_Storage, THEN THE Theme_Controller SHALL apply the light theme as the default.

---

### Requirement 11: Data Persistence and Restoration

**User Story:** As a User, I want my tasks, links, settings, and preferences to be saved automatically, so that my data is available the next time I open the Dashboard.

#### Acceptance Criteria

1. THE Dashboard SHALL use the browser Local_Storage API as the sole persistence mechanism; no server-side storage SHALL be used.
2. WHEN the Dashboard loads, THE Dashboard SHALL read all persisted data from Local_Storage and restore the application state before rendering the UI.
3. IF Local_Storage data for a given key is missing or contains malformed JSON, THEN THE Dashboard SHALL fall back to a safe default value for that key and continue loading without error.
4. THE Dashboard SHALL persist data synchronously at the point of each state change so that no data is lost if the browser tab is closed immediately after an interaction.

---

### Requirement 12: Responsive Layout and Browser Compatibility

**User Story:** As a User, I want the Dashboard to look good and work correctly on different screen sizes and modern browsers, so that I can use it on any device.

#### Acceptance Criteria

1. THE Dashboard SHALL render correctly and be fully usable on viewport widths from 320px to 2560px.
2. THE Dashboard SHALL use a two-column grid layout on viewports wider than 768px and a single-column layout on viewports 768px wide or narrower.
3. THE Dashboard SHALL function correctly in the current stable releases of Chrome, Firefox, Edge, and Safari without requiring any browser extensions or plugins.
4. THE Dashboard SHALL be implemented using only HTML, CSS, and Vanilla JavaScript with no external frameworks, libraries, or build tools required.

---

### Requirement 13: Performance

**User Story:** As a User, I want the Dashboard to load and respond quickly, so that it does not slow down my workflow.

#### Acceptance Criteria

1. THE Dashboard SHALL complete its initial render and display all UI panels within 2 seconds on a standard broadband connection.
2. WHEN the User performs any interaction (adding a task, toggling a theme, starting the timer), THE Dashboard SHALL reflect the change in the UI within 100 milliseconds.
3. THE Dashboard SHALL update the clock display every second without causing visible layout shifts or degrading UI responsiveness.
