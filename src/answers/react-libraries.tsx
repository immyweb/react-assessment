/**
 * React Libraries Exercises
 *
 * This file contains exercises covering popular React ecosystem libraries:
 * 1. Axios - HTTP client for making API requests
 * 2. TanStack Query (React Query) - Server state management and data fetching
 * 3. Redux - Predictable state container
 * 4. Zustand - Lightweight state management
 */

import { useEffect, useState } from 'react';
import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================================================
// Exercise 1: Axios - HTTP Client Basics
// ============================================================================

/**
 * Create an axios instance with base configuration
 *
 * Requirements:
 * - Base URL: 'https://api.example.com'
 * - Timeout: 5000ms
 * - Default headers: { 'Content-Type': 'application/json' }
 */
export const createAxiosInstance = () => {
  return axios.create({
    baseURL: 'https://api.example.com',
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' }
  });
};

/**
 * Component that fetches user data using axios
 *
 * Requirements:
 * - Fetch user data from /users/:userId on mount
 * - Show loading state while fetching
 * - Display error message if request fails
 * - Display user data when loaded (name, email)
 */
export const UserProfile = ({
  userId,
  axiosInstance
}: {
  userId: string;
  axiosInstance: AxiosInstance;
}) => {
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getUser() {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(`/users/${userId}`);
        setUser(response.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
          console.error(err.message);
        } else {
          setError('An unexpected error occurred');
          console.error('An unexpected error occurred:', err);
        }
      } finally {
        setLoading(false);
      }
    }
    getUser();
  }, [userId, axiosInstance]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>No user found</div>;
  }

  return (
    <div>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  );
};

/**
 * Add request interceptor to axios instance
 *
 * Requirements:
 * - Add Authorization header with token from localStorage
 * - Only add header if token exists
 * - Return modified config
 */
export const addAuthInterceptor = (axiosInstance: AxiosInstance) => {
  const token = localStorage.getItem('authToken');

  return axiosInstance.interceptors.request.use((config) => {
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  });
};

/**
 * Add response interceptor for error handling
 *
 * Requirements:
 * - Handle 401 errors by calling onUnauthorized callback
 * - Handle network errors by calling onNetworkError callback
 * - Return modified error
 */
export const addErrorInterceptor = (
  axiosInstance: AxiosInstance,
  onUnauthorized: () => void,
  onNetworkError: () => void
) => {
  return axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response) {
        // Server error
        if (error.response.status === 401) {
          onUnauthorized();
          error.isUnauthorized = true; // Add custom property
          error.customMessage = 'You are not authorized. Please log in again.';
        }
      } else {
        // Network error
        onNetworkError();
        error.isNetworkError = true; // Add custom property
        error.customMessage = 'Network error. Please check your connection.';
      }

      return Promise.reject(error);
    }
  );
};

// ============================================================================
// Exercise 2: TanStack Query (React Query) - Data Fetching
// ============================================================================

/**
 * Component that uses useQuery to fetch posts
 *
 * Requirements:
 * - Use queryKey: ['posts']
 * - Fetch from /posts endpoint
 * - Set staleTime to 30 seconds
 * - Show loading state
 * - Show error message if fetch fails
 * - Display list of posts with title
 */
type PostsListType = {
  id: number;
  title: string;
};

