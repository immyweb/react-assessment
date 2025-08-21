/**
 * React Context and Global State Tests
 *
 * Test suite for simplified React context exercises covering:
 * - createContext and useContext basics
 * - Context provider patterns with useReducer
 * - Avoiding prop drilling
 * - Context optimization techniques
 */

import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest';
import {
  // Exercise 1: Basic Context
  ThemeContext,
  ThemeProvider,
  useTheme,
  ThemedButton,
  UserContext,
  UserProvider,
  useUser,
  UserProfile,

  // Exercise 2: Context with useReducer
  CartContext,
  CartProvider,
  useCart,
  ShoppingCart,
  ProductCard,

  // Exercise 3: Prop Drilling
  PropDrillingExample,
  DeepUserContext,
  ContextSolutionExample,

  // Exercise 4: Context Optimization
  OptimizedUserDataContext,
  OptimizedUserActionsContext,
  OptimizedUserProvider,
  useUserData,
  useUserActions,
  OptimizedUserDisplay,
  OptimizedUserActions,
  ContextPatternDemo
} from '../exercises/react-context.jsx';

// Mock localStorage for testing
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};

beforeEach(() => {
  vi.clearAllMocks();
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true
  });
});

// =============================================================================
// EXERCISE 1 TESTS: createContext and useContext Basics
// =============================================================================

describe('Exercise 1: createContext and useContext Basics', () => {
  describe('Theme Context', () => {
    it('should create ThemeContext with createContext', () => {
      expect(ThemeContext).toBeDefined();
      expect(ThemeContext.Provider).toBeDefined();
      expect(ThemeContext.Consumer).toBeDefined();
    });

    it('should provide theme through ThemeProvider', () => {
      const TestComponent = () => {
        const theme = useTheme();
        return <div data-testid="theme">{theme?.name || 'no-theme'}</div>;
      };

      render(
        <ThemeProvider theme={{ name: 'dark', color: '#000' }}>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });

    it('should handle missing theme provider with error', () => {
      // We need to mock console.error to prevent the React error from being printed
      const originalConsoleError = console.error;
      console.error = vi.fn();

      const TestComponent = () => {
        try {
          const theme = useTheme();
          return <div data-testid="theme">{theme?.name || 'no-theme'}</div>;
        } catch (error) {
          return <div data-testid="error">Error: {error.message}</div>;
        }
      };

      render(<TestComponent />);

      // Should throw error when used outside provider
      expect(screen.getByTestId('error')).toBeInTheDocument();
      expect(screen.getByTestId('error').textContent).toContain('Error');

      // Restore console.error
      console.error = originalConsoleError;
    });

    it('should render ThemedButton with theme styles', () => {
      render(
        <ThemeProvider theme={{ name: 'dark', color: '#000' }}>
          <ThemedButton>Click me</ThemedButton>
        </ThemeProvider>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Click me');
      expect(button).toHaveStyle({ backgroundColor: '#000' });
    });
  });

  describe('User Context', () => {
    it('should create UserContext with createContext', () => {
      expect(UserContext).toBeDefined();
      expect(UserContext.Provider).toBeDefined();
      expect(UserContext.Consumer).toBeDefined();
    });

    it('should provide user state through UserProvider', () => {
      render(
        <UserProvider>
          <UserProfile />
        </UserProvider>
      );

      expect(screen.getByText(/user|profile/i)).toBeInTheDocument();
    });

    it('should handle user login/logout', async () => {
      const user = userEvent.setup();

      const TestComponent = () => {
        const { user: currentUser, login, logout } = useUser();
        return (
          <div>
            <div data-testid="user-status">
              {currentUser ? currentUser.name : 'Not logged in'}
            </div>
            <button onClick={() => login({ name: 'John' })}>Login</button>
            <button onClick={() => logout()}>Logout</button>
          </div>
        );
      };

      render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );

      // Should start not logged in
      expect(screen.getByTestId('user-status')).toHaveTextContent(
        'Not logged in'
      );

      // Test login
      const loginButton = screen.getByText('Login');
      await user.click(loginButton);

      // Wait for login to complete
      await waitFor(() => {
        expect(screen.getByTestId('user-status')).toHaveTextContent('John');
      });

      // Test logout
      const logoutButton = screen.getByText('Logout');
      await user.click(logoutButton);

      expect(screen.getByTestId('user-status')).toHaveTextContent(
        'Not logged in'
      );
    });

    it('should provide loading state during login', async () => {
      const TestComponent = () => {
        const { loading, login } = useUser() || {};
        return (
          <div>
            <div data-testid="loading">{loading ? 'Loading' : 'Ready'}</div>
            <button onClick={() => login({ name: 'John' })}>Login</button>
          </div>
        );
      };

      render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );

      // Initially not loading
      expect(screen.getByTestId('loading')).toHaveTextContent('Ready');

      // Start login process
      const loginButton = screen.getByText('Login');
      fireEvent.click(loginButton);

      // Should show loading state
      expect(screen.getByTestId('loading')).toHaveTextContent('Loading');

      // Wait for login to complete
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Ready');
      });
    });
  });
});

// =============================================================================
// EXERCISE 2 TESTS: Context Provider Patterns with useReducer
// =============================================================================

