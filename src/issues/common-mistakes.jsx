/**
 * Common React Mistakes:
 *
 * 1. Keys missing or using array indices as keys
 * 2. Inline function definitions in JSX (performance issue)
 * 3. Not handling loading/error states
 * 4. Props not validated or typed
 */

import React, { useState, useEffect, useCallback } from 'react';

// =============================================================================
// 1. Keys missing or using array indices as keys
// =============================================================================

// ❌ Bad - No keys:
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo) => (
        // ❌ Missing key prop - React warning in console
        <li>{todo.text}</li>
      ))}
    </ul>
  );
}

// ❌ Bad - Using array indices as keys:
function TodoList({ todos }) {
  const [items, setItems] = useState(todos);

  const addTodo = (text) => {
    // Adding to the beginning changes all indices
    setItems([{ id: Date.now(), text }, ...items]);
  };

  const removeTodo = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <ul>
      {items.map((todo, index) => (
        // ❌ Using index as key causes bugs when list changes
        <li key={index}>
          {todo.text}
          <button onClick={() => removeTodo(index)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

// Why it's bad - Example with input state:
// ❌ This causes bugs!
function TaskList() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Task 1' },
    { id: 2, text: 'Task 2' },
    { id: 3, text: 'Task 3' }
  ]);

  const removeFirst = () => {
    setTasks(tasks.slice(1));
  };

  return (
    <div>
      <button onClick={removeFirst}>Remove First</button>
      <ul>
        {tasks.map((task, index) => (
          // ❌ When you type in input and remove first item,
          // your input value stays with the wrong item!
          <li key={index}>
            <input type="checkbox" />
            <input defaultValue={task.text} />
          </li>
        ))}
      </ul>
    </div>
  );
}

// ✅ Good - Using stable unique IDs:
function TodoList({ todos }) {
  const [items, setItems] = useState(todos);

  const addTodo = (text) => {
    setItems([{ id: Date.now(), text }, ...items]);
  };

  const removeTodo = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <ul>
      {items.map((todo) => (
        // ✅ Using stable ID - React can track items correctly
        <li key={todo.id}>
          {todo.text}
          <button onClick={() => removeTodo(todo.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

// When index is acceptable:
// ✅ OK to use index when:
// 1. List is static (never reordered, added to, or removed from)
// 2. Items have no IDs
// 3. List is never filtered or sorted
function StaticList() {
  const colors = ['Red', 'Green', 'Blue']; // Never changes

  return (
    <ul>
      {colors.map((color, index) => (
        <li key={index}>{color}</li>
      ))}
    </ul>
  );
}

// =============================================================================
// 2. Inline Function Definitions in JSX (Performance Issue)
// =============================================================================

// ❌ Bad - Inline functions created every render:

function ProductList({ products }) {
  const [cart, setCart] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          // ❌ New function created on every render
          onAddToCart={() => {
            setCart([...cart, product]);
            console.log('Added:', product.name);
          }}
          // ❌ Another new function
          onSelect={() => setSelectedId(product.id)}
          // ❌ New function with computation
          isDiscounted={() => product.price < product.originalPrice}
          // ❌ Arrow function wrapping another function
          onHover={(e) => handleHover(e, product)}
        />
      ))}
    </div>
  );
}

// If ProductCard is memoized, it re-renders unnecessarily
// const ProductCard = React.memo(({ product, onAddToCart, onSelect }) => {
//   console.log('ProductCard render:', product.id);
//   return <div onClick={onSelect}>{product.name}</div>;
// });

// ✅ Good - Functions defined outside or memoized:

function ProductList({ products }) {
  const [cart, setCart] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  // ✅ Memoized functions
  const handleAddToCart = useCallback((product) => {
    setCart((prev) => [...prev, product]);
    console.log('Added:', product.name);
  }, []);

  const handleSelect = useCallback((id) => {
    setSelectedId(id);
  }, []);

  return (
    <div>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
          onSelect={handleSelect}
          isDiscounted={product.price < product.originalPrice}
        />
      ))}
    </div>
  );
}

const ProductCard = React.memo(
  ({ product, onAddToCart, onSelect, isDiscounted }) => {
    console.log('ProductCard render:', product.id);
    return (
      <div onClick={() => onSelect(product.id)}>
        {product.name}
        <button onClick={() => onAddToCart(product)}>Add to Cart</button>
      </div>
    );
  }
);

// Another example:

// ❌ Bad - Multiple inline functions
function UserList({ users }) {
  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>
          {/* ❌ New function every render */}
          <button onClick={() => console.log(user.name)}>View</button>
          {/* ❌ New function every render */}
          <button onClick={() => deleteUser(user.id)}>Delete</button>
          {/* ❌ Inline computation */}
          <span>
            {(() => {
              const age = new Date().getFullYear() - user.birthYear;
              return age > 18 ? 'Adult' : 'Minor';
            })()}
          </span>
        </div>
      ))}
    </div>
  );
}

// ✅ Good - Extract and memoize
function UserList({ users }) {
  const handleView = useCallback((name) => {
    console.log(name);
  }, []);

  const handleDelete = useCallback((id) => {
    deleteUser(id);
  }, []);

  return (
    <div>
      {users.map((user) => {
        const age = new Date().getFullYear() - user.birthYear;
        const ageGroup = age > 18 ? 'Adult' : 'Minor';

        return (
          <UserItem
            key={user.id}
            user={user}
            ageGroup={ageGroup}
            onView={handleView}
            onDelete={handleDelete}
          />
        );
      })}
    </div>
  );
}

