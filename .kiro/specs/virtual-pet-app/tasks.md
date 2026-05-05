# Tasks

## Task List

- [~] 1. Project scaffold and static shell
  - [~] 1.1 Create `index.html` with Tailwind CDN link, semantic layout sections (header, form area, pet list area), and placeholder DOM entry points (`#pet-form`, `#pet-list`, `#pet-counter`, `#empty-state`)
  - [~] 1.2 Create `style.css` with `@keyframes` definitions: `pet-click` (scale-down + rotation, 300ms), `wiggle` (fast shake, 600ms), `fade-in` (opacity 0→1, 400ms), `float-up` (translateY + fade-out, 1.5s)
  - [~] 1.3 Create `script.js` with module-level IIFE or top-level structure, `PET_EMOJI` constant map, and `DOMContentLoaded` entry point

- [~] 2. State layer
  - [~] 2.1 Implement `pets` array as the single source of truth
  - [ ] 2.2 Implement `addPet(name, type, age)` — creates a Pet object with `id` (crypto.randomUUID with fallback), `name`, `type`, `age`, `createdAt`, `idleTimerId: null`, `idleTimeoutId: null`; pushes to `pets`; returns the new Pet
  - [ ] 2.3 Implement `getPets()` returning a shallow copy of `pets`
  - [ ] 2.4 Implement `getPetById(id)` returning the matching Pet or `undefined`

- [ ] 3. Form validation and submission
  - [ ] 3.1 Implement `validateForm(name, type, age)` returning a `ValidationResult` — rejects empty name, name > 50 chars, empty type, age outside [0, 99] or non-integer
  - [ ] 3.2 Implement `showValidationErrors(errors)` — renders inline error messages next to the relevant fields
  - [ ] 3.3 Implement `clearValidationErrors()` — removes all inline error messages
  - [ ] 3.4 Implement `handleFormSubmit(event)` — calls `validateForm`, shows errors on failure, calls `addPet` + `renderPetList` + `renderCounter` + `renderEmptyState` + form reset on success
  - [ ] 3.5 Wire `handleFormSubmit` to the form's `submit` event listener

- [ ] 4. DOM renderer
  - [ ] 4.1 Implement `renderPetCard(pet)` — returns an `HTMLElement` containing pet name, type, age, type emoji, and a Zoomies button (⚡); sets `data-pet-id` attribute on the card
  - [ ] 4.2 Implement `renderPetList()` — clears `#pet-list`, iterates `pets`, calls `renderPetCard` for each, appends to DOM, applies fade-in animation to each new card, starts idle timer for each pet
  - [ ] 4.3 Implement `renderCounter()` — updates `#pet-counter` text to `"X pet(s)"`
  - [ ] 4.4 Implement `renderEmptyState()` — shows `#empty-state` placeholder when `pets` is empty, hides it otherwise

- [ ] 5. Audio engine
  - [ ] 5.1 Implement `initAudioContext()` — lazily creates a single `AudioContext` instance on first call; no-op on subsequent calls
  - [ ] 5.2 Implement `playPopSound()` — creates OscillatorNode (sine, 440 Hz) with GainNode envelope (attack 0ms, decay 80ms), connects to destination, starts and stops
  - [ ] 5.3 Implement `playMeowSound()` — creates OscillatorNode (sine), sweeps frequency 600 Hz → 300 Hz over 200ms via `linearRampToValueAtTime`, then decays
  - [ ] 5.4 Implement `playSoundForPet(petType)` — calls `initAudioContext`, then dispatches to `playMeowSound` if `petType === 'cat'`, else `playPopSound`; wraps in try/catch to silently handle missing Web Audio API support

