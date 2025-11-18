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
 * Create a simple functional component that renders a welcome message.
 * Should render an h1 element with the text "Welcome to React!"
 * Should have a className of "welcome"
 *
 * Expected JSX output:
 * <h1 className="welcome">Welcome to React!</h1>
 */
export function WelcomeMessage() {
  // TODO: Implement this component
}

/**
 * Create a component that displays user information using JSX expressions.
 * Should accept a user object with name, age, and email properties
 * Should render the user information in a structured format
 * Use JSX expressions to display dynamic content
 *
 * Expected structure:
 * <div className="user-card">
 *   <h2>{user.name}</h2>
 *   <p>Age: {user.age}</p>
 *   <p>Email: {user.email}</p>
 * </div>
 */
export function UserCard({ user }) {
  // TODO: Implement this component
}

// =============================================================================
// EXERCISE 2: Props and Prop Validation
// =============================================================================

/**
 * Create a button component with configurable props and default values.
 * Props: text, variant, disabled, onClick
 * Default values: text="Click me", variant="primary", disabled=false
 * Should render a button element with appropriate classes and attributes
 *
 * Expected behavior:
 * - className should be "btn btn-{variant}"
 * - Should handle onClick events
 * - Should be disabled when disabled=true
 */
export function CustomButton({
  text = 'Click me',
  variant = 'primary',
  disabled = false,
  onClick
}) {
  // TODO: Implement this component
}

/**
 * Create a product component with comprehensive prop validation.
 * Required props: id (number), name (string), price (number)
 * Optional props: description (string), inStock (boolean, default: true)
 * Should validate all prop types using PropTypes
 * Should display product information in a card format
 */
export function ProductCard({ id, name, price, description, inStock = true }) {
  // TODO: Implement this component
}

// TODO: Add PropTypes validation for ProductCard
ProductCard.propTypes = {
  // TODO: Define prop types
};

// =============================================================================
// EXERCISE 3: Event Handling and Synthetic Events
// =============================================================================

/**
 * Create a counter component with increment and decrement functionality.
 * Should display current count
 * Should have increment and decrement buttons
 * Should handle button clicks to update the count
 * Should prevent negative counts (minimum 0)
 */
export function Counter() {
  // TODO: Implement this component with state and event handlers
}

/**
 * Create a form component that handles various input types and events.
 * Should have inputs for: name, email, message
 * Should handle onChange events for all inputs
 * Should handle form submission (onSubmit)
 * Should prevent default form submission
 * Should display current form state
 */
export function ContactForm() {
  // TODO: Implement this component with form handling
}

/**
 * Create a component that demonstrates various synthetic event properties.
 * Should handle: onClick, onMouseEnter, onMouseLeave, onKeyDown
 * Should display event information (type, target, coordinates for mouse events)
 * Should handle keyboard events and display key pressed
 */
export function EventDemo() {
  // TODO: Implement this component with advanced event handling
}

// =============================================================================
// EXERCISE 4: Conditional Rendering Patterns
// =============================================================================

/**
 * Create a component that shows different content based on user authentication.
 * Props: isLoggedIn (boolean), username (string)
 * Should show welcome message if logged in, login prompt if not
 * Should use ternary operator for conditional rendering
 */
export function AuthStatus({ isLoggedIn, username }) {
  // TODO: Implement conditional rendering
}

/**
 * Create a component that displays different loading states.
 * Props: loading (boolean), error (string), data (array)
 * Should show loading spinner when loading=true
 * Should show error message when error exists
 * Should show data when available
 * Should show "No data" when data is empty array
 */
export function LoadingState({ loading, error, data }) {
  // TODO: Implement multiple conditional rendering patterns
}

/**
 * Create a notification component with various display conditions.
 * Props: type, message, dismissible, onDismiss
 * Should only render if message exists
 * Should show dismiss button only if dismissible=true
 * Should apply different styles based on type
 */
