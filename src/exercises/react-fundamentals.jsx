/**
 * React Fundamentals Exercises
 *
 * This file contains exercises covering core React concepts:
 * - Component creation and JSX
 * - Props and prop validation
 * - Event handling and synthetic events
 * - Conditional rendering patterns
 * - Lists and keys
 * - Component composition patterns
 * - Controlled vs uncontrolled components
 *
 * Each exercise includes:
 * - Clear documentation with examples
 * - Expected behavior description
 * - Component requirements
 * - Test cases to validate implementation
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

// =============================================================================
// EXERCISE 1: Component Creation and JSX
// =============================================================================

/**
 * Exercise 1.1: Basic Functional Component
 *
 * Create a simple functional component that renders a welcome message.
 *
 * Requirements:
 * - Component name: WelcomeMessage
 * - Should render an h1 element with the text "Welcome to React!"
 * - Should have a className of "welcome"
 *
 * Expected JSX output:
 * <h1 className="welcome">Welcome to React!</h1>
 */
export const WelcomeMessage = () => {
  // TODO: Implement this component
  return null;
};

/**
 * Exercise 1.2: JSX with Expressions
 *
 * Create a component that displays user information using JSX expressions.
 *
 * Requirements:
 * - Component name: UserCard
 * - Should accept a user object with name, age, and email properties
 * - Should render the user information in a structured format
 * - Use JSX expressions to display dynamic content
 *
 * Expected structure:
 * <div className="user-card">
 *   <h2>{user.name}</h2>
 *   <p>Age: {user.age}</p>
 *   <p>Email: {user.email}</p>
 * </div>
 */
export const UserCard = ({ user }) => {
  // TODO: Implement this component
  return null;
};

// =============================================================================
// EXERCISE 2: Props and Prop Validation
// =============================================================================

/**
 * Exercise 2.1: Props with Default Values
 *
 * Create a button component with configurable props and default values.
 *
 * Requirements:
 * - Component name: CustomButton
 * - Props: text, variant, disabled, onClick
 * - Default values: text="Click me", variant="primary", disabled=false
 * - Should render a button element with appropriate classes and attributes
 *
 * Expected behavior:
 * - className should be "btn btn-{variant}"
 * - Should handle onClick events
 * - Should be disabled when disabled=true
 */
export const CustomButton = ({
  text = 'Click me',
  variant = 'primary',
  disabled = false,
  onClick
}) => {
  // TODO: Implement this component
  return null;
};

/**
 * Exercise 2.2: Prop Validation with PropTypes
 *
 * Create a product component with comprehensive prop validation.
 *
 * Requirements:
 * - Component name: ProductCard
 * - Required props: id (number), name (string), price (number)
 * - Optional props: description (string), inStock (boolean, default: true)
 * - Should validate all prop types using PropTypes
 * - Should display product information in a card format
 */
export const ProductCard = ({
  id,
  name,
  price,
  description,
  inStock = true
}) => {
  // TODO: Implement this component
  return null;
};

// TODO: Add PropTypes validation for ProductCard
ProductCard.propTypes = {
  // TODO: Define prop types
};

// =============================================================================
// EXERCISE 3: Event Handling and Synthetic Events
// =============================================================================

/**
 * Exercise 3.1: Basic Event Handling
 *
 * Create a counter component with increment and decrement functionality.
 *
 * Requirements:
 * - Component name: Counter
 * - Should display current count
 * - Should have increment and decrement buttons
 * - Should handle button clicks to update the count
 * - Should prevent negative counts (minimum 0)
 */
export const Counter = () => {
  // TODO: Implement this component with state and event handlers
  return null;
};

/**
 * Exercise 3.2: Form Input Handling
 *
 * Create a form component that handles various input types and events.
 *
 * Requirements:
 * - Component name: ContactForm
 * - Should have inputs for: name, email, message
 * - Should handle onChange events for all inputs
 * - Should handle form submission (onSubmit)
 * - Should prevent default form submission
 * - Should display current form state
 */
export const ContactForm = () => {
  // TODO: Implement this component with form handling
  return null;
};

/**
 * Exercise 3.3: Advanced Event Handling
 *
 * Create a component that demonstrates various synthetic event properties.
 *
 * Requirements:
 * - Component name: EventDemo
 * - Should handle: onClick, onMouseEnter, onMouseLeave, onKeyDown
 * - Should display event information (type, target, coordinates for mouse events)
 * - Should handle keyboard events and display key pressed
 */
export const EventDemo = () => {
  // TODO: Implement this component with advanced event handling
  return null;
};

// =============================================================================
// EXERCISE 4: Conditional Rendering Patterns
// =============================================================================

/**
 * Exercise 4.1: Basic Conditional Rendering
 *
 * Create a component that shows different content based on user authentication.
 *
 * Requirements:
 * - Component name: AuthStatus
 * - Props: isLoggedIn (boolean), username (string)
 * - Should show welcome message if logged in, login prompt if not
 * - Should use ternary operator for conditional rendering
 */
export const AuthStatus = ({ isLoggedIn, username }) => {
  // TODO: Implement conditional rendering
  return null;
};

/**
 * Exercise 4.2: Multiple Conditions
 *
 * Create a component that displays different loading states.
 *
 * Requirements:
 * - Component name: LoadingState
 * - Props: loading (boolean), error (string), data (array)
 * - Should show loading spinner when loading=true
 * - Should show error message when error exists
 * - Should show data when available
 * - Should show "No data" when data is empty array
 */
export const LoadingState = ({ loading, error, data }) => {
  // TODO: Implement multiple conditional rendering patterns
  return null;
};

