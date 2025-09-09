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

import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useRef
} from 'react';
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
  return <h1 className="welcome">Welcome to React!</h1>;
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
  return (
    <div className="user-card">
      <h2>{user.name}</h2>
      <p>Age: {user.age}</p>
      <p>Email: {user.email}</p>
    </div>
  );
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
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}>
      {text}
    </button>
  );
}

/**
 * Create a product component with comprehensive prop validation.
 * Required props: id (number), name (string), price (number)
 * Optional props: description (string), inStock (boolean, default: true)
 * Should validate all prop types using PropTypes
 * Should display product information in a card format
 */
export function ProductCard({ id, name, price, description, inStock = true }) {
  return (
    <div id={id}>
      <h2>{name}</h2>
      <p>{price}</p>
      <p>{description}</p>
      <p>{inStock}</p>
    </div>
  );
}

// TODO: Add PropTypes validation for ProductCard
ProductCard.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  description: PropTypes.string,
  inStock: PropTypes.bool
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
  const [count, setCount] = useState(0);

  function onIncrement() {
    setCount(count + 1);
  }

  function onDecrement() {
    if (count > 0) {
      setCount(count - 1);
    }
  }

  return (
    <div>
      <p>{count}</p>
      <button onClick={onIncrement}>Increment</button>
      <button onClick={onDecrement}>Decrement</button>
    </div>
  );
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
  function onSubmit(formData) {}

  return (
    <form action={onSubmit} role="form">
      <label>
        Name:
        <input name="nameInput" />
      </label>
      <label>
        Email:
        <input name="emailInput" />
      </label>
      <label>
        Message:
        <input name="messageInput" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

/**
 * Create a component that demonstrates various synthetic event properties.
 * Should handle: onClick, onMouseEnter, onMouseLeave, onKeyDown
 * Should display event information (type, target, coordinates for mouse events)
 * Should handle keyboard events and display key pressed
 */
export function EventDemo() {
  const [mouseEvt, setMouseEvt] = useState({
    type: '',
    coordinates: {
      x: 0,
      y: 0
    }
  });
  const [keyboardEvt, setKeyboardEvt] = useState({
    keyPressed: ''
  });

  function onMouseEvent(evt) {
    setMouseEvt({
      type: evt.type,
      coordinates: { x: evt.clientX, y: evt.clientY }
    });
  }

  function onKeyBoardEvent(evt) {
    setKeyboardEvt({ keyPressed: evt.key });
  }

  return (
    <>
      <div>Mouse event type: {mouseEvt.type}</div>
      <div>
        Mouse coordinates: x: {mouseEvt.coordinates.x}
        y: {mouseEvt.coordinates.y}
      </div>
      <div>Key: {keyboardEvt.keyPressed}</div>

      <button onClick={onMouseEvent} data-testid="click-target">
        click me
      </button>
      <button
        onMouseEnter={onMouseEvent}
        onMouseLeave={onMouseEvent}
        data-testid="mouse-target">
        hover
      </button>
      <input name="name" onKeyDown={onKeyBoardEvent} data-testid="key-target" />
    </>
  );
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
  function Welcome({ username }) {
    return <h1>Welcome {username}</h1>;
  }

  function Login() {
    return <h1>Login</h1>;
  }

  return <div>{isLoggedIn ? <Welcome username={username} /> : <Login />}</div>;
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
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <h3>{error}</h3>;
  }

  if (data && data.length > 0) {
    return data.map((item) => <div>{item}</div>);
  } else {
    return <h3>No data</h3>;
  }
}

/**
 * Create a notification component with various display conditions.
 * Props: type, message, dismissible, onDismiss
 * Should only render if message exists
 * Should show dismiss button only if dismissible=true
 * Should apply different styles based on type
 */
