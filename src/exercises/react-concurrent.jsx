/**
 * React Concurrent Features Exercises
 *
 * This file contains exercises covering React concurrent features:
 * - Suspense for data fetching
 * - useTransition for non-urgent updates
 * - useDeferredValue for expensive computations
 * - useOptimistic for optimistic updates
 * - Progressive enhancement patterns
 *
 * Each exercise includes:
 * - Clear documentation with examples
 * - Expected behavior description
 * - Component requirements
 * - Test cases to validate implementation
 */

import {
  useState,
  useTransition,
  useDeferredValue,
  Suspense,
  useOptimistic,
  useRef
} from 'react';

// =============================================================================
// EXERCISE 1: Suspense for Data Fetching
// =============================================================================

/**
 * Create a simple data fetching function that returns a Suspense-compatible resource.
 * This simulates fetching user data with a configurable delay.
 *
 * Requirements:
 * - Accept userId and delay parameters
 * - Return an object with a read() method
 * - Throw a promise while loading (Suspense requirement)
 * - Return data when complete: { id: userId, name: `User ${userId}` }
 *
 * @param {number} userId - The user ID to fetch
 * @param {number} delay - Delay in milliseconds (default: 1000)
 * @returns {Object} Resource object with read() method
 */
export function fetchUser(userId, delay = 1000) {
  // TODO: Implement Suspense-compatible resource
  // Hint: Use a promise and track its state (pending/success/error)
}

/**
 * Create a component that displays user data using Suspense.
 * Should work with the fetchUser resource created above.
 *
 * Requirements:
 * - Accept a resource prop (from fetchUser)
 * - Call resource.read() to get data
 * - Display user id and name
 * - Render inside a div with className "user-profile"
 */
export function UserProfile({ resource }) {
  // TODO: Implement this component
}

/**
 * Create a parent component that demonstrates Suspense usage.
 * Should handle loading states with a fallback component.
 *
 * Requirements:
 * - Use Suspense with a loading fallback
 * - Display UserProfile for userId 1
 * - Show "Loading user..." text while fetching
 */
export function SuspenseDemo() {
  // TODO: Implement Suspense wrapper with UserProfile
}

// =============================================================================
// EXERCISE 2: useTransition for Non-Urgent Updates
// =============================================================================

/**
 * Create a search component that demonstrates useTransition.
 * Should handle expensive filtering without blocking user input.
 *
 * Requirements:
 * - Accept items prop (array of strings)
 * - Maintain search query state
 * - Use useTransition to defer filtering
 * - Show loading indicator during transition
 * - Filter items based on search query (case-insensitive)
 *
 * Expected behavior:
 * - Input should remain responsive during filtering
 * - Show "Searching..." when isPending is true
 * - Display filtered results in a list
 */
export function SearchList({ items = [] }) {
  // TODO: Implement with useTransition
  // Hint: Use startTransition to wrap the state update for filtered items
}

/**
 * Create a tab switcher that uses useTransition for smooth transitions.
 * Should demonstrate non-urgent updates when switching tabs.
 *
 * Requirements:
 * - Three tabs: "About", "Posts", "Contact"
 * - Use useTransition when switching tabs
 * - Show loading indicator on the tab being loaded
 * - Each tab content should render slowly (simulate with expensive render)
 *
 * Tab content:
 * - About: "About content" with 5000 items
 * - Posts: "Posts content" with 5000 items
 * - Contact: "Contact content" with 5000 items
 */
export function TabSwitcher() {
  // TODO: Implement with useTransition
}

/**
 * Helper component to simulate slow rendering.
 * DO NOT MODIFY - Used by tests and tab switcher.
 */
