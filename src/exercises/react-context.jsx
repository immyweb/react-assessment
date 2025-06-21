/**
 * React Context and Global State Exercises
 *
 * This file contains exercises covering React context and global state management:
 * - createContext and useContext
 * - Context provider patterns
 * - Avoiding prop drilling
 * - Multiple context composition
 * - Context optimization techniques
 * - Custom context hooks
 * - Context vs state management libraries
 *
 * Each exercise includes:
 * - Clear documentation with examples
 * - Expected behavior description
 * - Component requirements
 * - Test cases to validate implementation
 */

import React, {
  createContext,
  useContext,
  useState,
  useReducer,
  useMemo,
  useCallback
} from 'react';

// =============================================================================
// EXERCISE 1: createContext and useContext Basics
// =============================================================================

/**
 * Create a basic theme context that provides theme data to components.
 * Should use createContext to create ThemeContext
 * Should provide a ThemeProvider component
 * Should include a useTheme hook for consuming the context
 *
 * Expected behavior:
 * - ThemeProvider should accept theme prop and provide it via context
 * - useTheme should return current theme from context
 * - Components should be able to access theme without prop drilling
 */

// TODO: Create ThemeContext using createContext
export const ThemeContext = null;

// TODO: Create ThemeProvider component
export function ThemeProvider({ children, theme }) {
  // TODO: Implement theme provider
}

// TODO: Create useTheme hook
export function useTheme() {
  // TODO: Implement theme hook
}

// TODO: Create component that uses theme context
export function ThemedButton({ children }) {
  // TODO: Use useTheme to get theme and apply styles
  return <button>{children}</button>;
}

/**
 * Create a user context for authentication state.
 * Should provide user data and loading state
 * Should include login/logout functionality
 * Should demonstrate basic context patterns
 *
 * Expected behavior:
 * - Should provide current user state
 * - Should provide login/logout methods
 * - Should handle loading states
 * - Should work without prop drilling
 */

// TODO: Create UserContext
export const UserContext = null;

// TODO: Create UserProvider component
export function UserProvider({ children }) {
  // TODO: Implement user state management
  // TODO: Provide user data and methods via context
}

// TODO: Create useUser hook
export function useUser() {
  // TODO: Implement user context hook
}

// TODO: Create component that displays user info
export function UserProfile() {
  // TODO: Use useUser to display user information
  return <div>User Profile</div>;
}

// =============================================================================
// EXERCISE 2: Context Provider Patterns
// =============================================================================

/**
 * Create a shopping cart context with complex state management.
 * Should use useReducer for state management
 * Should provide cart items and total calculation
 * Should include add, remove, and clear functionality
 *
 * Expected behavior:
 * - Should manage cart items array
 * - Should calculate total price automatically
 * - Should provide actions for cart manipulation
 * - Should persist cart state across component re-renders
 */

// TODO: Define cart action types
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART'
};

// TODO: Implement cart reducer
function cartReducer(state, action) {
  // TODO: Handle different cart actions
  return state;
}

// TODO: Create CartContext
export const CartContext = null;

// TODO: Create CartProvider component
export function CartProvider({ children }) {
  // TODO: Implement cart state with useReducer
  // TODO: Provide cart state and dispatch actions
}

// TODO: Create useCart hook
export function useCart() {
  // TODO: Implement cart context hook with actions
}

// TODO: Create component that displays cart
export function ShoppingCart() {
  // TODO: Use useCart to display cart items and total
  return <div>Shopping Cart</div>;
}

// TODO: Create component for adding items to cart
export function ProductCard({ product }) {
  // TODO: Use useCart to add product to cart
  return (
    <div>
      <h3>{product?.name}</h3>
      <button>Add to Cart</button>
    </div>
  );
}

/**
 * Create a notification context for global notifications.
 * Should support different notification types (success, error, info)
 * Should auto-dismiss notifications after timeout
 * Should allow manual dismissal
 *
 * Expected behavior:
 * - Should queue multiple notifications
 * - Should auto-dismiss after specified timeout
 * - Should support different notification types
 * - Should provide methods to add and remove notifications
 */

