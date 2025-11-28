/**
 * React Architecture and Design Exercises
 *
 * This file contains exercises covering React application architecture:
 * - Code splitting strategies
 * - State architecture patterns
 * - API integration patterns
 * - Authentication patterns
 *
 * Each exercise includes:
 * - Clear documentation with examples
 * - Expected behavior description
 * - Component/pattern requirements
 * - Test cases to validate implementation
 */

import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  lazy,
  Suspense
} from 'react';

// =============================================================================
// EXERCISE 1: Code Splitting Strategies
// =============================================================================

/**
 * Create a lazy-loaded component for a dashboard page.
 * This component should be loaded on-demand using React.lazy.
 *
 * Requirements:
 * - Export as a lazy-loaded component
 * - Display heading "Dashboard Page"
 * - Include paragraph with text "This is a lazy-loaded dashboard"
 * - Use className "dashboard-page"
 */
export const LazyDashboard = lazy(() =>
  // TODO: Implement lazy loading
  // Hint: Return a Promise that resolves to a component module
  Promise.resolve({
    default: function Dashboard() {
      // TODO: Implement dashboard component
    }
  })
);

/**
 * Create a route-based code splitting wrapper.
 * Should render different lazy-loaded components based on the route prop.
 *
 * Requirements:
 * - Accept route prop: "home", "dashboard", "profile", "settings"
 * - Use Suspense with fallback "Loading page..."
 * - Lazy load appropriate component for each route
 * - All components should have data-testid matching the route name
 *
 * Routes:
 * - home: Display "Home Page"
 * - dashboard: Display "Dashboard Page"
 * - profile: Display "Profile Page"
 * - settings: Display "Settings Page"
 */
export function RouteBasedSplitting({ route }) {
  // TODO: Implement route-based code splitting
  // Hint: Use lazy() for each route component and Suspense for loading state
}

/**
 * Create a feature-based lazy loader with dynamic imports.
 * Should load feature modules based on feature flags.
 *
 * Requirements:
 * - Accept features object: { analytics: boolean, chat: boolean, notifications: boolean }
 * - Lazy load enabled features only
 * - Display "Feature: [name]" for each enabled feature
 * - Use Suspense with fallback for each feature
 * - Wrap features in div with className "feature-container"
 */
export function FeatureBasedSplitting({ features }) {
  // TODO: Implement feature-based code splitting
  // Hint: Conditionally lazy load based on feature flags
}

/**
 * Create a component that demonstrates bundle splitting with named chunks.
 * Should lazy load heavy dependencies (like charts) only when needed.
 *
 * Requirements:
 * - Button to toggle chart visibility
 * - Lazy load chart component when button clicked
 * - Use Suspense with fallback "Loading chart..."
 * - Chart component should display "Chart Component" with className "chart"
 */
export function BundleSplittingDemo() {
  // TODO: Implement bundle splitting with lazy loading
  // Hint: Use state to track if chart should be loaded, then lazy load it
}

// =============================================================================
// EXERCISE 2: State Architecture Patterns
// =============================================================================

/**
 * Create a centralized store using Context API for application state.
 * This demonstrates a Redux-like pattern with Context.
 *
 * Requirements:
 * - Create AppStateContext with initial state: { user: null, theme: 'light', notifications: [] }
 * - Create AppDispatchContext for dispatch function
 * - Implement reducer supporting actions: SET_USER, SET_THEME, ADD_NOTIFICATION, CLEAR_NOTIFICATIONS
 * - Export useAppState and useAppDispatch hooks
 * - Export AppStateProvider component
 *
 * Actions format:
 * - { type: 'SET_USER', payload: { id, name, email } }
 * - { type: 'SET_THEME', payload: 'light' | 'dark' }
 * - { type: 'ADD_NOTIFICATION', payload: { id, message, type } }
 * - { type: 'CLEAR_NOTIFICATIONS' }
 */

// TODO: Create AppStateContext
export const AppStateContext = createContext(null);

// TODO: Create AppDispatchContext
export const AppDispatchContext = createContext(null);

// TODO: Implement reducer
function appReducer(state, action) {
  // TODO: Handle all action types
}

// TODO: Implement AppStateProvider
export function AppStateProvider({ children }) {
  // TODO: Use useReducer with appReducer
  // TODO: Provide state and dispatch through contexts
}

// TODO: Implement custom hooks
export function useAppState() {
  // TODO: Return context value with error handling
}

export function useAppDispatch() {
  // TODO: Return dispatch function with error handling
}

/**
 * Create a feature-based state module for shopping cart.
 * Demonstrates modular state management pattern.
 *
 * Requirements:
 * - Custom hook useShoppingCart with state and actions
 * - State: items array (each item: { id, name, price, quantity })
 * - Actions: addItem, removeItem, updateQuantity, clearCart
 * - Derived state: totalItems, totalPrice
 * - Persist to localStorage with key 'shopping-cart'
 *
 * Return object structure:
 * { items, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart }
 */
