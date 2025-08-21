/**
 * React Advanced Hooks Exercises
 *
 * This file contains exercises covering advanced React hooks concepts:
 * - useMemo and useCallback optimization
 * - useRef for DOM access and values
 * - useImperativeHandle patterns
 * - Custom hook creation
 * - Hook composition patterns
 * - useLayoutEffect use cases
 * - useSyncExternalStore integration
 *
 * Each exercise includes:
 * - Clear documentation with examples
 * - Expected behavior description
 * - Component requirements
 * - Test cases to validate implementation
 */

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useImperativeHandle,
  useLayoutEffect,
  useSyncExternalStore,
  forwardRef
} from 'react';

// =============================================================================
// EXERCISE 1: useMemo for Expensive Computations
// =============================================================================

/**
 * Create a component that uses useMemo to optimize expensive calculations.
 * Should accept a list of numbers as prop
 * Should calculate expensive operations (fibonacci, prime checking, etc.)
 * Should only recalculate when the input list changes
 * Should display calculation time to demonstrate optimization
 *
 * Expected behavior:
 * - Expensive calculations should only run when numbers change
 * - Re-renders without prop changes should use cached results
 * - Should display both results and calculation time
 */
export function ExpensiveCalculator({ numbers }) {
  // TODO: Implement expensive calculation with useMemo
  // Hint: Create functions like fibonacci, isPrime, or factorial
  // Track calculation time to show optimization benefits
}

/**
 * Create a component that demonstrates useMemo with dependency optimization.
 * Should accept search term and filter criteria
 * Should filter and sort a large dataset
 * Should only reprocess data when relevant dependencies change
 *
 * Expected behavior:
 * - Filtering should only occur when search term changes
 * - Sorting should only occur when sort criteria changes
 * - Other state changes should not trigger data reprocessing
 */
export function OptimizedDataProcessor({ data, searchTerm, sortBy }) {
  // TODO: Implement data processing with useMemo
  // Use multiple useMemo hooks for different operations
}

// =============================================================================
// EXERCISE 2: useCallback for Function Optimization
// =============================================================================

/**
 * Create a parent component that passes callbacks to child components.
 * Should demonstrate useCallback to prevent unnecessary child re-renders
 * Should have multiple callback functions with different dependencies
 * Child components should be wrapped in React.memo for demonstration
 *
 * Expected behavior:
 * - Child components should only re-render when their specific callbacks change
 * - useCallback should prevent recreation of stable functions
 * - Should demonstrate difference with/without useCallback
 */
export function CallbackOptimizationDemo() {
  // TODO: Implement parent with optimized callbacks
  // Create child components that receive callbacks
  // Use React.memo on children to demonstrate optimization
}

/**
 * Create a component with a custom hook that uses useCallback.
 * Should create a debounced function using useCallback
 * Should demonstrate callback stability across re-renders
 * Should handle cleanup properly
 *
 * Expected behavior:
 * - Debounced function should maintain reference equality
 * - Should only call the actual function after delay
 * - Should cancel pending calls on unmount
 */
export function DebouncedInput({ onSearch, delay = 500 }) {
  // TODO: Implement debounced input with useCallback
  // Create a custom debounce hook if needed
}

// =============================================================================
// EXERCISE 3: useRef for DOM Access and Mutable Values
// =============================================================================

/**
 * Create a component that uses useRef for DOM manipulation.
 * Should focus an input field on mount
 * Should have methods to scroll to specific positions
 * Should measure and display DOM element dimensions
 *
 * Expected behavior:
 * - Input should be focused when component mounts
 * - Scroll buttons should work without causing re-renders
 * - Should display real-time element dimensions
 */
export function DOMManipulation() {
  // TODO: Implement DOM access with useRef
  // Use refs for input focus, scrolling, and measurements
}

/**
 * Create a component that uses useRef to store mutable values.
 * Should track render count without causing re-renders
 * Should store previous state values
 * Should manage timer IDs for cleanup
 *
 * Expected behavior:
 * - Render count should update without triggering re-renders
 * - Previous values should be accessible
 * - Timer should be properly managed and cleaned up
 */
export function MutableValueStorage() {
  // TODO: Implement mutable value storage with useRef
  // Track renders, previous values, and timer references
}

// =============================================================================
// EXERCISE 4: useImperativeHandle Patterns
// =============================================================================

/**
 * Create a reusable Modal component with imperative API.
 * Should expose open(), close(), and toggle() methods
 * Parent should be able to control modal imperatively
 * Should demonstrate ref forwarding with useImperativeHandle
 *
 * Expected structure:
 * const modalRef = useRef();
 * <Modal ref={modalRef} />
 * <button onClick={() => modalRef.current.open()}>Open</button>
 */
