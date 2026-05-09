/* ============================================================
   To-Do Life Dashboard — app.js
   Vanilla JS, no frameworks, no build step required.
   ============================================================ */

'use strict';

/* ============================================================
   Global State
   ============================================================ */
const state = {
  userName: '',
  tasks: [],
  links: [],
  pomoDuration: 25,       // minutes
  timerRemaining: 1500,   // seconds (25 * 60)
  timerRunning: false,
  timerId: null,
  theme: 'light',
  activeSortOption: 'default'
};

/* ============================================================
   Storage Helpers
   ============================================================ */

/**
 * Safely parse a JSON string.
 * Returns `fallback` if `value` is null, undefined, or not valid JSON.
 *
 * @param {string|null|undefined} value - The raw string from localStorage.
 * @param {*} fallback - The value to return on failure.
 * @returns {*} Parsed value or fallback.
 */
function safeParseJSON(value, fallback) {
  if (value === null || value === undefined) {
    return fallback;
  }
  try {
    return JSON.parse(value);
  } catch (_err) {
    return fallback;
  }
}

/* ============================================================
   12. Validation Helpers
   (defined first so all other sections can call them)
   ============================================================ */

/**
 * Display an inline validation error message.
 * @param {string} elementId - The id of the <span class="error"> element.
 * @param {string} message   - The error text to display.
 */
function showError(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) el.textContent = message;
}

/**
 * Clear an inline validation error message.
 * @param {string} elementId - The id of the <span class="error"> element.
 */
function clearError(elementId) {
  const el = document.getElementById(elementId);
  if (el) el.textContent = '';
}

/* ============================================================
   3. Greeting Panel
   ============================================================ */

/**
 * Format a Date object as HH:MM:SS (zero-padded).
 * @param {Date} date
 * @returns {string} e.g. "09:05:03"
 */