export function Notification({ type, message, dismissible, onDismiss }) {
  // TODO: Implement conditional rendering with logical operators
}

// =============================================================================
// EXERCISE 5: Lists and Keys
// =============================================================================

/**
 * Create a component that renders a list of items with proper keys.
 * Props: todos (array of objects with id, text, completed)
 * Should render each todo as a list item
 * Should use proper keys for list items
 * Should show completed todos with strikethrough
 */
export function TodoList({ todos }) {
  // TODO: Implement list rendering with keys
}

/**
 * Create a shopping cart component with add/remove functionality.
 * Should maintain a list of items in state
 * Should allow adding items (with name and price)
 * Should allow removing items by id
 * Should display total price
 * Should use proper keys and handle list updates
 */
export function ShoppingCart() {
  // TODO: Implement dynamic list with state management
}

/**
 * Create a component that renders nested category/item structure.
 * Props: categories (array of objects with id, name, items array)
 * Should render categories and their nested items
 * Should use proper keys for both levels
 * Should be collapsible (show/hide items)
 */
export function CategoryList({ categories }) {
  // TODO: Implement nested list rendering
}

// =============================================================================
// EXERCISE 6: Component Composition Patterns
// =============================================================================

/**
 * Create a card component that uses children for flexible content.
 * Props: title, children
 * Should render title in header and children in body
 * Should provide consistent styling structure
 */
export function Card({ title, children }) {
  // TODO: Implement component composition with children
}

/**
 * Create a data fetcher component using render props pattern.
 * Props: url, render (function)
 * Should manage loading state and data
 * Should call render prop with { data, loading, error }
 * Should simulate API call with setTimeout
 */
export function DataFetcher({ url, render }) {
  // TODO: Implement render props pattern
}

/**
 * Create a tabs component using compound component pattern.
 * Components: Tabs, TabList, Tab, TabPanels, TabPanel
 * Should manage active tab state
 * Should coordinate between tab buttons and panels
 * Should use React.Children utilities
 * <Tabs>
    <TabList>
      <Tab index={0}>Tab 1</Tab>
      <Tab index={1}>Tab 2</Tab>
      <Tab index={2}>Tab 3</Tab>
    </TabList>
    <TabPanels>
      <TabPanel index={0}>Panel 1 Content</TabPanel>
      <TabPanel index={1}>Panel 2 Content</TabPanel>
      <TabPanel index={2}>Panel 3 Content</TabPanel>
    </TabPanels>
  </Tabs>
 */
export function Tabs({ children }) {
  // TODO: Implement compound component pattern
}

export function TabList({ children }) {
  // TODO: Implement tab list component
}

export function Tab({ children, index }) {
  // TODO: Implement individual tab component
}

export function TabPanels({ children }) {
  // TODO: Implement tab panels container
}

export function TabPanel({ children, index }) {
  // TODO: Implement individual tab panel
}

// =============================================================================
// EXERCISE 7: Controlled vs Uncontrolled Components
// =============================================================================

/**
 * Create a controlled input component with validation.
 * Props: value, onChange, placeholder, validation
 * Should be fully controlled by parent component
 * Should show validation errors
 * Should handle different input types
 */
export function ControlledInput({
  value,
  onChange,
  placeholder,
  validation,
  type = 'text'
}) {
  // TODO: Implement controlled input component
}

/**
 * Create an uncontrolled input component using refs.
 * Should use useRef to access input value
 * Should have a method to get current value
 * Should allow setting default value
 * Should expose ref via forwardRef
 */
export const UncontrolledInput = React.forwardRef(
  ({ defaultValue, placeholder }, ref) => {
    // TODO: Implement uncontrolled input component
  }
);

/**
 * Create a form that demonstrates both controlled and uncontrolled patterns.
 * Should have both controlled and uncontrolled inputs
 * Should demonstrate when to use each pattern
 * Should handle form submission for both types
 * Should show current values from both approaches
 */
export function HybridForm() {
  // TODO: Implement hybrid form with both patterns
}

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