export function SlowContent({ text, count = 100 }) {
  const items = Array.from({ length: count }, (_, i) => `${text} ${i + 1}`);
  return (
    <ul>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

// =============================================================================
// EXERCISE 3: useDeferredValue for Expensive Computations
// =============================================================================

/**
 * Create a component that uses useDeferredValue to defer expensive filtering.
 * Similar to SearchList but using useDeferredValue instead of useTransition.
 *
 * Requirements:
 * - Accept items prop (array of strings)
 * - Maintain search query state
 * - Use useDeferredValue on the search query
 * - Filter based on deferred value
 * - Show visual indicator when value is stale
 *
 * Expected behavior:
 * - Input updates immediately
 * - Filtering uses deferred value
 * - Show opacity: 0.5 when deferredQuery !== query
 */
export function DeferredSearchList({ items = [] }) {
  // TODO: Implement with useDeferredValue
  // Hint: Compare query and deferredQuery to detect staleness
}

// =============================================================================
// EXERCISE 4: useOptimistic for Optimistic Updates
// =============================================================================

/**
 * Simulate an API call that adds a todo item.
 * DO NOT MODIFY - Used by tests.
 *
 * @param {string} text - Todo text
 * @returns {Promise<Object>} Resolves with todo object after delay
 */
export function addTodoAPI(text) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Date.now(),
        text,
        completed: false
      });
    }, 1000);
  });
}

/**
 * Create a todo list with optimistic updates using useOptimistic.
 * Should show new items immediately before server confirmation.
 *
 * Requirements:
 * - Maintain todos state (array of { id, text, completed })
 * - Use useOptimistic for optimistic updates
 * - Add new todos optimistically when form submits
 * - Show pending todos with different styling (opacity: 0.5)
 * - Update with server response when complete
 *
 * Form requirements:
 * - Input for new todo text
 * - Submit button (disabled during submission)
 * - Clear input after submission starts
 */
export function OptimisticTodoList() {
  // TODO: Implement with useOptimistic
  // Hint: useOptimistic takes (state, updateFn) and returns [optimisticState, addOptimistic]
}

/**
 * Create a like button with optimistic updates.
 * Shows immediate feedback while waiting for server response.
 *
 * Requirements:
 * - Accept initialLikes prop (default: 0)
 * - Use useOptimistic for like count
 * - Increment optimistically on click
 * - Simulate server call (1 second delay)
 * - Show pending state during update
 * - Button disabled while pending
 *
 * Expected output:
 * - Button text: "Like ({count})" or "Liking... ({count})"
 * - Button disabled when pending
 */
function addCountAPI() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

export function OptimisticLikeButton({ initialLikes = 0 }) {
  // TODO: Implement with useOptimistic
}

// =============================================================================
// EXERCISE 5: Progressive Enhancement
// =============================================================================

/**
 * Create a form that works with and without JavaScript (progressive enhancement).
 * Uses useOptimistic for enhanced experience when JS is available.
 *
 * Requirements:
 * - Form with name and email inputs
 * - Submit using form action (works without JS)
 * - Enhanced with useOptimistic when JS available
 * - Show optimistic feedback on submit
 * - Display submitted data in a list
 * - Clear form after successful submission
 *
 * Each submission should create an object: { id, name, email, pending: boolean }
 */
export function ProgressiveForm({ onSubmit }) {
  // TODO: Implement progressive enhancement with useOptimistic
  // Hint: Use form action and formAction for progressive enhancement
}

/**
 * Create a comment section with progressive enhancement.
 * Shows comments immediately (optimistically) while posting to server.
 *
 * Requirements:
 * - Accept initialComments prop (array of { id, text, author })
 * - Use useOptimistic for comment updates
 * - Add comments optimistically with pending state
 * - Show pending comments with visual indicator (italic text)
 * - Simulate server delay (1.5 seconds)
 * - Form with author and text inputs
 *
 * Expected behavior:
 * - New comments appear immediately (optimistic)
 * - Pending comments shown in italics
 * - Updates to real state after server confirms
 */
function addCommentAPI(comment) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(comment);
    }, 1000);
  });
}

export function OptimisticComments({ initialComments = [] }) {
  // TODO: Implement with useOptimistic
}

/* Utils */

function Loading() {
  return <h2>🌀 Loading user...</h2>;
}