function formatClockTime(date) {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

/**
 * Format a Date object as a human-readable date string.
 * e.g. "Monday, 5 May 2025"
 * @param {Date} date
 * @returns {string}
 */
function formatClockDate(date) {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Return a time-of-day greeting string based on the hour (0–23).
 * - 05–11 → "Good Morning"
 * - 12–17 → "Good Afternoon"
 * - 18–20 → "Good Evening"
 * - 21–23 or 0–4 → "Good Night"
 *
 * @param {number} hour - Integer 0–23.
 * @returns {string}
 */
function getGreeting(hour) {
  if (hour >= 5 && hour <= 11) return 'Good Morning';
  if (hour >= 12 && hour <= 17) return 'Good Afternoon';
  if (hour >= 18 && hour <= 20) return 'Good Evening';
  return 'Good Night'; // 21–23 and 0–4
}

/**
 * Compose and render the greeting text into #greeting-text.
 * Uses state.userName and the current hour.
 */
function renderGreeting() {
  const hour = new Date().getHours();
  const base = getGreeting(hour);
  const text = state.userName ? `${base}, ${state.userName}!` : base;
  const el = document.getElementById('greeting-text');
  if (el) el.textContent = text;
}

/**
 * Read the current time/date and update the clock DOM elements,
 * then re-render the greeting.
 */
function updateClock() {
  const now = new Date();
  const timeEl = document.getElementById('clock-time');
  const dateEl = document.getElementById('clock-date');
  if (timeEl) timeEl.textContent = formatClockTime(now);
  if (dateEl) dateEl.textContent = formatClockDate(now);
  renderGreeting();
}

/**
 * Start the live clock — fires immediately then every 1 second.
 */
function startClock() {
  updateClock();
  setInterval(updateClock, 1000);
}

/* ============================================================
   4. Custom Name
   ============================================================ */

/**
 * Validate a user-supplied display name.
 * @param {string} name - The raw (already-trimmed) name string.
 * @returns {{ valid: boolean, error: string }}
 */
function validateUserName(name) {
  if (name.length === 0) {
    return { valid: false, error: 'Name cannot be empty.' };
  }
  if (name.length > 30) {
    return { valid: false, error: 'Name must be 30 characters or fewer.' };
  }
  return { valid: true, error: '' };
}

/**
 * Validate and persist the user's display name.
 * On success: saves to localStorage, updates state, re-renders greeting.
 * On failure: shows inline error.
 * @param {string} name - The trimmed name value from the input.
 */
function saveUserName(name) {
  const result = validateUserName(name);
  if (!result.valid) {
    showError('name-error', result.error);
    return;
  }
  localStorage.setItem('userName', name);
  state.userName = name;
  renderGreeting();
  clearError('name-error');
}

/**
 * Load the persisted user name from localStorage and pre-fill the input.
 */
function loadUserName() {
  const saved = localStorage.getItem('userName');
  if (saved) {
    state.userName = saved;
    const input = document.getElementById('name-input');
    if (input) input.value = saved;
  }
}

/* ============================================================
   5. Focus Timer
   ============================================================ */

/**
 * Convert a total number of seconds to a MM:SS string (zero-padded).
 * @param {number} seconds - Non-negative integer.
 * @returns {string} e.g. "01:30"
 */
function formatTime(seconds) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

/**
 * Sync the timer display and button states with the current timer state.
 */
function updateTimerDisplay() {
  const display = document.getElementById('timer-display');
  if (display) display.textContent = formatTime(state.timerRemaining);

  const btnStart    = document.getElementById('btn-start');
  const btnStop     = document.getElementById('btn-stop');
  const btnReset    = document.getElementById('btn-reset');
  const durationInput = document.getElementById('duration-input');
  const durationBtn   = document.querySelector('#duration-form button[type="submit"]');

  if (state.timerRunning) {
    if (btnStart)  btnStart.disabled  = true;
    if (btnStop)   btnStop.disabled   = false;
    if (btnReset)  btnReset.disabled  = false;
    // Disable duration controls while running
    if (durationInput) durationInput.disabled = true;
    if (durationBtn)   durationBtn.disabled   = true;
  } else {
    if (btnStart)  btnStart.disabled  = false;
    if (btnStop)   btnStop.disabled   = true;
    if (btnReset)  btnReset.disabled  = false;
    // Re-enable duration controls when stopped
    if (durationInput) durationInput.disabled = false;
    if (durationBtn)   durationBtn.disabled   = false;
  }
}

/**
 * Start the countdown timer.
 * Guard: does nothing if the timer is already running.
 */
function startTimer() {
  if (state.timerRunning) return;
  state.timerRunning = true;
  // Hide any previous completion notification
  const notification = document.getElementById('timer-notification');
  if (notification) notification.classList.remove('visible');
  state.timerId = setInterval(tickTimer, 1000);
  updateTimerDisplay();
}

/**
 * Called every second while the timer is running.
 * Decrements the remaining time and checks for completion.
 */
function tickTimer() {
  state.timerRemaining -= 1;
  updateTimerDisplay();
  if (state.timerRemaining <= 0) {
    timerComplete();
  }
}

/**
 * Pause the countdown timer.
 */
function stopTimer() {
  clearInterval(state.timerId);
  state.timerId = null;
  state.timerRunning = false;
  updateTimerDisplay();
}

/**
 * Stop the timer and reset remaining time to the configured duration.
 */
function resetTimer() {
  stopTimer();
  state.timerRemaining = state.pomoDuration * 60;
  updateTimerDisplay();
  const notification = document.getElementById('timer-notification');
  if (notification) notification.classList.remove('visible');
}

/**
 * Handle timer reaching zero: stop, flash display, show notification.
 */
function timerComplete() {
  stopTimer();
  const display = document.getElementById('timer-display');
  if (display) {
    display.classList.add('timer-complete-flash');
    setTimeout(() => display.classList.remove('timer-complete-flash'), 3000);
  }
  const notification = document.getElementById('timer-notification');
  if (notification) notification.classList.add('visible');
}

/* ============================================================
   6. Configurable Pomodoro Duration
   ============================================================ */

/**
 * Validate a proposed Pomodoro duration value.
 * Must be an integer between 1 and 120 (inclusive).
 * @param {number} value
 * @returns {{ valid: boolean, error: string }}
 */
function validatePomoDuration(value) {
  if (!Number.isInteger(value) || isNaN(value) || value < 1 || value > 120) {
    return { valid: false, error: 'Duration must be between 1 and 120 minutes.' };
  }
  return { valid: true, error: '' };
}

/**
 * Validate and persist a new Pomodoro duration.
 * Resets the timer if it is not currently running.
 * @param {number} minutes
 */
function savePomoDuration(minutes) {
  const result = validatePomoDuration(minutes);
  if (!result.valid) {
    showError('duration-error', result.error);
    return;
  }
  localStorage.setItem('pomoDuration', String(minutes));
  state.pomoDuration = minutes;
  if (!state.timerRunning) {
    resetTimer();
  }
  clearError('duration-error');
}

/**
 * Load the persisted Pomodoro duration from localStorage (default 25).
 * Pre-fills the duration input and initialises timerRemaining.
 */
function loadPomoDuration() {
  const saved = localStorage.getItem('pomoDuration');
  const minutes = saved ? parseInt(saved, 10) : 25;
  state.pomoDuration = isNaN(minutes) ? 25 : minutes;
  state.timerRemaining = state.pomoDuration * 60;
  const input = document.getElementById('duration-input');
  if (input) input.value = state.pomoDuration;
}

/* ============================================================
   7. To-Do List CRUD
   ============================================================ */

/**
 * Check whether a title already exists in state.tasks (case-insensitive).
 * Optionally exclude a specific task id (used when editing).
 * @param {string} title
 * @param {string|null} [excludeId]
 * @returns {boolean}
 */
function isDuplicateTitle(title, excludeId) {
  const normalised = title.trim().toLowerCase();
  return state.tasks.some(
    t => t.id !== excludeId && t.title.toLowerCase() === normalised
  );
}

/**
 * Persist the current task list to localStorage.
 */
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(state.tasks));
}