export const Modal = forwardRef(function Modal({ children, title }, ref) {
  // TODO: Implement modal with imperative handle
  // Expose open, close, toggle, and isOpen methods
});

/**
 * Create a parent component that uses the Modal imperatively.
 * Should demonstrate different ways to control the modal
 * Should show integration with other components
 */
export function ModalDemo() {
  // TODO: Implement modal usage demonstration
  // Use useRef and call modal methods imperatively
}

/**
 * Create a custom Input component with validation methods.
 * Should expose validate(), reset(), and focus() methods
 * Should handle internal validation state
 * Parent should be able to trigger validation imperatively
 *
 * Expected behavior:
 * - Parent can call validate() to check input
 * - Parent can call reset() to clear input and errors
 * - Parent can call focus() to focus the input
 */
export const ValidatedInput = forwardRef(function ValidatedInput(
  { label, validator, required },
  ref
) {
  // TODO: Implement validated input with imperative handle
  // Expose validate, reset, focus, and getValue methods
});

// =============================================================================
// EXERCISE 5: Custom Hook Creation
// =============================================================================

/**
 * Create a custom hook for managing local storage.
 * Should sync state with localStorage
 * Should handle JSON serialization/deserialization
 * Should work like useState but persist data
 *
 * Usage:
 * const [value, setValue] = useLocalStorage('key', defaultValue);
 */
export function useLocalStorage(key, defaultValue) {
  // TODO: Implement localStorage hook
  // Handle serialization, deserialization, and storage events
}

/**
 * Create a custom hook for managing online/offline status.
 * Should return boolean indicating online status
 * Should handle both initial state and status changes
 * Should clean up event listeners properly
 *
 * Usage:
 * const isOnline = useOnlineStatus();
 */
export function useOnlineStatus() {
  // TODO: Implement online status hook
  // Listen to online/offline events
}

/**
 * Create a custom hook for managing async data fetching.
 * Should handle loading, error, and success states
 * Should support request cancellation
 * Should provide refetch functionality
 *
 * Usage:
 * const { data, loading, error, refetch } = useFetch('/api/data');
 */
export function useFetch(url, options = {}) {
  // TODO: Implement fetch hook
  // Handle loading states, errors, and cleanup
}

/**
 * Create a custom hook for window dimensions.
 * Should return current window width and height
 * Should update on window resize
 * Should clean up event listeners
 *
 * Usage:
 * const { width, height } = useWindowSize();
 */
export function useWindowSize() {
  // TODO: Implement window size hook
  // Handle resize events and cleanup
}

// =============================================================================
// EXERCISE 6: Hook Composition Patterns
// =============================================================================

/**
 * Create a complex custom hook that combines multiple hooks.
 * Should create a useForm hook that combines:
 * - State management for form data
 * - Validation logic
 * - Submit handling
 * - Error management
 *
 * Usage:
 * const form = useForm({
 *   initialValues: { name: '', email: '' },
 *   validators: { name: required, email: emailValidator }
 * });
 */
export function useForm({ initialValues, validators = {}, onSubmit }) {
  // TODO: Implement composed form hook
  // Combine useState, validation, and error handling
}

/**
 * Create a hook that combines data fetching with local storage caching.
 * Should fetch data from API
 * Should cache results in localStorage
 * Should handle cache expiration
 * Should provide cache invalidation
 *
 * Usage:
 * const { data, loading, error, invalidateCache } = useCachedFetch('/api/data', {
 *   cacheKey: 'userData',
 *   cacheTime: 5 * 60 * 1000 // 5 minutes
 * });
 */
export function useCachedFetch(url, { cacheKey, cacheTime = 0 } = {}) {
  // TODO: Implement cached fetch hook
  // Combine useFetch with useLocalStorage
}

/**
 * Demonstrate the composed hooks in a real component.
 * Should use useForm for form management
 * Should use useCachedFetch for data loading
 * Should show how hooks compose together
 */
export function ComposedHooksDemo() {
  // TODO: Implement component using composed hooks
  // Show practical application of hook composition
}

// =============================================================================
// EXERCISE 7: useLayoutEffect Use Cases
// =============================================================================

/**
 * Create a component that measures DOM elements before paint.
 * Should use useLayoutEffect to get accurate measurements
 * Should position elements based on measurements
 * Should demonstrate difference from useEffect
 *
 * Expected behavior:
 * - Measurements should be accurate before paint
 * - No visual flickering should occur
 * - Positioning should be immediate
 */
