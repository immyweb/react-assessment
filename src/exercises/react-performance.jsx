/**
 * React Performance Optimization Exercises
 *
 * Simplified exercises covering fundamental performance concepts:
 * 1. Memoization (React.memo, useMemo, useCallback)
 * 2. Component Splitting
 * 3. Lazy Loading & Suspense
 * 4. Basic Virtual Lists
 *
 * Each exercise focuses on core concepts with practical examples.
 *
 * Instructions: Replace all TODO comments with your implementations.
 */

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  memo,
  lazy,
  Suspense,
  startTransition
} from 'react';

// =============================================================================
// EXERCISE 1: Memoization Fundamentals
// =============================================================================

/**
 * Create a memoized child component that only re-renders when props change.
 *
 * Requirements:
 * - Use React.memo to prevent unnecessary re-renders
 * - Log renders to console for demonstration
 * - Accept name and count props
 * - Return JSX with name, count, and helpful text
 */
export const MemoizedChild = memo(function ChildComponent({ name, count }) {
  // TODO: Add console.log to track renders

  // TODO: Return JSX that displays name and count props
  return <div>TODO: Implement MemoizedChild</div>;
});

/**
 * Create a parent component demonstrating React.memo benefits.
 *
 * Requirements:
 * - Multiple state variables (childName, childCount, unrelatedState)
 * - Buttons to update each state independently
 * - Render both MemoizedChild and RegularChild for comparison
 */
export function MemoizationDemo() {
  // TODO: Add state for childName, childCount, and unrelatedState

  // TODO: Add event handlers for updating each state

  // TODO: Return JSX with buttons and both child components
  return <div>TODO: Implement MemoizationDemo</div>;
}

/**
 * Create a component demonstrating useMemo for expensive calculations.
 *
 * Requirements:
 * - Accept numbers array prop (default: [1, 2, 3, 4, 5])
 * - Perform expensive calculation only when numbers change
 * - Show calculation result and timing
 * - Include other state that doesn't trigger recalculation
 */
export function ExpensiveMemoCalculator({ numbers = [1, 2, 3, 4, 5] }) {
  // TODO: Add state for other updates that shouldn't trigger calculation

  // TODO: Use useMemo to memoize expensive calculation
  // Hint: Use performance.now() to measure timing

  // TODO: Return JSX displaying numbers, result, timing, and button for other state
  return <div>TODO: Implement ExpensiveMemoCalculator</div>;
}

/**
 * Create a list with useCallback optimized event handlers.
 *
 * Requirements:
 * - Initial state with 3 items: [{ id: 1, name: 'Item 1' }, ...]
 * - Memoized list items that log renders
 * - Stable click handlers using useCallback
 * - Add/remove items functionality
 */
export function OptimizedList() {
  // TODO: Add state for items list

  // TODO: Create memoized event handlers using useCallback

  // TODO: Add function to add new items

  // TODO: Return JSX with add button and list of OptimizedListItem components
  return <div>TODO: Implement OptimizedList</div>;
}

// TODO: Create OptimizedListItem as a memoized component
// Requirements:
// - Accept item, onClick, onRemove props
// - Log renders to console
// - Display item name and remove button
const OptimizedListItem = memo(function ListItem({ item, onClick, onRemove }) {
  // TODO: Add console.log to track renders

  // TODO: Return JSX with clickable item name and remove button
  return <div>TODO: Implement OptimizedListItem</div>;
});

// =============================================================================
// EXERCISE 2: Component Splitting
// =============================================================================

/**
 * Create a main profile page that demonstrates component splitting.
 *
 * Requirements:
 * - Combine UserProfile, UserSettings, and ActivityFeed components
 * - Pass userId prop to all child components
 * - Use grid or flexbox layout
 */
export function UserProfilePage({ userId = 1 }) {
  // TODO: Return JSX that renders all three profile components
  return <div>TODO: Implement UserProfilePage</div>;
}

/**
 * Create a user profile component for displaying basic user information.
 *
 * Requirements:
 * - Memoized component using React.memo
 * - State for user data: { name: 'John Doe', email: 'john@example.com' }
 * - Button to update the user's name (add " Jr." suffix)
 * - Log renders with userId for performance tracking
 */
export const UserProfile = memo(function UserProfile({ userId }) {
  // TODO: Add state for user data

  // TODO: Add console.log to track renders

  // TODO: Add handler to update user name

  // TODO: Return JSX with user info and update button
  return <div>TODO: Implement UserProfile</div>;
});

/**
 * Create a user settings component for managing user preferences.
 *
 * Requirements:
 * - Memoized component using React.memo
 * - State for notifications (boolean, default: true)
 * - State for theme (string, default: 'light')
 * - Checkbox for notifications and select for theme
 * - Log renders with userId for performance tracking
 */
export const UserSettings = memo(function UserSettings({ userId }) {
  // TODO: Add state for notifications and theme

  // TODO: Add console.log to track renders

  // TODO: Add handlers for notifications and theme changes

  // TODO: Return JSX with settings controls
  return <div>TODO: Implement UserSettings</div>;
});

/**
 * Create an activity feed component showing user's recent activities.
 *
 * Requirements:
 * - Memoized component using React.memo
 * - Static activities array: ['Logged in', 'Updated profile', 'Changed password', 'Posted a comment', 'Liked a post']
 * - Support limit prop (default: 5) to control number of activities shown
 * - Log renders with userId for performance tracking
 */
