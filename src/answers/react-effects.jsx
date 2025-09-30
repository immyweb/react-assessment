/**
 * React Effects and Side Effects Exercises
 *
 * This file contains exercises covering React effects and side effects concepts:
 * - useEffect hook patterns
 * - Effect dependencies and cleanup
 * - Effect timing (layout effects)
 * - Data fetching patterns
 * - Subscription management
 * - Race condition handling
 * - Effect optimization
 *
 * Each exercise includes:
 * - Clear documentation with examples
 * - Expected behavior description
 * - Component requirements
 * - Test cases to validate implementation
 */

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';

// =============================================================================
// EXERCISE 1: useEffect Hook Patterns
// =============================================================================

/**
 * Create a component that demonstrates basic useEffect usage for side effects.
 * Should accept a title prop
 * Should update document.title when the component mounts or title changes2
 * Should demonstrate effect with dependency array
 *
 * Expected behavior:
 * - Document title should change when component mounts
 * - Document title should update when title prop changes
 * - Effect should only run when title changes, not on every render
 */
export function DocumentTitle({ title }) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div>
      <p>{`Current title: ${title}`}</p>
      <p>Check the browser tab title</p>
    </div>
  );
}

/**
 * Create a component that runs an effect only once on mount.
 * Should log "Component mounted" to console on mount only
 * Should have state that changes but doesn't trigger the effect
 * Should demonstrate effect with empty dependency array
 *
 * Expected behavior:
 * - Effect should run only once when component mounts
 * - State changes should not trigger the effect again
 * - Console should show mount message only once
 */
export function MountLogger() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Component mounted');
  }, []);

  return (
    <div>
      <p>Mount logger component</p>
      <button
        onClick={() => setCount((c) => c + 1)}>{`State: ${count}`}</button>
    </div>
  );
}

// =============================================================================
// EXERCISE 2: Effect Dependencies and Cleanup
// =============================================================================

/**
 * Create a timer component that properly cleans up intervals.
 * Should start a timer that increments every second
 * Should clean up the interval when component unmounts
 * Should have start/stop functionality
 *
 * Expected behavior:
 * - Timer should increment every second when started
 * - Timer should stop when component unmounts
 * - No memory leaks from uncleaned intervals
 * - Start/stop buttons should control the timer
 */
export function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }

    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [isRunning]);

  return (
    <div>
      <div>{`Timer: ${seconds}`}</div>
      <button onClick={() => setIsRunning(true)}>Start</button>
      <button onClick={() => setIsRunning(false)}>Stop</button>
    </div>
  );
}

/**
 * Create a component that adds and removes window event listeners.
 * Should track and display window size
 * Should add resize event listener on mount
 * Should remove event listener on unmount
 *
 * Expected behavior:
 * - Should display current window dimensions
 * - Should update dimensions when window is resized
 * - Should not have memory leaks from event listeners
 */
export function WindowSizeTracker() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <p>{`Width: ${windowSize.width}`}</p>
      <p>{`Height: ${windowSize.height}`}</p>
    </div>
  );
}

/**
 * Create a component that demonstrates proper dependency array usage.
 * Should accept searchTerm and filters props
 * Should perform search when searchTerm or filters change
 * Should not re-run effect when other props change
 *
 * Expected behavior:
 * - Effect should only run when searchTerm or filters change
 * - Should log search parameters when effect runs
 * - Should demonstrate proper dependency tracking
 */
export function SearchResults({ searchTerm, filters, userId, theme }) {
  useEffect(() => {
    console.log(`Searching for ${searchTerm}`, filters);
  }, [searchTerm, filters]);

  return <div>{`Search results for ${searchTerm}`}</div>;
}

// =============================================================================
// EXERCISE 3: Effect Timing (Layout Effects)
// =============================================================================

/**
 * Create a component that demonstrates the difference between useLayoutEffect and useEffect.
 * Should have a div that changes color based on state
 * Should demonstrate synchronous vs asynchronous updates
 * Should show visual difference between the two hooks
 *
 * Expected behavior:
 * - useLayoutEffect should fire synchronously before paint
 * - useEffect should fire asynchronously after paint
 * - Should be able to toggle between the two approaches
 */