export const PostsList = ({
  api
}: {
  api: { get: (url: string) => Promise<AxiosResponse<PostsListType[]>> };
}) => {
  const { isFetching, isError, data, error } = useQuery<
    AxiosResponse<PostsListType[]>
  >({
    queryKey: ['posts'],
    queryFn: () => api.get('/posts'),
    staleTime: 30000
  });

  if (isFetching) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <ul>
      {data?.data?.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
};

/**
 * Component that uses useQuery with dynamic parameters
 *
 * Requirements:
 * - Use queryKey: ['post', postId]
 * - Only fetch when postId is truthy (use enabled option)
 * - Fetch from /posts/:postId
 * - Show "Select a post" when postId is null
 * - Show loading state while fetching
 * - Display post title and body
 */
type PostDetailType = {
  id: number;
  title: string;
  body: string;
};

export const PostDetail = ({
  postId,
  api
}: {
  postId?: number;
  api: { get: (url: string) => Promise<AxiosResponse<PostDetailType>> };
}) => {
  const { isFetching, isError, data, error } = useQuery<
    AxiosResponse<PostDetailType>
  >({
    queryKey: ['posts', postId],
    queryFn: () => api.get(`/posts/${postId}`),
    enabled: !!postId
  });

  if (!postId) {
    return <div>Select a post</div>;
  }

  if (isFetching) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No data found</div>;
  }

  const { title, body } = data?.data;

  return (
    <div>
      <h1>{title}</h1>
      <p>{body}</p>
    </div>
  );
};

/**
 * Component that uses useMutation to create a post
 *
 * Requirements:
 * - Use mutationFn to POST to /posts
 * - Invalidate 'posts' query on success
 * - Show loading state while mutation is pending
 * - Show error message if mutation fails
 * - Clear form after successful submission
 */
type NewPost = {
  title: string;
  body: string;
};

export const CreatePost = ({
  api,
  queryClient
}: {
  api: {
    post: (url: string, newPost: NewPost) => Promise<AxiosResponse<NewPost>>;
  };
  queryClient: QueryClient;
}) => {
  const mutation = useMutation({
    mutationFn: (newPost: NewPost) => {
      return api.post('/posts', newPost);
    },
    onSuccess: async () => {
      setTitle('');
      setBody('');
      await queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  function handleSubmit(evt: React.FormEvent) {
    evt.preventDefault();
    mutation.mutate({ title, body });
  }

  return (
    <div>
      {mutation.isPending && <div>Loading...</div>}
      {mutation.isError && (
        <div>An error occurred: {mutation.error.message}</div>
      )}
      {mutation.isSuccess && <div>Post added!</div>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          name="title"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="body">Body</label>
        <input
          name="body"
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

/**
 * Component with optimistic updates using useMutation
 *
 * Requirements:
 * - Implement optimistic update in onMutate
 * - Cancel outgoing refetches before optimistic update
 * - Snapshot previous todos for rollback
 * - Update cache optimistically with new todo
 * - Rollback on error using previous snapshot
 * - Refetch on settled to sync with server
 */
type OptimisticTodoListType = {
  id: number;
  text: string;
  completed: boolean;
};

let nextId = 2;
export const OptimisticTodoList = ({
  api,
  queryClient
}: {
  api: {
    post: (
      url: string,
      newTodo: OptimisticTodoListType
    ) => Promise<AxiosResponse<OptimisticTodoListType>>;
    get: (url: string) => Promise<AxiosResponse<OptimisticTodoListType[]>>;
  };
  queryClient: QueryClient;
}) => {
  const { isFetching, isError, data, error } = useQuery({
    queryKey: ['todos'],
    queryFn: () => api.get('/todos')
  });

  const { mutate, isPending, variables } = useMutation({
    mutationFn: (newTodo: OptimisticTodoListType) =>
      api.post('/todos', newTodo),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] })
  });

  const [todoItem, setTodoItem] = useState('');

  function handleSubmit(evt: React.FormEvent) {
    evt.preventDefault();
    mutate({ id: ++nextId, text: todoItem, completed: false });
  }

  return (
    <>
      <form role="form" onSubmit={handleSubmit}>
        <label htmlFor="todoInput">Add todo</label>
        <input
          name="todoInput"
          id="todoInput"
          value={todoItem}
          onChange={(e) => setTodoItem(e.target.value)}
        />

        <button type="submit">Add</button>
      </form>
      {isFetching && <div>Loading...</div>}
      {isError && <div>An error occurred: {error.message}</div>}
      {data && (
        <ul>
          {data.data.map((todo: OptimisticTodoListType) => {
            return (
              <li key={todo.id}>
                {todo.text} <span>{todo.completed}</span>
              </li>
            );
          })}
          {isPending && (
            <li key={variables.id}>
              {variables.text} <span>{variables.completed}</span>
            </li>
          )}
        </ul>
      )}
    </>
  );
};

// ============================================================================
// Exercise 3: Redux - State Management
// ============================================================================

/**
 * Create a simple counter reducer
 *
 * Requirements:
 * - Initial state: { value: 0 }
 * - Handle 'counter/increment' action: value + 1
 * - Handle 'counter/decrement' action: value - 1
 * - Handle 'counter/incrementByAmount' action: value + action.payload
 * - Return current state for unknown actions
 */
interface CounterState {
  value: number;
}

// const initialState: CounterState = { value: 0 };

// const counterSlice = createSlice({
//   name: 'counter',
//   initialState,
//   reducers: {
//     increment: (state) => {
//       state.value += 1;
//     },
//     decrement: (state) => {
//       state.value -= 1;
//     },
//     incrementByAmount: (state, action: PayloadAction<number>) => {
//       state.value += action.payload;
//     }
//   }
// });

// export const { increment, decrement, incrementByAmount } = counterSlice.actions;
// export default counterSlice.reducer;

/**
 * Counter component using Redux hooks
 *
 * Requirements:
 * - Use useSelector to get count from state.counter.value
 * - Use useDispatch to get dispatch function
 * - Dispatch increment action on + button click
 * - Dispatch decrement action on - button click
 * - Display current count
 */
export const ReduxCounter = () => {
  const count = useSelector((state: { value: number }) => state.value);
  const dispatch = useDispatch();

  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch({ type: 'counter/increment' })}>
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch({ type: 'counter/decrement' })}>
          Decrement
        </button>
      </div>
    </div>
  );
};

