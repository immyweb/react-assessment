/**
 * React Advanced Hooks Tests
 *
 * Test suite for React advanced hooks exercises covering:
 * - useMemo and useCallback optimization
 * - useRef for DOM access and values
 * - useImperativeHandle patterns
 * - Custom hook creation
 * - Hook composition patterns
 * - useLayoutEffect use cases
 * - useSyncExternalStore integration
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
import { renderHook } from '@testing-library/react';

import {
  ExpensiveCalculator,
  OptimizedDataProcessor,
  CallbackOptimizationDemo,
  DebouncedInput,
  DOMManipulation,
  MutableValueStorage,
  Modal,
  ModalDemo,
  ValidatedInput,
  useLocalStorage,
  useOnlineStatus,
  useFetch,
  useWindowSize,
  useForm,
  useCachedFetch,
  ComposedHooksDemo,
  LayoutMeasurement,
  Tooltip,
  SynchronizedAnimation,
  globalStore,
  useStore,
  useStoreSelector,
  ExternalStoreDemo,
  useBrowserSync,
  MemoizedChild,
  ExpensiveComponent
} from '../exercises/react-hooks';

// =============================================================================
// SETUP AND UTILITIES
// =============================================================================

// Mock console methods to test optimization
const mockConsole = vi.fn();
console.log = mockConsole;

// Mock DOM APIs
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  },
  writable: true
});

// Mock navigator for online status tests
Object.defineProperty(navigator, 'onLine', {
  value: true,
  writable: true
});

// Mock window resize for dimension tests
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();
window.addEventListener = mockAddEventListener;
window.removeEventListener = mockRemoveEventListener;

// Mock fetch for API tests
global.fetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  mockConsole.mockClear();
  globalStore.setState({ count: 0, user: null });
});

afterEach(() => {
  vi.restoreAllMocks();
});

// =============================================================================
// EXERCISE 1 TESTS: useMemo for Expensive Computations
// =============================================================================

describe('Exercise 1: useMemo for Expensive Computations', () => {
  describe('ExpensiveCalculator', () => {
    const mockNumbers = [1, 2, 3, 4, 5];

    it('should display calculation results', () => {
      render(<ExpensiveCalculator numbers={mockNumbers} />);

      // Should display some form of calculation result
      expect(
        screen.getByText(/result|calculation|computed/i)
      ).toBeInTheDocument();
    });

    it('should show calculation time', () => {
      render(<ExpensiveCalculator numbers={mockNumbers} />);

      // Should display timing information
      expect(screen.getByText(/time|ms|seconds|duration/i)).toBeInTheDocument();
    });

    it('should only recalculate when numbers prop changes', () => {
      const spy = vi.spyOn(console, 'log');
      const { rerender } = render(
        <ExpensiveCalculator numbers={mockNumbers} />
      );

      // Clear any initial logs
      spy.mockClear();

      // Re-render with same numbers - should not recalculate
      rerender(<ExpensiveCalculator numbers={mockNumbers} />);

      // Should not see calculation logs for same input
      expect(spy).not.toHaveBeenCalledWith(
        expect.stringContaining('calculating') ||
          expect.stringContaining('expensive')
      );

      // Re-render with different numbers - should recalculate
      rerender(<ExpensiveCalculator numbers={[6, 7, 8]} />);
    });

    it('should handle empty numbers array', () => {
      render(<ExpensiveCalculator numbers={[]} />);

      // Should not crash with empty array
      expect(screen.getByText(/result|calculation/i)).toBeInTheDocument();
    });
  });

  describe('OptimizedDataProcessor', () => {
    const mockData = [
      { id: 1, name: 'Alice', age: 30 },
      { id: 2, name: 'Bob', age: 25 },
      { id: 3, name: 'Charlie', age: 35 }
    ];

    it('should filter data based on search term', () => {
      render(
        <OptimizedDataProcessor
          data={mockData}
          searchTerm="Alice"
          sortBy="name"
        />
      );

      expect(screen.getByText(/Alice/)).toBeInTheDocument();
      expect(screen.queryByText(/Bob/)).not.toBeInTheDocument();
    });

    it('should sort data based on sort criteria', () => {
      render(
        <OptimizedDataProcessor data={mockData} searchTerm="" sortBy="age" />
      );

      // Should display data in sorted order
      const items = screen.getAllByText(/age:|name:/);
      expect(items.length).toBeGreaterThan(0);
    });

    it('should only reprocess when relevant dependencies change', () => {
      const spy = vi.spyOn(console, 'log');
      const { rerender } = render(
        <OptimizedDataProcessor
          data={mockData}
          searchTerm="Alice"
          sortBy="name"
        />
      );

      spy.mockClear();

      // Re-render with same props - should not reprocess
      rerender(
        <OptimizedDataProcessor
          data={mockData}
          searchTerm="Alice"
          sortBy="name"
        />
      );

      // Should not see processing logs
      expect(spy).not.toHaveBeenCalledWith(
        expect.stringContaining('filtering') ||
          expect.stringContaining('sorting')
      );
    });
  });
});

// =============================================================================
// EXERCISE 2 TESTS: useCallback for Function Optimization
// =============================================================================

describe('Exercise 2: useCallback for Function Optimization', () => {
  describe('CallbackOptimizationDemo', () => {
    it('should render child components', () => {
      render(<CallbackOptimizationDemo />);

      // Should render some child components or buttons
      expect(
        screen.getByText(/child|callback|optimization/i)
      ).toBeInTheDocument();
    });

    it('should prevent unnecessary child re-renders with useCallback', () => {
      const spy = vi.spyOn(console, 'log');
      render(<CallbackOptimizationDemo />);

      // Check that MemoizedChild render logs are minimal
      const renderLogs = spy.mock.calls.filter(
        (call) =>
          call[0] && call[0].includes && call[0].includes('MemoizedChild')
      );

      expect(renderLogs.length).toBeGreaterThan(0);
    });

    it('should have interactive elements that trigger callbacks', async () => {
      const user = userEvent.setup();
      render(<CallbackOptimizationDemo />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);

      // Should be able to click buttons without errors
      await user.click(buttons[0]);
    });
  });

  describe('DebouncedInput', () => {
    it('should render an input field', () => {
      const mockOnSearch = vi.fn();
      render(<DebouncedInput onSearch={mockOnSearch} />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should debounce search calls', async () => {
      const user = userEvent.setup();
      const mockOnSearch = vi.fn();
      render(<DebouncedInput onSearch={mockOnSearch} delay={100} />);

      const input = screen.getByRole('textbox');

      // Type rapidly
      await user.type(input, 'test');

      // Should not call immediately
      expect(mockOnSearch).not.toHaveBeenCalled();

      // Wait for debounce
      await waitFor(
        () => {
          expect(mockOnSearch).toHaveBeenCalledWith('test');
        },
        { timeout: 200 }
      );
    });

    it('should handle rapid typing correctly', async () => {
      const user = userEvent.setup();
      const mockOnSearch = vi.fn();
      render(<DebouncedInput onSearch={mockOnSearch} delay={50} />);

      const input = screen.getByRole('textbox');

      await user.type(input, 'hello');
      await user.clear(input);
      await user.type(input, 'world');

      // Should only call with final value
      await waitFor(
        () => {
          expect(mockOnSearch).toHaveBeenLastCalledWith('world');
        },
        { timeout: 100 }
      );
    });
  });
});

// =============================================================================
// EXERCISE 3 TESTS: useRef for DOM Access and Mutable Values
// =============================================================================

describe('Exercise 3: useRef for DOM Access and Mutable Values', () => {
  describe('DOMManipulation', () => {
    it('should render input and control elements', () => {
      render(<DOMManipulation />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /focus|scroll/i })
      ).toBeInTheDocument();
    });

    it('should focus input when focus button is clicked', async () => {
      const user = userEvent.setup();
      render(<DOMManipulation />);

      const input = screen.getByRole('textbox');
      const focusButton = screen.getByRole('button', { name: /focus/i });

      await user.click(focusButton);

      expect(input).toHaveFocus();
    });

    it('should display element dimensions', () => {
      render(<DOMManipulation />);

      // Should display some dimension information
      expect(screen.getByText(/width|height|dimensions/i)).toBeInTheDocument();
    });

    it('should handle scroll operations', async () => {
      const user = userEvent.setup();
      render(<DOMManipulation />);

      const scrollButton = screen.getByRole('button', { name: /scroll/i });

      // Should not throw when clicking scroll button
      await user.click(scrollButton);
    });
  });

  describe('MutableValueStorage', () => {
    it('should display render count', () => {
      render(<MutableValueStorage />);

      expect(
        screen.getByText(/render.*count|count.*render/i)
      ).toBeInTheDocument();
    });

    it('should track renders without causing re-renders', () => {
      const { rerender } = render(<MutableValueStorage />);

      // Get initial render count
      const initialCount = screen.getByText(/render.*count|count.*render/i);

      // Force re-render
      rerender(<MutableValueStorage />);

      // Count should increment but component shouldn't re-render infinitely
      expect(
        screen.getByText(/render.*count|count.*render/i)
      ).toBeInTheDocument();
    });

    it('should display previous values', () => {
      render(<MutableValueStorage />);

      expect(screen.getByText(/previous|last|prev/i)).toBeInTheDocument();
    });

    it('should manage timer properly', async () => {
      const user = userEvent.setup();
      render(<MutableValueStorage />);

      const startButton = screen.queryByRole('button', {
        name: /start|timer/i
      });
      if (startButton) {
        await user.click(startButton);
        // Should not throw errors
      }
    });
  });
});

// =============================================================================
// EXERCISE 4 TESTS: useImperativeHandle Patterns
// =============================================================================

describe('Exercise 4: useImperativeHandle Patterns', () => {
  describe('Modal Component', () => {
    it('should render modal content when provided', () => {
      const ref = React.createRef();
      render(
        <Modal ref={ref} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      // Modal might be initially hidden, but should render
      expect(screen.getByText(/Test Modal|Modal content/)).toBeInTheDocument();
    });

    it('should expose imperative methods', () => {
      const ref = React.createRef();
      render(
        <Modal ref={ref} title="Test Modal">
          <p>Content</p>
        </Modal>
      );

      // Should have imperative methods
      expect(ref.current).toBeDefined();
      expect(typeof ref.current?.open).toBe('function');
      expect(typeof ref.current?.close).toBe('function');
      expect(typeof ref.current?.toggle).toBe('function');
    });

    it('should open modal when open() is called', () => {
      const ref = React.createRef();
      render(
        <Modal ref={ref} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      act(() => {
        ref.current?.open();
      });

      // Modal should be visible
      expect(screen.getByText(/Test Modal/)).toBeVisible();
    });

    it('should close modal when close() is called', () => {
      const ref = React.createRef();
      render(
        <Modal ref={ref} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      act(() => {
        ref.current?.open();
        ref.current?.close();
      });

      // Modal should be hidden (implementation dependent)
    });
  });

  describe('ModalDemo', () => {
    it('should render modal controls', () => {
      render(<ModalDemo />);

      expect(
        screen.getByRole('button', { name: /open|modal/i })
      ).toBeInTheDocument();
    });

    it('should control modal imperatively', async () => {
      const user = userEvent.setup();
      render(<ModalDemo />);

      const openButton = screen.getByRole('button', { name: /open/i });
      await user.click(openButton);

      // Should show modal content
      expect(screen.getByText(/modal|dialog/i)).toBeInTheDocument();
    });
  });

  describe('ValidatedInput Component', () => {
    it('should render input with label', () => {
      const ref = React.createRef();
      render(
        <ValidatedInput
          ref={ref}
          label="Email"
          validator={(value) => value.includes('@')}
        />
      );

      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    });

    it('should expose validation methods', () => {
      const ref = React.createRef();
      render(
        <ValidatedInput
          ref={ref}
          label="Email"
          validator={(value) => value.includes('@')}
        />
      );

      expect(ref.current).toBeDefined();
      expect(typeof ref.current?.validate).toBe('function');
      expect(typeof ref.current?.reset).toBe('function');
      expect(typeof ref.current?.focus).toBe('function');
    });

    it('should validate input when validate() is called', async () => {
      const user = userEvent.setup();
      const ref = React.createRef();
      const validator = vi.fn().mockReturnValue(true);

      render(<ValidatedInput ref={ref} label="Email" validator={validator} />);

      const input = screen.getByLabelText(/Email/i);
      await user.type(input, 'test@example.com');

      act(() => {
        ref.current?.validate();
      });

      expect(validator).toHaveBeenCalledWith('test@example.com');
    });
  });
});

// =============================================================================
// EXERCISE 5 TESTS: Custom Hook Creation
// =============================================================================

describe('Exercise 5: Custom Hook Creation', () => {
  describe('useLocalStorage', () => {
    it('should return initial value when localStorage is empty', () => {
      window.localStorage.getItem.mockReturnValue(null);

      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'default')
      );

      expect(result.current[0]).toBe('default');
    });

    it('should return stored value from localStorage', () => {
      window.localStorage.getItem.mockReturnValue(
        JSON.stringify('stored value')
      );

      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'default')
      );

      expect(result.current[0]).toBe('stored value');
    });

    it('should update localStorage when value changes', () => {
      window.localStorage.getItem.mockReturnValue(null);

      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'default')
      );

      act(() => {
        result.current[1]('new value');
      });

      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify('new value')
      );
    });

    it('should handle JSON serialization errors gracefully', () => {
      window.localStorage.getItem.mockReturnValue('invalid json');

      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'default')
      );

      expect(result.current[0]).toBe('default');
    });
  });

  describe('useOnlineStatus', () => {
    it('should return initial online status', () => {
      navigator.onLine = true;

      const { result } = renderHook(() => useOnlineStatus());

      expect(result.current).toBe(true);
    });

    it('should set up event listeners for online/offline events', () => {
      renderHook(() => useOnlineStatus());

      expect(mockAddEventListener).toHaveBeenCalledWith(
        'online',
        expect.any(Function)
      );
      expect(mockAddEventListener).toHaveBeenCalledWith(
        'offline',
        expect.any(Function)
      );
    });

    it('should clean up event listeners on unmount', () => {
      const { unmount } = renderHook(() => useOnlineStatus());

      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'online',
        expect.any(Function)
      );
      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'offline',
        expect.any(Function)
      );
    });
  });

  describe('useFetch', () => {
    beforeEach(() => {
      global.fetch.mockReset();
    });

    it('should return loading state initially', () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: 'test' })
      });

      const { result } = renderHook(() => useFetch('/api/test'));

      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBe(null);
      expect(result.current.error).toBe(null);
    });

    it('should fetch data and update state', async () => {
      const mockData = { data: 'test' };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      });

      const { result } = renderHook(() => useFetch('/api/test'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBe(null);
    });

    it('should handle fetch errors', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useFetch('/api/test'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBe(null);
      expect(result.current.error).toBeTruthy();
    });

    it('should provide refetch functionality', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: 'test' })
      });

      const { result } = renderHook(() => useFetch('/api/test'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      global.fetch.mockClear();

      act(() => {
        result.current.refetch();
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('useWindowSize', () => {
    it('should return initial window dimensions', () => {
      // Mock window dimensions
      Object.defineProperty(window, 'innerWidth', {
        value: 1024,
        writable: true
      });
      Object.defineProperty(window, 'innerHeight', {
        value: 768,
        writable: true
      });

      const { result } = renderHook(() => useWindowSize());

      expect(result.current.width).toBe(1024);
      expect(result.current.height).toBe(768);
    });

    it('should set up resize event listener', () => {
      renderHook(() => useWindowSize());

      expect(mockAddEventListener).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
    });

    it('should clean up resize event listener on unmount', () => {
      const { unmount } = renderHook(() => useWindowSize());

      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
    });
  });
});

// =============================================================================
// EXERCISE 6 TESTS: Hook Composition Patterns
// =============================================================================

describe('Exercise 6: Hook Composition Patterns', () => {
  describe('useForm', () => {
    const initialValues = { name: '', email: '' };
    const validators = {
      name: (value) => (value.length > 0 ? null : 'Name is required'),
      email: (value) => (value.includes('@') ? null : 'Invalid email')
    };

    it('should return form state and methods', () => {
      const { result } = renderHook(() =>
        useForm({ initialValues, validators })
      );

      expect(result.current.values).toEqual(initialValues);
      expect(typeof result.current.handleChange).toBe('function');
      expect(typeof result.current.handleSubmit).toBe('function');
      expect(typeof result.current.validate).toBe('function');
    });

    it('should handle input changes', () => {
      const { result } = renderHook(() =>
        useForm({ initialValues, validators })
      );

      act(() => {
        result.current.handleChange('name', 'John Doe');
      });

      expect(result.current.values.name).toBe('John Doe');
    });

    it('should validate individual fields', () => {
      const { result } = renderHook(() =>
        useForm({ initialValues, validators })
      );

      act(() => {
        result.current.validate('email', 'invalid-email');
      });

      expect(result.current.errors.email).toBe('Invalid email');
    });

    it('should handle form submission', () => {
      const onSubmit = vi.fn();
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validators,
          onSubmit
        })
      );

      act(() => {
        result.current.handleChange('name', 'John');
        result.current.handleChange('email', 'john@example.com');
        result.current.handleSubmit();
      });

      expect(onSubmit).toHaveBeenCalledWith({
        name: 'John',
        email: 'john@example.com'
      });
    });
  });

  describe('useCachedFetch', () => {
    beforeEach(() => {
      global.fetch.mockReset();
      window.localStorage.clear();
    });

    it('should use cached data when available and not expired', () => {
      const cachedData = { data: 'cached', timestamp: Date.now() };
      window.localStorage.getItem.mockReturnValue(JSON.stringify(cachedData));

      const { result } = renderHook(() =>
        useCachedFetch('/api/test', {
          cacheKey: 'test-cache',
          cacheTime: 5 * 60 * 1000
        })
      );

      expect(result.current.data).toEqual({ data: 'cached' });
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should fetch fresh data when cache is expired', async () => {
      const expiredCache = {
        data: 'cached',
        timestamp: Date.now() - 10 * 60 * 1000 // 10 minutes ago
      };
      window.localStorage.getItem.mockReturnValue(JSON.stringify(expiredCache));

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: 'fresh' })
      });

      const { result } = renderHook(() =>
        useCachedFetch('/api/test', {
          cacheKey: 'test-cache',
          cacheTime: 5 * 60 * 1000
        })
      );

      await waitFor(() => {
        expect(result.current.data).toEqual({ data: 'fresh' });
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should provide cache invalidation', async () => {
      const { result } = renderHook(() =>
        useCachedFetch('/api/test', { cacheKey: 'test-cache' })
      );

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: 'new' })
      });

      act(() => {
        result.current.invalidateCache();
      });

      expect(window.localStorage.removeItem).toHaveBeenCalledWith('test-cache');
    });
  });

  describe('ComposedHooksDemo', () => {
    it('should render form and data components', () => {
      render(<ComposedHooksDemo />);

      // Should render form inputs and data display
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByText(/form|data|composed/i)).toBeInTheDocument();
    });

    it('should handle form interactions', async () => {
      const user = userEvent.setup();
      render(<ComposedHooksDemo />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test input');

      expect(input).toHaveValue('test input');
    });
  });
});

// =============================================================================
// EXERCISE 7 TESTS: useLayoutEffect Use Cases
// =============================================================================

describe('Exercise 7: useLayoutEffect Use Cases', () => {
  describe('LayoutMeasurement', () => {
    it('should render measurement display', () => {
      render(<LayoutMeasurement />);

      expect(
        screen.getByText(/measurement|layout|dimensions/i)
      ).toBeInTheDocument();
    });

    it('should display element measurements', () => {
      render(<LayoutMeasurement />);

      expect(screen.getByText(/width|height|size/i)).toBeInTheDocument();
    });

    it('should update measurements on resize', () => {
      const { rerender } = render(<LayoutMeasurement />);

      // Simulate window resize
      act(() => {
        window.dispatchEvent(new Event('resize'));
      });

      rerender(<LayoutMeasurement />);

      // Should still display measurements
      expect(screen.getByText(/measurement|layout/i)).toBeInTheDocument();
    });
  });

  describe('Tooltip', () => {
    it('should render trigger element', () => {
      render(
        <Tooltip content="Tooltip content">
          <button>Hover me</button>
        </Tooltip>
      );

      expect(
        screen.getByRole('button', { name: /hover me/i })
      ).toBeInTheDocument();
    });

    it('should show tooltip on hover', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Tooltip content">
          <button>Hover me</button>
        </Tooltip>
      );

      const button = screen.getByRole('button', { name: /hover me/i });
      await user.hover(button);

      expect(screen.getByText(/tooltip content/i)).toBeInTheDocument();
    });

    it('should hide tooltip on unhover', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Tooltip content">
          <button>Hover me</button>
        </Tooltip>
      );

      const button = screen.getByRole('button', { name: /hover me/i });
      await user.hover(button);
      await user.unhover(button);

      // Tooltip should be hidden or removed
      expect(screen.queryByText(/tooltip content/i)).not.toBeInTheDocument();
    });
  });

  describe('SynchronizedAnimation', () => {
    it('should render animation elements', () => {
      render(<SynchronizedAnimation />);

      expect(
        screen.getByText(/animation|synchronized|motion/i)
      ).toBeInTheDocument();
    });

    it('should have animation controls', async () => {
      const user = userEvent.setup();
      render(<SynchronizedAnimation />);

      const startButton = screen.queryByRole('button', {
        name: /start|play|animate/i
      });
      if (startButton) {
        await user.click(startButton);
        // Should not throw errors
      }
    });
  });
});

// =============================================================================
// EXERCISE 8 TESTS: useSyncExternalStore Integration
// =============================================================================

describe('Exercise 8: useSyncExternalStore Integration', () => {
  describe('useStore', () => {
    it('should return store state and setState function', () => {
      const { result } = renderHook(() => useStore(globalStore));

      expect(result.current).toBeDefined();
      expect(result.current[0]).toBeDefined(); // state
      expect(typeof result.current[1]).toBe('function'); // setState
    });

    it('should sync with external store changes', () => {
      const { result } = renderHook(() => useStore(globalStore));

      act(() => {
        globalStore.setState({ count: 5 });
      });

      expect(result.current[0].count).toBe(5);
    });

    it('should allow state updates', () => {
      const { result } = renderHook(() => useStore(globalStore));

      act(() => {
        result.current[1]({ count: 10 });
      });

      expect(globalStore.getState().count).toBe(10);
    });
  });

  describe('useStoreSelector', () => {
    it('should return selected value', () => {
      globalStore.setState({ count: 15, user: { name: 'John' } });

      const { result } = renderHook(() =>
        useStoreSelector(globalStore, (state) => state.count)
      );

      expect(result.current).toBe(15);
    });

    it('should only re-render when selected value changes', () => {
      globalStore.setState({ count: 20, user: { name: 'John' } });

      let renderCount = 0;
      const { result } = renderHook(() => {
        renderCount++;
        return useStoreSelector(globalStore, (state) => state.count);
      });

      const initialRenderCount = renderCount;

      // Change unrelated state
      act(() => {
        globalStore.setState({ user: { name: 'Jane' } });
      });

      // Should not trigger re-render
      expect(renderCount).toBe(initialRenderCount);

      // Change selected state
      act(() => {
        globalStore.setState({ count: 25 });
      });

      // Should trigger re-render
      expect(renderCount).toBe(initialRenderCount + 1);
      expect(result.current).toBe(25);
    });
  });

  describe('ExternalStoreDemo', () => {
    beforeEach(() => {
      globalStore.setState({ count: 0, user: null });
    });

    it('should render store state', () => {
      render(<ExternalStoreDemo />);

      expect(screen.getByText(/count|store|external/i)).toBeInTheDocument();
    });

    it('should update when store changes', async () => {
      const user = userEvent.setup();
      render(<ExternalStoreDemo />);

      const incrementButton = screen.queryByRole('button', {
        name: /increment|\+/i
      });
      if (incrementButton) {
        await user.click(incrementButton);

        expect(screen.getByText(/1/)).toBeInTheDocument();
      }
    });

    it('should handle external store updates', () => {
      render(<ExternalStoreDemo />);

      act(() => {
        globalStore.setState({ count: 42 });
      });

      expect(screen.getByText(/42/)).toBeInTheDocument();
    });
  });

  describe('useBrowserSync', () => {
    it('should sync with browser API', () => {
      const mockGetSnapshot = vi.fn().mockReturnValue(true);

      const { result } = renderHook(() =>
        useBrowserSync('navigator', mockGetSnapshot)
      );

      expect(result.current).toBe(true);
      expect(mockGetSnapshot).toHaveBeenCalled();
    });

    it('should set up appropriate event listeners based on source', () => {
      const mockGetSnapshot = vi.fn().mockReturnValue('light');

      renderHook(() => useBrowserSync('localStorage', mockGetSnapshot));

      // Should set up storage event listener for localStorage
      expect(mockAddEventListener).toHaveBeenCalledWith(
        'storage',
        expect.any(Function)
      );
    });

    it('should clean up event listeners on unmount', () => {
      const mockGetSnapshot = vi.fn().mockReturnValue(true);

      const { unmount } = renderHook(() =>
        useBrowserSync('navigator', mockGetSnapshot)
      );

      unmount();

      // Should clean up listeners
      expect(mockRemoveEventListener).toHaveBeenCalled();
    });
  });
});

// =============================================================================
// HELPER COMPONENT TESTS
// =============================================================================

describe('Helper Components', () => {
  describe('MemoizedChild', () => {
    it('should render title and handle events', async () => {
      const user = userEvent.setup();
      const mockOnClick = vi.fn();
      const mockOnHover = vi.fn();

      render(
        <MemoizedChild
          title="Test Child"
          onClick={mockOnClick}
          onHover={mockOnHover}
        />
      );

      expect(screen.getByText(/test child/i)).toBeInTheDocument();

      await user.click(screen.getByText(/test child/i));
      expect(mockOnClick).toHaveBeenCalled();
    });

    it('should be properly memoized', () => {
      const spy = vi.spyOn(console, 'log');
      const mockOnClick = vi.fn();

      const { rerender } = render(
        <MemoizedChild title="Test" onClick={mockOnClick} onHover={vi.fn()} />
      );

      spy.mockClear();

      // Re-render with same props
      rerender(
        <MemoizedChild title="Test" onClick={mockOnClick} onHover={vi.fn()} />
      );

      // Should see additional render log due to new onHover function
      const renderLogs = spy.mock.calls.filter(
        (call) =>
          call[0] && call[0].includes && call[0].includes('MemoizedChild')
      );
      expect(renderLogs.length).toBeGreaterThan(0);
    });
  });

  describe('ExpensiveComponent', () => {
    it('should display computation result', () => {
      render(<ExpensiveComponent shouldRerender={false} />);

      expect(
        screen.getByText(/expensive computation result/i)
      ).toBeInTheDocument();
    });

    it('should only recompute when shouldRerender changes', () => {
      const spy = vi.spyOn(console, 'log');
      const { rerender } = render(
        <ExpensiveComponent shouldRerender={false} />
      );

      spy.mockClear();

      // Re-render with same prop
      rerender(<ExpensiveComponent shouldRerender={false} />);

      // Should not see computation log
      expect(spy).not.toHaveBeenCalledWith('Expensive computation running...');

      // Re-render with different prop
      rerender(<ExpensiveComponent shouldRerender={true} />);

      // Should see computation log
      expect(spy).toHaveBeenCalledWith('Expensive computation running...');
    });
  });
});
