/**
 * Tests for React Libraries Exercises
 *
 * This test suite validates implementations for:
 * - Axios HTTP client
 * - TanStack Query (React Query)
 * - Redux state management
 * - Zustand state management
 */

import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { legacy_createStore as createStore } from 'redux';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

import {
  createAxiosInstance,
  UserProfile,
  addAuthInterceptor,
  addErrorInterceptor,
  PostsList,
  PostDetail,
  CreatePost,
  OptimisticTodoList,
  ReduxCounter,
  TodoState,
  createCounterStore,
  createUsersStore,
  createThemeStore,
  ZustandCounter,
  createAsyncStore
} from '../exercises/react-libraries';
import counterReducer, * as counterActions from '../exercises/react-libraries';
import todosReducer, * as todosActions from '../exercises/react-libraries';

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
    let mockApi: Partial<AxiosInstance> & { get: Mock };

    beforeEach(() => {
      mockApi = {
        get: vi.fn()
      };
    });

    it('should show loading state initially', () => {
      mockApi.get!.mockReturnValue(new Promise(() => {})); // Never resolves
      render(
        <UserProfile
          userId="123"
          axiosInstance={mockApi as unknown as AxiosInstance}
        />
      );
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should fetch user data on mount', async () => {
      mockApi.get!.mockResolvedValue({
        data: { id: '123', name: 'John Doe', email: 'john@example.com' }
      });

      render(
        <UserProfile
          userId="123"
          axiosInstance={mockApi as unknown as AxiosInstance}
        />
      );

      await waitFor(() => {
        expect(mockApi.get).toHaveBeenCalledWith('/users/123');
      });
    });

    it('should display user name when loaded', async () => {
      mockApi.get!.mockResolvedValue({
        data: { id: '123', name: 'John Doe', email: 'john@example.com' }
      });

      render(
        <UserProfile
          userId="123"
          axiosInstance={mockApi as unknown as AxiosInstance}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/john doe/i)).toBeInTheDocument();
      });
    });

    it('should display user email when loaded', async () => {
      mockApi.get!.mockResolvedValue({
        data: { id: '123', name: 'John Doe', email: 'john@example.com' }
      });

      render(
        <UserProfile
          userId="123"
          axiosInstance={mockApi as unknown as AxiosInstance}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
      });
    });

    it('should show error message when fetch fails', async () => {
      mockApi.get!.mockRejectedValue(new Error('Network error'));

      render(
        <UserProfile
          userId="123"
          axiosInstance={mockApi as unknown as AxiosInstance}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });

    it('should not show loading state after data is loaded', async () => {
      mockApi.get!.mockResolvedValue({
        data: { id: '123', name: 'John Doe', email: 'john@example.com' }
      });

      render(
        <UserProfile
          userId="123"
          axiosInstance={mockApi as unknown as AxiosInstance}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      });

      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });

  describe('addAuthInterceptor', () => {
    let interceptorFn:
      | ((config: AxiosRequestConfig) => AxiosRequestConfig)
      | undefined;
    const mockInstance = {
      interceptors: {
        request: {
          use: vi.fn((fn) => {
            interceptorFn = fn;
            return 1;
          }),
          eject: vi.fn(),
          clear: vi.fn()
        },
        response: {
          use: vi.fn(),
          eject: vi.fn(),
          clear: vi.fn()
        }
      }
    } as unknown as AxiosInstance;

    beforeEach(() => {
      interceptorFn = undefined;
      localStorage.clear();
    });

    it('returns an interceptor ID', () => {
      const id = addAuthInterceptor(mockInstance);
      expect(id).toBe(1);
      expect(typeof id).toBe('number');
    });

    it('adds Authorization header when token exists', () => {
      localStorage.setItem('authToken', 'token-abc');
      addAuthInterceptor(mockInstance);
      expect(interceptorFn).toBeDefined();
      const config = { headers: {} };
      const result = interceptorFn!(config);
      expect(result.headers?.Authorization).toBe('Bearer token-abc');
    });

    it('does not add Authorization header when token is missing', () => {
      addAuthInterceptor(mockInstance);
      expect(interceptorFn).toBeDefined();
      const config = { headers: {} };
      const result = interceptorFn!(config);
      expect(result.headers?.Authorization).toBeUndefined();
    });

    it('returns modified config', () => {
      localStorage.setItem('authToken', 'token-xyz');
      addAuthInterceptor(mockInstance);
      expect(interceptorFn).toBeDefined();
      const config = { headers: {}, url: '/foo' };
      const result = interceptorFn!(config);
      expect(result).toBeDefined();
      expect(result.url).toBe('/foo');
    });
  });

  describe('addErrorInterceptor', () => {
    let onUnauthorized: () => void;
    let onNetworkError: () => void;
    let fulfilledFn: ((response: any) => any) | undefined;
    let rejectedFn: ((error: any) => Promise<any>) | undefined;
    const mockInstance = {
      interceptors: {
        response: {
          use: vi.fn((onFulfilled, onRejected) => {
            fulfilledFn = onFulfilled;
            rejectedFn = onRejected;
            return 1;
          })
        }
      }
    } as unknown as AxiosInstance;

    beforeEach(() => {
      onUnauthorized = vi.fn();
      onNetworkError = vi.fn();
      fulfilledFn = undefined;
      rejectedFn = undefined;
    });

    it('returns interceptor ID', () => {
      const id = addErrorInterceptor(
        mockInstance,
        onUnauthorized,
        onNetworkError
      );
      expect(id).toBe(1);
      expect(typeof id).toBe('number');
    });

    it('passes through successful responses', () => {
      addErrorInterceptor(mockInstance, onUnauthorized, onNetworkError);
      expect(fulfilledFn).toBeDefined();
      const response = { status: 200, data: {} };
      const result = fulfilledFn!(response);
      expect(result).toBe(response);
    });

    it('calls onUnauthorized for 401 errors', async () => {
      addErrorInterceptor(mockInstance, onUnauthorized, onNetworkError);
      expect(rejectedFn).toBeDefined();
      const error = { response: { status: 401 } };
      await expect(rejectedFn!(error)).rejects.toBe(error);
      expect(onUnauthorized).toHaveBeenCalled();
    });

    it('calls onNetworkError when no response', async () => {
      addErrorInterceptor(mockInstance, onUnauthorized, onNetworkError);
      expect(rejectedFn).toBeDefined();
      const error = { request: {}, message: 'Network Error' };
      await expect(rejectedFn!(error)).rejects.toBe(error);
      expect(onNetworkError).toHaveBeenCalled();
    });

    it('does not call onUnauthorized for other status codes', async () => {
      addErrorInterceptor(mockInstance, onUnauthorized, onNetworkError);
      expect(rejectedFn).toBeDefined();
      const error = { response: { status: 404 } };
      await expect(rejectedFn!(error)).rejects.toBe(error);
      expect(onUnauthorized).not.toHaveBeenCalled();
    });

    it('returns rejected promise with error', async () => {
      addErrorInterceptor(mockInstance, onUnauthorized, onNetworkError);
      expect(rejectedFn).toBeDefined();
      const error = { response: { status: 500 } };
      await expect(rejectedFn!(error)).rejects.toBe(error);
    });
  });
});

