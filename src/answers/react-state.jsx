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
  const [count, setCount] = useState(0);

  return (
    <>
      <div>Current count: {count}</div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </>
  );
}

/**
 * Create a user profile component with multiple independent state variables.
 * State variables: name, email, age
 * Should have inputs to update each state variable
 * Should display current state values
 * Should handle form submission (console.log the values)
 */
export function UserProfile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);

  function onSubmit(formData) {
    const result = {
      name: formData.get('name'),
      email: formData.get('email'),
      age: parseInt(formData.get('age'))
    };
    console.log(result);
  }

  return (
    <>
      <div>
        <p>{name}</p>
        <p>{email}</p>
        <p>{age}</p>
      </div>
      <form action={onSubmit} role="form">
        <label>
          Name:{' '}
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label>
          Email:{' '}
          <input
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          Age:{' '}
          <input
            name="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </label>
      </form>
    </>
  );
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
  const [count, setCount] = useState(0);

  return (
    <>
      <p>Count {count}</p>
      <button onClick={() => setCount(count + 1)}>Direct update</button>
      <button onClick={() => setCount((prev) => prev + 1)}>
        Functional update
      </button>
      <button onClick={() => setCount(0)}>Reset</button>
    </>
  );
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
  const [person, setPerson] = useState({
    name: '',
    age: 0,
    email: ''
  });

  return (
    <>
      <div>
        <p>{person.name}</p>
        <p>{person.age}</p>
        <p>{person.email}</p>
      </div>
      <label>
        Name{' '}
        <input
          name="name"
          value={person.name}
          onChange={(e) => setPerson({ ...person, name: e.target.value })}
        />
      </label>
      <label>
        Age{' '}
        <input
          name="age"
          type="number"
          value={person.age}
          onChange={(e) =>
            setPerson({ ...person, age: Number(e.target.value) })
          }
        />
      </label>
      <label>
        Email{' '}
        <input
          name="email"
          value={person.email}
          onChange={(e) => setPerson({ ...person, email: e.target.value })}
        />
      </label>
    </>
  );
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
  const [user, setUser] = useState({
    name: 'Charlie',
    age: 44,
    email: 'charlie@email.com'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const isAdult = user.age >= 18;

  return (
    <>
      <div data-testid="user-data">
        <p>Name: {user.name}</p>
        <p>Age: {user.age}</p>
        <p>Email: {user.email}</p>
      </div>
      <div data-testid="state-structure">{JSON.stringify(user)}</div>
      <div data-testid="ui-state">
        <>
          {loading ? <div>loading...</div> : ''}
          {error ? <div>Something went wrong</div> : ''}
          <button onClick={() => setLoading(!loading)}>Toggle loading</button>
          <button onClick={() => setError(!error)}>Toggle error</button>
        </>
      </div>
      <div data-testid="derived-state">
        <p>Is Adult: {isAdult}</p>
      </div>
    </>
  );
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
let nextId = 0;
export function TodoList() {
  const [todos, setTodos] = useState([]);
  const [item, setItem] = useState('');

  function addTodo() {
    setTodos([...todos, { id: nextId++, text: item, completed: false }]);
    setItem('');
  }

  function removeTodo(id) {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
  }

  return (
    <>
      <ul>
        {todos.length > 0
          ? todos.map((todo) => {
              return (
                <li key={todo.id}>
                  {todo.text} <input type="checkbox" checked={todo.completed} />
                  <button onClick={() => removeTodo(todo.id)}>Remove</button>
                </li>
              );
            })
          : 'No todos'}
      </ul>
      <div>
        <label>
          Add todo:{' '}
          <input
            name="addTodoInput"
            value={item}
            onChange={(e) => setItem(e.target.value)}
          />
        </label>
        <button onClick={() => addTodo()}>Add</button>
      </div>
    </>
  );
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
  const [temp, setTemp] = useState('');
  const [scale, setScale] = useState('c');

  function toFahrenheit(celsius) {
    return ((Number(celsius) * 9) / 5 + 32).toString();
  }

  function toCelsius(fahrenheit) {
    return (((fahrenheit - 32) * 5) / 9).toString();
  }

  function handleCelsiusChange(value) {
    setTemp(value);
    setScale('c');
  }

  function handleFahrenheitChange(value) {
    setTemp(value);
    setScale('f');
  }

  // Determine the values to display in each input
  const celsius = scale === 'f' ? (temp === '' ? '' : toCelsius(temp)) : temp;
  const fahrenheit =
    scale === 'c' ? (temp === '' ? '' : toFahrenheit(temp)) : temp;

  // Only show boiling point if celsius is a valid number
  const celsiusNum = Number(celsius);
  const boiling = celsius !== '' && !isNaN(celsiusNum) && celsiusNum >= 100;

  return (
    <>
      <TemperatureInput
        scale="c"
        temperature={celsius}
        onTemperatureChange={handleCelsiusChange}
      />
      <TemperatureInput
        scale="f"
        temperature={fahrenheit}
        onTemperatureChange={handleFahrenheitChange}
      />
      {boiling ? <p>Boiling point achieved</p> : ''}
    </>
  );
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

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'set':
      return { count: Number(action.count) };
    case 'reset':
      return { count: 0 };
    default:
      throw new Error(`${action.type} not recognised`);
  }
}

export function ReducerCounter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <>
      <div>Current count: {state.count}</div>
      <button onClick={() => dispatch({ type: 'increment' })}>Increment</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>Decrement</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>

      <label>
        Set{' '}
        <input
          name="set"
          onChange={(e) => dispatch({ type: 'set', count: e.target.value })}
        />
      </label>
    </>
  );
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

