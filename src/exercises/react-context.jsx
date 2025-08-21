/**
 * React Context and Global State Exercises
 *
 * This file contains simplified exercises covering the core React context concepts:
 * - createContext and useContext basics
 * - Context provider patterns with useReducer
 * - Avoiding prop drilling
 * - Context optimization techniques
 *
 * Each exercise focuses on practical, real-world use cases of React Context.
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
 *
 * Expected behavior:
 * - ThemeProvider should accept theme prop and provide it via context
 * - useTheme should return current theme from context
 * - ThemedButton should apply the theme styles
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
 *
 * Expected behavior:
 * - Should provide current user state (user object and loading state)
 * - Should provide login/logout methods
 * - UserProfile should display the current user's information
 */

// TODO: Create UserContext
export const UserContext = null;

// TODO: Create UserProvider component
export function UserProvider({ children }) {
  // TODO: Implement user state management with useState
  // TODO: Create login and logout functions
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
// EXERCISE 2: Context Provider Patterns with useReducer
// =============================================================================

/**
 * Create a shopping cart context with useReducer for state management.
 *
 * Expected behavior:
 * - Should manage cart items array
 * - Should calculate total price automatically
 * - Should provide actions for adding and removing items
 */

// TODO: Define cart action types
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
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
  // TODO: Create action handler functions
  // TODO: Calculate cart total with useMemo
  // TODO: Provide cart state and actions
}

// TODO: Create useCart hook
export function useCart() {
  // TODO: Implement cart context hook with error handling
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

// =============================================================================
// EXERCISE 3: Avoiding Prop Drilling
// =============================================================================

/**
 * Demonstrate prop drilling problem and solution with context.
 *
 * Component tree: App -> Header -> Navigation -> UserMenu -> UserName
 * Data needed: user object with name and avatar
 *
 * This exercise shows the practical difference between passing props down
 * multiple levels versus using context to access data directly.
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

// TODO: Create a context for the deep component tree
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

// =============================================================================
// EXERCISE 4: Context Optimization Techniques
// =============================================================================

/**
 * Create an optimized context implementation to prevent unnecessary re-renders.
 *
 * This exercise demonstrates how to:
 * - Split context into multiple providers for better performance
 * - Use useMemo and useCallback to optimize context values
 * - Prevent unnecessary component re-renders
 */

// TODO: Create separate contexts for user data and user actions
export const OptimizedUserDataContext = null;
export const OptimizedUserActionsContext = null;

// TODO: Create OptimizedUserProvider
export function OptimizedUserProvider({ children }) {
  // TODO: Implement user state with useState
  // TODO: Create memoized action functions with useCallback
  // TODO: Create memoized user data object with useMemo
  // TODO: Provide separate contexts for data and actions
}

// TODO: Create optimized hooks for separate concerns
export function useUserData() {
  // TODO: Hook for accessing user data only
}

export function useUserActions() {
  // TODO: Hook for accessing user actions only
}

// TODO: Create component that only uses user data
export function OptimizedUserDisplay() {
  // TODO: Use only useUserData to prevent re-renders when actions change
  return <div>Optimized User Display</div>;
}

// TODO: Create component that only uses user actions
export function OptimizedUserActions() {
  // TODO: Use only useUserActions to prevent re-renders when data changes
  return <div>Optimized User Actions</div>;
}

// Demo component showing all patterns
export function ContextPatternDemo() {
  return (
    <div>
      <h2>Context Pattern Demonstrations</h2>
      <ThemedButton>Themed Button</ThemedButton>
      <UserProfile />
      <ShoppingCart />
      <OptimizedUserDisplay />
      <OptimizedUserActions />
    </div>
  );
}