- [ ] 6. Animation controller
  - [ ] 6.1 Implement `isAnimating(cardEl)` — returns `true` if `cardEl.dataset.animating === 'true'`
  - [ ] 6.2 Implement `lockAnimation(cardEl)` / `unlockAnimation(cardEl)` — sets/removes `data-animating` attribute
  - [ ] 6.3 Implement `applyPetAnimation(cardEl)` — guards with `isAnimating`; locks card; adds `pet-click` CSS class; after 300ms removes class and unlocks
  - [ ] 6.4 Implement `applyZoomiesAnimation(cardEl)` — guards with `isAnimating`; locks card; disables Zoomies button; adds `wiggle` CSS class and injects speed-line emoji element (`🐾⚡🐾`); after 600ms removes class, removes emoji element, re-enables button, and unlocks
  - [ ] 6.5 Implement `applyFadeInAnimation(cardEl)` — adds `fade-in` CSS class; removes it after 400ms

- [ ] 7. Idle timer
  - [ ] 7.1 Implement `startIdleTimer(petId)` — sets a 5-second `setTimeout`; on expiry, calls `showIdleEmoji` and starts a 3-second `setInterval` that calls `showIdleEmoji` repeatedly; stores both handles on the pet object
  - [ ] 7.2 Implement `resetIdleTimer(petId)` — clears existing `setTimeout` and `setInterval` handles on the pet object, calls `removeIdleEmoji` on the pet's card element, then calls `startIdleTimer(petId)`
  - [ ] 7.3 Implement `clearIdleTimer(petId)` — clears handles without restarting
  - [ ] 7.4 Implement `showIdleEmoji(cardEl)` — creates a `💤` element, appends to card, applies `float-up` animation; removes element after 1.5s
  - [ ] 7.5 Implement `removeIdleEmoji(cardEl)` — immediately removes any existing `💤` element from the card

- [ ] 8. Event wiring — pet interactions
  - [ ] 8.1 Wire pet card click handler — on click of a Pet_Card (not the Zoomies button), call `applyPetAnimation(cardEl)`, `playSoundForPet(pet.type)`, and `resetIdleTimer(pet.id)`
  - [ ] 8.2 Wire Zoomies button click handler — on click of the ⚡ button, call `applyZoomiesAnimation(cardEl)` and `resetIdleTimer(pet.id)`; stop event propagation to prevent triggering the card click handler

- [ ] 9. Visual design and responsiveness
  - [ ] 9.1 Apply pastel color palette via Tailwind utility classes to the page background, card backgrounds, and interactive elements
  - [ ] 9.2 Implement responsive grid layout for `#pet-list` using Tailwind responsive prefixes (1 column on mobile, 2 on md, 3 on lg)
  - [ ] 9.3 Add visible hover states to Pet_Cards and all buttons using Tailwind `hover:` utilities

- [ ] 10. Tests
  - [ ] 10.1 Set up fast-check as a dev dependency (or via CDN in a test HTML file) and configure a test runner (e.g., Vitest or plain Node test runner)
  - [ ] 10.2 Write unit tests for `validateForm` boundary cases: empty name, name = 50 chars (valid), name = 51 chars (invalid), age = 0 (valid), age = 99 (valid), age = -1 (invalid), age = 100 (invalid)
  - [ ] 10.3 Write unit tests for `playSoundForPet` dispatch: 'cat' calls meow, 'dog' calls pop
  - [ ] 10.4 Write unit test for `renderPetCard` emoji mapping: cat → 🐱
  - [ ] 10.5 Write unit test for empty state: shown when pets = [], hidden when pets has items
  - [ ] 10.6 Write property test for Property 1 — valid pet addition grows the list (100 runs)
  - [ ] 10.7 Write property test for Property 2 — invalid pet input is rejected (100 runs)
  - [ ] 10.8 Write property test for Property 3 — pet counter matches list length (100 runs)
  - [ ] 10.9 Write property test for Property 4 — pet card renders all required fields and controls (100 runs)
  - [ ] 10.10 Write property test for Property 6 — animation lock prevents stacking (100 runs)
  - [ ] 10.11 Write property test for Property 8 — sound dispatch correctness (100 runs)