function shoppingReducer(cart, action) {
  switch (action.type) {
    case 'add':
      const existing = cart.find((c) => c.id === action.id);
      if (existing) {
        return cart.map((c) =>
          c.id === action.id
            ? { ...c, quantity: c.quantity + (action.quantity || 1) }
            : c
        );
      } else {
        return [
          ...cart,
          {
            id: action.id,
            item: action.item,
            quantity: action.quantity || 1,
            price: action.price
          }
        ];
      }
    case 'remove':
      return cart.filter((c) => c.id !== action.id);
    case 'update':
      return cart.map((c) => {
        if (c.id === action.id) {
          return {
            id: action.id,
            item: action.item,
            quantity: action.quantity,
            price: action.price
          };
        } else {
          return c;
        }
      });
    case 'reset':
      return [];
    default:
      throw new Error(`${action.type} not recognised`);
  }
}

export function ShoppingCart() {
  const [state, dispatch] = useReducer(shoppingReducer, []);

  // Calculate total price (ensure price is treated as a number)
  const total = state.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <>
      <section>
        <h3>Basket</h3>
        {state.length > 0 ? (
          <>
            {state.map((item) => {
              return (
                <div key={item.id} data-testid={item.id}>
                  <p>{item.item}</p>
                  <p data-testid={`quantity-${item.quantity}`}>
                    Quantity: {item.quantity}
                  </p>
                  <p>Price: £{Number(item.price).toFixed(2)}</p>
                  <button
                    onClick={() => dispatch({ type: 'remove', id: item.id })}>
                    Remove item
                  </button>
                </div>
              );
            })}
            <div
              style={{ fontWeight: 'bold', marginTop: '1em' }}
              data-testid="total">
              Total: £{total.toFixed(2)}
            </div>
          </>
        ) : (
          <div data-testid="cart-empty">Your cart is empty</div>
        )}

        <button onClick={() => dispatch({ type: 'reset' })}>
          Clear basket
        </button>
      </section>
      <section>
        <ul>
          <li>
            <p>Teapot</p>
            <p>Price: £25.00</p>
            <button
              onClick={() =>
                dispatch({
                  type: 'add',
                  item: 'Teapot',
                  price: '25',
                  quantity: 1,
                  id: 1
                })
              }>
              Add to cart
            </button>
          </li>
          <li>
            <p>Trendy Bag</p>
            <p>Price: £125.00</p>
            <button
              onClick={() =>
                dispatch({
                  type: 'add',
                  item: 'Trendy Bag',
                  price: '125',
                  quantity: 1,
                  id: 2
                })
              }>
              Add to cart
            </button>
          </li>
          <li>
            <p>Umbrella</p>
            <p>Price: £50.00</p>
            <button
              onClick={() =>
                dispatch({
                  type: 'add',
                  item: 'Umbrella',
                  price: '50',
                  quantity: 1,
                  id: 3
                })
              }>
              Add to cart
            </button>
          </li>
        </ul>
      </section>
    </>
  );
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
