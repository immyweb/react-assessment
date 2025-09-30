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

import React, { useState, useContext, createContext } from 'react';

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
  return function withLoading({ isLoading, ...props }) {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };
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
  return function clickCounter({ ...props }) {
    const [count, setCount] = useState(0);

    function onClick() {
      setCount(count + 1);
      if (props.onClick) {
        props.onClick();
      }
    }

    function onReset() {
      setCount(0);
      if (props.resetCount) {
        props.resetCount();
      }
    }

    return (
      <WrappedComponent
        onClick={onClick}
        clickCount={count}
        resetCount={onReset}
        {...props}
      />
    );
  };
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
export function Counter({ initialCount = 0, children }) {
  const [count, setCount] = useState(initialCount);

  function increment() {
    setCount(count + 1);
  }

  function decrement() {
    setCount(count - 1);
  }

  function reset() {
    setCount(0);
  }

  return children({ count, increment, decrement, reset });
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
  const [isOn, setIsOn] = useState(initialValue);

  function toggle() {
    setIsOn(!isOn);
  }

  function turnOn() {
    setIsOn(true);
  }

  function turnOff() {
    setIsOn(false);
  }

  return children({ isOn, toggle, turnOn, turnOff });
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
  if (!isOpen) return null;

  return (
    <ModalContext.Provider value={{ isOpen, onClose }}>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-container" role="dialog" aria-modal="true">
        {children}
      </div>
    </ModalContext.Provider>
  );
}

export function ModalHeader({ children }) {
  return <div className="modal-header">{children}</div>;
}

export function ModalBody({ children }) {
  return <div className="modal-body">{children}</div>;
}

export function ModalFooter({ children }) {
  const { onClose } = useContext(ModalContext);
  // Pass onClose to children if needed, or just render children
  return React.Children.map(children, (child) =>
    React.isValidElement(child) ? React.cloneElement(child, { onClose }) : child
  );
}

export function ModalCloseButton({ children, onClose }) {
  return <button onClick={onClose}>{children}</button>;
}

// Attach compound components to Modal
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
Modal.CloseButton = ModalCloseButton;

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
  return <div className={className}>{children}</div>;
}

export function CardHeader({ children, className = '' }) {
  return <h3 className={className}>{children}</h3>;
}

export function CardBody({ children, className = '' }) {
  return <p className={className}>{children}</p>;
}

export function CardFooter({ children, className = '' }) {
  return <p className={className}>{children}</p>;
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
export function Button({
  as: Component = 'button',
  variant,
  children,
  ...props
}) {
  const Element = Component ?? 'button';

  return (
    <Element className={variant} {...props}>
      {children}
    </Element>
  );
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
  const Element = Component;

  return (
    <Element className={`${className} ${size}`} {...props}>
      {children}
    </Element>
  );
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
  const [count, setCount] = useState(initialValue);

  function increment() {
    setCount(count + 1);
  }

  function decrement() {
    setCount(count - 1);
  }

  function reset() {
    setCount(initialValue);
  }

  return children({ count, increment, decrement, reset });
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
  const [isOn, setIsOn] = useState(initialValue);

  function toggle() {
    setIsOn(!isOn);
  }

  function turnOn() {
    setIsOn(true);
  }

  function turnOff() {
    setIsOn(false);
  }

  return children({ isOn, toggle, turnOn, turnOff });
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

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const themes = {
    light: { name: 'light', color: '#fff' },
    dark: { name: 'dark', color: '#000' }
  };

  const [currentTheme, setCurrentTheme] = useState(themes.light);

  function toggleTheme() {
    setCurrentTheme((prev) =>
      prev.name === 'dark' ? themes.light : themes.dark
    );
  }

  return (
    <ThemeContext.Provider value={{ currentTheme, themes, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
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

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  function login({ name, email }) {
    setUser({
      name,
      email
    });
  }

  function logout() {
    setUser(null);
  }

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserContext');
  return context;
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
  const { variant = 'primary', size = 'medium', disabled = false } = config;
  const { onClick, onHover } = handlers;

  const className = `${variant} ${size}`;

  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={onHover}
      {...props}>
      {children}
    </button>
  );
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
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  let inputs;

  function handleSubmit(evt) {
    evt.preventDefault();

    if (validate) {
      setErrors(validate(values));
    }

    if (Object.keys(errors).length === 0) {
      onSubmit(values);
    }
  }

  function validateInput(name, value) {
    if (validate) {
      setErrors(validate({ [name]: value }));
    }
  }

  if (fields.length) {
    inputs = fields.map(({ name, type, label, required }) => {
      return (
        <div key={name}>
          <label htmlFor={name}>{label}</label>
          <input
            id={name}
            value={values[name] || ''}
            name={name}
            type={type}
            required={required}
            onChange={(e) => setValues({ ...values, [name]: e.target.value })}
            onBlur={(e) => validateInput(name, e.target.value)}
          />
          {errors[name] && <span>{`Invalid ${name}`}</span>}
        </div>
      );
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      {inputs}
      <button type="submit">Submit</button>
    </form>
  );
}