export function Notification({ type, message, dismissible, onDismiss }) {
  if (message) {
    return (
      <div className={type}>
        <h3>{message}</h3>
        {dismissible ? <button onClick={onDismiss}></button> : ''}
      </div>
    );
  }
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
  return (
    <ul>
      {todos.map(({ id, text, completed }) => {
        return (
          <li
            key={id}
            style={{ textDecoration: completed ? 'line-through' : 'none' }}>
            {text}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Create a shopping cart component with add/remove functionality.
 * Should maintain a list of items in state
 * Should allow adding items (with name and price)
 * Should allow removing items by id
 * Should display total price
 * Should use proper keys and handle list updates
 */
let nextId = 0;
export function ShoppingCart() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [items, setItems] = useState([]);

  const totalPrice = items.reduce((acc, i) => {
    return acc + i.price;
  }, 0);

  return (
    <div>
      {items.length > 0 ? (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.name} <span>{item.price}</span>
              <button
                onClick={() => {
                  setItems(items.filter((i) => i.id !== item.id));
                }}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        'empty'
      )}
      <p>Total price: {totalPrice}</p>
      <div>
        <label>
          Name:{' '}
          <input
            name="nameInput"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Price:{' '}
          <input
            name="priceInput"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </label>
        <button
          onClick={() => {
            setItems([
              ...items,
              { id: nextId++, name: name, price: Number(price) }
            ]);
          }}>
          Add
        </button>
      </div>
    </div>
  );
}

/**
 * Create a component that renders nested category/item structure.
 * Props: categories (array of objects with id, name, items array)
 * Should render categories and their nested items
 * Should use proper keys for both levels
 * Should be collapsible (show/hide items)
 */
export function CategoryList({ categories }) {
  // Track open/closed state for each category by id
  const [openIds, setOpenIds] = useState(() =>
    Object.fromEntries(categories.map((category) => [category.id, true]))
  );

  function toggleItems(categoryId) {
    setOpenIds((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  }

  return (
    <ul>
      {categories.map((category) => {
        return (
          <li key={category.id}>
            {category.name}
            <button onClick={() => toggleItems(category.id)}>
              Show / hide
            </button>
            {openIds[category.id] && (
              <ul>
                {category.items.map((item) => (
                  <li key={item.id}>{item.name}</li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
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
  return (
    <>
      <h1>{title}</h1>
      {children}
    </>
  );
}

/**
 * Create a data fetcher component using render props pattern.
 * Props: url, render (function)
 * Should manage loading state and data
 * Should call render prop with { data, loading, error }
 * Should simulate API call with setTimeout
 */
export function DataFetcher({ url, render }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset state
    setLoading(true);
    setData(null);
    setError(null);

    simulateApiCall({ some: 'data' }, 500)
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [url]);

  return <>{render({ loading, data, error })}</>;
}

/**
 * Create a tabs component using compound component pattern.
 * Components: Tabs, TabList, Tab, TabPanels, TabPanel
 * Should manage active tab state
 * Should coordinate between tab buttons and panels
 * Should use React.Children utilities
 */
const TabContext = createContext();

export function Tabs({ children }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      <div>{children}</div>
    </TabContext.Provider>
  );
}

export function TabList({ children }) {
  return <div>{children}</div>;
}

export function Tab({ children, index }) {
  const { activeTab, setActiveTab } = useContext(TabContext);

  return (
    <button
      onClick={() => setActiveTab(index)}
      className={activeTab === index ? 'active' : ''}>
      {children}
    </button>
  );
}

export function TabPanels({ children }) {
  const { activeTab } = useContext(TabContext);
  return <div>{React.Children.toArray(children)[activeTab]}</div>;
}

export function TabPanel({ children, index }) {
  return <>{children}</>;
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
  return (
    <>
      <input
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
      />
      {validation && !validation.isValid ? (
        <span role="alert">{validation.error}</span>
      ) : (
        ''
      )}
    </>
  );
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
    return (
      <input defaultValue={defaultValue} placeholder={placeholder} ref={ref} />
    );
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
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const inputRef = useRef(null);

  function onSubmit(evt) {
    evt.preventDefault();
    setAge(inputRef.current.value);
  }

  return (
    <form onSubmit={onSubmit} role="form">
      <label>
        Name (Controlled Input):{' '}
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <span>{name}</span>

      <label>
        Age (Uncontrolled Input): <input ref={inputRef} />
      </label>
      <span>{age}</span>

      <button>Submit</button>
    </form>
  );
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
