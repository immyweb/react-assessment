/**
 * React Advanced Patterns Exercises
 *
 * This file contains exercises covering advanced React patterns:
 * - Higher-Order Components (HOCs)
 * - Render props pattern
 * - Compound components
 * - Polymorphic components
 * - Headless component patterns
 * - Provider pattern variations
 * - Inversion of control patterns
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
  useContext,
  createContext,
  useCallback,
  Children,
  cloneElement
} from 'react';
import PropTypes from 'prop-types';

// =============================================================================
// EXERCISE 1: Higher-Order Components (HOCs)
// =============================================================================

/**
 * Create a simple HOC that adds loading functionality to any component.
 * Should show "Loading..." text when isLoading prop is true
 * Should render the wrapped component when isLoading is false
 *
 * Usage:
 * const LoadingButton = withLoading(Button);
 * <LoadingButton isLoading={true}>Click me</LoadingButton>
 *
 * Expected behavior:
 * - Shows "Loading..." when isLoading=true
 * - Renders wrapped component when isLoading=false
 * - Passes all other props to wrapped component
 */
export function withLoading(WrappedComponent) {
  // TODO: Implement HOC that adds loading functionality
  // Return a component that shows loading state or wrapped component
}

/**
 * Create a HOC that adds click counting to any component.
 * Should track how many times the component has been clicked
 * Should display the click count somewhere in the component
 *
 * Usage:
 * const CountingButton = withClickCounter(Button);
 * <CountingButton>Click me</CountingButton>
 *
 * Expected behavior:
 * - Tracks click count internally
 * - Displays "Clicked X times" text
 * - Wraps original onClick handler
 */
export function withClickCounter(WrappedComponent) {
  // TODO: Implement click counting HOC
  // Track clicks and display count
}

// =============================================================================
// EXERCISE 2: Render Props Pattern
// =============================================================================

/**
 * Create a simple counter component using render props pattern.
 * Should manage count state and provide increment/decrement functions
 * Should render whatever the children function returns
 *
 * Usage:
 * <Counter initialValue={0}>
 *   {({ count, increment, decrement }) => (
 *     <div>
 *       <p>Count: {count}</p>
 *       <button onClick={increment}>+</button>
 *       <button onClick={decrement}>-</button>
 *     </div>
 *   )}
 * </Counter>
 *
 * Expected behavior:
 * - Manages count state internally
 * - Provides count and functions to children
 * - Children can render count however they want
 */
export function Counter({ initialValue = 0, children }) {
  // TODO: Implement counter with render props
  // Manage count state and provide increment/decrement functions
}

/**
 * Create a toggle component using render props pattern.
 * Should manage boolean state and provide toggle function
 * Should allow customization of initial state
 *
 * Usage:
 * <Toggle initialValue={false}>
 *   {({ isOn, toggle }) => (
 *     <button onClick={toggle}>
 *       {isOn ? 'ON' : 'OFF'}
 *     </button>
 *   )}
 * </Toggle>
 *
 * Expected behavior:
 * - Manages boolean toggle state
 * - Provides toggle function to children
 * - Allows setting initial state
 */
export function Toggle({ initialValue = false, children }) {
  // TODO: Implement toggle functionality with render props
  // Manage toggle state and provide control function
}

// =============================================================================
// EXERCISE 3: Compound Components
// =============================================================================

/**
 * Create a simple compound Modal component system.
 * Should include Modal, Modal.Header, Modal.Body, Modal.Footer
 * Should manage modal open/close state with context
 *
 * Usage:
 * <Modal>
 *   <Modal.Header>
 *     <h2>Modal Title</h2>
 *   </Modal.Header>
 *   <Modal.Body>
 *     <p>Modal content goes here</p>
 *   </Modal.Body>
 *   <Modal.Footer>
 *     <button>Close</button>
 *   </Modal.Footer>
 * </Modal>
 *
 * Expected behavior:
 * - Modal parts share state through context
 * - Header, body, footer render in correct sections
 * - Modal can be opened/closed from any part
 */

