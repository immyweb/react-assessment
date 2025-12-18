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

import {
  createContext,
  useContext,
  useState,
  useReducer,
  useMemo,
  useEffect
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

export const ThemeContext = createContext();

export function ThemeProvider({ children, theme: initialTheme }) {
  const [theme, setTheme] = useState(
    initialTheme || { name: 'dark', color: '#000' }
  );

  const toggleTheme = () => {
    setTheme((prev) =>
      prev.name === 'dark'
        ? { name: 'light', color: '#fff' }
        : { name: 'dark', color: '#000' }
    );
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme.name);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ ...theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}

export function ThemedButton({ children }) {
  const { toggleTheme, theme } = useTheme();
  const style =
    theme === 'dark'
      ? { background: '#222', color: '#fff' }
      : { background: '#fff', color: '#222' };

  return (
    <button style={style} onClick={toggleTheme}>
      {children}
    </button>
  );
}

/**
 * Create a user context for authentication state.
 *
 * Expected behavior:
 * - Should provide current user state (user object and loading state)
 * - Should provide login/logout methods
 * - UserProfile should display the current user's information
 */

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  function login(person) {
    setLoading(true);
    setUser({ name: person.name, email: person.email });
    setLoading(false);
  }

  function logout() {
    setLoading(true);
    setUser(null);
    setLoading(false);
  }

  return (
    <UserContext.Provider value={{ loading, user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
}

export function UserProfile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { login, logout, loading, user } = useUser();

  function onSubmit(evt) {
    evt.preventDefault();
    login({ name, email });
  }

  if (loading) {
    return <div data-testid="loading">loading...</div>;
  }

  if (!user) {
    return (
      <form onSubmit={onSubmit}>
        <label>
          Name: <input name="name" onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Email:{' '}
          <input name="email" onChange={(e) => setEmail(e.target.value)} />
        </label>
        <button>Login</button>
      </form>
    );
  }

  return (
    <div>
      <p>{user.name}</p>
      <p>{user.email}</p>
      <button onClick={logout}>Log out</button>
    </div>
  );
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

const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  CLEAR_CART: 'CLEAR_CART'
};

// id
// item
// quantity
// price

function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM:
      const existing = state.find((c) => c.id === action.id);
      if (existing) {
        return state.map((c) =>
          c.id === action.id
            ? { ...c, quantity: c.quantity + (action.quantity || 1) }
            : c
        );
      } else {
        return [
          ...state,
          {
            id: action.id,
            item: action.item,
            quantity: action.quantity || 1,
            price: action.price
          }
        ];
      }
    case CART_ACTIONS.REMOVE_ITEM:
      return state.filter((c) => c.id !== action.id);
    case CART_ACTIONS.UPDATE_ITEM:
      return state.map((c) => {
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
    case CART_ACTIONS.CLEAR_CART:
      return [];
    default:
      throw new Error(`${action.type} not recognised`);
  }
}

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const total = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );
  }, [cart]);

  function addItem(id, item, price, quantity) {
    dispatch({ type: CART_ACTIONS.ADD_ITEM, item, price, quantity, id });
  }

  function removeItem(id) {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, id });
  }

  function updateItem(id, item, price, quantity) {
    dispatch({ type: CART_ACTIONS.UPDATE_ITEM, item, price, quantity, id });
  }

  function clearCart() {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  }

  return (
    <CartContext.Provider
      value={{ cart, total, addItem, removeItem, updateItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}

export function ShoppingCart() {
  const { cart, total, clearCart, removeItem } = useCart();

  return (
    <div>
      <h3>Basket</h3>
      <section>
        {cart.length > 0 ? (
          cart.map((product) => {
            return (
              <div key={product.id}>
                <p>{product.item}</p>
                <p>{product.price}</p>
                <p>{product.quantity}</p>
                <button onClick={() => removeItem(product.id)}>
                  Remove item
                </button>
              </div>
            );
          })
        ) : (
          <div>Cart is empty</div>
        )}
      </section>
      <div data-testid="cart-count">Number of items: {cart.length}</div>
      <div data-testid="cart-total">{total.toFixed(2)}</div>
      <button onClick={clearCart}>Clear basket</button>
      <h3>Products</h3>
      <section>
        <ProductCard product={{ id: 1, item: 'Teapot', price: '25' }} />
        <ProductCard product={{ id: 2, item: 'Trendy Bag', price: '125' }} />
        <ProductCard product={{ id: 3, item: 'Umbrella', price: '50' }} />
      </section>
    </div>
  );
}

export function ProductCard({ product }) {
  const { addItem } = useCart();
  const { id, item, price } = product;

  return (
    <div>
      <h3>{item}</h3>
      <p>£{price}</p>
      <button onClick={() => addItem(id, item, price, 1)}>Add item</button>
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

export const DeepUserContext = createContext();

export function ContextSolutionExample({ user }) {
  return (
    <DeepUserContext.Provider value={{ user }}>
      <HeaderWithContext />
    </DeepUserContext.Provider>
  );
}

function HeaderWithContext() {
  return (
    <header>
      <NavigationWithContext />
    </header>
  );
}

function NavigationWithContext() {
  return (
    <nav>
      <UserMenuWithContext />
    </nav>
  );
}

function UserMenuWithContext() {
  return (
    <div>
      <UserNameWithContext />
    </div>
  );
}

function UserNameWithContext() {
  const { user } = useContext(DeepUserContext);

  return <span>{user.name}</span>;
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