/**
 * Todos reducer with more complex state
 *
 * Requirements:
 * - Initial state: []
 * - 'todos/todoAdded': Add new todo with id, text, completed: false
 * - 'todos/todoToggled': Toggle completed status for todo with matching id
 * - 'todos/todoDeleted': Remove todo with matching id
 */

export interface TodoState {
  id: number;
  text: string;
  completed: boolean;
}

const initialState: TodoState[] = [];

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    todoAdded: (state, action: PayloadAction<string>) => {
      state.push({
        id: Date.now(),
        text: action.payload,
        completed: false
      });
    },
    todoToggled: (state, action: PayloadAction<number>) => {
      const todo = state.find((t) => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    todoDeleted: (state, action: PayloadAction<number>) => {
      return state.filter((t) => t.id !== action.payload);
    }
  }
});

export const { todoAdded, todoToggled, todoDeleted } = todoSlice.actions;
export default todoSlice.reducer;

// ============================================================================
// Exercise 4: Zustand - Lightweight State Management
// ============================================================================

/**
 * Create a Zustand store for a counter
 *
 * Requirements:
 * - State: count (number, initial value: 0)
 * - Action: increment() - increases count by 1
 * - Action: decrement() - decreases count by 1
 * - Action: reset() - sets count to 0
 */
type createCounterStoreState = {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
};

export const createCounterStore = () => {
  return create<createCounterStoreState>()((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
    reset: () => set({ count: 0 })
  }));
};

/**
 * Create a Zustand store with selectors
 *
 * Requirements:
 * - State: users array, loading boolean
 * - Action: setUsers(users) - sets users array
 * - Action: setLoading(loading) - sets loading state
 * - Action: addUser(user) - adds user to array
 * - Selector: selectUserCount - returns users.length
 * - Selector: selectIsEmpty - returns users.length === 0
 */
type createUsersStoreUser = {
  id: number;
  name: string;
};

type createUsersStoreState = {
  users: createUsersStoreUser[];
  loading: boolean;
  setUsers: (users: createUsersStoreUser[]) => void;
  setLoading: (bool: boolean) => void;
  addUser: (user: createUsersStoreUser) => void;
  selectUserCount: () => void;
  selectIsEmpty: () => void;
};