/**
 * Load tasks from localStorage into state.tasks.
 */
function loadTasks() {
  state.tasks = safeParseJSON(localStorage.getItem('tasks'), []);
}

/**
 * Return a sorted copy of the tasks array without mutating the original.
 * @param {Array} tasks
 * @param {string} sortOption - 'default' | 'az' | 'za' | 'completedLast' | 'completedFirst'
 * @returns {Array}
 */
function getSortedTasks(tasks, sortOption) {
  const copy = [...tasks];
  switch (sortOption) {
    case 'az':
      return copy.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
    case 'za':
      return copy.sort((a, b) => b.title.toLowerCase().localeCompare(a.title.toLowerCase()));
    case 'completedLast':
      return copy.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return a.createdAt - b.createdAt;
      });
    case 'completedFirst':
      return copy.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? -1 : 1;
        return a.createdAt - b.createdAt;
      });
    case 'default':
    default:
      return copy.sort((a, b) => a.createdAt - b.createdAt);
  }
}

/**
 * Rebuild the task list DOM from the current state.
 */
function renderTasks() {
  const list = document.getElementById('task-list');
  if (!list) return;
  list.innerHTML = '';

  const sorted = getSortedTasks(state.tasks, state.activeSortOption);

  sorted.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');
    li.dataset.id = task.id;

    // Toggle / complete button
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'btn-icon';
    toggleBtn.dataset.action = 'toggle';
    toggleBtn.dataset.id = task.id;
    toggleBtn.setAttribute('aria-label', task.completed ? 'Mark incomplete' : 'Mark complete');
    toggleBtn.textContent = task.completed ? '✅' : '⬜';

    // Title span
    const titleSpan = document.createElement('span');
    titleSpan.className = 'task-title';
    titleSpan.textContent = task.title;

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'btn-icon';
    editBtn.dataset.action = 'edit';
    editBtn.dataset.id = task.id;
    editBtn.setAttribute('aria-label', 'Edit task');
    editBtn.textContent = '✏️';

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn-icon btn-danger';
    deleteBtn.dataset.action = 'delete';
    deleteBtn.dataset.id = task.id;
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.textContent = '🗑️';

    li.appendChild(toggleBtn);
    li.appendChild(titleSpan);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

/**
 * Add a new task to the list.
 * Validates for empty title and duplicates before adding.
 * @param {string} title - Raw value from the task input.
 */
function addTask(title) {
  const trimmed = title.trim();
  if (!trimmed) {
    showError('task-error', 'Task title cannot be empty.');
    return;
  }
  if (isDuplicateTitle(trimmed, null)) {
    showError('task-error', 'A task with this name already exists.');
    return;
  }
  const task = {
    id: crypto.randomUUID(),
    title: trimmed,
    completed: false,
    createdAt: Date.now()
  };
  state.tasks.push(task);
  saveTasks();
  renderTasks();
  const input = document.getElementById('task-input');
  if (input) input.value = '';
  clearError('task-error');
}

/**
 * Remove a task by id.
 * @param {string} id
 */
function deleteTask(id) {
  state.tasks = state.tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

/**
 * Toggle the completed state of a task.
 * @param {string} id
 */
function toggleTask(id) {
  const task = state.tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

/**
 * Replace a task's title span with an inline edit input.
 * @param {string} id
 */
function beginEditTask(id) {
  const task = state.tasks.find(t => t.id === id);
  if (!task) return;

  const li = document.querySelector(`li[data-id="${id}"]`);
  if (!li) return;

  const titleSpan = li.querySelector('.task-title');
  if (!titleSpan) return;

  // Build the edit input
  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.className = 'task-edit-input';
  editInput.value = task.title;
  editInput.dataset.id = id;

  // Inline error span
  const inlineError = document.createElement('span');
  inlineError.className = 'error';
  inlineError.style.fontSize = 'var(--font-size-sm)';

  // Confirm button
  const confirmBtn = document.createElement('button');
  confirmBtn.type = 'button';
  confirmBtn.className = 'btn-icon';
  confirmBtn.dataset.action = 'confirm-edit';
  confirmBtn.dataset.id = id;
  confirmBtn.setAttribute('aria-label', 'Confirm edit');
  confirmBtn.textContent = '✓';

  // Cancel button
  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'btn-icon';
  cancelBtn.dataset.action = 'cancel-edit';
  cancelBtn.dataset.id = id;
  cancelBtn.setAttribute('aria-label', 'Cancel edit');
  cancelBtn.textContent = '✕';

  // Replace the title span with the edit controls
  li.replaceChild(editInput, titleSpan);
  // Insert inline error, confirm, and cancel after the edit input
  editInput.insertAdjacentElement('afterend', inlineError);
  inlineError.insertAdjacentElement('afterend', confirmBtn);
  confirmBtn.insertAdjacentElement('afterend', cancelBtn);

  // Hide the original edit and delete buttons
  const editBtn   = li.querySelector('[data-action="edit"]');
  const deleteBtn = li.querySelector('[data-action="delete"]');
  if (editBtn)   editBtn.style.display   = 'none';
  if (deleteBtn) deleteBtn.style.display = 'none';

  editInput.focus();
}

/**
 * Confirm an in-place edit for a task.
 * Validates for empty title and duplicates (excluding self).
 * @param {string} id
 * @param {string} newTitle - Raw value from the edit input.
 */
function confirmEditTask(id, newTitle) {
  const trimmed = newTitle.trim();
  const li = document.querySelector(`li[data-id="${id}"]`);
  const inlineError = li ? li.querySelector('.error') : null;

  if (!trimmed) {
    if (inlineError) inlineError.textContent = 'Task title cannot be empty.';
    return;
  }
  if (isDuplicateTitle(trimmed, id)) {
    if (inlineError) inlineError.textContent = 'A task with this name already exists.';
    return;
  }

  const task = state.tasks.find(t => t.id === id);
  if (task) {
    task.title = trimmed;
    saveTasks();
    renderTasks();
  }
}

/* ============================================================
   8. Sort Tasks (sort-select wiring is in wireUpEventListeners)
   ============================================================ */

/* ============================================================
   10. Quick Links
   ============================================================ */

/**
 * Ensure a URL has a scheme. Prepends 'https://' if none is present.
 * @param {string} url
 * @returns {string}
 */
function normalizeUrl(url) {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'https://' + url;
  }
  return url;
}

/**
 * Persist the current links list to localStorage.
 */
function saveLinks() {
  localStorage.setItem('quickLinks', JSON.stringify(state.links));
}

/**
 * Load links from localStorage into state.links.
 */
function loadLinks() {
  state.links = safeParseJSON(localStorage.getItem('quickLinks'), []);
}

/**
 * Add a new quick link after validating label and URL.
 * @param {string} label
 * @param {string} url
 */
function addLink(label, url) {
  const trimmedLabel = label.trim();
  const trimmedUrl   = url.trim();

  if (!trimmedLabel) {
    showError('link-label-error', 'Link label cannot be empty.');
    return;
  }
  if (!trimmedUrl) {
    showError('link-url-error', 'Link URL cannot be empty.');
    return;
  }

  const normalised = normalizeUrl(trimmedUrl);
  const link = {
    id: crypto.randomUUID(),
    label: trimmedLabel,
    url: normalised
  };
  state.links.push(link);
  saveLinks();
  renderLinks();

  // Clear inputs
  const labelInput = document.getElementById('link-label-input');
  const urlInput   = document.getElementById('link-url-input');
  if (labelInput) labelInput.value = '';
  if (urlInput)   urlInput.value   = '';

  clearError('link-label-error');
  clearError('link-url-error');
}

/**
 * Remove a quick link by id.
 * @param {string} id
 */
function deleteLink(id) {
  state.links = state.links.filter(l => l.id !== id);
  saveLinks();
  renderLinks();
}

/**
 * Rebuild the quick links DOM from state.links.
 */
function renderLinks() {
  const container = document.getElementById('links-container');
  if (!container) return;
  container.innerHTML = '';

  state.links.forEach(link => {
    const div = document.createElement('div');
    div.className = 'link-item';

    const anchor = document.createElement('a');
    anchor.href = link.url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.className = 'btn-secondary';
    anchor.textContent = link.label;

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn-danger btn-icon';
    deleteBtn.dataset.action = 'delete-link';
    deleteBtn.dataset.id = link.id;
    deleteBtn.setAttribute('aria-label', `Delete link: ${link.label}`);
    deleteBtn.textContent = '✕';

    div.appendChild(anchor);
    div.appendChild(deleteBtn);
    container.appendChild(div);
  });
}

/* ============================================================
   11. Light / Dark Mode
   ============================================================ */

/**
 * Apply a theme by setting the data-theme attribute on <html>
 * and updating the toggle button label.
 * @param {'light'|'dark'} theme
 */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('btn-theme-toggle');
  if (btn) {
    btn.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
  }
}

/**
 * Load the persisted theme from localStorage (default 'light').
 */
function loadTheme() {
  state.theme = localStorage.getItem('theme') || 'light';
  applyTheme(state.theme);
}

/**
 * Toggle between light and dark themes and persist the choice.
 */
function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  applyTheme(state.theme);
  localStorage.setItem('theme', state.theme);
}

