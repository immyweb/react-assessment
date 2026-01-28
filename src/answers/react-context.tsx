/**
 * React Context and Global State Exercises
 *
 * This file contains simplified exercises covering the core React context concepts:
 * - createContext and useContext basics
 * - Context provider patterns with useReducer
 * - Avoiding prop drilling
 * - Context optimization techniques
 */
import {
  createContext,
  useContext,
  useState,
  useReducer,
  useMemo,
  useEffect,
  useCallback,
  ReactElement,
  FormEvent
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
type ThemeContextType = {
  name: string;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  name: 'dark',
  toggleTheme: () => {}
});

export function ThemeProvider({
  children,
  theme: initialTheme
}: {
  children: React.ReactNode;
  theme: { name: string };
}) {
  const [theme, setTheme] = useState(initialTheme || { name: 'dark' });

  const toggleTheme = () => {
    setTheme((prev) =>
      prev.name === 'dark' ? { name: 'light' } : { name: 'dark' }
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

export function ThemedButton({
  children
}: {
  children: React.ReactNode;
}): ReactElement {
  const { name, toggleTheme } = useTheme();
  const style =
    name === 'dark'
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
type UserContextType = {
  loading: boolean;
  user: UserType | null;
  login: (user: UserType) => void;
  logout: () => void;
};

type UserType = {
  name: string;
  email?: string;
};

export const UserContext = createContext<UserContextType>({
  loading: false,
  user: null,
  login: () => {},
  logout: () => {}
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<UserType | null>(null);

  function login(person: UserType) {
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

export function UserProfile(): ReactElement {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const { login, logout, loading, user } = useUser();

  function onSubmit(evt: FormEvent) {
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

const ADD_ITEM = 'ADD_ITEM';
const REMOVE_ITEM = 'REMOVE_ITEM';
const UPDATE_ITEM = 'UPDATE_ITEM';
const CLEAR_CART = 'CLEAR_CART';

type ItemType = {
  id: number;
  item: string;
  quantity: number;
  price: string;
};

type CartState = ItemType[];

type AddAction = { type: typeof ADD_ITEM } & ItemType;
type RemoveAction = { type: typeof REMOVE_ITEM } & Pick<ItemType, 'id'>;
type UpdateAction = { type: typeof UPDATE_ITEM } & ItemType;
type ClearAction = { type: typeof CLEAR_CART };
type CartAction = AddAction | RemoveAction | UpdateAction | ClearAction;

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case ADD_ITEM:
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
    case REMOVE_ITEM:
      return state.filter((c) => c.id !== action.id);
    case UPDATE_ITEM:
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
    case CLEAR_CART:
      return [];
    default:
      throw new Error(`Action not recognised`);
  }
}

type CartContextType = {
  cart: CartState;
  total: number;
  addItem: (id: number, item: string, quantity: number, price: string) => void;
  removeItem: (id: number) => void;
  updateItem: (
    id: number,
    item: string,
    quantity: number,
    price: string
  ) => void;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextType>({
  cart: [],
  total: 0,
  addItem: () => {},
  removeItem: () => {},
  updateItem: () => {},
  clearCart: () => {}
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const total = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );
  }, [cart]);

  function addItem(id: number, item: string, quantity: number, price: string) {
    dispatch({ type: ADD_ITEM, item, price, quantity, id });
  }

  function removeItem(id: number) {
    dispatch({ type: REMOVE_ITEM, id });
  }

  function updateItem(
    id: number,
    item: string,
    quantity: number,
    price: string
  ) {
    dispatch({ type: UPDATE_ITEM, item, price, quantity, id });
  }

  function clearCart() {
    dispatch({ type: CLEAR_CART });
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

export function ShoppingCart(): ReactElement {
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

export function ProductCard({
  product
}: {
  product: Omit<ItemType, 'quantity'>;
}): ReactElement {
  const { addItem } = useCart();
  const { id, item, price } = product;

  return (
    <div>
      <h3>{item}</h3>
      <p>£{price}</p>
      <button onClick={() => addItem(id, item, 1, price)}>Add item</button>
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

type UserType2 = {
  name: string;
  avatar: string;
};

// Prop drilling version (for comparison)
export function PropDrillingExample({ user }: { user: UserType2 }) {
  return <HeaderWithProps user={user} />;
}

function HeaderWithProps({ user }: { user: UserType2 }): ReactElement {
  return (
    <header>
      <NavigationWithProps user={user} />
    </header>
  );
}

function NavigationWithProps({ user }: { user: UserType2 }): ReactElement {
  return (
    <nav>
      <UserMenuWithProps user={user} />
    </nav>
  );
}

function UserMenuWithProps({ user }: { user: UserType2 }): ReactElement {
  return (
    <div>
      <UserNameWithProps user={user} />
    </div>
  );
}

function UserNameWithProps({ user }: { user: UserType2 }) {
  return <span>{user?.name || 'Guest'}</span>;
}

type DeepUserContextType = {
  user: UserType2;
};

export const DeepUserContext = createContext<DeepUserContextType>({
  user: {
    name: '',
    avatar: ''
  }
});

export function ContextSolutionExample({ user }: { user: UserType2 }) {
  return (
    <DeepUserContext.Provider value={{ user }}>
      <HeaderWithContext />
    </DeepUserContext.Provider>
  );
}

function HeaderWithContext(): ReactElement {
  return (
    <header>
      <NavigationWithContext />
    </header>
  );
}

function NavigationWithContext(): ReactElement {
  return (
    <nav>
      <UserMenuWithContext />
    </nav>
  );
}

function UserMenuWithContext(): ReactElement {
  return (
    <div>
      <UserNameWithContext />
    </div>
  );
}

function UserNameWithContext(): ReactElement {
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
type OptimizedUser = { name: string } | null;

type OptimizedUserDataContextType = {
  value: OptimizedUser;
};

type OptimizedUserActionsContextType = {
  login: (person: OptimizedUser) => void;
  logout: () => void;
};

export const OptimizedUserDataContext =
  createContext<OptimizedUserDataContextType>({
    value: null
  });
export const OptimizedUserActionsContext =
  createContext<OptimizedUserActionsContextType>({
    login: () => {},
    logout: () => {}
  });

export function OptimizedUserProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<OptimizedUser>(null);

  const login = useCallback((person: OptimizedUser) => {
    if (person) {
      setUser({ name: person.name });
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const memoizedUser = useMemo(() => ({ value: user }), [user]);

  return (
    <OptimizedUserDataContext.Provider value={memoizedUser}>
      <OptimizedUserActionsContext.Provider value={{ login, logout }}>
        {children}
      </OptimizedUserActionsContext.Provider>
    </OptimizedUserDataContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(OptimizedUserDataContext);
  if (!context)
    throw new Error('useUserData must be used within a OptimizedUserProvider');
  return context;
}

export function useUserActions() {
  const context = useContext(OptimizedUserActionsContext);
  if (!context)
    throw new Error(
      'useUserActions must be used within a OptimizedUserProvider'
    );
  return context;
}

export function OptimizedUserDisplay(): ReactElement {
  const user = useUserData();

  return (
    <div>
      <h3>Optimized User Display</h3>
      <p>{user?.value?.name || 'Guest'}</p>
    </div>
  );
}

export function OptimizedUserActions(): ReactElement {
  const [name, setName] = useState('');
  const { login, logout } = useUserActions();

  function handleLogin(evt: FormEvent) {
    evt.preventDefault();
    login({ name });
  }

  return (
    <form onSubmit={handleLogin}>
      <h3>Optimized User Actions</h3>
      <label>
        Name: <input name="name" onChange={(e) => setName(e.target.value)} />
      </label>
      <button type="submit">Login</button>
      <button onClick={logout}>Log out</button>
    </form>
  );
}