export function useShoppingCart() {
  // TODO: Implement shopping cart state management
  // Hint: Use useState, useEffect for persistence, useMemo for derived state
}

/**
 * Create a component demonstrating state colocation pattern.
 * State should be placed close to where it's used, not at top level unnecessarily.
 *
 * Requirements:
 * - Parent component with global search query state
 * - Two independent child sections: UserList and ProductList
 * - Each child manages its own local state (filters, sort order)
 * - Both children receive and use the global search query
 * - Global search input in parent
 * - Each child shows filtered results based on global search + local filters
 *
 * UserList local state: { sortBy: 'name' | 'email' }
 * ProductList local state: { sortBy: 'name' | 'price', filterInStock: boolean }
 */
export function StateColocationDemo({ users = [], products = [] }) {
  // TODO: Implement state colocation pattern
  // Parent manages global search, children manage local state
}

/**
 * Create a state normalization pattern for nested data.
 * Demonstrates how to structure and access normalized data efficiently.
 *
 * Requirements:
 * - Accept nested data: posts with authors and comments
 * - Normalize into separate entities: { posts: {}, authors: {}, comments: {} }
 * - Provide selectors: getPost(id), getAuthor(id), getPostWithAuthor(id)
 * - Display posts with author info and comment count
 * - Use data-testid for testing
 *
 * Input format:
 * posts = [{ id, title, content, author: { id, name }, comments: [{ id, text }] }]
 *
 * Normalized format:
 * {
 *   posts: { [id]: { id, title, content, authorId, commentIds } },
 *   authors: { [id]: { id, name } },
 *   comments: { [id]: { id, text, postId } }
 * }
 */
export function NormalizedDataDemo({ posts = [] }) {
  // TODO: Implement data normalization and selectors
  // Hint: Normalize data in useEffect or useMemo
}

// =============================================================================
// EXERCISE 3: API Integration Patterns
// =============================================================================

/**
 * Create a custom hook for API requests with loading, error, and data states.
 * Demonstrates the standard pattern for async data fetching.
 *
 * Requirements:
 * - Accept url and options parameters
 * - Return { data, loading, error, refetch }
 * - Handle loading state (initially true)
 * - Handle error state with error object
 * - Support manual refetch
 * - Clean up on unmount (abort ongoing requests)
 *
 * States:
 * - loading: true during fetch
 * - error: null or Error object
 * - data: null or fetched data
 */
export function useFetch(url, options = {}) {
  // TODO: Implement fetch hook with proper state management
  // Hint: Use useState for states, useEffect for fetching, AbortController for cleanup
}

/**
 * Create a component demonstrating API integration with error boundaries.
 * Should gracefully handle API errors and provide retry functionality.
 *
 * Requirements:
 * - Use useFetch to load data from provided apiUrl
 * - Display loading state: "Loading data..."
 * - Display error state with error message and retry button
 * - Display data as list when successful
 * - Each item should have data-testid="data-item"
 * - Retry button should have data-testid="retry-button"
 *
 * Expected data format: Array of { id, name }
 */
export function ApiIntegrationDemo({ apiUrl }) {
  // TODO: Implement API integration with error handling
}

/**
 * Create a request caching layer for API calls.
 * Demonstrates caching pattern to avoid duplicate requests.
 *
 * Requirements:
 * - Create ApiCacheProvider with cache context
 * - Implement useCachedFetch hook
 * - Cache successful responses by URL
 * - Return cached data immediately if available
 * - Support cache invalidation
 * - Include timestamp for cache entries
 * - Optional TTL (time-to-live) in milliseconds
 *
 * Return from useCachedFetch: { data, loading, error, invalidateCache }
 */

// TODO: Create cache context
export const ApiCacheContext = createContext(null);

export function ApiCacheProvider({ children }) {
  // TODO: Implement cache provider with cache state
  // Cache structure: { [url]: { data, timestamp } }
}

export function useCachedFetch(url, options = {}) {
  // TODO: Implement cached fetch hook
  // Hint: Check cache first, fetch if not cached or expired
}

/**
 * Create a request queue/debounce pattern for search.
 * Demonstrates how to handle rapid API calls efficiently.
 *
 * Requirements:
 * - Accept searchTerm prop and onSearch callback
 * - Debounce API calls by 300ms
 * - Cancel pending requests when searchTerm changes
 * - Show "Searching..." during debounce wait
 * - Display results from onSearch callback
 * - Input should update immediately (not debounced)
 *
 * Component should call onSearch(debouncedTerm) when term stabilizes
 */
export function DebouncedSearch({ onSearch }) {
  // TODO: Implement debounced search
  // Hint: Use useEffect with timeout, cleanup function to cancel
}

/**
 * Create a polling pattern for real-time updates.
 * Demonstrates how to fetch data at regular intervals.
 *
 * Requirements:
 * - Accept url and interval props (default interval: 5000ms)
 * - Fetch data immediately and then at regular intervals
 * - Stop polling when component unmounts
 * - Support manual start/stop controls
 * - Display data, last updated timestamp, and polling status
 * - Buttons: "Start Polling", "Stop Polling" (disabled appropriately)
 *
 * Return: Component that polls and displays data
 */