export const ActivityFeed = memo(function ActivityFeed({ userId, limit = 5 }) {
  // TODO: Add activities array in state or as constant

  // TODO: Add console.log to track renders

  // TODO: Return JSX with activity list (use .slice(0, limit))
  return <div>TODO: Implement ActivityFeed</div>;
});

// =============================================================================
// EXERCISE 3: Lazy Loading & Suspense
// =============================================================================

/**
 * Create lazy-loaded components using React.lazy.
 *
 * Requirements:
 * - Create HeavyDashboard that loads after 1 second delay
 * - Create HeavyReports that loads after 1.5 second delay
 * - Components should return JSX with titles and mock content
 * - Use Promise with setTimeout to simulate loading delay
 */

// TODO: Create HeavyDashboard using React.lazy
// Should return a Promise that resolves after 1000ms with a component showing:
// - "Heavy Dashboard Component" title
// - Text about lazy loading
// - Mock chart placeholders (2 divs with "Chart 1" and "Chart 2")
const HeavyDashboard = lazy(() => {
  // TODO: Return Promise with setTimeout delay
  return Promise.resolve({
    default: () => <div>TODO: Implement HeavyDashboard</div>
  });
});

// TODO: Create HeavyReports using React.lazy
// Should return a Promise that resolves after 1500ms with a component showing:
// - "Heavy Reports Component" title
// - Text about lazy loading
// - Mock table with headers "Metric" and "Value" and sample rows
const HeavyReports = lazy(() => {
  // TODO: Return Promise with setTimeout delay
  return Promise.resolve({
    default: () => <div>TODO: Implement HeavyReports</div>
  });
});

/**
 * Create a component demonstrating lazy loading with tabs.
 *
 * Requirements:
 * - State for activeTab with options: 'home', 'dashboard', 'reports'
 * - Tab buttons for each option with proper styling
 * - Show different content based on active tab
 * - Use Suspense with loading fallbacks for lazy components
 * - Include helpful text about lazy loading behavior
 */
export function LazyLoadingDemo() {
  // TODO: Add state for activeTab

  // TODO: Add tab switching handler

  // TODO: Return JSX with:
  // - Tab buttons (styled to show active state)
  // - Conditional content based on activeTab
  // - Suspense boundaries for lazy components with loading fallbacks
  // - Information text about lazy loading
  return <div>TODO: Implement LazyLoadingDemo</div>;
}

// =============================================================================
// EXERCISE 4: Basic Virtual List
// =============================================================================

/**
 * Create a basic virtual list for handling large datasets efficiently.
 *
 * Requirements:
 * - Props: items, itemHeight (default: 50), containerHeight (default: 400), overscan (default: 3)
 * - State for scrollTop position
 * - Calculate visible range based on scroll position
 * - Only render visible items plus overscan buffer
 * - Handle scroll events to update scrollTop
 * - Show total height for proper scrollbar
 * - Display performance info (visible count, total count, scroll position, visible range)
 */
export function VirtualList({
  items = [],
  itemHeight = 50,
  containerHeight = 400,
  overscan = 3
}) {
  // TODO: Add state for scrollTop

  // TODO: Calculate visible range based on scrollTop, itemHeight, containerHeight, and overscan

  // TODO: Calculate total height and offset for positioning

  // TODO: Get visible items array

  // TODO: Add scroll handler

  // TODO: Return JSX with:
  // - Title and performance info
  // - Scrollable container with total height
  // - Positioned visible items using VirtualListItem
  // - Debug info showing scroll position and visible range
  return <div>TODO: Implement VirtualList</div>;
}

// TODO: Create VirtualListItem as a memoized component
// Requirements:
// - Props: item, height, index
// - Fixed height styling
// - Display item index, name, and value
// - Alternating background colors for odd/even rows
const VirtualListItem = memo(function VirtualListItem({ item, height, index }) {
  // TODO: Return JSX with proper styling and item data
  return <div>TODO: Implement VirtualListItem</div>;
});

// =============================================================================
// HELPER COMPONENTS AND UTILITIES
// =============================================================================

/**
 * Non-memoized child component for comparison with MemoizedChild.
 * Always re-renders when parent renders.
 */
export function RegularChild({ name, count }) {
  console.log(`RegularChild rendered with: ${name}, ${count}`);

  return (
    <div style={{ padding: '10px', margin: '5px', border: '1px solid red' }}>
      <h4>Regular Child (always re-renders)</h4>
      <p>Name: {name}</p>
      <p>Count: {count}</p>
      <small>Check console for render logs</small>
    </div>
  );
}

/**
 * Generate mock data for testing virtual lists and performance.
 */
export function generateMockData(count = 10000) {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    name: `Item ${index}`,
    value: Math.floor(Math.random() * 1000),
    category: `Category ${index % 10}`,
    status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)]
  }));
}

/**
 * Demo component that shows all exercises together.
 * Students can implement this after completing individual exercises.
 */
export function PerformanceExercisesDemo() {
  // TODO: Generate mock data for virtual list

  // TODO: Return JSX that renders all exercise components with proper spacing
  // Include: MemoizationDemo, ExpensiveMemoCalculator, OptimizedList,
  // UserProfilePage, LazyLoadingDemo, VirtualList
  // Add CSS for spinner animation
  return <div>TODO: Implement PerformanceExercisesDemo</div>;
}
