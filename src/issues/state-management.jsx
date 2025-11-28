/**
 * State Management Issues
 *
 * 1. Unnecessary state (could it be derived?)
 * 2. State in wrong component (should it be lifted up or down?)
 * 3. Missing state (hardcoded values that should be dynamic)
 * 4. Improper state updates (mutating state directly)
 */

import React, { useState, useEffect } from 'react';

// =============================================================================
// 1. Unnecessary State (Could be Derived)
// =============================================================================

// ❌ Bad - Storing derived values in state:
function ShoppingCart({ items }) {
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const newTotal = items.reduce((sum, item) => sum + item.price, 0);
    const newCount = items.length;
    setTotal(newTotal);
    setItemCount(newCount);
  }, [items]);

  return (
    <div>
      <p>Items: {itemCount}</p>
      <p>Total: ${total}</p>
    </div>
  );
}

// ✅ Good - Calculate derived values directly:
function ShoppingCart({ items }) {
  // No state needed - just calculate on render
  const total = items.reduce((sum, item) => sum + item.price, 0);
  const itemCount = items.length;

  return (
    <div>
      <p>Items: {itemCount}</p>
      <p>Total: ${total}</p>
    </div>
  );
}

// Another example:
// ❌ Bad
function UserProfile({ firstName, lastName }) {
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    setFullName(`${firstName} ${lastName}`);
  }, [firstName, lastName]);

  return <h1>{fullName}</h1>;
}

// ✅ Good
function UserProfile({ firstName, lastName }) {
  const fullName = `${firstName} ${lastName}`;
  return <h1>{fullName}</h1>;
}

// =============================================================================
// 2. State in Wrong Component
// =============================================================================

// ❌ Bad - State too low (needs to be lifted up):
function FilterButton({ label }) {
  const [isActive, setIsActive] = useState(false);

  return (
    <button onClick={() => setIsActive(!isActive)}>
      {label} {isActive ? '✓' : ''}
    </button>
  );
}

function ProductList() {
  return (
    <div>
      {/* Problem: Each button has its own state, 
          but parent needs to know which filter is active */}
      <FilterButton label="Electronics" />
      <FilterButton label="Clothing" />
      <FilterButton label="Books" />

      {/* Can't filter products here - no access to filter state! */}
      <div>Products go here...</div>
    </div>
  );
}

// ✅ Good - State lifted up to parent:
function ProductList() {
  const [activeFilter, setActiveFilter] = useState(null);

  const filteredProducts = products.filter(
    (p) => !activeFilter || p.category === activeFilter
  );

  return (
    <div>
      <FilterButton
        label="Electronics"
        isActive={activeFilter === 'Electronics'}
        onClick={() => setActiveFilter('Electronics')}
      />
      <FilterButton
        label="Clothing"
        isActive={activeFilter === 'Clothing'}
        onClick={() => setActiveFilter('Clothing')}
      />

      <div>
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function FilterButton({ label, isActive, onClick }) {
  return (
    <button onClick={onClick}>
      {label} {isActive ? '✓' : ''}
    </button>
  );
}

// ❌ Bad - State too high (should be pushed down):
function App() {
  // Modal state in App, but only used by Settings component
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  return (
    <div>
      <Header />
      <MainContent />
      <Settings
        showModal={showModal}
        setShowModal={setShowModal}
        modalMessage={modalMessage}
        setModalMessage={setModalMessage}
      />
      <Footer />
    </div>
  );
}

// ✅ Good - State moved to where it's used:
function App() {
  return (
    <div>
      <Header />
      <MainContent />
      <Settings />
      <Footer />
    </div>
  );
}

function Settings() {
  // State lives here - only this component needs it
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  return (
    <div>
      <button onClick={() => setShowModal(true)}>Open Settings</button>
      {showModal && <Modal message={modalMessage} />}
    </div>
  );
}

// =============================================================================
// 3. Missing State (Hardcoded Values)
// =============================================================================

// ❌ Bad - Hardcoded values that should be state:
function TemperatureDisplay() {
  // Temperature is hardcoded!
  const temperature = 72;

  return (
    <div>
      <p>Temperature: {temperature}°F</p>
      <button
        onClick={() => {
          // This doesn't work - can't update hardcoded value
          console.log('Toggle clicked');
        }}>
        Toggle to Celsius
      </button>
    </div>
  );
}

// ✅ Good - Using state for dynamic values:
function TemperatureDisplay() {
  const [temperature, setTemperature] = useState(72);
  const [unit, setUnit] = useState('F');

  const displayTemp =
    unit === 'F' ? temperature : Math.round(((temperature - 32) * 5) / 9);

  return (
    <div>
      <p>
        Temperature: {displayTemp}°{unit}
      </p>
      <button onClick={() => setUnit(unit === 'F' ? 'C' : 'F')}>
        Toggle to {unit === 'F' ? 'Celsius' : 'Fahrenheit'}
      </button>
    </div>
  );
}

// Another example:

// ❌ Bad - Selection hardcoded
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo) => (
        <li
          key={todo.id}
          style={{
            backgroundColor: todo.id === 1 ? 'yellow' : 'white'
          }}>
          {todo.text}
        </li>
      ))}
    </ul>
  );
}