// TODO: Create NotificationContext
export const NotificationContext = null;

// TODO: Create NotificationProvider component
export function NotificationProvider({ children }) {
  // TODO: Implement notification state management
  // TODO: Handle auto-dismissal with setTimeout
}

// TODO: Create useNotification hook
export function useNotification() {
  // TODO: Implement notification hook with actions
}

// TODO: Create NotificationList component
export function NotificationList() {
  // TODO: Render list of current notifications
  return <div>Notifications</div>;
}

// =============================================================================
// EXERCISE 3: Avoiding Prop Drilling
// =============================================================================

/**
 * Demonstrate prop drilling problem and solution with context.
 * Create a deep component tree that needs to share data
 * Show both prop drilling version and context solution
 *
 * Component tree: App -> Header -> Navigation -> UserMenu -> UserName
 * Data needed: user object with name and avatar
 *
 * Expected behavior:
 * - PropDrillingExample should pass props through all levels
 * - ContextSolutionExample should use context to avoid drilling
 * - Both should render the same final output
 * - Context version should be cleaner and more maintainable
 */

// Prop drilling version (for comparison)
export function PropDrillingExample({ user }) {
  return <HeaderWithProps user={user} />;
}

function HeaderWithProps({ user }) {
  return (
    <header>
      <NavigationWithProps user={user} />
    </header>
  );
}

function NavigationWithProps({ user }) {
  return (
    <nav>
      <UserMenuWithProps user={user} />
    </nav>
  );
}

function UserMenuWithProps({ user }) {
  return (
    <div>
      <UserNameWithProps user={user} />
    </div>
  );
}

function UserNameWithProps({ user }) {
  return <span>{user?.name || 'Guest'}</span>;
}

// TODO: Context solution
export const DeepUserContext = null;

// TODO: Create context solution components
export function ContextSolutionExample({ user }) {
  // TODO: Provide user via context and render header without props
  return <div>Context Solution</div>;
}

function HeaderWithContext() {
  // TODO: Implement header without user prop
  return (
    <header>
      <NavigationWithContext />
    </header>
  );
}

function NavigationWithContext() {
  // TODO: Implement navigation without user prop
  return (
    <nav>
      <UserMenuWithContext />
    </nav>
  );
}

function UserMenuWithContext() {
  // TODO: Implement user menu without user prop
  return (
    <div>
      <UserNameWithContext />
    </div>
  );
}

function UserNameWithContext() {
  // TODO: Use context to get user and display name
  return <span>User Name</span>;
}

/**
 * Create a settings context for app-wide configuration.
 * Should provide settings like language, timezone, theme preferences
 * Should allow updating individual settings
 * Should demonstrate avoiding prop drilling in complex apps
 *
 * Expected behavior:
 * - Should provide settings object with multiple properties
 * - Should allow updating individual settings
 * - Should be accessible deep in component tree
 * - Should trigger re-renders only when relevant settings change
 */

// TODO: Create SettingsContext
export const SettingsContext = null;

// TODO: Create SettingsProvider component
export function SettingsProvider({ children }) {
  // TODO: Implement settings state management
}

// TODO: Create useSettings hook
export function useSettings() {
  // TODO: Implement settings hook
}

// TODO: Create component that uses settings deep in tree
export function DeepSettingsComponent() {
  // TODO: Use useSettings to access and update settings
  return <div>Settings Component</div>;
}

// =============================================================================
// EXERCISE 4: Multiple Context Composition
// =============================================================================

/**
 * Create multiple contexts that work together.
 * Combine Theme, User, and Settings contexts
 * Show how to compose multiple providers
 * Demonstrate context interdependencies
 *
 * Expected behavior:
 * - Should combine multiple contexts efficiently
 * - Should handle provider composition
 * - Should allow contexts to interact with each other
 * - Should maintain separation of concerns
 */

// TODO: Create AppProvider that combines multiple contexts
export function AppProvider({ children }) {
  // TODO: Compose Theme, User, Settings, and other providers
  return <div>{children}</div>;
}