// ============================================================================
// Exercise 2: TanStack Query Tests
// ============================================================================

describe('Exercise 2: TanStack Query - Data Fetching', () => {
  let queryClient: QueryClient;

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
      // Return a promise that never resolves, but with correct AxiosResponse type
      const api = {
        get: vi.fn(
          () => new Promise<import('axios').AxiosResponse<any>>(() => {})
        )
      };
      render(
        <QueryClientProvider client={queryClient}>
          <PostsList api={api} />
        </QueryClientProvider>
      );
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should fetch posts from /posts endpoint', async () => {
      const api = {
        get: vi.fn().mockResolvedValue({ data: [{ id: 1, title: 'Post 1' }] })
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
      const api = { get: vi.fn().mockRejectedValue(new Error('Fetch failed')) };
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
      const api = { get: vi.fn().mockResolvedValue({ data: [] }) };
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
          <PostDetail api={api} />
        </QueryClientProvider>
      );

      expect(screen.getByText(/select a post/i)).toBeInTheDocument();
    });

    it('should not fetch when postId is null', async () => {
      const api = { get: vi.fn() };

      render(
        <QueryClientProvider client={queryClient}>
          <PostDetail api={api} />
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
      // Return a promise that never resolves, but with correct AxiosResponse<PostDetailType> type
      const api = {
        get: vi.fn(
          () =>
            new Promise<
              import('axios').AxiosResponse<{
                id: number;
                title: string;
                body: string;
              }>
            >(() => {})
        )
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
        post: vi.fn(
          () =>
            new Promise<
              import('axios').AxiosResponse<{
                id: number;
                title: string;
                body: string;
              }>
            >(() => {})
        )
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
            new Promise<
              import('axios').AxiosResponse<{ id: number; text: string }>
            >((resolve) =>
              setTimeout(
                () =>
                  resolve({
                    data: { id: 1, text: 'New Todo' },
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config: {}
                  }),
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
      expect(counterActions.increment()).toEqual({ type: 'counter/increment' });
      const state = counterReducer({ value: 5 }, counterActions.increment());
      expect(state).toEqual({ value: 6 });
    });

    it('should handle decrement', () => {
      expect(counterActions.decrement()).toEqual({ type: 'counter/decrement' });
      const state = counterReducer({ value: 5 }, counterActions.decrement());
      expect(state).toEqual({ value: 4 });
    });

    it('should handle incrementByAmount', () => {
      const state = counterReducer(
        { value: 5 },
        counterActions.incrementByAmount(10)
      );
      expect(state).toEqual({ value: 15 });
    });

    it('should not mutate original state', () => {
      const original = { value: 5 };
      counterReducer(original, counterActions.increment());
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
      expect(counterActions.increment()).toEqual({ type: 'counter/increment' });
    });

    it('should create decrement action', () => {
      expect(counterActions.decrement()).toEqual({ type: 'counter/decrement' });
    });

    it('should create incrementByAmount action with payload', () => {
      expect(counterActions.incrementByAmount(5)).toEqual({
        type: 'counter/incrementByAmount',
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
      const state = todosReducer([], todosActions.todoAdded('Learn Redux'));

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

      const state = todosReducer(initial, todosActions.todoToggled(1));

      expect(state[0].completed).toBe(true);
      expect(state[1].completed).toBe(false);
    });

    it('should handle todos/todoDeleted', () => {
      const initial = [
        { id: 1, text: 'Todo 1', completed: false },
        { id: 2, text: 'Todo 2', completed: false }
      ];

      const state = todosReducer(initial, todosActions.todoDeleted(1));

      expect(state).toHaveLength(1);
      expect(state[0].id).toBe(2);
    });

    it('should not mutate original state', () => {
      const original = [{ id: 1, text: 'Todo', completed: false }];
      todosReducer(original, todosActions.todoAdded('New'));
      expect(original).toHaveLength(1);
    });

    it('should add multiple todos', () => {
      let state: TodoState[] = [];
      state = todosReducer(state, todosActions.todoAdded('First'));
      state = todosReducer(state, todosActions.todoAdded('Second'));
      state = todosReducer(state, todosActions.todoAdded('Third'));

      expect(state).toHaveLength(3);
    });

    it('should toggle same todo multiple times', () => {
      let state = [{ id: 1, text: 'Todo', completed: false }];
      state = todosReducer(state, todosActions.todoToggled(1));
      expect(state[0].completed).toBe(true);

      state = todosReducer(state, todosActions.todoToggled(1));
      expect(state[0].completed).toBe(false);
    });
  });
});

// ============================================================================
// Exercise 4: Zustand Tests
// ============================================================================

describe('Exercise 4: Zustand - Lightweight State Management', () => {
  describe('createCounterStore', () => {
    let useStore: ReturnType<typeof createCounterStore>;

    beforeEach(() => {
      useStore = createCounterStore();
      act(() => {
        useStore.setState({ count: 0 });
      });
    });

    it('should create store with initial count of 0', () => {
      expect(useStore.getState().count).toBe(0);
    });

    it('should increment count', () => {
      act(() => {
        useStore.getState().increment();
      });

      expect(useStore.getState().count).toBe(1);
    });

    it('should decrement count', () => {
      act(() => {
        useStore.getState().increment();
        useStore.getState().increment();
        useStore.getState().decrement();
      });

      expect(useStore.getState().count).toBe(1);
    });

    it('should reset count to 0', () => {
      act(() => {
        useStore.getState().increment();
        useStore.getState().increment();
        useStore.getState().increment();
        useStore.getState().reset();
      });

      expect(useStore.getState().count).toBe(0);
    });

    it('should handle multiple increments', () => {
      act(() => {
        useStore.getState().increment();
        useStore.getState().increment();
        useStore.getState().increment();
      });

      expect(useStore.getState().count).toBe(3);
    });
  });

  describe('createUsersStore', () => {
    let useStore: ReturnType<typeof createUsersStore>;

    beforeEach(() => {
      useStore = createUsersStore();
      act(() => {
        useStore.setState({ users: [], loading: false });
      });
    });

    it('should initialize with empty users array', () => {
      expect(useStore.getState().users).toEqual([]);
    });

    it('should initialize with loading false', () => {
      expect(useStore.getState().loading).toBe(false);
    });

    it('should set users array', () => {
      const users = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ];
      act(() => {
        useStore.getState().setUsers(users);
      });

      expect(useStore.getState().users).toBe(users);
    });

    it('should set loading state', () => {
      act(() => {
        useStore.getState().setLoading(true);
      });

      expect(useStore.getState().loading).toBe(true);
    });

    it('should add user to array', () => {
      act(() => {
        useStore.getState().addUser({ id: 1, name: 'Alice' });
      });

      expect(useStore.getState().users).toHaveLength(1);
      expect(useStore.getState().users[0]).toEqual({ id: 1, name: 'Alice' });
    });

    it('should have selectUserCount selector', () => {
      act(() => {
        useStore.getState().addUser({ id: 1, name: 'Alice' });
        useStore.getState().addUser({ id: 2, name: 'Bob' });
      });

      expect(useStore.getState().selectUserCount()).toBe(2);
    });

    it('should have selectIsEmpty selector', () => {
      expect(useStore.getState().selectIsEmpty()).toBe(true);

      act(() => {
        useStore.getState().addUser({ id: 1, name: 'Alice' });
      });

      expect(useStore.getState().selectIsEmpty()).toBe(false);
    });
  });

  describe('createThemeStore', () => {
    let useStore: ReturnType<typeof createThemeStore>;

    beforeEach(() => {
      useStore = createThemeStore();
      act(() => {
        useStore.setState({ theme: 'light' });
      });
    });

    beforeEach(() => {
      localStorage.clear();
    });

    afterEach(() => {
      localStorage.clear();
    });

    it('should initialize with light theme', () => {
      expect(useStore.getState().theme).toBe('light');
    });

    it('should set theme', () => {
      act(() => {
        useStore.getState().setTheme('dark');
      });

      expect(useStore.getState().theme).toBe('dark');
    });

    it('should toggle theme from light to dark', () => {
      act(() => {
        useStore.getState().toggleTheme();
      });

      expect(useStore.getState().theme).toBe('dark');
    });

    it('should toggle theme from dark to light', () => {
      act(() => {
        useStore.getState().setTheme('dark');
        useStore.getState().toggleTheme();
      });

      expect(useStore.getState().theme).toBe('light');
    });

    it('should persist theme to localStorage', () => {
      act(() => {
        useStore.getState().setTheme('dark');
      });

      const stored = localStorage.getItem('theme-storage');
      expect(stored).toBeDefined();
      if (stored) {
        expect(JSON.parse(stored).state.theme).toBe('dark');
      }
    });

    it('should restore theme from localStorage', () => {
      // First store - set dark theme
      const useStore1 = createThemeStore();

      act(() => {
        useStore1.getState().setTheme('dark');
      });

      // Second store - should restore dark theme
      const useStore2 = createThemeStore();

      expect(useStore2.getState().theme).toBe('dark');
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

  describe.only('createAsyncStore', () => {
    let useStore: ReturnType<typeof createAsyncStore>;

    beforeEach(() => {
      useStore = createAsyncStore();
      act(() => {
        useStore.setState({ data: null, loading: false });
      });
    });

    it('should initialize with null data', () => {
      expect(useStore.getState().data).toBeNull();
    });

    it('should initialize with loading false', () => {
      expect(useStore.getState().loading).toBe(false);
    });

    it('should initialize with null error', () => {
      expect(useStore.getState().error).toBeNull();
    });

    it('should set loading to true when fetching', async () => {
      const api = {
        get: vi.fn().mockResolvedValue({ data: {} })
      } as unknown as AxiosInstance;

      act(() => {
        useStore.getState().fetchData(api, '/test');
      });

      expect(useStore.getState().loading).toBe(true);
    });

    it('should set data on successful fetch', async () => {
      const api = {
        get: vi.fn().mockResolvedValue({ data: { id: 1, name: 'Test' } })
      } as unknown as AxiosInstance;

      await act(async () => {
        useStore.getState().fetchData(api, '/test');
      });

      expect(useStore.getState().data).toEqual({ id: 1, name: 'Test' });
    });

    it('should set loading to false after successful fetch', async () => {
      const api = {
        get: vi.fn().mockResolvedValue({ data: {} })
      } as unknown as AxiosInstance;

      await act(async () => {
        useStore.getState().fetchData(api, '/test');
      });

      expect(useStore.getState().loading).toBe(false);
    });

    it('should set error on failed fetch', async () => {
      const error = new Error('Fetch failed');
      const api = {
        get: vi.fn().mockRejectedValue(error)
      } as unknown as AxiosInstance;

      await act(async () => {
        useStore.getState().fetchData(api, '/test');
      });

      expect(useStore.getState().error).toStrictEqual(error);
    });

    it('should set loading to false after failed fetch', async () => {
      const api = {
        get: vi.fn().mockRejectedValue(new Error('Failed'))
      } as unknown as AxiosInstance;

      await act(async () => {
        useStore.getState().fetchData(api, '/test');
      });

      expect(useStore.getState().loading).toBe(false);
    });

    it('should clear error before new fetch', async () => {
      const api1 = {
        get: vi.fn().mockRejectedValue(new Error('First error'))
      } as unknown as AxiosInstance;

      await act(async () => {
        useStore.getState().fetchData(api1, '/test');
      });

      expect(useStore.getState().error).toBeDefined();

      const api2 = {
        get: vi.fn().mockResolvedValue({ data: {} })
      } as unknown as AxiosInstance;

      await act(async () => {
        useStore.getState().fetchData(api2, '/test');
      });

      expect(useStore.getState().error).toBeNull();
    });
  });
});

// Helper for renderHook (simple implementation)
function renderHook<T>(callback: () => T) {
  let result = { current: null as T | null };

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