// Create context for modal state
const ModalContext = createContext();

export function Modal({ children, isOpen = false, onClose }) {
  // TODO: Implement main Modal component
  // Provide context with modal state and close function
  // Render modal backdrop and container
}

export function ModalHeader({ children }) {
  // TODO: Implement modal header component
  // Render header section with proper styling
}

export function ModalBody({ children }) {
  // TODO: Implement modal body component
  // Render main content area
}

export function ModalFooter({ children }) {
  // TODO: Implement modal footer component
  // Render footer with buttons/actions
}

// Attach compound components to Modal
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

/**
 * Create a simple compound Card component system.
 * Should include Card, Card.Header, Card.Body, Card.Footer
 * Should provide consistent styling and layout
 *
 * Usage:
 * <Card>
 *   <Card.Header>
 *     <h3>Card Title</h3>
 *   </Card.Header>
 *   <Card.Body>
 *     <p>Card content</p>
 *   </Card.Body>
 *   <Card.Footer>
 *     <button>Action</button>
 *   </Card.Footer>
 * </Card>
 */
export function Card({ children, className = '' }) {
  // TODO: Implement main Card component
  // Render card container with proper styling
}

export function CardHeader({ children, className = '' }) {
  // TODO: Implement card header
}

export function CardBody({ children, className = '' }) {
  // TODO: Implement card body
}

export function CardFooter({ children, className = '' }) {
  // TODO: Implement card footer
}

// Attach compound components
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

// =============================================================================
// EXERCISE 4: Polymorphic Components
// =============================================================================

/**
 * Create a simple polymorphic Button component.
 * Should accept an 'as' prop to render as different HTML elements
 * Should forward all props to the rendered element
 *
 * Usage:
 * <Button as="a" href="/link">Link Button</Button>
 * <Button as="div" onClick={handler}>Div Button</Button>
 * <Button>Regular Button</Button>
 *
 * Expected behavior:
 * - Renders as specified element type (default: button)
 * - Forwards appropriate props to rendered element
 * - Maintains consistent button styling
 */
export function Button({ as: Component = 'button', children, ...props }) {
  // TODO: Implement polymorphic button component
  // Render as specified component type with all props
}

/**
 * Create a polymorphic Text component.
 * Should render as different text elements (h1, h2, p, span, etc.)
 * Should apply size styling based on props
 *
 * Usage:
 * <Text as="h1">Heading</Text>
 * <Text as="p" size="small">Paragraph</Text>
 * <Text as="span">Inline text</Text>
 *
 * Expected behavior:
 * - Renders as appropriate text element (default: p)
 * - Applies size classes for styling
 * - Forwards all other props
 */
export function Text({
  as: Component = 'p',
  size = 'medium',
  children,
  className = '',
  ...props
}) {
  // TODO: Implement polymorphic text component
  // Add size-based styling classes
}

// =============================================================================
// EXERCISE 5: Headless Component Patterns
// =============================================================================

/**
 * Create a simple headless Counter component.
 * Should provide counter logic without any UI
 * Should handle increment, decrement, and reset functionality
 *
 * Usage:
 * <HeadlessCounter initialValue={0}>
 *   {({ count, increment, decrement, reset }) => (
 *     <div>
 *       <span>Count: {count}</span>
 *       <button onClick={increment}>+</button>
 *       <button onClick={decrement}>-</button>
 *       <button onClick={reset}>Reset</button>
 *     </div>
 *   )}
 * </HeadlessCounter>
 *
 * Expected behavior:
 * - Manages counter state without rendering UI
 * - Provides count value and control functions
 * - Allows complete UI customization
 */
export function HeadlessCounter({ initialValue = 0, children }) {
  // TODO: Implement headless counter logic
  // Provide count state and control functions to children
}