export function LayoutEffectDemo() {
  const [show, setShow] = useState(true);
  const [color, setColor] = useState('blue');
  const [useLayout, setUseLayout] = useState(true);

  const Effect = useLayout ? useLayoutEffect : useEffect;

  Effect(() => {
    if (show) {
      setColor('red');
    } else {
      setColor('blue');
    }
    console.log(useLayout ? 'useLayoutEffect ran' : 'useEffect ran');
  }, [show, useLayout]);

  return (
    <div>
      <div style={{ color, fontWeight: 'bold', fontSize: 24 }}>
        Layout Effect Demo
      </div>
      <button onClick={() => setShow((s) => !s)}>
        Toggle Show ({show ? 'ON' : 'OFF'})
      </button>
      <button onClick={() => setUseLayout((u) => !u)}>
        Use {useLayout ? 'Effect' : 'LayoutEffect'}
      </button>
      <div>
        <small>
          Currently using: <b>{useLayout ? 'useLayoutEffect' : 'useEffect'}</b>
        </small>
      </div>
    </div>
  );
}

/**
 * Create a component that measures DOM elements using useLayoutEffect.
 * Should measure element dimensions after render
 * Should use useLayoutEffect for synchronous measurements
 * Should display the measured dimensions
 *
 * Expected behavior:
 * - Should measure element width and height
 * - Measurements should be available before paint
 * - Should re-measure when content changes
 */
export function ElementMeasurer() {
  const [dimensions, setDimension] = useState({ width: 0, height: 0 });
  const [content, setContent] = useState('Short');
  const elementRef = useRef(null);

  useLayoutEffect(() => {
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      setDimension({ width: rect.width, height: rect.height });
    }
  }, [content]);

  return (
    <div>
      <p ref={elementRef}>{content}</p>
      <p>{`Width: ${dimensions.width}`}</p>
      <p>{`Height: ${dimensions.height}`}</p>
      <button
        onClick={() =>
          setContent(content === 'Short' ? 'Much longer content here' : 'Short')
        }>
        Change content
      </button>
    </div>
  );
}

// =============================================================================
// EXERCISE 4: Data Fetching Patterns
// =============================================================================

/**
 * Create a component that fetches data on mount with loading and error states.
 * Should fetch user data on mount
 * Should handle loading, success, and error states
 * Should display appropriate UI for each state
 * API endpoint: /api/users/${userId}
 *
 * Expected behavior:
 * - Show loading indicator while fetching
 * - Display user data when successful
 * - Show error message when fetch fails
 * - Only fetch once on mount
 */
export function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>An error occured.</div>;
  }

  if (user) {
    return (
      <div>
        <p>{user.name}</p>
        <p>{user.email}</p>
      </div>
    );
  }

  return <div>No user found</div>;
}

/**
 * Create a component that refetches data when parameters change.
 * Should fetch posts based on category and page props
 * Should refetch when category or page changes
 * Should handle loading states properly
 * API endpoint: /api/posts?category=${category}&page=${page}
 *
 * Expected behavior:
 * - Fetch posts when component mounts
 * - Refetch when category changes
 * - Refetch when page changes
 * - Show loading state during refetch
 */
export function PostList({ category, page }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/posts?category=${category}&page=${page}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const postData = await response.json();
        setPosts(postData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [category, page]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>An error occured.</div>;
  }

  if (posts.length > 0) {
    return (
      <div>
        {posts.map((post) => {
          return <div>{post}</div>;
        })}
      </div>
    );
  }

  return <div>No posts found</div>;
}

/**
 * Create a component that can cancel in-flight requests.
 * Should fetch data based on search term
 * Should cancel previous requests when new search starts
 * Should use AbortController for cancellation
 *
 * Expected behavior:
 * - Should debounce search input
 * - Should cancel previous fetch when new search starts
 * - Should not update state if request was cancelled
 * - Should handle abort errors gracefully
 */
