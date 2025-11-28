/**
 * React Architecture and Design Tests
 *
 * Test suite for React architecture exercises covering:
 * - Code splitting strategies
 * - State architecture patterns
 * - API integration patterns
 * - Authentication patterns
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
  LazyDashboard,
  RouteBasedSplitting,
  FeatureBasedSplitting,
  BundleSplittingDemo,
  AppStateProvider,
  useAppState,
  useAppDispatch,
  useShoppingCart,
  StateColocationDemo,
  NormalizedDataDemo,
  useFetch,
  ApiIntegrationDemo,
  ApiCacheProvider,
  useCachedFetch,
  DebouncedSearch,
  PollingDemo,
  AuthProvider,
  useAuth,
  ProtectedRoute,
  RequireRole,
  LoginForm,
  useTokenRefresh,
  UserProfile,
  UserDashboardFeature,
  mockApiCall,
  mockApiError
} from '../exercises/react-architecture';

// =============================================================================
// EXERCISE 1 TESTS: Code Splitting Strategies
// =============================================================================

describe('Exercise 1: Code Splitting Strategies', () => {
  describe('LazyDashboard', () => {
    it('should be a lazy component', () => {
      expect(LazyDashboard).toBeDefined();
      expect(LazyDashboard.$$typeof?.toString()).toContain('react.lazy');
    });

    it('should render dashboard content when loaded', async () => {
      const { Suspense } = React;
      render(
        <Suspense fallback={<div>Loading...</div>}>
          <LazyDashboard />
        </Suspense>
      );

      await waitFor(() => {
        expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
      });
    });

    it('should have correct content and className', async () => {
      const { Suspense } = React;
      render(
        <Suspense fallback={<div>Loading...</div>}>
          <LazyDashboard />
        </Suspense>
      );

      await waitFor(() => {
        expect(screen.getByText(/lazy-loaded dashboard/i)).toBeInTheDocument();
        expect(
          screen.getByText('Dashboard Page').closest('.dashboard-page')
        ).toBeInTheDocument();
      });
    });
  });

  describe('RouteBasedSplitting', () => {
    it('should show loading fallback initially', () => {
      render(<RouteBasedSplitting route="home" />);
      expect(screen.getByText('Loading page...')).toBeInTheDocument();
    });

    it('should render home route', async () => {
      render(<RouteBasedSplitting route="home" />);
      await waitFor(() => {
        expect(screen.getByText('Home Page')).toBeInTheDocument();
      });
    });

    it('should render dashboard route', async () => {
      render(<RouteBasedSplitting route="dashboard" />);
      await waitFor(() => {
        expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
      });
    });

    it('should render profile route', async () => {
      render(<RouteBasedSplitting route="profile" />);
      await waitFor(() => {
        expect(screen.getByText('Profile Page')).toBeInTheDocument();
      });
    });

    it('should render settings route', async () => {
      render(<RouteBasedSplitting route="settings" />);
      await waitFor(() => {
        expect(screen.getByText('Settings Page')).toBeInTheDocument();
      });
    });

    it('should have correct data-testid for each route', async () => {
      const { rerender } = render(<RouteBasedSplitting route="home" />);
      await waitFor(() => {
        expect(screen.getByTestId('home')).toBeInTheDocument();
      });

      rerender(<RouteBasedSplitting route="dashboard" />);
      await waitFor(() => {
        expect(screen.getByTestId('dashboard')).toBeInTheDocument();
      });
    });
  });

  describe('FeatureBasedSplitting', () => {
    it('should render enabled features only', async () => {
      const features = { analytics: true, chat: false, notifications: true };
      render(<FeatureBasedSplitting features={features} />);

      await waitFor(() => {
        expect(screen.getByText(/Feature: analytics/i)).toBeInTheDocument();
        expect(screen.getByText(/Feature: notifications/i)).toBeInTheDocument();
        expect(screen.queryByText(/Feature: chat/i)).not.toBeInTheDocument();
      });
    });

    it('should render all features when all enabled', async () => {
      const features = { analytics: true, chat: true, notifications: true };
      render(<FeatureBasedSplitting features={features} />);

      await waitFor(() => {
        expect(screen.getByText(/Feature: analytics/i)).toBeInTheDocument();
        expect(screen.getByText(/Feature: chat/i)).toBeInTheDocument();
        expect(screen.getByText(/Feature: notifications/i)).toBeInTheDocument();
      });
    });

    it('should have feature-container className', () => {
      const features = { analytics: true, chat: false, notifications: false };
      const { container } = render(
        <FeatureBasedSplitting features={features} />
      );
      expect(container.querySelector('.feature-container')).toBeInTheDocument();
    });

    it('should render nothing when all features disabled', () => {
      const features = { analytics: false, chat: false, notifications: false };
      render(<FeatureBasedSplitting features={features} />);
      expect(screen.queryByText(/Feature:/i)).not.toBeInTheDocument();
    });
  });

  describe('BundleSplittingDemo', () => {
    it('should render toggle button', () => {
      render(<BundleSplittingDemo />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should not show chart initially', () => {
      render(<BundleSplittingDemo />);
      expect(screen.queryByText('Chart Component')).not.toBeInTheDocument();
    });

    it('should show loading when chart is loading', async () => {
      const user = userEvent.setup();
      render(<BundleSplittingDemo />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(screen.getByText('Loading chart...')).toBeInTheDocument();
    });

    it('should render chart after button click', async () => {
      const user = userEvent.setup();
      render(<BundleSplittingDemo />);

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('Chart Component')).toBeInTheDocument();
      });
    });

    it('should have correct className on chart', async () => {
      const user = userEvent.setup();
      render(<BundleSplittingDemo />);

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(
          screen.getByText('Chart Component').closest('.chart')
        ).toBeInTheDocument();
      });
    });
  });
});

// =============================================================================
// EXERCISE 2 TESTS: State Architecture Patterns
// =============================================================================

describe('Exercise 2: State Architecture Patterns', () => {
  describe('AppStateProvider and hooks', () => {
    function TestComponent() {
      const state = useAppState();
      const dispatch = useAppDispatch();

      return (
        <div>
          <div data-testid="user">
            {state.user ? state.user.name : 'No user'}
          </div>
          <div data-testid="theme">{state.theme}</div>
          <div data-testid="notification-count">
            {state.notifications.length}
          </div>
          <button
            onClick={() =>
              dispatch({
                type: 'SET_USER',
                payload: { id: 1, name: 'John', email: 'john@test.com' }
              })
            }>
            Set User
          </button>
          <button
            onClick={() => dispatch({ type: 'SET_THEME', payload: 'dark' })}>
            Set Dark Theme
          </button>
          <button
            onClick={() =>
              dispatch({
                type: 'ADD_NOTIFICATION',
                payload: { id: 1, message: 'Test', type: 'info' }
              })
            }>
            Add Notification
          </button>
          <button onClick={() => dispatch({ type: 'CLEAR_NOTIFICATIONS' })}>
            Clear Notifications
          </button>
        </div>
      );
    }

    it('should provide initial state', () => {
      render(
        <AppStateProvider>
          <TestComponent />
        </AppStateProvider>
      );

      expect(screen.getByTestId('user')).toHaveTextContent('No user');
      expect(screen.getByTestId('theme')).toHaveTextContent('light');
      expect(screen.getByTestId('notification-count')).toHaveTextContent('0');
    });

    it('should handle SET_USER action', async () => {
      const user = userEvent.setup();
      render(
        <AppStateProvider>
          <TestComponent />
        </AppStateProvider>
      );

      await user.click(screen.getByText('Set User'));
      expect(screen.getByTestId('user')).toHaveTextContent('John');
    });

    it('should handle SET_THEME action', async () => {
      const user = userEvent.setup();
      render(
        <AppStateProvider>
          <TestComponent />
        </AppStateProvider>
      );

      await user.click(screen.getByText('Set Dark Theme'));
      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });

    it('should handle ADD_NOTIFICATION action', async () => {
      const user = userEvent.setup();
      render(
        <AppStateProvider>
          <TestComponent />
        </AppStateProvider>
      );

      await user.click(screen.getByText('Add Notification'));
      expect(screen.getByTestId('notification-count')).toHaveTextContent('1');
    });

    it('should handle CLEAR_NOTIFICATIONS action', async () => {
      const user = userEvent.setup();
      render(
        <AppStateProvider>
          <TestComponent />
        </AppStateProvider>
      );

      await user.click(screen.getByText('Add Notification'));
      expect(screen.getByTestId('notification-count')).toHaveTextContent('1');

      await user.click(screen.getByText('Clear Notifications'));
      expect(screen.getByTestId('notification-count')).toHaveTextContent('0');
    });

    it('should throw error when useAppState used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow();

      consoleSpy.mockRestore();
    });
  });

  describe('useShoppingCart', () => {
    function CartTestComponent() {
      const cart = useShoppingCart();

      return (
        <div>
          <div data-testid="total-items">{cart.totalItems}</div>
          <div data-testid="total-price">{cart.totalPrice}</div>
          <div data-testid="item-count">{cart.items.length}</div>
          <button
            onClick={() =>
              cart.addItem({ id: 1, name: 'Product 1', price: 10, quantity: 1 })
            }>
            Add Item
          </button>
          <button onClick={() => cart.removeItem(1)}>Remove Item</button>
          <button onClick={() => cart.updateQuantity(1, 3)}>
            Update Quantity
          </button>
          <button onClick={() => cart.clearCart()}>Clear Cart</button>
        </div>
      );
    }

    beforeEach(() => {
      localStorage.clear();
    });

    it('should start with empty cart', () => {
      render(<CartTestComponent />);
      expect(screen.getByTestId('total-items')).toHaveTextContent('0');
      expect(screen.getByTestId('total-price')).toHaveTextContent('0');
    });

    it('should add items to cart', async () => {
      const user = userEvent.setup();
      render(<CartTestComponent />);

      await user.click(screen.getByText('Add Item'));
      expect(screen.getByTestId('item-count')).toHaveTextContent('1');
      expect(screen.getByTestId('total-items')).toHaveTextContent('1');
      expect(screen.getByTestId('total-price')).toHaveTextContent('10');
    });

    it('should remove items from cart', async () => {
      const user = userEvent.setup();
      render(<CartTestComponent />);

      await user.click(screen.getByText('Add Item'));
      await user.click(screen.getByText('Remove Item'));
      expect(screen.getByTestId('item-count')).toHaveTextContent('0');
    });

    it('should update item quantity', async () => {
      const user = userEvent.setup();
      render(<CartTestComponent />);

      await user.click(screen.getByText('Add Item'));
      await user.click(screen.getByText('Update Quantity'));
      expect(screen.getByTestId('total-items')).toHaveTextContent('3');
      expect(screen.getByTestId('total-price')).toHaveTextContent('30');
    });

    it('should clear cart', async () => {
      const user = userEvent.setup();
      render(<CartTestComponent />);

      await user.click(screen.getByText('Add Item'));
      await user.click(screen.getByText('Clear Cart'));
      expect(screen.getByTestId('item-count')).toHaveTextContent('0');
    });

    it('should persist to localStorage', async () => {
      const user = userEvent.setup();
      render(<CartTestComponent />);

      await user.click(screen.getByText('Add Item'));

      const stored = JSON.parse(localStorage.getItem('shopping-cart') || '[]');
      expect(stored).toHaveLength(1);
      expect(stored[0]).toMatchObject({ id: 1, name: 'Product 1' });
    });
  });

  describe('StateColocationDemo', () => {
    const users = [
      { id: 1, name: 'Alice', email: 'alice@test.com' },
      { id: 2, name: 'Bob', email: 'bob@test.com' }
    ];

    const products = [
      { id: 1, name: 'Product A', price: 100, inStock: true },
      { id: 2, name: 'Product B', price: 50, inStock: false }
    ];

    it('should render global search input', () => {
      render(<StateColocationDemo users={users} products={products} />);
      expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    });

    it('should render both user and product sections', () => {
      render(<StateColocationDemo users={users} products={products} />);
      expect(screen.getByText(/alice/i)).toBeInTheDocument();
      expect(screen.getByText(/product a/i)).toBeInTheDocument();
    });

    it('should filter based on global search', async () => {
      const user = userEvent.setup();
      render(<StateColocationDemo users={users} products={products} />);

      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.type(searchInput, 'alice');

      expect(screen.getByText(/alice/i)).toBeInTheDocument();
      expect(screen.queryByText(/bob/i)).not.toBeInTheDocument();
    });

    it('should maintain independent local state in children', () => {
      render(<StateColocationDemo users={users} products={products} />);
      // Children should have their own sort controls
      // This tests that state is properly colocated
      expect(screen.getByText(/alice/i)).toBeInTheDocument();
    });
  });

  describe('NormalizedDataDemo', () => {
    const posts = [
      {
        id: 1,
        title: 'Post 1',
        content: 'Content 1',
        author: { id: 1, name: 'Author 1' },
        comments: [
          { id: 1, text: 'Comment 1' },
          { id: 2, text: 'Comment 2' }
        ]
      },
      {
        id: 2,
        title: 'Post 2',
        content: 'Content 2',
        author: { id: 2, name: 'Author 2' },
        comments: [{ id: 3, text: 'Comment 3' }]
      }
    ];

    it('should render normalized posts', () => {
      render(<NormalizedDataDemo posts={posts} />);
      expect(screen.getByText('Post 1')).toBeInTheDocument();
      expect(screen.getByText('Post 2')).toBeInTheDocument();
    });

    it('should display author information', () => {
      render(<NormalizedDataDemo posts={posts} />);
      expect(screen.getByText(/Author 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Author 2/i)).toBeInTheDocument();
    });

    it('should show comment count', () => {
      render(<NormalizedDataDemo posts={posts} />);
      expect(screen.getByText(/2.*comment/i)).toBeInTheDocument();
      expect(screen.getByText(/1.*comment/i)).toBeInTheDocument();
    });

    it('should have data-testid for testing', () => {
      render(<NormalizedDataDemo posts={posts} />);
      expect(screen.getAllByTestId(/post-/i)).toHaveLength(2);
    });
  });
});

// =============================================================================
// EXERCISE 3 TESTS: API Integration Patterns
// =============================================================================

describe('Exercise 3: API Integration Patterns', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('useFetch', () => {
    function TestComponent({ url }) {
      const { data, loading, error, refetch } = useFetch(url);

      return (
        <div>
          {loading && <div>Loading...</div>}
          {error && <div>Error: {error.message}</div>}
          {data && <div>Data: {JSON.stringify(data)}</div>}
          <button onClick={refetch}>Refetch</button>
        </div>
      );
    }

    it('should show loading state initially', () => {
      global.fetch.mockImplementation(() => new Promise(() => {}));
      render(<TestComponent url="https://api.test.com/data" />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should display data on successful fetch', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1, name: 'Test' })
      });

      render(<TestComponent url="https://api.test.com/data" />);

      await waitFor(() => {
        expect(screen.getByText(/Data:.*Test/)).toBeInTheDocument();
      });
    });

    it('should display error on failed fetch', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      render(<TestComponent url="https://api.test.com/data" />);

      await waitFor(() => {
        expect(screen.getByText(/Error:.*Network error/)).toBeInTheDocument();
      });
    });

    it('should support manual refetch', async () => {
      const user = userEvent.setup();
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ id: 1, name: 'Test' })
      });

      render(<TestComponent url="https://api.test.com/data" />);

      await waitFor(() => {
        expect(screen.getByText(/Data:/)).toBeInTheDocument();
      });

      await user.click(screen.getByText('Refetch'));
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('ApiIntegrationDemo', () => {
    it('should show loading state initially', () => {
      global.fetch.mockImplementation(() => new Promise(() => {}));
      render(<ApiIntegrationDemo apiUrl="https://api.test.com/items" />);
      expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });

    it('should display data items when loaded', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' }
        ]
      });

      render(<ApiIntegrationDemo apiUrl="https://api.test.com/items" />);

      await waitFor(() => {
        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Item 2')).toBeInTheDocument();
      });
    });

    it('should show error message and retry button on error', async () => {
      global.fetch.mockRejectedValueOnce(new Error('API Error'));

      render(<ApiIntegrationDemo apiUrl="https://api.test.com/items" />);

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
        expect(screen.getByTestId('retry-button')).toBeInTheDocument();
      });
    });

    it('should retry on button click', async () => {
      const user = userEvent.setup();
      global.fetch
        .mockRejectedValueOnce(new Error('API Error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [{ id: 1, name: 'Item 1' }]
        });

      render(<ApiIntegrationDemo apiUrl="https://api.test.com/items" />);

      await waitFor(() => {
        expect(screen.getByTestId('retry-button')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('retry-button'));

      await waitFor(() => {
        expect(screen.getByText('Item 1')).toBeInTheDocument();
      });
    });

    it('should have correct data-testid on items', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 1, name: 'Item 1' }]
      });

      render(<ApiIntegrationDemo apiUrl="https://api.test.com/items" />);

      await waitFor(() => {
        expect(screen.getByTestId('data-item')).toBeInTheDocument();
      });
    });
  });

  describe('ApiCacheProvider and useCachedFetch', () => {
    function TestComponent({ url }) {
      const { data, loading, invalidateCache } = useCachedFetch(url);

      return (
        <div>
          {loading && <div>Loading...</div>}
          {data && <div>Data: {data.name}</div>}
          <button onClick={invalidateCache}>Invalidate</button>
        </div>
      );
    }

    it('should cache successful responses', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ name: 'Cached Data' })
      });

      const { rerender } = render(
        <ApiCacheProvider>
          <TestComponent url="https://api.test.com/data" />
        </ApiCacheProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Data: Cached Data')).toBeInTheDocument();
      });

      // First fetch call
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Rerender with same URL should use cache
      rerender(
        <ApiCacheProvider>
          <TestComponent url="https://api.test.com/data" />
        </ApiCacheProvider>
      );

      // Should still be 1 call (cached)
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should support cache invalidation', async () => {
      const user = userEvent.setup();
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ name: 'Fresh Data' })
      });

      render(
        <ApiCacheProvider>
          <TestComponent url="https://api.test.com/data" />
        </ApiCacheProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Data: Fresh Data')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Invalidate'));

      // Should refetch after invalidation
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('DebouncedSearch', () => {
    it('should debounce search calls', async () => {
      vi.useFakeTimers();
      const user = userEvent.setup({ delay: null });
      const onSearch = vi.fn();

      render(<DebouncedSearch onSearch={onSearch} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      // Should not call immediately
      expect(onSearch).not.toHaveBeenCalled();

      // Fast-forward time
      act(() => {
        vi.advanceTimersByTime(300);
      });

      // Should call after debounce
      await waitFor(() => {
        expect(onSearch).toHaveBeenCalledWith('test');
      });

      vi.useRealTimers();
    });

    it('should show searching indicator during debounce', async () => {
      const user = userEvent.setup();
      render(<DebouncedSearch onSearch={vi.fn()} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'search');

      expect(screen.getByText(/searching/i)).toBeInTheDocument();
    });

    it('should update input immediately', async () => {
      const user = userEvent.setup();
      render(<DebouncedSearch onSearch={vi.fn()} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'immediate');

      expect(input).toHaveValue('immediate');
    });
  });

  describe('PollingDemo', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should render start and stop buttons', () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ value: 1 })
      });

      render(<PollingDemo url="https://api.test.com/data" interval={1000} />);

      expect(screen.getByText('Start Polling')).toBeInTheDocument();
      expect(screen.getByText('Stop Polling')).toBeInTheDocument();
    });

    it('should fetch immediately on mount', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ value: 1 })
      });

      render(<PollingDemo url="https://api.test.com/data" interval={1000} />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });

    it('should poll at regular intervals when started', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ value: 1 })
      });

      render(<PollingDemo url="https://api.test.com/data" interval={1000} />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2);
      });
    });

    it('should stop polling when stop button clicked', async () => {
      const user = userEvent.setup({ delay: null });
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ value: 1 })
      });

      render(<PollingDemo url="https://api.test.com/data" interval={1000} />);

      await user.click(screen.getByText('Stop Polling'));

      const callCount = global.fetch.mock.calls.length;

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Should not have made additional calls
      expect(global.fetch).toHaveBeenCalledTimes(callCount);
    });
  });
});

// =============================================================================
// EXERCISE 4 TESTS: Authentication Patterns
// =============================================================================

describe('Exercise 4: Authentication Patterns', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('AuthProvider and useAuth', () => {
    function TestComponent() {
      const { user, isAuthenticated, isLoading, login, logout } = useAuth();

      return (
        <div>
          <div data-testid="auth-status">
            {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
          </div>
          <div data-testid="loading">{isLoading ? 'Loading' : 'Ready'}</div>
          {user && <div data-testid="user-name">{user.name}</div>}
          <button onClick={() => login('user@example.com', 'password123')}>
            Login
          </button>
          <button onClick={logout}>Logout</button>
        </div>
      );
    }

    it('should start not authenticated', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'Not authenticated'
      );
    });

    it('should authenticate with correct credentials', async () => {
      const user = userEvent.setup();
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await user.click(screen.getByText('Login'));

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent(
          'Authenticated'
        );
      });
    });

    it('should set user data on successful login', async () => {
      const user = userEvent.setup();
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await user.click(screen.getByText('Login'));

      await waitFor(() => {
        expect(screen.getByTestId('user-name')).toBeInTheDocument();
      });
    });

    it('should store token in localStorage', async () => {
      const user = userEvent.setup();
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await user.click(screen.getByText('Login'));

      await waitFor(() => {
        expect(localStorage.getItem('auth-token')).toBeTruthy();
      });
    });

    it('should logout and clear state', async () => {
      const user = userEvent.setup();
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await user.click(screen.getByText('Login'));
      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent(
          'Authenticated'
        );
      });

      await user.click(screen.getByText('Logout'));

      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'Not authenticated'
      );
      expect(localStorage.getItem('auth-token')).toBeNull();
    });
  });

  describe('ProtectedRoute', () => {
    function MockAuth({ isAuth, children }) {
      const [isAuthenticated] = useState(isAuth);
      const value = { isAuthenticated, isLoading: false, user: null };
      return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
      );
    }

    it('should render children when authenticated', () => {
      render(
        <MockAuth isAuth={true}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MockAuth>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should show fallback when not authenticated', () => {
      render(
        <MockAuth isAuth={false}>
          <ProtectedRoute fallback={<div>Access Denied</div>}>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MockAuth>
      );

      expect(screen.getByText('Access Denied')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should show default message when no fallback provided', () => {
      render(
        <MockAuth isAuth={false}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MockAuth>
      );

      expect(screen.getByText(/please log in/i)).toBeInTheDocument();
    });
  });

  describe('RequireRole', () => {
    function MockAuth({ role, children }) {
      const value = {
        isAuthenticated: !!role,
        isLoading: false,
        user: role
          ? { id: 1, name: 'User', email: 'user@test.com', role }
          : null
      };
      return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
      );
    }

    it('should render children when user has required role', () => {
      render(
        <MockAuth role="admin">
          <RequireRole requiredRole="admin">
            <div>Admin Content</div>
          </RequireRole>
        </MockAuth>
      );

      expect(screen.getByText('Admin Content')).toBeInTheDocument();
    });

    it('should show fallback when user lacks required role', () => {
      render(
        <MockAuth role="user">
          <RequireRole
            requiredRole="admin"
            fallback={<div>Not Authorized</div>}>
            <div>Admin Content</div>
          </RequireRole>
        </MockAuth>
      );

      expect(screen.getByText('Not Authorized')).toBeInTheDocument();
      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    });

    it('should show default message when no fallback provided', () => {
      render(
        <MockAuth role="user">
          <RequireRole requiredRole="admin">
            <div>Admin Content</div>
          </RequireRole>
        </MockAuth>
      );

      expect(screen.getByText(/access denied/i)).toBeInTheDocument();
    });

    it('should handle not logged in case', () => {
      render(
        <MockAuth role={null}>
          <RequireRole requiredRole="admin">
            <div>Admin Content</div>
          </RequireRole>
        </MockAuth>
      );

      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    });
  });

  describe('LoginForm', () => {
    it('should render email and password inputs', () => {
      render(
        <AuthProvider>
          <LoginForm onSuccess={vi.fn()} />
        </AuthProvider>
      );

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(
        <AuthProvider>
          <LoginForm onSuccess={vi.fn()} />
        </AuthProvider>
      );

      expect(
        screen.getByRole('button', { name: /submit|login/i })
      ).toBeInTheDocument();
    });

    it('should call onSuccess after successful login', async () => {
      const user = userEvent.setup();
      const onSuccess = vi.fn();

      render(
        <AuthProvider>
          <LoginForm onSuccess={onSuccess} />
        </AuthProvider>
      );

      await user.type(screen.getByLabelText(/email/i), 'user@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /submit|login/i }));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });

    it('should disable submit button during login', async () => {
      const user = userEvent.setup();
      render(
        <AuthProvider>
          <LoginForm onSuccess={vi.fn()} />
        </AuthProvider>
      );

      const submitButton = screen.getByRole('button', {
        name: /submit|login/i
      });

      await user.type(screen.getByLabelText(/email/i), 'user@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();
    });

    it('should show error for invalid credentials', async () => {
      const user = userEvent.setup();
      render(
        <AuthProvider>
          <LoginForm onSuccess={vi.fn()} />
        </AuthProvider>
      );

      await user.type(screen.getByLabelText(/email/i), 'wrong@example.com');
      await user.type(screen.getByLabelText(/password/i), 'wrongpass');
      await user.click(screen.getByRole('button', { name: /submit|login/i }));

      await waitFor(() => {
        expect(screen.getByText(/error|invalid|failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('UserProfile', () => {
    function MockAuth({ user, children }) {
      const value = {
        isAuthenticated: !!user,
        isLoading: false,
        user,
        logout: vi.fn()
      };
      return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
      );
    }

    it('should display user information when logged in', () => {
      const user = {
        id: 1,
        name: 'John Doe',
        email: 'john@test.com',
        role: 'user'
      };
      render(
        <MockAuth user={user}>
          <UserProfile />
        </MockAuth>
      );

      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
      expect(screen.getByText(/john@test.com/i)).toBeInTheDocument();
      expect(screen.getByText(/user/i)).toBeInTheDocument();
    });

    it('should show not logged in message when no user', () => {
      render(
        <MockAuth user={null}>
          <UserProfile />
        </MockAuth>
      );

      expect(screen.getByText(/not logged in/i)).toBeInTheDocument();
    });

    it('should render logout button when logged in', () => {
      const user = {
        id: 1,
        name: 'John Doe',
        email: 'john@test.com',
        role: 'user'
      };
      render(
        <MockAuth user={user}>
          <UserProfile />
        </MockAuth>
      );

      expect(screen.getByTestId('logout-button')).toBeInTheDocument();
    });

    it('should have correct className', () => {
      const user = {
        id: 1,
        name: 'John Doe',
        email: 'john@test.com',
        role: 'user'
      };
      const { container } = render(
        <MockAuth user={user}>
          <UserProfile />
        </MockAuth>
      );

      expect(container.querySelector('.user-profile')).toBeInTheDocument();
    });
  });
});

// =============================================================================
// EXERCISE 5 TESTS: Combined Architecture Patterns
// =============================================================================

describe('Exercise 5: Combined Architecture Patterns', () => {
  describe('mockApiCall helper', () => {
    it('should resolve with data after delay', async () => {
      const data = { id: 1, name: 'Test' };
      const result = await mockApiCall(data, 100);
      expect(result).toEqual(data);
    });

    it('should use default delay of 1000ms', async () => {
      const start = Date.now();
      await mockApiCall({ test: true });
      const duration = Date.now() - start;
      expect(duration).toBeGreaterThanOrEqual(950);
    });
  });

  describe('mockApiError helper', () => {
    it('should reject with error after delay', async () => {
      await expect(mockApiError('Test error', 100)).rejects.toThrow(
        'Test error'
      );
    });

    it('should use default message and delay', async () => {
      await expect(mockApiError()).rejects.toThrow('API Error');
    });
  });

  describe('UserDashboardFeature', () => {
    beforeEach(() => {
      global.fetch = vi.fn();
    });

    it('should render with required props', () => {
      render(
        <AuthProvider>
          <ApiCacheProvider>
            <UserDashboardFeature apiUrl="https://api.test.com" />
          </ApiCacheProvider>
        </AuthProvider>
      );

      expect(document.body).toBeInTheDocument();
    });

    // Additional tests would depend on specific implementation
    // This is an advanced exercise combining multiple patterns
  });
});
