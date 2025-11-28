/**
 * React Libraries Exercises
 *
 * This file contains exercises covering popular React ecosystem libraries:
 * 1. Axios - HTTP client for making API requests
 * 2. TanStack Query (React Query) - Server state management and data fetching
 * 3. Redux - Predictable state container
 * 4. Zustand - Lightweight state management
 *
 * Each exercise includes TODO comments where you need to implement functionality.
 * Run the test suite to validate your implementations.
 */

import React from 'react';
import axios from 'axios';
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import { createSlice, configureStore } from '@reduxjs/toolkit';
import { create } from 'zustand';

// ============================================================================
// Exercise 1: Axios - HTTP Client Basics
// ============================================================================

/**
 * Create an axios instance with base configuration
 *
 * Requirements:
 * - Base URL: 'https://api.example.com'
 * - Timeout: 5000ms
 * - Default headers: { 'Content-Type': 'application/json' }
 */
export const createAxiosInstance = () => {
  // TODO: Import axios and create configured instance
  // TODO: Set baseURL, timeout, and default headers
  // TODO: Return the configured instance
};

/**
 * Component that fetches user data using axios
 *
 * Requirements:
 * - Fetch user data from /users/:userId on mount
 * - Show loading state while fetching
 * - Display error message if request fails
 * - Display user data when loaded (name, email)
 */
export const UserProfile = ({ userId, axiosInstance }) => {
  // TODO: Add state for user data, loading, and error
  // TODO: Fetch user data on mount using axiosInstance
  // TODO: Handle loading and error states
  // TODO: Render user information or appropriate state
};

/**
 * Add request interceptor to axios instance
 *
 * Requirements:
 * - Add Authorization header with token from localStorage
 * - Only add header if token exists
 * - Return modified config
 */
export const addAuthInterceptor = (axiosInstance) => {
  // TODO: Add request interceptor
  // TODO: Get token from localStorage.getItem('authToken')
  // TODO: Add Authorization header if token exists
  // TODO: Return interceptor ID
};

/**
 * Add response interceptor for error handling
 *
 * Requirements:
 * - Handle 401 errors by calling onUnauthorized callback
 * - Handle network errors by calling onNetworkError callback
 * - Return modified error
 */
export const addErrorInterceptor = (
  axiosInstance,
  onUnauthorized,
  onNetworkError
) => {
  // TODO: Add response interceptor
  // TODO: Handle successful responses (return response)
  // TODO: Handle 401 status code
  // TODO: Handle network errors (no response)
  // TODO: Return interceptor ID
};

// ============================================================================
// Exercise 2: TanStack Query (React Query) - Data Fetching
// ============================================================================

/**
 * Component that uses useQuery to fetch posts
 *
 * Requirements:
 * - Use queryKey: ['posts']
 * - Fetch from /posts endpoint
 * - Set staleTime to 30 seconds
 * - Show loading state
 * - Show error message if fetch fails
 * - Display list of posts with title
 */
export const PostsList = ({ api }) => {
  // TODO: Import useQuery from @tanstack/react-query
  // TODO: Setup useQuery with proper configuration
  // TODO: Handle loading state
  // TODO: Handle error state
  // TODO: Render posts list
};

/**
 * Component that uses useQuery with dynamic parameters
 *
 * Requirements:
 * - Use queryKey: ['post', postId]
 * - Only fetch when postId is truthy (use enabled option)
 * - Fetch from /posts/:postId
 * - Show "Select a post" when postId is null
 * - Show loading state while fetching
 * - Display post title and body
 */
export const PostDetail = ({ postId, api }) => {
  // TODO: Setup useQuery with queryKey including postId
  // TODO: Use enabled option to control when query runs
  // TODO: Handle null postId case
  // TODO: Handle loading state
  // TODO: Render post details
};

/**
 * Component that uses useMutation to create a post
 *
 * Requirements:
 * - Use mutationFn to POST to /posts
 * - Invalidate 'posts' query on success
 * - Show loading state while mutation is pending
 * - Show error message if mutation fails
 * - Clear form after successful submission
 */
export const CreatePost = ({ api, queryClient }) => {
  // TODO: Import useMutation from @tanstack/react-query
  // TODO: Add state for title and body
  // TODO: Setup useMutation with proper configuration
  // TODO: Invalidate queries on success using queryClient
  // TODO: Handle form submission
  // TODO: Display loading and error states
};

/**
 * Component with optimistic updates using useMutation
 *
 * Requirements:
 * - Implement optimistic update in onMutate
 * - Cancel outgoing refetches before optimistic update
 * - Snapshot previous todos for rollback
 * - Update cache optimistically with new todo
 * - Rollback on error using previous snapshot
 * - Refetch on settled to sync with server
 */
export const OptimisticTodoList = ({ api, queryClient }) => {
  // TODO: Setup useQuery for todos list
  // TODO: Setup useMutation with onMutate, onError, onSettled
  // TODO: Implement optimistic update logic
  // TODO: Handle rollback on error
  // TODO: Invalidate queries on settled
};

// ============================================================================
// Exercise 3: Redux - State Management
// ============================================================================

/**
 * Create a simple counter reducer
 *
 * Requirements:
 * - Initial state: { value: 0 }
 * - Handle 'counter/increment' action: value + 1
 * - Handle 'counter/decrement' action: value - 1
 * - Handle 'counter/incrementByAmount' action: value + action.payload
 * - Return current state for unknown actions
 */
export const counterReducer = (state = { value: 0 }, action) => {
  // TODO: Implement switch statement for action types
  // TODO: Handle increment action
  // TODO: Handle decrement action
  // TODO: Handle incrementByAmount action
  // TODO: Return state for default case
};