const UserItem = React.memo(({ user, ageGroup, onView, onDelete }) => (
  <div>
    <button onClick={() => onView(user.name)}>View</button>
    <button onClick={() => onDelete(user.id)}>Delete</button>
    <span>{ageGroup}</span>
  </div>
));

// When inline functions are OK:

// ✅ Inline functions are fine when:
// 1. Not passing to memoized children
// 2. Simple event handlers that don't cause performance issues
// 3. One-time renders or small lists

function SimpleForm() {
  const [name, setName] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log(name);
      }}>
      {/* ✅ OK - simple handler, no perf issue */}
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button type="submit">Submit</button>
    </form>
  );
}

// =============================================================================
// 3. Not Handling Loading/Error States
// =============================================================================

// ❌ Bad - No loading or error handling:
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ❌ No loading state
    // ❌ No error handling
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then(setUser);
  }, [userId]);

  // ❌ What renders while loading? What if fetch fails?
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

// ❌ Bad - Only partial handling:
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  // ❌ No error state

  useEffect(() => {
    setLoading(true);
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      });
    // ❌ No .catch() - errors go unhandled
    // ❌ Loading never set to false if error occurs
  }, [userId]);

  if (loading) return <div>Loading...</div>;

  // ❌ Could crash if user is null due to error
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

// ✅ Good - Proper loading and error handling:
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`/api/users/${userId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return <div className="spinner">Loading...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!user) {
    return <div>No user found</div>;
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

// Another example with async/await:

// ❌ Bad - No error handling
function DataList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      // ❌ If this throws, the app crashes
      const response = await fetch('/api/items');
      const data = await response.json();
      setItems(data);
    };

    loadData();
  }, []);

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

// ✅ Good - Comprehensive error handling
function DataList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/items');

        if (!response.ok) {
          throw new Error('Failed to fetch items');
        }

        const data = await response.json();
        setItems(data);
      } catch (err) {
        setError(err.message);
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div>Loading items...</div>;
  if (error) return <div>Error: {error}</div>;
  if (items.length === 0) return <div>No items found</div>;

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

// Form submission example:

// ❌ Bad - No feedback during submission
function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // ❌ No loading state, no error handling
    fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    // ❌ User has no idea if it worked
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

// ✅ Good - Loading and error states
function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      setStatus('success');
      setFormData({ name: '', email: '' });
    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        disabled={status === 'loading'}
      />
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Submitting...' : 'Submit'}
      </button>

      {status === 'success' && (
        <div className="success">Thank you! We'll be in touch.</div>
      )}
      {status === 'error' && <div className="error">Error: {error}</div>}
    </form>
  );
}

// =============================================================================
// 4. Props Not Validated or Typed
// =============================================================================

// ❌ Bad - No prop validation:
function UserCard({ user, onEdit, onDelete, theme, size }) {
  // ❌ What if user is undefined?
  // ❌ What if onEdit is not a function?
  // ❌ What if theme is misspelled?
  // ❌ What shape does user have?

  return (
    <div className={`card card--${theme} card--${size}`}>
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button onClick={() => onEdit(user)}>Edit</button>
      <button onClick={() => onDelete(user.id)}>Delete</button>
    </div>
  );
}

// ❌ Bad - Runtime crashes:
function ProductPrice({ product }) {
  // ❌ Crashes if product is undefined
  // ❌ Crashes if product.price doesn't exist
  const discount = (product.price * product.discountPercent) / 100;
  const finalPrice = product.price - discount;

  return (
    <div>
      <span>${finalPrice.toFixed(2)}</span>
      {product.inStock && <span>In Stock</span>}
    </div>
  );
}

// Usage that causes crash:
// <ProductPrice product={undefined} />
// <ProductPrice product={{}} />

// ✅ Good - Using PropTypes:
import PropTypes from 'prop-types';

function UserCard({ user, onEdit, onDelete, theme, size }) {
  return (
    <div className={`card card--${theme} card--${size}`}>
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button onClick={() => onEdit(user)}>Edit</button>
      <button onClick={() => onDelete(user.id)}>Delete</button>
    </div>
  );
}

// ✅ PropTypes catch errors in development
UserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    avatar: PropTypes.string
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  theme: PropTypes.oneOf(['light', 'dark']),
  size: PropTypes.oneOf(['small', 'medium', 'large'])
};

UserCard.defaultProps = {
  theme: 'light',
  size: 'medium'
};

// Defensive programming when types unavailable:
// ✅ Good - Defensive checks
function ProductPrice({ product }) {
  // Handle missing or invalid product
  if (!product || typeof product !== 'object') {
    return <div>Product information unavailable</div>;
  }

  const price = product.price || 0;
  const discountPercent = product.discountPercent || 0;
  const discount = (price * discountPercent) / 100;
  const finalPrice = price - discount;

  return (
    <div>
      <span>${finalPrice.toFixed(2)}</span>
      {product.inStock && <span>In Stock</span>}
    </div>
  );
}

// Complex prop shapes:
// ❌ Bad - No validation on complex nested structure
function OrderSummary({ order }) {
  return (
    <div>
      <h2>Order #{order.id}</h2>
      <p>Total: ${order.total}</p>
      {order.items.map((item) => (
        <div key={item.id}>
          {item.product.name} x {item.quantity}
        </div>
      ))}
      <p>Ship to: {order.shipping.address.street}</p>
    </div>
  );
}

// ✅ Good - Validate nested structures
OrderSummary.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        product: PropTypes.shape({
          name: PropTypes.string.isRequired,
          price: PropTypes.number.isRequired
        }).isRequired
      })
    ).isRequired,
    shipping: PropTypes.shape({
      address: PropTypes.shape({
        street: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        zip: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  }).isRequired
};
