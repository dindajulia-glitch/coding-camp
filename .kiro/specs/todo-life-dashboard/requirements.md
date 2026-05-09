# Requirements Document

## Introduction

The To-Do List Life Dashboard is a browser-based web application that helps users organize their day from a single, clean interface. It displays the current time and date with a personalized greeting, a Pomodoro-style focus timer, a task management list, and a quick-links panel for favorite websites. All data is persisted client-side using the browser's Local Storage API. The app is built with HTML, CSS, and Vanilla JavaScript — no frameworks, no backend, no build step required.

The user has selected the following optional challenges to implement:
- Light / Dark mode toggle
- Custom name in greeting
- Configurable Pomodoro duration
- Prevent duplicate tasks
- Sort tasks

## Glossary

- **Dashboard**: The main web page that contains all four feature panels.
- **Greeting_Panel**: The UI section that displays the current time, date, and a personalized greeting message.
- **Clock**: The component within the Greeting_Panel that shows the live current time and date.
- **Focus_Timer**: The Pomodoro-style countdown timer component with configurable duration.
- **Task_List**: The component that manages and displays the user's to-do items.
- **Task**: A single to-do item with a title, completion status, and creation timestamp.
- **Quick_Links**: The component that displays and manages user-defined shortcut buttons to external websites.
- **Link**: A single quick-link entry with a label and a URL.
- **Storage**: The browser's Local Storage API used to persist all user data.
- **Theme_Controller**: The component responsible for toggling and persisting the light/dark color theme.
- **User_Name**: The custom name entered by the user, displayed in the greeting message.

---

## Requirements

### Requirement 1: Greeting Panel — Time, Date, and Greeting

**User Story:** As a user, I want to see the current time, date, and a greeting based on the time of day, so that I feel welcomed and oriented when I open the dashboard.

#### Acceptance Criteria

1. THE Clock SHALL display the current time in HH:MM:SS format, updating every second.
2. THE Clock SHALL display the current date in a human-readable format (e.g., "Monday, 5 May 2025").
3. WHEN the current hour is between 05:00 and 11:59, THE Greeting_Panel SHALL display the message "Good Morning".
4. WHEN the current hour is between 12:00 and 17:59, THE Greeting_Panel SHALL display the message "Good Afternoon".
5. WHEN the current hour is between 18:00 and 20:59, THE Greeting_Panel SHALL display the message "Good Evening".
6. WHEN the current hour is between 21:00 and 04:59, THE Greeting_Panel SHALL display the message "Good Night".
7. WHERE a User_Name has been saved, THE Greeting_Panel SHALL append the User_Name to the greeting (e.g., "Good Morning, Alex!").

---

### Requirement 2: Custom Name in Greeting

**User Story:** As a user, I want to enter my name so that the greeting feels personal and addresses me directly.

#### Acceptance Criteria

1. THE Dashboard SHALL provide an input field for the user to enter their User_Name.
2. WHEN the user submits a non-empty User_Name, THE Storage SHALL save the User_Name under the key `userName`.
3. WHEN the Dashboard loads, THE Dashboard SHALL read the `userName` key from Storage and pre-populate the name input field with the saved value.
4. IF the user submits an empty User_Name, THEN THE Dashboard SHALL display a validation message indicating the name field cannot be empty.
5. THE Dashboard SHALL accept a User_Name between 1 and 30 characters in length.

---

### Requirement 3: Focus Timer (Pomodoro)

**User Story:** As a user, I want a focus timer I can start, stop, and reset, so that I can manage my work sessions using the Pomodoro technique.

#### Acceptance Criteria

1. THE Focus_Timer SHALL display the remaining time in MM:SS format.
2. WHEN the user clicks the Start button, THE Focus_Timer SHALL begin counting down from the configured duration.
3. WHEN the user clicks the Stop button, THE Focus_Timer SHALL pause the countdown at the current remaining time.
4. WHEN the user clicks the Reset button, THE Focus_Timer SHALL stop the countdown and restore the display to the configured duration.
5. WHEN the Focus_Timer countdown reaches 00:00, THE Focus_Timer SHALL stop automatically and display a visual notification to the user.
6. WHILE the Focus_Timer is counting down, THE Focus_Timer SHALL disable the Start button and enable the Stop and Reset buttons.
7. WHILE the Focus_Timer is stopped or reset, THE Focus_Timer SHALL enable the Start button and disable the Stop button.

---

### Requirement 4: Configurable Pomodoro Duration

**User Story:** As a user, I want to set a custom focus timer duration, so that I can adapt the timer to my preferred work session length.

#### Acceptance Criteria

1. THE Dashboard SHALL provide an input field for the user to enter a custom timer duration in minutes.
2. THE Focus_Timer SHALL accept a duration between 1 and 120 minutes.
3. WHEN the user saves a valid custom duration, THE Storage SHALL persist the duration under the key `pomoDuration`.
4. WHEN the Dashboard loads, THE Focus_Timer SHALL read the `pomoDuration` key from Storage and initialize the timer display with the saved duration.
5. IF the user enters a duration outside the range of 1 to 120 minutes, THEN THE Dashboard SHALL display a validation message and reject the input.
6. WHEN a new duration is saved, THE Focus_Timer SHALL reset to the new duration immediately if the timer is not currently running.

---

### Requirement 5: To-Do List — Add, Edit, Complete, and Delete Tasks

**User Story:** As a user, I want to add, edit, mark as done, and delete tasks, so that I can manage my daily to-do list effectively.

#### Acceptance Criteria