/**
 * Counter component using Redux hooks
 *
 * Requirements:
 * - Use useSelector to get count from state.counter.value
 * - Use useDispatch to get dispatch function
 * - Dispatch increment action on + button click
 * - Dispatch decrement action on - button click
 * - Display current count
 */
export const ReduxCounter = () => {
  // TODO: Import useSelector and useDispatch from react-redux
  // TODO: Get count from store using useSelector
  // TODO: Get dispatch function using useDispatch
  // TODO: Create handlers for increment/decrement
  // TODO: Render buttons and count display
};

/**
 * Create action creators for counter
 *
 * Requirements:
 * - increment() returns { type: 'counter/increment' }
 * - decrement() returns { type: 'counter/decrement' }
 * - incrementByAmount(amount) returns { type: 'counter/incrementByAmount', payload: amount }
 */
export const counterActions = {
  increment: () => {
    // TODO: Return increment action
  },
  decrement: () => {
    // TODO: Return decrement action
  },
  incrementByAmount: (amount) => {
    // TODO: Return incrementByAmount action with payload
  }
};

/**
 * Todos reducer with more complex state
 *
 * Requirements:
 * - Initial state: []
 * - 'todos/todoAdded': Add new todo with id, text, completed: false
 * - 'todos/todoToggled': Toggle completed status for todo with matching id
 * - 'todos/todoDeleted': Remove todo with matching id
 */
export const todosReducer = (state = [], action) => {
  // TODO: Implement switch for action types
  // TODO: Handle todoAdded - add new todo to array
  // TODO: Handle todoToggled - toggle completed for matching id
  // TODO: Handle todoDeleted - filter out matching id
  // TODO: Return state for default case
};

// ============================================================================
// Exercise 4: Zustand - Lightweight State Management
// ============================================================================

/**
 * Create a Zustand store for a counter
 *
 * Requirements:
 * - State: count (number, initial value: 0)
 * - Action: increment() - increases count by 1
 * - Action: decrement() - decreases count by 1
 * - Action: reset() - sets count to 0
 */
export const createCounterStore = () => {
  // TODO: Import create from zustand
  // TODO: Define store with count state and actions
  // TODO: Return the created store hook
};

/**
 * Create a Zustand store with selectors
 *
 * Requirements:
 * - State: users array, loading boolean
 * - Action: setUsers(users) - sets users array
 * - Action: setLoading(loading) - sets loading state
 * - Action: addUser(user) - adds user to array
 * - Selector: selectUserCount - returns users.length
 * - Selector: selectIsEmpty - returns users.length === 0
 */
export const createUsersStore = () => {
  // TODO: Import create from zustand
  // TODO: Define state (users, loading)
  // TODO: Define actions (setUsers, setLoading, addUser)
  // TODO: Define selectors (selectUserCount, selectIsEmpty)
  // TODO: Return the created store hook
};

/**
 * Create a Zustand store with persist middleware
 *
 * Requirements:
 * - State: theme (string, initial: 'light')
 * - Action: setTheme(theme) - updates theme
 * - Action: toggleTheme() - toggles between 'light' and 'dark'
 * - Persist to localStorage with name 'theme-storage'
 */
export const createThemeStore = () => {
  // TODO: Import create from zustand
  // TODO: Import persist and createJSONStorage from zustand/middleware
  // TODO: Wrap store creation with persist middleware
  // TODO: Configure storage name
  // TODO: Define theme state and actions
  // TODO: Return the created store hook
};

/**
 * Component using Zustand store
 *
 * Requirements:
 * - Use useCounterStore to get count and actions
 * - Display current count
 * - Render increment button
 * - Render decrement button
 * - Render reset button
 */
export const ZustandCounter = ({ useCounterStore }) => {
  // TODO: Get count from store
  // TODO: Get increment action from store
  // TODO: Get decrement action from store
  // TODO: Get reset action from store
  // TODO: Render UI with count and buttons
};

/**
 * Create Zustand store with middleware for async actions
 *
 * Requirements:
 * - State: data (null initially), loading (false), error (null)
 * - Action: fetchData(api, endpoint) - async function that:
 *   - Sets loading to true
 *   - Clears error
 *   - Makes API call
 *   - Sets data on success
 *   - Sets error on failure
 *   - Sets loading to false when done
 */
export const createAsyncStore = () => {
  // TODO: Import create from zustand
  // TODO: Define state (data, loading, error)
  // TODO: Define fetchData async action
  // TODO: Handle loading states properly
  // TODO: Handle errors properly
  // TODO: Return the created store hook
};

// ============================================================================
// Helper Components and Utilities
// ============================================================================

/**
 * Simple mock API for testing
 */
export const createMockApi = () => {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  return {
    get: async (url) => {
      await delay(100);
      if (url.includes('/users/')) {
        const id = url.split('/').pop();
        return {
          data: { id, name: `User ${id}`, email: `user${id}@example.com` }
        };
      }
      if (url.includes('/posts/')) {
        const id = url.split('/').pop();
        return {
          data: { id, title: `Post ${id}`, body: `Body of post ${id}` }
        };
      }
      if (url === '/posts') {
        return {
          data: [
            { id: 1, title: 'Post 1' },
            { id: 2, title: 'Post 2' }
          ]
        };
      }
      throw new Error('Not found');
    },
    post: async (url, data) => {
      await delay(100);
      return { data: { id: Date.now(), ...data } };
    }
  };
};

/**
 * Error boundary for testing error handling
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || <div>Error: {this.state.error.message}</div>
      );
    }
    return this.props.children;
  }
}