export function LayoutMeasurement() {
  // TODO: Implement layout measurement with useLayoutEffect
  // Compare with useEffect to show timing difference
}

/**
 * Create a tooltip component that positions itself correctly.
 * Should calculate optimal position based on trigger element
 * Should reposition on window resize or scroll
 * Should avoid going off-screen
 *
 * Expected behavior:
 * - Tooltip should position correctly relative to trigger
 * - Should flip position if it would go off-screen
 * - Should update position synchronously
 */
export function Tooltip({ children, content }) {
  // TODO: Implement tooltip with useLayoutEffect
  // Handle positioning and boundary detection
}

/**
 * Create a component that animates elements with synchronized timing.
 * Should start animations at the exact right moment
 * Should coordinate multiple element animations
 * Should demonstrate useLayoutEffect timing benefits
 *
 * Expected behavior:
 * - Animations should start immediately after DOM updates
 * - No visual jank or delayed starts
 * - Multiple animations should be perfectly synchronized
 */
export function SynchronizedAnimation() {
  // TODO: Implement synchronized animations with useLayoutEffect
  // Coordinate multiple element animations
}

// =============================================================================
// EXERCISE 8: useSyncExternalStore Integration
// =============================================================================

/**
 * Create a simple external store for global state management.
 * Should manage state outside of React
 * Should notify React components of changes
 * Should provide subscribe/getSnapshot methods
 */
class SimpleStore {
  constructor(initialState = {}) {
    this.state = initialState;
    this.listeners = new Set();
  }

  getState = () => this.state;

  setState = (newState) => {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach((listener) => listener());
  };

  subscribe = (listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };
}

// Global store instance
export const globalStore = new SimpleStore({ count: 0, user: null });

/**
 * Create a hook that connects to the external store.
 * Should use useSyncExternalStore to sync with external state
 * Should provide both read and write capabilities
 * Should handle server-side rendering considerations
 *
 * Usage:
 * const [state, setState] = useStore(globalStore);
 * const count = useStoreSelector(globalStore, state => state.count);
 */
export function useStore(store) {
  // TODO: Implement store hook with useSyncExternalStore
  // Provide both full state access and updates
}

/**
 * Create a selector hook for performance optimization.
 * Should only re-render when selected data changes
 * Should use useSyncExternalStore with custom selector
 *
 * Usage:
 * const count = useStoreSelector(globalStore, state => state.count);
 */
export function useStoreSelector(store, selector) {
  // TODO: Implement selector hook with useSyncExternalStore
  // Use selector for optimized subscriptions
}

/**
 * Create components that demonstrate the external store integration.
 * Should show multiple components sharing external state
 * Should demonstrate selective updates with selectors
 * Should show external updates affecting React components
 */
export function ExternalStoreDemo() {
  // TODO: Implement demo components using external store
  // Show counter, user info, and external update buttons
}

/**
 * Create a hook that syncs with browser APIs.
 * Should sync with localStorage changes from other tabs
 * Should sync with online/offline status
 * Should demonstrate external store patterns with browser APIs
 *
 * Usage:
 * const isOnline = useBrowserSync('navigator', () => navigator.onLine);
 * const theme = useBrowserSync('localStorage', () => localStorage.getItem('theme'));
 */
export function useBrowserSync(source, getSnapshot) {
  // TODO: Implement browser API sync with useSyncExternalStore
  // Handle different browser APIs and their event patterns
}

// =============================================================================
// HELPER COMPONENTS FOR TESTING AND DEMONSTRATION
// =============================================================================

/**
 * A child component wrapped in React.memo for useCallback demonstrations.
 * Should only re-render when props actually change
 */
export const MemoizedChild = React.memo(function MemoizedChild({
  title,
  onClick,
  onHover
}) {
  console.log(`MemoizedChild "${title}" rendered`);

  return (
    <div
      onClick={onClick}
      onMouseEnter={onHover}
      style={{ padding: '10px', margin: '5px', border: '1px solid #ccc' }}>
      {title}
      <span style={{ fontSize: '12px', color: '#666' }}>
        (Check console for render logs)
      </span>
    </div>
  );
});

/**
 * A component that triggers expensive re-renders for optimization demonstrations.
 * Should be used to test useMemo and useCallback optimizations
 */
export function ExpensiveComponent({ shouldRerender }) {
  // Simulate expensive computation
  const expensiveValue = useMemo(() => {
    console.log('Expensive computation running...');
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.random();
    }
    return result;
  }, [shouldRerender]);

  return (
    <div>
      <p>Expensive computation result: {expensiveValue.toFixed(2)}</p>
      <small>Check console to see when computation runs</small>
    </div>
  );
}