/**
 * Exercise 4.3: Conditional Rendering with Logical Operators
 *
 * Create a notification component with various display conditions.
 *
 * Requirements:
 * - Component name: Notification
 * - Props: type, message, dismissible, onDismiss
 * - Should only render if message exists
 * - Should show dismiss button only if dismissible=true
 * - Should apply different styles based on type
 */
export const Notification = ({ type, message, dismissible, onDismiss }) => {
  // TODO: Implement conditional rendering with logical operators
  return null;
};

// =============================================================================
// EXERCISE 5: Lists and Keys
// =============================================================================

/**
 * Exercise 5.1: Basic List Rendering
 *
 * Create a component that renders a list of items with proper keys.
 *
 * Requirements:
 * - Component name: TodoList
 * - Props: todos (array of objects with id, text, completed)
 * - Should render each todo as a list item
 * - Should use proper keys for list items
 * - Should show completed todos with strikethrough
 */
export const TodoList = ({ todos }) => {
  // TODO: Implement list rendering with keys
  return null;
};

/**
 * Exercise 5.2: Dynamic List with Actions
 *
 * Create a shopping cart component with add/remove functionality.
 *
 * Requirements:
 * - Component name: ShoppingCart
 * - Should maintain a list of items in state
 * - Should allow adding items (with name and price)
 * - Should allow removing items by id
 * - Should display total price
 * - Should use proper keys and handle list updates
 */
export const ShoppingCart = () => {
  // TODO: Implement dynamic list with state management
  return null;
};

/**
 * Exercise 5.3: Nested Lists
 *
 * Create a component that renders nested category/item structure.
 *
 * Requirements:
 * - Component name: CategoryList
 * - Props: categories (array of objects with id, name, items array)
 * - Should render categories and their nested items
 * - Should use proper keys for both levels
 * - Should be collapsible (show/hide items)
 */
export const CategoryList = ({ categories }) => {
  // TODO: Implement nested list rendering
  return null;
};

// =============================================================================
// EXERCISE 6: Component Composition Patterns
// =============================================================================

/**
 * Exercise 6.1: Children Prop Pattern
 *
 * Create a card component that uses children for flexible content.
 *
 * Requirements:
 * - Component name: Card
 * - Props: title, children
 * - Should render title in header and children in body
 * - Should provide consistent styling structure
 */
export const Card = ({ title, children }) => {
  // TODO: Implement component composition with children
  return null;
};

/**
 * Exercise 6.2: Render Props Pattern
 *
 * Create a data fetcher component using render props pattern.
 *
 * Requirements:
 * - Component name: DataFetcher
 * - Props: url, render (function)
 * - Should manage loading state and data
 * - Should call render prop with { data, loading, error }
 * - Should simulate API call with setTimeout
 */
export const DataFetcher = ({ url, render }) => {
  // TODO: Implement render props pattern
  return null;
};

/**
 * Exercise 6.3: Compound Components
 *
 * Create a tabs component using compound component pattern.
 *
 * Requirements:
 * - Components: Tabs, TabList, Tab, TabPanels, TabPanel
 * - Should manage active tab state
 * - Should coordinate between tab buttons and panels
 * - Should use React.Children utilities
 */
export const Tabs = ({ children }) => {
  // TODO: Implement compound component pattern
  return null;
};

export const TabList = ({ children }) => {
  // TODO: Implement tab list component
  return null;
};

export const Tab = ({ children, index }) => {
  // TODO: Implement individual tab component
  return null;
};

export const TabPanels = ({ children }) => {
  // TODO: Implement tab panels container
  return null;
};

export const TabPanel = ({ children, index }) => {
  // TODO: Implement individual tab panel
  return null;
};

// =============================================================================
// EXERCISE 7: Controlled vs Uncontrolled Components
// =============================================================================

/**
 * Exercise 7.1: Controlled Input Component
 *
 * Create a controlled input component with validation.
 *
 * Requirements:
 * - Component name: ControlledInput
 * - Props: value, onChange, placeholder, validation
 * - Should be fully controlled by parent component
 * - Should show validation errors
 * - Should handle different input types
 */
export const ControlledInput = ({
  value,
  onChange,
  placeholder,
  validation,
  type = 'text'
}) => {
  // TODO: Implement controlled input component
  return null;
};

/**
 * Exercise 7.2: Uncontrolled Input with Ref
 *
 * Create an uncontrolled input component using refs.
 *
 * Requirements:
 * - Component name: UncontrolledInput
 * - Should use useRef to access input value
 * - Should have a method to get current value
 * - Should allow setting default value
 * - Should expose ref via forwardRef
 */
export const UncontrolledInput = React.forwardRef(
  ({ defaultValue, placeholder }, ref) => {
    // TODO: Implement uncontrolled input component
    return null;
  }
);

/**
 * Exercise 7.3: Hybrid Form Component
 *
 * Create a form that demonstrates both controlled and uncontrolled patterns.
 *
 * Requirements:
 * - Component name: HybridForm
 * - Should have both controlled and uncontrolled inputs
 * - Should demonstrate when to use each pattern
 * - Should handle form submission for both types
 * - Should show current values from both approaches
 */
export const HybridForm = () => {
  // TODO: Implement hybrid form with both patterns
  return null;
};

// =============================================================================
// HELPER COMPONENTS AND UTILITIES
// =============================================================================

/**
 * Helper component for demonstration purposes
 */
export const LoadingSpinner = () => (
  <div className="loading-spinner">Loading...</div>
);

/**
 * Helper function to simulate API calls
 */
export const simulateApiCall = (data, delay = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};