1. THE Task_List SHALL provide a text input and an "Add" button for creating new Tasks.
2. WHEN the user submits a non-empty task title, THE Task_List SHALL add the new Task to the list and save it to Storage under the key `tasks`.
3. IF the user submits an empty task title, THEN THE Task_List SHALL display a validation message and not add the Task.
4. WHEN the user clicks the complete toggle on a Task, THE Task_List SHALL update the Task's completion status and apply a visual strikethrough style to the task title.
5. WHEN the user clicks the edit button on a Task, THE Task_List SHALL replace the task title with an editable input field pre-filled with the current title.
6. WHEN the user confirms an edit with a non-empty title, THE Task_List SHALL update the Task's title and save the updated list to Storage.
7. WHEN the user clicks the delete button on a Task, THE Task_List SHALL remove the Task from the list and update Storage.
8. WHEN the Dashboard loads, THE Task_List SHALL read the `tasks` key from Storage and render all saved Tasks.

---

### Requirement 6: Prevent Duplicate Tasks

**User Story:** As a user, I want the dashboard to prevent me from adding duplicate tasks, so that my list stays clean and free of repeated entries.

#### Acceptance Criteria

1. WHEN the user submits a new task title, THE Task_List SHALL compare the title (case-insensitively) against all existing Task titles.
2. IF the submitted task title matches an existing Task title (case-insensitive), THEN THE Task_List SHALL display a validation message indicating the task already exists and not add the duplicate Task.
3. WHEN the user edits a Task title, THE Task_List SHALL apply the same duplicate check against all other existing Tasks (excluding the Task being edited).
4. IF an edited task title matches another existing Task title (case-insensitive), THEN THE Task_List SHALL display a validation message and not save the edit.

---

### Requirement 7: Sort Tasks

**User Story:** As a user, I want to sort my task list, so that I can view tasks in a meaningful order.

#### Acceptance Criteria

1. THE Task_List SHALL provide a sort control with the following options: "Default" (creation order), "A–Z" (alphabetical ascending), "Z–A" (alphabetical descending), "Completed Last", and "Completed First".
2. WHEN the user selects a sort option, THE Task_List SHALL re-render the task list in the selected order without modifying the underlying saved order in Storage.
3. WHEN the Dashboard loads, THE Task_List SHALL default to the "Default" sort order.
4. THE Task_List SHALL preserve the original creation order in Storage regardless of the active sort option.

---

### Requirement 8: Quick Links

**User Story:** As a user, I want to save and access quick links to my favorite websites, so that I can navigate to them with a single click.

#### Acceptance Criteria

1. THE Quick_Links panel SHALL provide input fields for a link label and a URL, and an "Add" button.
2. WHEN the user submits a valid label and URL, THE Quick_Links panel SHALL add the new Link and save it to Storage under the key `quickLinks`.
3. IF the user submits an empty label or an empty URL, THEN THE Quick_Links panel SHALL display a validation message and not add the Link.
4. IF the user submits a URL that does not begin with "http://" or "https://", THEN THE Quick_Links panel SHALL prepend "https://" to the URL before saving.
5. WHEN the user clicks a Link button, THE Dashboard SHALL open the URL in a new browser tab.
6. WHEN the user clicks the delete button on a Link, THE Quick_Links panel SHALL remove the Link and update Storage.
7. WHEN the Dashboard loads, THE Quick_Links panel SHALL read the `quickLinks` key from Storage and render all saved Links.

---

### Requirement 9: Light / Dark Mode

**User Story:** As a user, I want to toggle between light and dark mode, so that I can use the dashboard comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE Dashboard SHALL provide a toggle button to switch between light and dark themes.
2. WHEN the user activates the dark mode toggle, THE Theme_Controller SHALL apply a dark color scheme to all Dashboard panels.
3. WHEN the user deactivates the dark mode toggle, THE Theme_Controller SHALL apply the light color scheme to all Dashboard panels.
4. WHEN the theme is changed, THE Storage SHALL persist the active theme under the key `theme`.
5. WHEN the Dashboard loads, THE Theme_Controller SHALL read the `theme` key from Storage and apply the saved theme before rendering content, preventing a flash of unstyled content.

---

### Requirement 10: Data Persistence and Storage

**User Story:** As a user, I want my tasks, links, name, timer settings, and theme preference to be saved automatically, so that my data is available every time I open the dashboard.

#### Acceptance Criteria

1. THE Storage SHALL persist all user data (tasks, quickLinks, userName, pomoDuration, theme) using the browser's Local Storage API.
2. WHEN any user data changes, THE Dashboard SHALL write the updated data to Storage immediately.
3. WHEN the Dashboard loads, THE Dashboard SHALL read all keys from Storage and restore the full application state before displaying content to the user.
4. IF a Storage key is missing or contains invalid data, THEN THE Dashboard SHALL fall back to a defined default value for that key without throwing an error.

---

### Requirement 11: Code Structure and Technical Constraints

**User Story:** As a developer, I want the codebase to follow the defined folder structure and use only HTML, CSS, and Vanilla JavaScript, so that the project is simple, portable, and easy to maintain.

#### Acceptance Criteria

1. THE Dashboard SHALL be delivered as a single `index.html` file, one CSS file inside a `css/` folder, and one JavaScript file inside a `js/` folder.
2. THE Dashboard SHALL use only HTML, CSS, and Vanilla JavaScript with no external frameworks, libraries, or build tools.
3. THE Dashboard SHALL function correctly in modern browsers: Chrome, Firefox, Edge, and Safari, without requiring a server or build step.
4. THE Dashboard SHALL be usable as a standalone web page opened directly from the file system (via `file://` protocol).
5. THE JavaScript file SHALL organize code into clearly named functions with single responsibilities.
6. THE CSS file SHALL define all visual styles, including light and dark theme variables, using CSS custom properties (variables).