describe('Exercise 2: Context Provider Patterns with useReducer', () => {
  describe('Shopping Cart Context', () => {
    it('should create CartContext with createContext', () => {
      expect(CartContext).toBeDefined();
      expect(CartContext.Provider).toBeDefined();
      expect(CartContext.Consumer).toBeDefined();
    });

    it('should manage cart items with useReducer', async () => {
      const user = userEvent.setup();

      const TestComponent = () => {
        const { items, addItem, removeItem, total } = useCart();
        return (
          <div>
            <div data-testid="cart-count">{items.length}</div>
            <div data-testid="cart-total">{total}</div>
            <button onClick={() => addItem({ id: 1, name: 'Test', price: 10 })}>
              Add Item
            </button>
            <button onClick={() => removeItem(1)}>Remove Item</button>
          </div>
        );
      };

      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      // Should start empty
      expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('0');

      // Add item
      const addButton = screen.getByText('Add Item');
      await user.click(addButton);

      // Should update count and total
      expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('10');

      // Add same item again to test quantity increase
      await user.click(addButton);
      expect(screen.getByTestId('cart-count')).toHaveTextContent('1'); // Still 1 unique item
      expect(screen.getByTestId('cart-total')).toHaveTextContent('20'); // But price doubled

      // Remove item
      const removeButton = screen.getByText('Remove Item');
      await user.click(removeButton);

      // Should be empty again
      expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('0');
    });

    it('should render ProductCard with add to cart functionality', async () => {
      const user = userEvent.setup();
      const mockProduct = { id: 1, name: 'Test Product', price: 15 };

      render(
        <CartProvider>
          <ProductCard product={mockProduct} />
          <ShoppingCart />
        </CartProvider>
      );

      // Check product display
      expect(screen.getByText('Test Product')).toBeInTheDocument();

      // Add to cart
      const addButton = screen.getByText('Add to Cart');
      await user.click(addButton);

      // Check that ShoppingCart displays the item
      expect(screen.getByText(/Shopping Cart/)).toBeInTheDocument();
    });
  });
});

// =============================================================================
// EXERCISE 3 TESTS: Avoiding Prop Drilling
// =============================================================================

describe('Exercise 3: Avoiding Prop Drilling', () => {
  it('should render user name with prop drilling', () => {
    const testUser = { name: 'Test User', avatar: '/avatar.jpg' };

    render(<PropDrillingExample user={testUser} />);

    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('should render user name with context solution', () => {
    const testUser = { name: 'Test User', avatar: '/avatar.jpg' };

    render(<ContextSolutionExample user={testUser} />);

    // This will fail if ContextSolutionExample doesn't use context properly
    // to pass user data to UserNameWithContext
    expect(screen.getByText(/Test User|User Name/)).toBeInTheDocument();
  });

  it('should create DeepUserContext with createContext', () => {
    expect(DeepUserContext).toBeDefined();
    expect(DeepUserContext.Provider).toBeDefined();
    expect(DeepUserContext.Consumer).toBeDefined();
  });
});

// =============================================================================
// EXERCISE 4 TESTS: Context Optimization Techniques
// =============================================================================

describe('Exercise 4: Context Optimization Techniques', () => {
  it('should create separate contexts for data and actions', () => {
    expect(OptimizedUserDataContext).toBeDefined();
    expect(OptimizedUserActionsContext).toBeDefined();
  });

  it('should render OptimizedUserDisplay with user data', () => {
    render(
      <OptimizedUserProvider>
        <OptimizedUserDisplay />
      </OptimizedUserProvider>
    );

    expect(screen.getByText(/Optimized User Display/)).toBeInTheDocument();
  });

  it('should render OptimizedUserActions with user actions', () => {
    render(
      <OptimizedUserProvider>
        <OptimizedUserActions />
      </OptimizedUserProvider>
    );

    expect(screen.getByText(/Optimized User Actions/)).toBeInTheDocument();
  });

  it('should provide user data through useUserData hook', () => {
    const TestComponent = () => {
      const userData = useUserData();
      return <div data-testid="user-data">{userData?.name || 'No user'}</div>;
    };

    render(
      <OptimizedUserProvider>
        <TestComponent />
      </OptimizedUserProvider>
    );

    const userDataElement = screen.getByTestId('user-data');
    expect(userDataElement).toBeInTheDocument();
  });

  it('should provide user actions through useUserActions hook', () => {
    const TestComponent = () => {
      const { login, logout } = useUserActions();
      return (
        <div>
          <button onClick={() => login({ name: 'Test' })}>Login</button>
          <button onClick={logout}>Logout</button>
        </div>
      );
    };

    render(
      <OptimizedUserProvider>
        <TestComponent />
      </OptimizedUserProvider>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});

// =============================================================================
// Demo Component Tests
// =============================================================================

describe('Demo Component', () => {
  it('should render all pattern components', () => {
    render(
      <OptimizedUserProvider>
        <CartProvider>
          <UserProvider>
            <ThemeProvider theme={{ name: 'light', color: '#fff' }}>
              <ContextPatternDemo />
            </ThemeProvider>
          </UserProvider>
        </CartProvider>
      </OptimizedUserProvider>
    );

    expect(
      screen.getByText('Context Pattern Demonstrations')
    ).toBeInTheDocument();
  });
});
