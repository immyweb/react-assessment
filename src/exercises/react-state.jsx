/**
 * React State Management Exercises
 *
 * This file contains exercises covering React state management concepts:
 * - useState hook fundamentals
 * - State updates and batching
 * - State structure design
 * - Avoiding state mutations
 * - State lifting patterns
 * - useReducer for complex state
 * - State normalization techniques
 *
 * Each exercise includes:
 * - Clear documentation with examples
 * - Expected behavior description
 * - Component requirements
 * - Test cases to validate implementation
 */

import React, { useState, useReducer } from 'react';

// =============================================================================
// EXERCISE 1: useState Hook Fundamentals
// =============================================================================

/**
 * Create a simple counter component using useState.
 * Should display current count (starting at 0)
 * Should have increment, decrement, and reset buttons
 * Should handle button clicks to update state
 *
 * Expected behavior:
 * - Increment button increases count by 1
 * - Decrement button decreases count by 1
 * - Reset button sets count to 0
 */
export function Counter() {
  // TODO: Implement this component
}

/**
 * Create a user profile component with multiple independent state variables.
 * State variables: name, email, age
 * Should have inputs to update each state variable
 * Should display current state values
 * Should handle form submission (console.log the values)
 */
export function UserProfile() {
  // TODO: Implement this component
}

// =============================================================================
// EXERCISE 2: State Updates and Batching
// =============================================================================

/**
 * Create a component that demonstrates functional state updates for reliability.
 * Should have a counter that can be incremented multiple times rapidly
 * Should demonstrate difference between direct updates and functional updates
 * Should have buttons for both approaches
 * The direct update can miss increments because React batches state updates.
 * The functional update always works as expected, even with rapid clicks.
 *
 * Expected behavior:
 * - Direct update button may not work correctly when clicked rapidly
 * - Functional update button should work correctly in all cases
 */
export function FunctionalUpdates() {
  // TODO: Implement this component
}

// =============================================================================
// EXERCISE 3: Object State Management
// =============================================================================

/**
 * Create a component that manages object state properly without mutations.
 * Should manage a person object with name, age, and email properties
 * Should update individual properties without losing others
 * Should demonstrate proper object spreading
 *
 * Expected behavior:
 * - Updating name should preserve age and email
 * - Updating age should preserve name and email
 * - Should display current object state
 */
export function PersonInfo() {
  // TODO: Implement this component
}

/**
 * Create a component that demonstrates proper state structure organization.
 * Should manage both user data and UI state
 * Should demonstrate when to group vs separate state
 * Should show flat vs nested state patterns
 *
 * Expected behavior:
 * - User data (profile) should be in one state object
 * - UI state (loading, errors) should be separate
 * - Should avoid deeply nested state structures
 * - Should demonstrate derived state calculations
 */
export function StateStructure() {
  // TODO: Implement this component
}

// =============================================================================
// EXERCISE 4: Array State Management
// =============================================================================

/**
 * Create a todo list component that manages array state properly.
 * Should manage an array of todo items
 * Should add, remove, and toggle todo items
 * Should demonstrate proper array state updates (no mutations)
 *
 * Expected behavior:
 * - Adding todos should not mutate existing array
 * - Removing todos should filter out the item
 * - Each todo should have id, text, and completed properties
 */
export function TodoList() {
  // TODO: Implement this component
}

// =============================================================================
// EXERCISE 5: State Lifting Patterns
// =============================================================================

/**
 * Create parent and child components that demonstrate state lifting.
 * Parent component: TemperatureConverter
 * Child component: TemperatureInput (already provided below)
 * Should lift temperature state to parent
 * Should synchronize both Celsius and Fahrenheit inputs
 *
 * Expected behavior:
 * - Entering value in Celsius should update Fahrenheit automatically
 * - Entering value in Fahrenheit should update Celsius automatically
 * - Should show boiling point message when appropriate
 */

// Helper component for temperature input (DO NOT MODIFY)
const TemperatureInput = ({ scale, temperature, onTemperatureChange }) => {
  const handleChange = (e) => {
    onTemperatureChange(e.target.value);
  };

  return (
    <fieldset>
      <label htmlFor={`temp-${scale}`}>
        Enter temperature in {scale === 'c' ? 'Celsius' : 'Fahrenheit'}:
      </label>
      <input id={`temp-${scale}`} value={temperature} onChange={handleChange} />
    </fieldset>
  );
};

export function TemperatureConverter() {
  // TODO: Implement this component
}

// =============================================================================
// EXERCISE 6: useReducer for Complex State
// =============================================================================

/**
 * Create a counter component using useReducer instead of useState.
 * Should support increment, decrement, reset, and set actions
 * Should use useReducer for state management
 * Should define action types and reducer function
 *
 * Expected behavior:
 * - Should work exactly like useState counter but with useReducer
 * - Should demonstrate action-based state updates
 */
export function ReducerCounter() {
  // TODO: Define action types
  // TODO: Define reducer function
  // TODO: Implement this component
}

/**
 * Create a shopping cart component with complex state using useReducer.
 * Should manage cart items with add, remove, and update quantity actions
 * Should calculate totals based on cart state
 * Should handle existing items by updating quantity
 *
 * Expected behavior:
 * - Adding existing item should increase quantity
 * - Adding new item should add to cart
 * - Should display total price
 * - Should allow clearing entire cart
 */
export function ShoppingCart() {
  // TODO: Define action types
  // TODO: Define reducer function
  // TODO: Implement this component
}

// =============================================================================
// EXERCISE 7: State Normalization Techniques
// =============================================================================

/**
 * Create a component that manages normalized relational data efficiently.
 * Should manage users, posts, and comments in normalized form
 * Should demonstrate efficient lookups and updates
 * Should avoid nested data structures
 *
 * Expected behavior:
 * - Data should be stored in separate entities (users, posts, comments)
 * - Should use IDs to reference relationships
 * - Should provide efficient data access patterns
 * - Should handle adding/removing data without deep mutations
 */
export function BlogManager() {
  // TODO: Define normalized data structure
  // TODO: Implement data management functions
  // TODO: Implement this component
}

/**
 * Create a component that demonstrates efficient data derivation from normalized state.
 * Should compute derived data efficiently
 * Should demonstrate selector patterns for data access
 * Should show memoization for expensive computations
 *
 * Expected behavior:
 * - Should calculate statistics from normalized data
 * - Should use memoization to avoid unnecessary recalculations
 * - Should demonstrate efficient data filtering and sorting
 */
export function DataSelectors() {
  // TODO: Implement selector functions
  // TODO: Implement memoized computations
  // TODO: Implement this component
}