// TODO: Create component that uses multiple contexts
export function MultiContextComponent() {
  // TODO: Use multiple context hooks
  // TODO: Show interaction between different contexts
  return <div>Multi Context Component</div>;
}

/**
 * Create specialized context hooks that combine multiple contexts.
 * Create useAppState hook that combines user and settings
 * Create useUIState hook that combines theme and notifications
 * Demonstrate context composition patterns
 *
 * Expected behavior:
 * - Should provide convenient access to related contexts
 * - Should combine context data intelligently
 * - Should maintain performance characteristics
 * - Should provide clean API for components
 */

// TODO: Create useAppState hook
export function useAppState() {
  // TODO: Combine user and settings contexts
}

// TODO: Create useUIState hook
export function useUIState() {
  // TODO: Combine theme and notification contexts
}

// TODO: Create component using composed hooks
export function ComposedHooksExample() {
  // TODO: Use useAppState and useUIState
  return <div>Composed Hooks Example</div>;
}

// =============================================================================
// EXERCISE 5: Context Optimization Techniques
// =============================================================================

/**
 * Create optimized context to prevent unnecessary re-renders.
 * Split context into multiple providers for performance
 * Use useMemo and useCallback for context values
 * Demonstrate context splitting patterns
 *
 * Expected behavior:
 * - Should minimize re-renders of consuming components
 * - Should split frequently changing data from stable data
 * - Should use memoization appropriately
 * - Should demonstrate performance monitoring
 */

// TODO: Create optimized user context with split data/actions
export const OptimizedUserDataContext = null;
export const OptimizedUserActionsContext = null;

// TODO: Create OptimizedUserProvider
export function OptimizedUserProvider({ children }) {
  // TODO: Split user data and actions into separate contexts
  // TODO: Use useMemo and useCallback for optimization
}

// TODO: Create optimized hooks
export function useUserData() {
  // TODO: Hook for user data only
}

export function useUserActions() {
  // TODO: Hook for user actions only
}

// TODO: Create component that only needs user data
export function OptimizedUserDisplay() {
  // TODO: Use only useUserData to prevent action re-renders
  return <div>Optimized User Display</div>;
}

// TODO: Create component that only needs user actions
export function OptimizedUserActions() {
  // TODO: Use only useUserActions to prevent data re-renders
  return <div>Optimized User Actions</div>;
}

/**
 * Create context with selector pattern for fine-grained subscriptions.
 * Allow components to subscribe to specific parts of context
 * Implement selector-based context updates
 * Show performance benefits of selective subscriptions
 *
 * Expected behavior:
 * - Should allow components to select specific data
 * - Should only re-render when selected data changes
 * - Should provide clean selector API
 * - Should demonstrate performance improvements
 */

// TODO: Create context with selector support
export const SelectableContext = null;

// TODO: Create provider with selector support
export function SelectableProvider({ children }) {
  // TODO: Implement context with selector functionality
}

// TODO: Create hook with selector support
export function useSelector(selector) {
  // TODO: Implement selector-based context consumption
}

// TODO: Create components using selectors
export function SelectiveComponent() {
  // TODO: Use useSelector to subscribe to specific data
  return <div>Selective Component</div>;
}

// =============================================================================
// EXERCISE 6: Custom Context Hooks
// =============================================================================

/**
 * Create custom hooks that encapsulate complex context logic.
 * Build hooks with built-in error handling and validation
 * Create hooks that combine multiple contexts
 * Demonstrate advanced hook patterns with context
 *
 * Expected behavior:
 * - Should provide clean, reusable context APIs
 * - Should include error handling and validation
 * - Should abstract complex context operations
 * - Should be composable and testable
 */

// TODO: Create custom hook with error handling
export function useThemeWithValidation() {
  // TODO: Use theme context with error handling
  // TODO: Validate theme data and provide defaults
}

// TODO: Create custom hook that combines contexts
export function useAppData() {
  // TODO: Combine user, settings, and theme contexts
  // TODO: Provide unified data structure
}