/**
 * Create a headless Toggle component.
 * Should provide toggle logic without UI
 * Should handle boolean state management
 *
 * Usage:
 * <HeadlessToggle initialValue={false}>
 *   {({ isOn, toggle, turnOn, turnOff }) => (
 *     <button onClick={toggle}>
 *       Status: {isOn ? 'ON' : 'OFF'}
 *     </button>
 *   )}
 * </HeadlessToggle>
 *
 * Expected behavior:
 * - Manages boolean state without UI
 * - Provides toggle state and control functions
 * - Allows custom toggle implementations
 */
export function HeadlessToggle({ initialValue = false, children }) {
  // TODO: Implement headless toggle logic
  // Provide toggle state and control functions
}

// =============================================================================
// EXERCISE 6: Provider Pattern Variations
// =============================================================================

/**
 * Create a ThemeProvider using React Context.
 * Should manage theme state and provide theme switching functionality
 * Should include basic theme values (colors, fonts, spacing)
 *
 * Usage:
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 *
 * Expected behavior:
 * - Provides theme context to all children
 * - Includes light/dark theme switching
 * - Provides useTheme hook for consumption
 */

// TODO: Create theme context
const ThemeContext = null;

// TODO: Create theme provider component
export function ThemeProvider({ children }) {
  // TODO: Implement theme state management
  // Include themes object with light/dark variants
  // Provide currentTheme and toggleTheme function
}

// TODO: Create useTheme hook
export function useTheme() {
  // TODO: Return theme context value
  // Throw error if used outside provider
}

/**
 * Create a simple UserProvider for user authentication state.
 * Should manage user login/logout and user data
 * Should provide user context to components
 *
 * Usage:
 * <UserProvider>
 *   <App />
 * </UserProvider>
 *
 * Expected behavior:
 * - Manages user authentication state
 * - Provides login/logout functions
 * - Includes user data when authenticated
 */

// TODO: Create user context
const UserContext = null;

// TODO: Create user provider component
export function UserProvider({ children }) {
  // TODO: Implement user state management
  // Include user state, login, and logout functions
}

// TODO: Create useUser hook
export function useUser() {
  // TODO: Return user context value
  // Throw error if used outside provider
}
// =============================================================================
// EXERCISE 7: Inversion of Control Patterns
// =============================================================================

/**
 * Create a Configurable Button component that accepts configuration props.
 * Should accept styling and behavior configuration
 * Should allow custom onClick handlers and validation
 *
 * Usage:
 * <ConfigurableButton
 *   config={{
 *     variant: 'primary',
 *     size: 'large',
 *     disabled: false
 *   }}
 *   handlers={{
 *     onClick: handleClick,
 *     onHover: handleHover
 *   }}
 * >
 *   Click me
 * </ConfigurableButton>
 *
 * Expected behavior:
 * - Applies configuration to appearance and behavior
 * - Calls provided handlers for events
 * - Supports validation and error states
 */
export function ConfigurableButton({
  config = {},
  handlers = {},
  children,
  ...props
}) {
  // TODO: Implement configurable button
  // Apply config for styling and behavior
  // Call handlers for events
}

/**
 * Create a Form component that accepts field configuration.
 * Should render form fields based on configuration
 * Should handle validation and submission through props
 *
 * Usage:
 * <ConfigurableForm
 *   fields={[
 *     { name: 'email', type: 'email', label: 'Email', required: true },
 *     { name: 'password', type: 'password', label: 'Password', required: true }
 *   ]}
 *   onSubmit={handleSubmit}
 *   validate={validateForm}
 * />
 *
 * Expected behavior:
 * - Renders fields based on configuration
 * - Handles validation through provided function
 * - Calls onSubmit with form data
 */
export function ConfigurableForm({
  fields = [],
  onSubmit,
  validate,
  ...props
}) {
  // TODO: Implement configurable form
  // Render fields from configuration
  // Handle validation and submission
}