export function PollingDemo({ url, interval = 5000 }) {
  // TODO: Implement polling pattern
  // Hint: Use setInterval in useEffect, clear on cleanup
}

// =============================================================================
// EXERCISE 4: Authentication Patterns
// =============================================================================

/**
 * Create an authentication context and provider.
 * Demonstrates centralized auth state management.
 *
 * Requirements:
 * - AuthContext with state: { user: null | User, isAuthenticated: boolean, isLoading: boolean }
 * - Methods: login(email, password), logout(), checkAuth()
 * - Simulate async login (500ms delay)
 * - Store token in localStorage with key 'auth-token'
 * - Auto-check auth on mount
 * - Export useAuth hook
 *
 * User object: { id, email, name, role }
 * Login success: email === 'user@example.com' && password === 'password123'
 */

// TODO: Create AuthContext
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // TODO: Implement auth provider with state and methods
  // Hint: Use useState for auth state, useEffect to check auth on mount
}

export function useAuth() {
  // TODO: Return auth context with error handling
}

/**
 * Create a protected route component.
 * Should redirect or show message if user is not authenticated.
 *
 * Requirements:
 * - Accept children and fallback props
 * - Use useAuth to check authentication
 * - Render children if authenticated
 * - Render fallback or "Please log in" message if not authenticated
 * - Show "Loading..." while auth is being checked (isLoading)
 */
export function ProtectedRoute({ children, fallback }) {
  // TODO: Implement protected route
  // Hint: Use useAuth hook to get auth state
}

/**
 * Create a role-based access control (RBAC) component.
 * Should render children only if user has required role.
 *
 * Requirements:
 * - Accept children, requiredRole, and fallback props
 * - Use useAuth to get current user
 * - Render children if user.role matches requiredRole
 * - Render fallback or "Access denied" if role doesn't match
 * - Handle case when user is not logged in
 *
 * Roles: 'user', 'admin', 'moderator'
 */
export function RequireRole({ children, requiredRole, fallback }) {
  // TODO: Implement role-based access control
}

/**
 * Create a login form component with authentication.
 * Demonstrates form integration with auth context.
 *
 * Requirements:
 * - Email and password inputs (controlled)
 * - Submit button (disabled during login)
 * - Use useAuth for login
 * - Show error message if login fails
 * - Clear error on input change
 * - Display "Logging in..." during login process
 * - Call onSuccess callback after successful login
 *
 * Validation:
 * - Email required and valid format
 * - Password required and min 6 characters
 */
export function LoginForm({ onSuccess }) {
  // TODO: Implement login form with validation
  // Hint: Use useAuth().login method, handle async errors
}

/**
 * Create a token refresh mechanism.
 * Demonstrates how to handle token expiration and refresh.
 *
 * Requirements:
 * - Custom hook useTokenRefresh
 * - Accept token and refreshToken
 * - Auto-refresh before token expires (check every minute)
 * - Return { token, isRefreshing, error }
 * - Simulate refresh API call (300ms delay)
 * - Update localStorage with new token
 *
 * Token format: { value: string, expiresAt: timestamp }
 */
export function useTokenRefresh(initialToken, refreshToken) {
  // TODO: Implement token refresh mechanism
  // Hint: Use setInterval to check expiration, fetch to refresh
}

/**
 * Create a user profile component with auth integration.
 * Demonstrates how to use auth context in components.
 *
 * Requirements:
 * - Use useAuth to get current user
 * - Display user info: name, email, role
 * - Show "Not logged in" if no user
 * - Logout button that calls useAuth().logout()
 * - All info wrapped in div with className "user-profile"
 * - Logout button has data-testid="logout-button"
 */
export function UserProfile() {
  // TODO: Implement user profile component
}

// =============================================================================
// EXERCISE 5: Combined Architecture Patterns
// =============================================================================

/**
 * Create a complete feature module combining all architecture patterns.
 * This is an advanced exercise demonstrating real-world application structure.
 *
 * Requirements:
 * - Code splitting for feature components
 * - Centralized state management
 * - API integration with caching
 * - Authentication and authorization
 * - Error boundaries
 * - Loading states
 *
 * Feature: User Dashboard
 * - Protected route (requires authentication)
 * - Lazy loaded dashboard component
 * - Fetches user data from API (with caching)
 * - Displays user stats and recent activity
 * - Role-based UI elements (admin sees extra options)
 * - Polling for real-time notifications
 */
export function UserDashboardFeature({ apiUrl }) {
  // TODO: Implement complete feature module
  // This combines: lazy loading, auth, API integration, state management
}

/**
 * Helper function to simulate API calls.
 * DO NOT MODIFY - Used by tests.
 */
export function mockApiCall(data, delay = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
}

/**
 * Helper function to simulate API errors.
 * DO NOT MODIFY - Used by tests.
 */
export function mockApiError(message = 'API Error', delay = 1000) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), delay);
  });
}