// ✅ Good - Selection is state
function TodoList({ todos }) {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <ul>
      {todos.map((todo) => (
        <li
          key={todo.id}
          onClick={() => setSelectedId(todo.id)}
          style={{
            backgroundColor: todo.id === selectedId ? 'yellow' : 'white'
          }}>
          {todo.text}
        </li>
      ))}
    </ul>
  );
}

// =============================================================================
// 4. Improper State Updates (Mutating Directly)
// =============================================================================

// ❌ Bad - Mutating state directly:
function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', done: false }
  ]);

  const toggleTodo = (id) => {
    // WRONG: Mutating state directly
    const todo = todos.find((t) => t.id === id);
    todo.done = !todo.done;
    setTodos(todos); // React won't detect the change!
  };

  const addTodo = (text) => {
    // WRONG: Mutating array directly
    todos.push({ id: Date.now(), text, done: false });
    setTodos(todos); // React won't re-render!
  };

  return <div></div>;
}

// ✅ Good - Creating new state objects:
function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', done: false }
  ]);

  const toggleTodo = (id) => {
    // Create new array with updated object
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, done: !todo.done } // Create new object
          : todo
      )
    );
  };

  const addTodo = (text) => {
    // Create new array with new item
    setTodos([...todos, { id: Date.now(), text, done: false }]);
  };

  return <div></div>;
}

// More mutation examples:

// ❌ Bad - Various mutations
function DataManager() {
  const [user, setUser] = useState({ name: 'John', age: 30 });
  const [items, setItems] = useState([1, 2, 3]);

  // WRONG: Mutating object
  const updateName = (newName) => {
    user.name = newName;
    setUser(user);
  };

  // WRONG: Mutating array
  const addItem = (item) => {
    items.push(item);
    setItems(items);
  };

  // WRONG: Mutating nested object
  const updateAddress = (address) => {
    user.address = address;
    setUser(user);
  };
}

// ✅ Good - Creating new objects/arrays
function DataManager() {
  const [user, setUser] = useState({ name: 'John', age: 30 });
  const [items, setItems] = useState([1, 2, 3]);

  const updateName = (newName) => {
    setUser({ ...user, name: newName });
  };

  const addItem = (item) => {
    setItems([...items, item]);
  };

  const updateAddress = (address) => {
    setUser({ ...user, address });
  };
}

// Nested state mutations:

// ❌ Bad - Mutating nested state
function ProfileEditor() {
  const [user, setUser] = useState({
    name: 'John',
    address: { city: 'NYC', country: 'USA' }
  });

  const updateCity = (newCity) => {
    // WRONG: Mutating nested object
    user.address.city = newCity;
    setUser(user);
  };
}

// ✅ Good - Spreading nested objects
function ProfileEditor() {
  const [user, setUser] = useState({
    name: 'John',
    address: { city: 'NYC', country: 'USA' }
  });

  const updateCity = (newCity) => {
    setUser({
      ...user,
      address: {
        ...user.address,
        city: newCity
      }
    });
  };
}