export const createUsersStore = () => {
  return create<createUsersStoreState>((set, get) => ({
    users: [],
    loading: false,
    setUsers: (newUsers) =>
      set((state) => ({
        users: newUsers
      })),
    setLoading: (bool) =>
      set(() => ({
        loading: bool
      })),
    addUser: (user) =>
      set((state) => ({
        users: [...state.users, user]
      })),
    selectUserCount: () => get().users.length,
    selectIsEmpty: () => get().users.length === 0
  }));
};

/**
 * Create a Zustand store with persist middleware
 *
 * Requirements:
 * - State: theme (string, initial: 'light')
 * - Action: setTheme(theme) - updates theme
 * - Action: toggleTheme() - toggles between 'light' and 'dark'
 * - Persist to localStorage with name 'theme-storage'
 */
type ThemeStoreType = 'light' | 'dark';

type createThemeStoreState = {
  theme: ThemeStoreType;
  setTheme: (newTheme: ThemeStoreType) => void;
  toggleTheme: () => void;
};

export const createThemeStore = () => {
  return create<createThemeStoreState>()(
    persist(
      (set) => ({
        theme: 'light',
        setTheme: (newTheme) =>
          set(() => ({
            theme: newTheme
          })),
        toggleTheme: () =>
          set((state) => ({
            theme: state.theme === 'light' ? 'dark' : 'light'
          }))
      }),
      {
        name: 'theme-storage'
      }
    )
  );
};

/**
 * Component using Zustand store
 *
 * Requirements:
 * - Use useCounterStore to get count and actions
 * - Display current count
 * - Render increment button
 * - Render decrement button
 * - Render reset button
 */
type ZustandCounterProps = {
  useCounterStore: <T>(selector: (state: createCounterStoreState) => T) => T;
};

export const ZustandCounter: React.FC<ZustandCounterProps> = ({
  useCounterStore
}) => {
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);
  const reset = useCounterStore((state) => state.reset);

  return (
    <div>
      <p>{count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};

/**
 * Create Zustand store with middleware for async actions
 *
 * Requirements:
 * - State: data (null initially), loading (false), error (null)
 * - Action: fetchData(api, endpoint) - async function that:
 *   - Sets loading to true
 *   - Clears error
 *   - Makes API call
 *   - Sets data on success
 *   - Sets error on failure
 *   - Sets loading to false when done
 */
type createAsyncStoreState = {
  data: { id: number; name: string } | null;
  loading: boolean;
  error: Error | null;
  fetchData: (api: AxiosInstance, endpoint: string) => void;
};

export const createAsyncStore = () => {
  return create<createAsyncStoreState>((set) => ({
    data: null,
    loading: false,
    error: null,
    fetchData: async (api, endpoint) => {
      set({ loading: true, error: null });
      try {
        const response = await api.get(endpoint);
        set({ loading: false, data: response.data });
      } catch (err) {
        let errorMessage = 'Unknown error';
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        set({ loading: false, error: new Error(errorMessage) });
      }
    }
  }));
};

// ============================================================================
// Helper Components and Utilities
// ============================================================================

/**
 * Simple mock API for testing
 */
export const createMockApi = () => {
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  return {
    get: async (url: string) => {
      await delay(100);
      if (url.includes('/users/')) {
        const id = url.split('/').pop();
        return {
          data: { id, name: `User ${id}`, email: `user${id}@example.com` }
        };
      }
      if (url.includes('/posts/')) {
        const id = url.split('/').pop();
        return {
          data: { id, title: `Post ${id}`, body: `Body of post ${id}` }
        };
      }
      if (url === '/posts') {
        return {
          data: [
            { id: 1, title: 'Post 1' },
            { id: 2, title: 'Post 2' }
          ]
        };
      }
      throw new Error('Not found');
    },
    post: async (
      url: string,
      data: { id: number; title: string; body: string }
    ) => {
      await delay(100);
      return { data: { ...data, id: Date.now() } };
    }
  };
};
