/**
 * Tests for React Libraries Exercises
 *
 * This test suite validates implementations for:
 * - Axios HTTP client
 * - TanStack Query (React Query)
 * - Redux state management
 * - Zustand state management
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { legacy_createStore as createStore } from 'redux';

import {
  createAxiosInstance,
  UserProfile,
  addAuthInterceptor,
  addErrorInterceptor,
  PostsList,
  PostDetail,
  CreatePost,
  OptimisticTodoList,
  counterReducer,
  ReduxCounter,
  counterActions,
  todosReducer,
  createCounterStore,
  createUsersStore,
  createThemeStore,
  ZustandCounter,
  createAsyncStore,
  createMockApi
} from '../exercises/react-libraries';

// ============================================================================
// Exercise 1: Axios Tests
// ============================================================================

describe('Exercise 1: Axios - HTTP Client Basics', () => {
  describe('createAxiosInstance', () => {
    it('should create axios instance with base URL', () => {
      const instance = createAxiosInstance();
      expect(instance.defaults.baseURL).toBe('https://api.example.com');
    });

    it('should set timeout to 5000ms', () => {
      const instance = createAxiosInstance();
      expect(instance.defaults.timeout).toBe(5000);
    });

    it('should set default Content-Type header', () => {
      const instance = createAxiosInstance();
      expect(instance.defaults.headers['Content-Type']).toBe(
        'application/json'
      );
    });
  });

  describe('UserProfile', () => {
    let mockApi;

    beforeEach(() => {
      mockApi = {
        get: vi.fn()
      };
    });

    it('should show loading state initially', () => {
      mockApi.get.mockReturnValue(new Promise(() => {})); // Never resolves
      render(<UserProfile userId="123" axiosInstance={mockApi} />);
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should fetch user data on mount', async () => {
      mockApi.get.mockResolvedValue({
        data: { id: '123', name: 'John Doe', email: 'john@example.com' }
      });

      render(<UserProfile userId="123" axiosInstance={mockApi} />);

      await waitFor(() => {
        expect(mockApi.get).toHaveBeenCalledWith('/users/123');
      });
    });

    it('should display user name when loaded', async () => {
      mockApi.get.mockResolvedValue({
        data: { id: '123', name: 'John Doe', email: 'john@example.com' }
      });

      render(<UserProfile userId="123" axiosInstance={mockApi} />);

      await waitFor(() => {
        expect(screen.getByText(/john doe/i)).toBeInTheDocument();
      });
    });

    it('should display user email when loaded', async () => {
      mockApi.get.mockResolvedValue({
        data: { id: '123', name: 'John Doe', email: 'john@example.com' }
      });

      render(<UserProfile userId="123" axiosInstance={mockApi} />);

      await waitFor(() => {
        expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
      });
    });

    it('should show error message when fetch fails', async () => {
      mockApi.get.mockRejectedValue(new Error('Network error'));

      render(<UserProfile userId="123" axiosInstance={mockApi} />);

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });

    it('should not show loading state after data is loaded', async () => {
      mockApi.get.mockResolvedValue({
        data: { id: '123', name: 'John Doe', email: 'john@example.com' }
      });

      render(<UserProfile userId="123" axiosInstance={mockApi} />);

      await waitFor(() => {
        expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      });

      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });

  describe('addAuthInterceptor', () => {
    let mockInstance;

    beforeEach(() => {
      mockInstance = {
        interceptors: {
          request: {
            use: vi.fn((onFulfilled) => {
              mockInstance._requestInterceptor = onFulfilled;
              return 1;
            })
          }
        }
      };
      localStorage.clear();
    });

    afterEach(() => {
      localStorage.clear();
    });

    it('should return interceptor ID', () => {
      const id = addAuthInterceptor(mockInstance);
      expect(typeof id).toBe('number');
    });

    it('should add Authorization header when token exists', () => {
      localStorage.setItem('authToken', 'test-token-123');
      addAuthInterceptor(mockInstance);

      const config = { headers: {} };
      const result = mockInstance._requestInterceptor(config);

      expect(result.headers.Authorization).toBe('Bearer test-token-123');
    });

    it('should not add Authorization header when token is missing', () => {
      addAuthInterceptor(mockInstance);

      const config = { headers: {} };
      const result = mockInstance._requestInterceptor(config);

      expect(result.headers.Authorization).toBeUndefined();
    });

    it('should return modified config', () => {
      localStorage.setItem('authToken', 'test-token');
      addAuthInterceptor(mockInstance);

      const config = { headers: {}, url: '/test' };
      const result = mockInstance._requestInterceptor(config);

      expect(result).toBeDefined();
      expect(result.url).toBe('/test');
    });
  });

  describe('addErrorInterceptor', () => {
    let mockInstance;
    let onUnauthorized;
    let onNetworkError;

    beforeEach(() => {
      onUnauthorized = vi.fn();
      onNetworkError = vi.fn();
      mockInstance = {
        interceptors: {
          response: {
            use: vi.fn((onFulfilled, onRejected) => {
              mockInstance._responseOnFulfilled = onFulfilled;
              mockInstance._responseOnRejected = onRejected;
              return 1;
            })
          }
        }
      };
    });

    it('should return interceptor ID', () => {
      const id = addErrorInterceptor(
        mockInstance,
        onUnauthorized,
        onNetworkError
      );
      expect(typeof id).toBe('number');
    });

    it('should pass through successful responses', () => {
      addErrorInterceptor(mockInstance, onUnauthorized, onNetworkError);

      const response = { status: 200, data: {} };
      const result = mockInstance._responseOnFulfilled(response);

      expect(result).toBe(response);
    });

    it('should call onUnauthorized for 401 errors', async () => {
      addErrorInterceptor(mockInstance, onUnauthorized, onNetworkError);

      const error = { response: { status: 401 } };

      try {
        await mockInstance._responseOnRejected(error);
      } catch (e) {
        expect(onUnauthorized).toHaveBeenCalled();
      }
    });

    it('should call onNetworkError when no response', async () => {
      addErrorInterceptor(mockInstance, onUnauthorized, onNetworkError);

      const error = { request: {}, message: 'Network Error' };

      try {
        await mockInstance._responseOnRejected(error);
      } catch (e) {
        expect(onNetworkError).toHaveBeenCalled();
      }
    });

    it('should not call onUnauthorized for other status codes', async () => {
      addErrorInterceptor(mockInstance, onUnauthorized, onNetworkError);

      const error = { response: { status: 404 } };

      try {
        await mockInstance._responseOnRejected(error);
      } catch (e) {
        expect(onUnauthorized).not.toHaveBeenCalled();
      }
    });

    it('should return rejected promise with error', async () => {
      addErrorInterceptor(mockInstance, onUnauthorized, onNetworkError);

      const error = { response: { status: 500 } };

      await expect(mockInstance._responseOnRejected(error)).rejects.toBe(error);
    });
  });
});

// ============================================================================
// Exercise 2: TanStack Query Tests
// ============================================================================

describe('Exercise 2: TanStack Query - Data Fetching', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });
  });

  afterEach(() => {
    queryClient.clear();
  });

  describe('PostsList', () => {
    it('should show loading state initially', () => {
      const api = { get: vi.fn(() => new Promise(() => {})) };

      render(
        <QueryClientProvider client={queryClient}>
          <PostsList api={api} />
        </QueryClientProvider>
      );

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should fetch posts from /posts endpoint', async () => {
      const api = {
        get: vi.fn().mockResolvedValue({
          data: [{ id: 1, title: 'Post 1' }]
        })
      };

      render(
        <QueryClientProvider client={queryClient}>
          <PostsList api={api} />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(api.get).toHaveBeenCalledWith('/posts');
      });
    });

    it('should display list of post titles', async () => {
      const api = {
        get: vi.fn().mockResolvedValue({
          data: [
            { id: 1, title: 'First Post' },
            { id: 2, title: 'Second Post' }
          ]
        })
      };

      render(
        <QueryClientProvider client={queryClient}>
          <PostsList api={api} />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('First Post')).toBeInTheDocument();
        expect(screen.getByText('Second Post')).toBeInTheDocument();
      });
    });

    it('should show error message when fetch fails', async () => {
      const api = {
        get: vi.fn().mockRejectedValue(new Error('Fetch failed'))
      };

      render(
        <QueryClientProvider client={queryClient}>
          <PostsList api={api} />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });

    it('should use queryKey ["posts"]', async () => {
      const api = {
        get: vi.fn().mockResolvedValue({ data: [] })
      };

      render(
        <QueryClientProvider client={queryClient}>
          <PostsList api={api} />
        </QueryClientProvider>
      );

      await waitFor(() => {
        const cache = queryClient.getQueryCache();
        const query = cache.find({ queryKey: ['posts'] });
        expect(query).toBeDefined();
      });
    });
  });

  describe('PostDetail', () => {
    it('should show "Select a post" when postId is null', () => {
      const api = { get: vi.fn() };

      render(
        <QueryClientProvider client={queryClient}>
          <PostDetail postId={null} api={api} />
        </QueryClientProvider>
      );

      expect(screen.getByText(/select a post/i)).toBeInTheDocument();
    });

    it('should not fetch when postId is null', async () => {
      const api = { get: vi.fn() };

      render(
        <QueryClientProvider client={queryClient}>
          <PostDetail postId={null} api={api} />
        </QueryClientProvider>
      );

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(api.get).not.toHaveBeenCalled();
    });

    it('should fetch when postId is provided', async () => {
      const api = {
        get: vi.fn().mockResolvedValue({
          data: { id: 5, title: 'Post 5', body: 'Content' }
        })
      };

      render(
        <QueryClientProvider client={queryClient}>
          <PostDetail postId={5} api={api} />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(api.get).toHaveBeenCalledWith('/posts/5');
      });
    });

    it('should display post title and body', async () => {
      const api = {
        get: vi.fn().mockResolvedValue({
          data: { id: 5, title: 'Amazing Post', body: 'Great content here' }
        })
      };

      render(
        <QueryClientProvider client={queryClient}>
          <PostDetail postId={5} api={api} />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Amazing Post')).toBeInTheDocument();
        expect(screen.getByText('Great content here')).toBeInTheDocument();
      });
    });

    it('should show loading state while fetching', () => {
      const api = {
        get: vi.fn(() => new Promise(() => {}))
      };

      render(
        <QueryClientProvider client={queryClient}>
          <PostDetail postId={5} api={api} />
        </QueryClientProvider>
      );

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  describe('CreatePost', () => {
    it('should render title and body input fields', () => {
      const api = { post: vi.fn() };

      render(
        <QueryClientProvider client={queryClient}>
          <CreatePost api={api} queryClient={queryClient} />
        </QueryClientProvider>
      );

      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/body/i)).toBeInTheDocument();
    });

    it('should render submit button', () => {
      const api = { post: vi.fn() };

      render(
        <QueryClientProvider client={queryClient}>
          <CreatePost api={api} queryClient={queryClient} />
        </QueryClientProvider>
      );

      expect(
        screen.getByRole('button', { name: /submit|create/i })
      ).toBeInTheDocument();
    });

    it('should call api.post with form data on submit', async () => {
      const api = {
        post: vi.fn().mockResolvedValue({ data: { id: 1 } })
      };
      const user = userEvent.setup();

      render(
        <QueryClientProvider client={queryClient}>
          <CreatePost api={api} queryClient={queryClient} />
        </QueryClientProvider>
      );

      await user.type(screen.getByLabelText(/title/i), 'New Post');
      await user.type(screen.getByLabelText(/body/i), 'Post content');
      await user.click(screen.getByRole('button', { name: /submit|create/i }));

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/posts', {
          title: 'New Post',
          body: 'Post content'
        });
      });
    });

    it('should show loading state while mutation is pending', async () => {
      const api = {
        post: vi.fn(() => new Promise(() => {}))
      };
      const user = userEvent.setup();

      render(
        <QueryClientProvider client={queryClient}>
          <CreatePost api={api} queryClient={queryClient} />
        </QueryClientProvider>
      );

      await user.type(screen.getByLabelText(/title/i), 'New Post');
      await user.click(screen.getByRole('button', { name: /submit|create/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/loading|creating|submitting/i)
        ).toBeInTheDocument();
      });
    });

    it('should clear form after successful submission', async () => {
      const api = {
        post: vi.fn().mockResolvedValue({ data: { id: 1 } })
      };
      const user = userEvent.setup();

      render(
        <QueryClientProvider client={queryClient}>
          <CreatePost api={api} queryClient={queryClient} />
        </QueryClientProvider>
      );

      const titleInput = screen.getByLabelText(/title/i);
      const bodyInput = screen.getByLabelText(/body/i);

      await user.type(titleInput, 'New Post');
      await user.type(bodyInput, 'Content');
      await user.click(screen.getByRole('button', { name: /submit|create/i }));

      await waitFor(() => {
        expect(titleInput).toHaveValue('');
        expect(bodyInput).toHaveValue('');
      });
    });

    it('should show error message if mutation fails', async () => {
      const api = {
        post: vi.fn().mockRejectedValue(new Error('Failed to create'))
      };
      const user = userEvent.setup();

      render(
        <QueryClientProvider client={queryClient}>
          <CreatePost api={api} queryClient={queryClient} />
        </QueryClientProvider>
      );

      await user.type(screen.getByLabelText(/title/i), 'New Post');
      await user.click(screen.getByRole('button', { name: /submit|create/i }));

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });

    it('should invalidate posts query on success', async () => {
      const api = {
        post: vi.fn().mockResolvedValue({ data: { id: 1 } })
      };
      const user = userEvent.setup();

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      render(
        <QueryClientProvider client={queryClient}>
          <CreatePost api={api} queryClient={queryClient} />
        </QueryClientProvider>
      );

      await user.type(screen.getByLabelText(/title/i), 'New Post');
      await user.click(screen.getByRole('button', { name: /submit|create/i }));

      await waitFor(() => {
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['posts'] });
      });
    });
  });

  describe('OptimisticTodoList', () => {
    it('should render todos list', async () => {
      const api = {
        get: vi.fn().mockResolvedValue({
          data: [
            { id: 1, text: 'Todo 1', completed: false },
            { id: 2, text: 'Todo 2', completed: true }
          ]
        }),
        post: vi.fn()
      };

      render(
        <QueryClientProvider client={queryClient}>
          <OptimisticTodoList api={api} queryClient={queryClient} />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Todo 1')).toBeInTheDocument();
        expect(screen.getByText('Todo 2')).toBeInTheDocument();
      });
    });

    it('should show new todo optimistically before server response', async () => {
      const api = {
        get: vi.fn().mockResolvedValue({ data: [] }),
        post: vi.fn(
          () =>
            new Promise((resolve) =>
              setTimeout(
                () => resolve({ data: { id: 1, text: 'New Todo' } }),
                1000
              )
            )
        )
      };
      const user = userEvent.setup();

      render(
        <QueryClientProvider client={queryClient}>
          <OptimisticTodoList api={api} queryClient={queryClient} />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });

      const input = screen.getByLabelText(/add todo/i);
      await user.type(input, 'New Todo');
      await user.click(screen.getByRole('button', { name: /add/i }));

      // Should appear immediately (optimistic)
      expect(screen.getByText('New Todo')).toBeInTheDocument();
    });

    it('should rollback on error', async () => {
      const api = {
        get: vi.fn().mockResolvedValue({
          data: [{ id: 1, text: 'Existing Todo', completed: false }]
        }),
        post: vi.fn().mockRejectedValue(new Error('Failed'))
      };
      const user = userEvent.setup();

      render(
        <QueryClientProvider client={queryClient}>
          <OptimisticTodoList api={api} queryClient={queryClient} />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Existing Todo')).toBeInTheDocument();
      });

      const input = screen.getByLabelText(/add todo/i);
      await user.type(input, 'Failed Todo');
      await user.click(screen.getByRole('button', { name: /add/i }));

      // Should be removed after error
      await waitFor(() => {
        expect(screen.queryByText('Failed Todo')).not.toBeInTheDocument();
      });

      // Original todo should still be there
      expect(screen.getByText('Existing Todo')).toBeInTheDocument();
    });

    it('should refetch todos after mutation settles', async () => {
      const api = {
        get: vi
          .fn()
          .mockResolvedValueOnce({ data: [] })
          .mockResolvedValueOnce({ data: [{ id: 1, text: 'Server Todo' }] }),
        post: vi.fn().mockResolvedValue({ data: { id: 1 } })
      };
      const user = userEvent.setup();

      render(
        <QueryClientProvider client={queryClient}>
          <OptimisticTodoList api={api} queryClient={queryClient} />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(api.get).toHaveBeenCalledTimes(1);
      });

      const input = screen.getByLabelText(/add todo/i);
      await user.type(input, 'New Todo');
      await user.click(screen.getByRole('button', { name: /add/i }));

      await waitFor(() => {
        expect(api.get).toHaveBeenCalledTimes(2);
      });
    });
  });
});

// ============================================================================
// Exercise 3: Redux Tests
// ============================================================================

describe('Exercise 3: Redux - State Management', () => {
  describe('counterReducer', () => {
    it('should return initial state', () => {
      const state = counterReducer(undefined, { type: '@@INIT' });
      expect(state).toEqual({ value: 0 });
    });

    it('should handle increment', () => {
      const state = counterReducer({ value: 5 }, { type: 'increment' });
      expect(state).toEqual({ value: 6 });
    });

    it('should handle decrement', () => {
      const state = counterReducer({ value: 5 }, { type: 'decrement' });
      expect(state).toEqual({ value: 4 });
    });

    it('should handle incrementByAmount', () => {
      const state = counterReducer(
        { value: 5 },
        { type: 'incrementByAmount', payload: 10 }
      );
      expect(state).toEqual({ value: 15 });
    });

    it('should not mutate original state', () => {
      const original = { value: 5 };
      counterReducer(original, { type: 'increment' });
      expect(original).toEqual({ value: 5 });
    });

    it('should return current state for unknown actions', () => {
      const state = counterReducer({ value: 5 }, { type: 'UNKNOWN' });
      expect(state).toEqual({ value: 5 });
    });
  });

  describe('ReduxCounter', () => {
    it('should display current count', () => {
      const store = createStore(counterReducer, { value: 42 });

      render(
        <Provider store={store}>
          <ReduxCounter />
        </Provider>
      );

      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('should increment count when + button is clicked', async () => {
      const store = createStore(counterReducer);
      const user = userEvent.setup();

      render(
        <Provider store={store}>
          <ReduxCounter />
        </Provider>
      );

      const incrementButton = screen.getByRole('button', {
        name: /increment|\+/i
      });
      await user.click(incrementButton);

      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should decrement count when - button is clicked', async () => {
      const store = createStore(counterReducer, { value: 5 });
      const user = userEvent.setup();

      render(
        <Provider store={store}>
          <ReduxCounter />
        </Provider>
      );

      const decrementButton = screen.getByRole('button', {
        name: /decrement|-/i
      });
      await user.click(decrementButton);

      expect(screen.getByText('4')).toBeInTheDocument();
    });

    it('should handle multiple increments', async () => {
      const store = createStore(counterReducer);
      const user = userEvent.setup();

      render(
        <Provider store={store}>
          <ReduxCounter />
        </Provider>
      );

      const incrementButton = screen.getByRole('button', {
        name: /increment|\+/i
      });
      await user.click(incrementButton);
      await user.click(incrementButton);
      await user.click(incrementButton);

      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  describe('counterActions', () => {
    it('should create increment action', () => {
      expect(counterActions.increment()).toEqual({ type: 'increment' });
    });

    it('should create decrement action', () => {
      expect(counterActions.decrement()).toEqual({ type: 'decrement' });
    });

    it('should create incrementByAmount action with payload', () => {
      expect(counterActions.incrementByAmount(5)).toEqual({
        type: 'incrementByAmount',
        payload: 5
      });
    });
  });

  describe('todosReducer', () => {
    it('should return initial state', () => {
      const state = todosReducer(undefined, { type: '@@INIT' });
      expect(state).toEqual([]);
    });

    it('should handle todos/todoAdded', () => {
      const state = todosReducer([], {
        type: 'todos/todoAdded',
        payload: 'Learn Redux'
      });

      expect(state).toHaveLength(1);
      expect(state[0]).toMatchObject({
        text: 'Learn Redux',
        completed: false
      });
      expect(state[0].id).toBeDefined();
    });

    it('should handle todos/todoToggled', () => {
      const initial = [
        { id: 1, text: 'Todo 1', completed: false },
        { id: 2, text: 'Todo 2', completed: false }
      ];

      const state = todosReducer(initial, {
        type: 'todos/todoToggled',
        id: 1
      });

      expect(state[0].completed).toBe(true);
      expect(state[1].completed).toBe(false);
    });

    it('should handle todos/todoDeleted', () => {
      const initial = [
        { id: 1, text: 'Todo 1', completed: false },
        { id: 2, text: 'Todo 2', completed: false }
      ];

      const state = todosReducer(initial, {
        type: 'todos/todoDeleted',
        id: 1
      });

      expect(state).toHaveLength(1);
      expect(state[0].id).toBe(2);
    });

    it('should not mutate original state', () => {
      const original = [{ id: 1, text: 'Todo', completed: false }];
      todosReducer(original, { type: 'todos/todoAdded', payload: 'New' });
      expect(original).toHaveLength(1);
    });

    it('should add multiple todos', () => {
      let state = [];
      state = todosReducer(state, {
        type: 'todos/todoAdded',
        payload: 'First'
      });
      state = todosReducer(state, {
        type: 'todos/todoAdded',
        payload: 'Second'
      });
      state = todosReducer(state, {
        type: 'todos/todoAdded',
        payload: 'Third'
      });

      expect(state).toHaveLength(3);
    });

    it('should toggle same todo multiple times', () => {
      let state = [{ id: 1, text: 'Todo', completed: false }];
      state = todosReducer(state, { type: 'todos/todoToggled', id: 1 });
      expect(state[0].completed).toBe(true);

      state = todosReducer(state, { type: 'todos/todoToggled', id: 1 });
      expect(state[0].completed).toBe(false);
    });
  });
});

// ============================================================================
// Exercise 4: Zustand Tests
// ============================================================================

describe('Exercise 4: Zustand - Lightweight State Management', () => {
  describe('createCounterStore', () => {
    it('should create store with initial count of 0', () => {
      const useStore = createCounterStore();
      const { result } = renderHook(() => useStore());
      expect(result.current.count).toBe(0);
    });

    it('should increment count', () => {
      const useStore = createCounterStore();
      const { result } = renderHook(() => useStore());

      act(() => {
        result.current.increment();
      });

      expect(result.current.count).toBe(1);
    });

    it('should decrement count', () => {
      const useStore = createCounterStore();
      const { result } = renderHook(() => useStore());

      act(() => {
        result.current.increment();
        result.current.increment();
        result.current.decrement();
      });

      expect(result.current.count).toBe(1);
    });

    it('should reset count to 0', () => {
      const useStore = createCounterStore();
      const { result } = renderHook(() => useStore());

      act(() => {
        result.current.increment();
        result.current.increment();
        result.current.increment();
        result.current.reset();
      });

      expect(result.current.count).toBe(0);
    });

    it('should handle multiple increments', () => {
      const useStore = createCounterStore();
      const { result } = renderHook(() => useStore());

      act(() => {
        result.current.increment();
        result.current.increment();
        result.current.increment();
      });

      expect(result.current.count).toBe(3);
    });
  });

  describe('createUsersStore', () => {
    it('should initialize with empty users array', () => {
      const useStore = createUsersStore();
      const { result } = renderHook(() => useStore());
      expect(result.current.users).toEqual([]);
    });

    it('should initialize with loading false', () => {
      const useStore = createUsersStore();
      const { result } = renderHook(() => useStore());
      expect(result.current.loading).toBe(false);
    });

    it('should set users array', () => {
      const useStore = createUsersStore();
      const { result } = renderHook(() => useStore());

      const users = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ];
      act(() => {
        result.current.setUsers(users);
      });

      expect(result.current.users).toEqual(users);
    });

    it('should set loading state', () => {
      const useStore = createUsersStore();
      const { result } = renderHook(() => useStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.loading).toBe(true);
    });

    it('should add user to array', () => {
      const useStore = createUsersStore();
      const { result } = renderHook(() => useStore());

      act(() => {
        result.current.addUser({ id: 1, name: 'Alice' });
      });

      expect(result.current.users).toHaveLength(1);
      expect(result.current.users[0]).toEqual({ id: 1, name: 'Alice' });
    });

    it('should have selectUserCount selector', () => {
      const useStore = createUsersStore();
      const { result } = renderHook(() => useStore());

      act(() => {
        result.current.addUser({ id: 1, name: 'Alice' });
        result.current.addUser({ id: 2, name: 'Bob' });
      });

      expect(result.current.selectUserCount()).toBe(2);
    });

    it('should have selectIsEmpty selector', () => {
      const useStore = createUsersStore();
      const { result } = renderHook(() => useStore());

      expect(result.current.selectIsEmpty()).toBe(true);

      act(() => {
        result.current.addUser({ id: 1, name: 'Alice' });
      });

      expect(result.current.selectIsEmpty()).toBe(false);
    });
  });

  describe('createThemeStore', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    afterEach(() => {
      localStorage.clear();
    });

    it('should initialize with light theme', () => {
      const useStore = createThemeStore();
      const { result } = renderHook(() => useStore());
      expect(result.current.theme).toBe('light');
    });

    it('should set theme', () => {
      const useStore = createThemeStore();
      const { result } = renderHook(() => useStore());

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.theme).toBe('dark');
    });

    it('should toggle theme from light to dark', () => {
      const useStore = createThemeStore();
      const { result } = renderHook(() => useStore());

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('dark');
    });

    it('should toggle theme from dark to light', () => {
      const useStore = createThemeStore();
      const { result } = renderHook(() => useStore());

      act(() => {
        result.current.setTheme('dark');
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('light');
    });

    it('should persist theme to localStorage', () => {
      const useStore = createThemeStore();
      const { result } = renderHook(() => useStore());

      act(() => {
        result.current.setTheme('dark');
      });

      const stored = localStorage.getItem('theme-storage');
      expect(stored).toBeDefined();
      expect(JSON.parse(stored).state.theme).toBe('dark');
    });

    it('should restore theme from localStorage', () => {
      // First store - set dark theme
      const useStore1 = createThemeStore();
      const { result: result1 } = renderHook(() => useStore1());

      act(() => {
        result1.current.setTheme('dark');
      });

      // Second store - should restore dark theme
      const useStore2 = createThemeStore();
      const { result: result2 } = renderHook(() => useStore2());

      expect(result2.current.theme).toBe('dark');
    });
  });

  describe('ZustandCounter', () => {
    it('should display current count', () => {
      const useCounterStore = createCounterStore();
      render(<ZustandCounter useCounterStore={useCounterStore} />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should increment when increment button is clicked', async () => {
      const useCounterStore = createCounterStore();
      const user = userEvent.setup();

      render(<ZustandCounter useCounterStore={useCounterStore} />);

      const incrementButton = screen.getByRole('button', {
        name: /increment|\+/i
      });
      await user.click(incrementButton);

      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should decrement when decrement button is clicked', async () => {
      const useCounterStore = createCounterStore();
      const user = userEvent.setup();

      render(<ZustandCounter useCounterStore={useCounterStore} />);

      const incrementButton = screen.getByRole('button', {
        name: /increment|\+/i
      });
      const decrementButton = screen.getByRole('button', {
        name: /decrement|-/i
      });

      await user.click(incrementButton);
      await user.click(incrementButton);
      await user.click(decrementButton);

      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should reset when reset button is clicked', async () => {
      const useCounterStore = createCounterStore();
      const user = userEvent.setup();

      render(<ZustandCounter useCounterStore={useCounterStore} />);

      const incrementButton = screen.getByRole('button', {
        name: /increment|\+/i
      });
      const resetButton = screen.getByRole('button', { name: /reset/i });

      await user.click(incrementButton);
      await user.click(incrementButton);
      await user.click(resetButton);

      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('createAsyncStore', () => {
    it('should initialize with null data', () => {
      const useStore = createAsyncStore();
      const { result } = renderHook(() => useStore());
      expect(result.current.data).toBeNull();
    });

    it('should initialize with loading false', () => {
      const useStore = createAsyncStore();
      const { result } = renderHook(() => useStore());
      expect(result.current.loading).toBe(false);
    });

    it('should initialize with null error', () => {
      const useStore = createAsyncStore();
      const { result } = renderHook(() => useStore());
      expect(result.current.error).toBeNull();
    });

    it('should set loading to true when fetching', async () => {
      const useStore = createAsyncStore();
      const { result } = renderHook(() => useStore());

      const api = {
        get: vi.fn(() => new Promise(() => {}))
      };

      act(() => {
        result.current.fetchData(api, '/test');
      });

      expect(result.current.loading).toBe(true);
    });

    it('should set data on successful fetch', async () => {
      const useStore = createAsyncStore();
      const { result } = renderHook(() => useStore());

      const api = {
        get: vi.fn().mockResolvedValue({ data: { id: 1, name: 'Test' } })
      };

      await act(async () => {
        await result.current.fetchData(api, '/test');
      });

      expect(result.current.data).toEqual({ id: 1, name: 'Test' });
    });

    it('should set loading to false after successful fetch', async () => {
      const useStore = createAsyncStore();
      const { result } = renderHook(() => useStore());

      const api = {
        get: vi.fn().mockResolvedValue({ data: {} })
      };

      await act(async () => {
        await result.current.fetchData(api, '/test');
      });

      expect(result.current.loading).toBe(false);
    });

    it('should set error on failed fetch', async () => {
      const useStore = createAsyncStore();
      const { result } = renderHook(() => useStore());

      const error = new Error('Fetch failed');
      const api = {
        get: vi.fn().mockRejectedValue(error)
      };

      await act(async () => {
        await result.current.fetchData(api, '/test');
      });

      expect(result.current.error).toStrictEqual(error);
    });

    it('should set loading to false after failed fetch', async () => {
      const useStore = createAsyncStore();
      const { result } = renderHook(() => useStore());

      const api = {
        get: vi.fn().mockRejectedValue(new Error('Failed'))
      };

      await act(async () => {
        await result.current.fetchData(api, '/test');
      });

      expect(result.current.loading).toBe(false);
    });

    it('should clear error before new fetch', async () => {
      const useStore = createAsyncStore();
      const { result } = renderHook(() => useStore());

      const api1 = {
        get: vi.fn().mockRejectedValue(new Error('First error'))
      };

      await act(async () => {
        await result.current.fetchData(api1, '/test');
      });

      expect(result.current.error).toBeDefined();

      const api2 = {
        get: vi.fn().mockResolvedValue({ data: {} })
      };

      await act(async () => {
        await result.current.fetchData(api2, '/test');
      });

      expect(result.current.error).toBeNull();
    });
  });
});

// Helper for renderHook (simple implementation)
function renderHook(callback) {
  let result = { current: null };

  function TestComponent() {
    result.current = callback();
    return null;
  }

  const { rerender, unmount } = render(<TestComponent />);

  return {
    result,
    rerender: () => rerender(<TestComponent />),
    unmount
  };
}