export function SearchableList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchTerm) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/search?q=${searchTerm}`, {
          signal: controller.signal
        });
        const searchData = await response.json();
        setResults(searchData);
      } catch (err) {
        if (error.name !== 'AbortError') {
          console.error('Search failed:', error);
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [searchTerm]);

  return (
    <div>
      <label>
        Search{' '}
        <input
          name="search"
          value={searchTerm}
          placeholder="Search..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </label>
      {loading ? <div>Searching...</div> : ''}
      <div>{`Results: ${results.length}`}</div>
    </div>
  );
}

// =============================================================================
// EXERCISE 5: Subscription Management
// =============================================================================

/**
 * Create a component that manages WebSocket connections.
 * Should connect to WebSocket on mount
 * Should listen for messages and update state
 * Should disconnect on unmount
 * Should handle connection errors
 *
 * Expected behavior:
 * - Establish WebSocket connection on mount
 * - Display incoming messages in real-time
 * - Clean up connection on unmount
 * - Handle connection failures gracefully
 */
export function LiveChat({ roomId }) {
  // TODO: Implement WebSocket subscription management
}

/**
 * Create a component that manages multiple event subscriptions.
 * Should subscribe to multiple events (mouse, keyboard, scroll)
 * Should track and display event data
 * Should clean up all subscriptions on unmount
 *
 * Expected behavior:
 * - Subscribe to multiple window events
 * - Display real-time event data
 * - Clean up all subscriptions properly
 * - Handle subscription errors
 */
export function MultiSubscriber() {
  // TODO: Implement multiple event subscriptions
}

// =============================================================================
// EXERCISE 6: Race Condition Handling
// =============================================================================

/**
 * Create a component that prevents stale closure issues in async operations.
 * Should handle async operations that may complete out of order
 * Should only update state with the latest request
 * Should demonstrate cleanup of stale requests
 *
 * Expected behavior:
 * - Multiple rapid requests should not cause stale updates
 * - Only the latest request should update the UI
 * - Should handle component unmounting during async operations
 */
export function StaleClosurePrevention() {
  // TODO: Implement stale closure prevention
}

/**
 * Create a component that prevents duplicate requests.
 * Should cache request results
 * Should not make duplicate requests for same parameters
 * Should handle cache invalidation
 *
 * Expected behavior:
 * - Same requests should return cached results
 * - Should not make network calls for cached data
 * - Should invalidate cache when needed
 * - Should handle cache expiration
 */
export function RequestDeduplication() {
  // TODO: Implement request deduplication
}

// =============================================================================
// EXERCISE 7: Effect Optimization
// =============================================================================

/**
 * Create a component that optimizes expensive effects.
 * Should perform expensive calculations in effects
 * Should optimize using proper dependencies
 * Should demonstrate memoization of effect dependencies
 *
 * Expected behavior:
 * - Expensive operations should only run when necessary
 * - Should use memoization to prevent unnecessary recalculations
 * - Should show performance improvements
 */
export function ExpensiveEffect({ data, filters, settings }) {
  // TODO: Implement effect optimization
}

/**
 * Create a component that debounces effects for performance.
 * Should debounce search API calls
 * Should cancel previous debounced calls
 * Should handle rapid input changes efficiently
 *
 * Expected behavior:
 * - Should wait for user to stop typing before searching
 * - Should cancel previous search requests
 * - Should show loading states appropriately
 * - Should handle empty search terms
 */
export function DebouncedSearch() {
  // TODO: Implement debounced search
}

/**
 * Create a component that demonstrates effect batching for performance.
 * Should batch multiple related effects
 * Should demonstrate React's automatic batching
 * Should show performance benefits of batching
 *
 * Expected behavior:
 * - Multiple state updates should be batched
 * - Effects should run in optimal order
 * - Should minimize DOM updates
 * - Should demonstrate flushSync when needed
 */
export function BatchedEffects() {
  // TODO: Implement effect batching
}

// =============================================================================
// BONUS EXERCISE: Advanced Effect Patterns
// =============================================================================

/**
 * Create a custom hook that encapsulates complex effect logic.
 * Hook name: useAsyncEffect
 * Should handle async operations in effects
 * Should provide loading, error, and data states
 * Should handle cleanup and cancellation
 * Should be reusable across components
 *
 * Expected behavior:
 * - Should work with any async function
 * - Should handle loading states automatically
 * - Should prevent memory leaks
 * - Should be composable with other hooks
 */
export function useAsyncEffect(asyncFunction, dependencies) {
  // TODO: Implement custom async effect hook
}

/**
 * Component demonstrating the custom hook usage
 */
export function AsyncEffectDemo() {
  // TODO: Implement async effect demo using custom hook
}