/* ============================================================
   Event Listener Wiring
   ============================================================ */

/**
 * Attach all DOM event listeners.
 * Called once from loadAll() after the DOM is ready.
 */
function wireUpEventListeners() {
  /* ---- Theme toggle ---- */
  const btnTheme = document.getElementById('btn-theme-toggle');
  if (btnTheme) btnTheme.addEventListener('click', toggleTheme);

  /* ---- Name form ---- */
  const nameForm  = document.getElementById('name-form');
  const nameInput = document.getElementById('name-input');
  if (nameForm) {
    nameForm.addEventListener('submit', e => {
      e.preventDefault();
      saveUserName(nameInput ? nameInput.value.trim() : '');
    });
  }
  if (nameInput) {
    nameInput.addEventListener('input', () => clearError('name-error'));
  }

  /* ---- Timer buttons ---- */
  const btnStart = document.getElementById('btn-start');
  const btnStop  = document.getElementById('btn-stop');
  const btnReset = document.getElementById('btn-reset');
  if (btnStart) btnStart.addEventListener('click', startTimer);
  if (btnStop)  btnStop.addEventListener('click', stopTimer);
  if (btnReset) btnReset.addEventListener('click', resetTimer);

  /* ---- Duration form ---- */
  const durationForm  = document.getElementById('duration-form');
  const durationInput = document.getElementById('duration-input');
  if (durationForm) {
    durationForm.addEventListener('submit', e => {
      e.preventDefault();
      savePomoDuration(Number(durationInput ? durationInput.value : ''));
    });
  }
  if (durationInput) {
    durationInput.addEventListener('input', () => clearError('duration-error'));
  }

  /* ---- Task form ---- */
  const taskForm  = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  if (taskForm) {
    taskForm.addEventListener('submit', e => {
      e.preventDefault();
      addTask(taskInput ? taskInput.value : '');
    });
  }
  if (taskInput) {
    taskInput.addEventListener('input', () => clearError('task-error'));
  }

  /* ---- Task list — click delegation ---- */
  const taskList = document.getElementById('task-list');
  if (taskList) {
    taskList.addEventListener('click', e => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const action = btn.dataset.action;
      const id     = btn.dataset.id;

      switch (action) {
        case 'toggle':
          toggleTask(id);
          break;
        case 'edit':
          beginEditTask(id);
          break;
        case 'delete':
          deleteTask(id);
          break;
        case 'confirm-edit': {
          const li = btn.closest('li[data-id]');
          const editInput = li ? li.querySelector('.task-edit-input') : null;
          confirmEditTask(id, editInput ? editInput.value : '');
          break;
        }
        case 'cancel-edit':
          renderTasks();
          break;
      }
    });
  }

  /* ---- Sort select ---- */
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      state.activeSortOption = sortSelect.value;
      localStorage.setItem('sortOption', state.activeSortOption);
      renderTasks();
    });
  }

  /* ---- Link form ---- */
  const linkForm       = document.getElementById('link-form');
  const linkLabelInput = document.getElementById('link-label-input');
  const linkUrlInput   = document.getElementById('link-url-input');
  if (linkForm) {
    linkForm.addEventListener('submit', e => {
      e.preventDefault();
      addLink(
        linkLabelInput ? linkLabelInput.value : '',
        linkUrlInput   ? linkUrlInput.value   : ''
      );
    });
  }
  if (linkLabelInput) {
    linkLabelInput.addEventListener('input', () => clearError('link-label-error'));
  }
  if (linkUrlInput) {
    linkUrlInput.addEventListener('input', () => clearError('link-url-error'));
  }

  /* ---- Links container — click delegation ---- */
  const linksContainer = document.getElementById('links-container');
  if (linksContainer) {
    linksContainer.addEventListener('click', e => {
      const btn = e.target.closest('button[data-action="delete-link"]');
      if (btn) deleteLink(btn.dataset.id);
    });
  }
}

/* ============================================================
   2. loadAll — Bootstrap
   ============================================================ */

/**
 * Initialise the entire application.
 * Reads all persisted data, populates state, renders all panels,
 * and wires up event listeners.
 * Registered on DOMContentLoaded.
 */
function loadAll() {
  loadTheme();
  loadUserName();
  loadPomoDuration();
  loadTasks();
  loadLinks();

  // Restore sort option
  state.activeSortOption = localStorage.getItem('sortOption') || 'default';
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) sortSelect.value = state.activeSortOption;

  startClock();
  renderTasks();
  renderLinks();
  updateTimerDisplay();
  wireUpEventListeners();
}

document.addEventListener('DOMContentLoaded', loadAll);