// TODO: Create custom hook with async operations
export function useAsyncUser() {
  // TODO: Handle async user operations with context
  // TODO: Manage loading and error states
}

/**
 * Create custom hooks for common context patterns.
 * Build useToggle hook with context persistence
 * Create useLocalStorage hook that syncs with context
 * Show how to create reusable context utilities
 *
 * Expected behavior:
 * - Should provide reusable context patterns
 * - Should handle persistence and synchronization
 * - Should be framework-agnostic where possible
 * - Should include proper cleanup and error handling
 */

// TODO: Create useContextToggle hook
export function useContextToggle(key, defaultValue = false) {
  // TODO: Toggle state that persists in context
}

// TODO: Create useContextStorage hook
export function useContextStorage(key, defaultValue) {
  // TODO: Sync context with localStorage
}

// TODO: Create components using custom hooks
export function CustomHookExample() {
  // TODO: Use custom context hooks
  return <div>Custom Hook Example</div>;
}

// =============================================================================
// EXERCISE 7: Context vs State Management Libraries
// =============================================================================

/**
 * Compare context implementation with state management patterns.
 * Create Redux-like patterns using context and useReducer
 * Show when to use context vs external libraries
 * Demonstrate migration strategies
 *
 * Expected behavior:
 * - Should implement Redux-like patterns with context
 * - Should show performance characteristics
 * - Should demonstrate when context is sufficient
 * - Should show integration with external libraries
 */

// TODO: Create Redux-like store with context
export const StoreContext = null;

// TODO: Create store provider with Redux patterns
export function StoreProvider({ children }) {
  // TODO: Implement Redux-like state management
  // TODO: Include middleware-like functionality
}

// TODO: Create useStore hook with Redux-like API
export function useStore() {
  // TODO: Provide store state and dispatch
}

// TODO: Create useDispatch hook
export function useDispatch() {
  // TODO: Provide dispatch function
}

// TODO: Create useStoreSelector hook
export function useStoreSelector(selector) {
  // TODO: Select specific parts of store state
}

/**
 * Create context that mimics popular state management libraries.
 * Show Zustand-like patterns with context
 * Demonstrate Jotai-like atomic patterns
 * Compare performance and complexity trade-offs
 *
 * Expected behavior:
 * - Should mimic popular library APIs
 * - Should show equivalent functionality
 * - Should demonstrate when context falls short
 * - Should provide migration guidance
 */

// TODO: Create Zustand-like store
export function createContextStore(initialState) {
  // TODO: Create store factory similar to Zustand
}

// TODO: Create atomic context pattern
export function createAtom(initialValue) {
  // TODO: Create Jotai-like atom with context
}

// TODO: Create components comparing approaches
export function StateManagementComparison() {
  // TODO: Show different state management approaches
  return <div>State Management Comparison</div>;
}

// =============================================================================
// BONUS EXERCISE: Advanced Context Patterns
// =============================================================================

/**
 * Create advanced context patterns for complex applications.
 * Implement context with time-travel debugging
 * Create context with undo/redo functionality
 * Show context with middleware patterns
 *
 * Expected behavior:
 * - Should support advanced debugging features
 * - Should include undo/redo capabilities
 * - Should support middleware patterns
 * - Should maintain performance with complex features
 */

// TODO: Create context with time-travel debugging
export function createDebugContext(initialState) {
  // TODO: Implement context with state history
}

// TODO: Create context with undo/redo
export function useUndoRedoContext() {
  // TODO: Implement undo/redo functionality
}

// TODO: Create context middleware system
export function createContextMiddleware(middleware) {
  // TODO: Implement middleware pattern for context
}

// Demo component showing all patterns
export function ContextPatternDemo() {
  return (
    <div>
      <h2>Context Pattern Demonstrations</h2>
      <ThemedButton>Themed Button</ThemedButton>
      <UserProfile />
      <ShoppingCart />
      <NotificationList />
      <MultiContextComponent />
      <OptimizedUserDisplay />
      <SelectiveComponent />
      <CustomHookExample />
      <StateManagementComparison />
    </div>
  );
}
