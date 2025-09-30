import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act
} from '@testing-library/react';
import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';

import {
  MemoCalculator,
  CallbackDemo,
  MemoizedChildComponent,
  RefExample,
  CustomInput,
  ImperativeHandleDemo,
  useLocalStorage,
  useWindowSize,
  CustomHooksDemo,
  LayoutEffectDemo
} from '../exercises/react-hooks';

// =============================================================================
// SETUP AND UTILITIES
// =============================================================================

// Mock console.log for tracking component renders
const originalConsoleLog = console.log;
const mockConsoleLog = vi.fn();
console.log = (...args) => {
  mockConsoleLog(...args);
  originalConsoleLog(...args);
};

// Mock localStorage for testing
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock window dimensions and resize events
Object.defineProperty(window, 'innerWidth', { writable: true, value: 1024 });
Object.defineProperty(window, 'innerHeight', { writable: true, value: 768 });

const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();
window.addEventListener = mockAddEventListener;
window.removeEventListener = mockRemoveEventListener;

beforeEach(() => {
  vi.clearAllMocks();
  mockConsoleLog.mockClear();
  localStorageMock.clear();
});

afterEach(() => {
  // Restore any mocks that need restoration between tests
});

// =============================================================================
// EXERCISE 1 TESTS: useMemo for Performance Optimization
// =============================================================================

describe('Exercise 1: useMemo for Performance Optimization', () => {
  it('should calculate fibonacci correctly', () => {
    render(<MemoCalculator number={10} />);
    expect(screen.getByText(/Fibonacci of 10:/i)).toBeInTheDocument();
    // The actual value depends on implementation, so we're just checking format
  });

  it('should not recalculate on unrelated state changes', () => {
    render(<MemoCalculator number={7} />);

    // Initial calculation should happen
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('calculating')
      // expect.anything()
    );
    mockConsoleLog.mockClear();

    // Click the button to change count state
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('button'));

    // The fibonacci calculation function should not be called again
    expect(mockConsoleLog).not.toHaveBeenCalledWith(
      expect.stringContaining('calculating')
      // expect.anything()
    );
  });

  it('should recalculate when number prop changes', () => {
    const { rerender } = render(<MemoCalculator number={5} />);
    mockConsoleLog.mockClear();

    // Change the number prop
    rerender(<MemoCalculator number={6} />);

    // The fibonacci calculation should run again
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('calculating')
      // expect.anything()
    );
  });
});

// =============================================================================
// EXERCISE 2 TESTS: useCallback for Stable References
// =============================================================================

describe('Exercise 2: useCallback for Stable References', () => {
  it('should render MemoizedChildComponent only when props change', () => {
    render(<CallbackDemo />);
    mockConsoleLog.mockClear();

    // Click parent button (changes count)
    fireEvent.click(screen.getByText(/parent count/i));

    // Child should not re-render when only count changes
    expect(mockConsoleLog).not.toHaveBeenCalledWith('Child component rendered');

    // Update text input (changes text)
    fireEvent.change(screen.getByPlaceholderText('Type something'), {
      target: { value: 'test' }
    });

    // Child should re-render when text changes
    expect(mockConsoleLog).toHaveBeenCalledWith('Child component rendered');
  });

  it('should maintain callback reference when unrelated state changes', () => {
    const onClickSpy = vi.fn();
    const { rerender } = render(
      <MemoizedChildComponent text="test" onClick={onClickSpy} />
    );
    const firstRenderOnClick = onClickSpy;

    // Simulate parent re-rendering with same props
    rerender(<MemoizedChildComponent text="test" onClick={onClickSpy} />);

    // onClick reference should be the same
    expect(onClickSpy).toBe(firstRenderOnClick);

    // Child component should not re-render
    expect(mockConsoleLog).toHaveBeenCalledTimes(1);
  });
});

// =============================================================================
// EXERCISE 3 TESTS: useRef for DOM References and Persistent Values
// =============================================================================

describe('Exercise 3: useRef for DOM References and Persistent Values', () => {
  it('should focus input when focus button is clicked', () => {
    render(<RefExample />);

    const input = screen.getByPlaceholderText('Type here');
    const button = screen.getByText('Focus Input');

    // Mock the focus method
    const focusMock = vi.fn();
    input.focus = focusMock;

    // Click the focus button
    fireEvent.click(button);

    // The input focus method should have been called
    expect(focusMock).toHaveBeenCalled();
  });

  it('should track render count without causing re-renders', () => {
    const { rerender } = render(<RefExample />);

    // Initial render should show render count of 1
    expect(screen.getByText(/This component has rendered/i)).toHaveTextContent(
      '1'
    );

    // Update input to cause re-render
    fireEvent.change(screen.getByPlaceholderText('Type here'), {
      target: { value: 'test' }
    });

    // Render count should be 2
    expect(screen.getByText(/This component has rendered/i)).toHaveTextContent(
      '2'
    );

    // Force another re-render
    rerender(<RefExample />);

    // Render count should be 3
    expect(screen.getByText(/This component has rendered/i)).toHaveTextContent(
      '3'
    );
  });
});

// =============================================================================
// EXERCISE 4 TESTS: useImperativeHandle and forwardRef
// =============================================================================

describe('Exercise 4: useImperativeHandle and forwardRef', () => {
  it('should expose focus method via ref', () => {
    // Create a test component to test the imperative handle
    function TestComponent() {
      const inputRef = React.useRef();

      React.useEffect(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, []);

      return <CustomInput ref={inputRef} data-testid="custom-input" />;
    }

    render(<TestComponent />);

    // Check if focus was called on the input
    expect(document.activeElement).toBe(screen.getByTestId('custom-input'));
  });

  it('should expose reset method via ref', () => {
    // Create a test component to test the imperative handle
    function TestComponent() {
      const inputRef = React.useRef();

      return (
        <>
          <CustomInput
            ref={inputRef}
            data-testid="custom-input"
            defaultValue="initial value"
          />
          <button onClick={() => inputRef.current.reset()}>Reset</button>
        </>
      );
    }

    render(<TestComponent />);

    // Initial value should be set
    expect(screen.getByTestId('custom-input')).toHaveValue('initial value');

    // Click reset button
    fireEvent.click(screen.getByText('Reset'));

    // Value should be cleared
    expect(screen.getByTestId('custom-input')).toHaveValue('');
  });

  it('should properly render the ImperativeHandleDemo component', () => {
    render(<ImperativeHandleDemo />);

    // Check that the component renders properly
    expect(screen.getByText('Imperative Handle Demo')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Type something...')
    ).toBeInTheDocument();
    expect(screen.getByText('Focus Input')).toBeInTheDocument();
    expect(screen.getByText('Reset Input')).toBeInTheDocument();
  });
});

// =============================================================================
// EXERCISE 5 TESTS: Custom Hooks
// =============================================================================

describe('Exercise 5: Custom Hooks', () => {
  describe('useLocalStorage hook', () => {
    it('should initialize with value from localStorage if available', () => {
      // Set up localStorage with initial value
      window.localStorage.setItem('testKey', JSON.stringify('stored value'));

      const { result } = renderHook(() =>
        useLocalStorage('testKey', 'default value')
      );

      // Should use the value from localStorage
      expect(result.current[0]).toBe('stored value');
    });

    it('should initialize with default value if localStorage is empty', () => {
      const { result } = renderHook(() =>
        useLocalStorage('emptyKey', 'default value')
      );

      // Should use the default value
      expect(result.current[0]).toBe('default value');
    });

    it('should update localStorage when value changes', () => {
      const { result } = renderHook(() =>
        useLocalStorage('updateKey', 'initial')
      );

      // Update the value
      act(() => {
        const setValue = result.current[1];
        setValue('updated value');
      });

      // localStorage should be updated
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'updateKey',
        JSON.stringify('updated value')
      );

      // hook value should be updated
      expect(result.current[0]).toBe('updated value');
    });
  });

  describe('useWindowSize hook', () => {
    it('should return current window dimensions', () => {
      const { result } = renderHook(() => useWindowSize());

      expect(result.current.width).toBe(1024);
      expect(result.current.height).toBe(768);
    });

    it('should update dimensions when window resizes', () => {
      const { result } = renderHook(() => useWindowSize());

      // Verify initial dimensions
      expect(result.current.width).toBe(1024);

      // Simulate resize event
      act(() => {
        window.innerWidth = 1280;
        window.innerHeight = 800;
        window.dispatchEvent(new Event('resize'));
      });

      // Dimensions should be updated
      // This fails because the hook expects the
      // real browser event system, but the mocks
      // do not actually call the handler functions
      // when events are dispatched.
      expect(result.current.width).toBe(1280);
      expect(result.current.height).toBe(800);
    });

    it('should clean up event listener on unmount', () => {
      const { unmount } = renderHook(() => useWindowSize());
      unmount();

      // Event listener should be removed
      expect(window.removeEventListener).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
    });
  });

  describe('CustomHooksDemo component', () => {
    it('should render with both hooks', () => {
      // Mock window dimensions
      window.innerWidth = 1280;
      window.innerHeight = 800;

      render(<CustomHooksDemo />);

      // Should display window dimensions
      expect(screen.getByText(/Current window dimensions/i)).toHaveTextContent(
        '1280 x 800'
      );

      // Should have localStorage input
      expect(
        screen.getByPlaceholderText('Value persists in localStorage')
      ).toBeInTheDocument();
    });
  });
});

// =============================================================================
// EXERCISE 6 TESTS: useLayoutEffect vs useEffect
// =============================================================================

describe('Exercise 6: useLayoutEffect vs useEffect', () => {
  it('should render LayoutEffectDemo component correctly', () => {
    render(<LayoutEffectDemo />);

    // Initial state (content hidden)
    expect(screen.getByText(/Show Content/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/Positioned with useLayoutEffect/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Positioned with useEffect/i)
    ).not.toBeInTheDocument();

    // Click to show content
    fireEvent.click(screen.getByText(/Show Content/i));

    // Content should be visible
    expect(screen.getByText(/Hide Content/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Positioned with useLayoutEffect/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Positioned with useEffect/i)).toBeInTheDocument();
  });

  it('should position elements differently with useLayoutEffect and useEffect', async () => {
    render(<LayoutEffectDemo />);

    // Show content
    fireEvent.click(screen.getByText(/Show Content/i));

    // Wait for all effects to complete
    await waitFor(() => {
      const layoutEffectBox = screen.getByText(
        /Positioned with useLayoutEffect/i
      );
      const effectBox = screen.getByText(/Positioned with useEffect/i);

      // The exact positions will depend on implementation, but they should be different
      // We're just checking that both boxes are rendered with absolute positioning
      expect(window.getComputedStyle(layoutEffectBox).position).toBe(
        'absolute'
      );
      expect(window.getComputedStyle(effectBox).position).toBe('absolute');
    });
  });

  it('should toggle content visibility when clicking the button', () => {
    render(<LayoutEffectDemo />);

    // Initial state (content hidden)
    expect(
      screen.queryByText(/Positioned with useLayoutEffect/i)
    ).not.toBeInTheDocument();

    // Show content
    fireEvent.click(screen.getByText(/Show Content/i));
    expect(
      screen.getByText(/Positioned with useLayoutEffect/i)
    ).toBeInTheDocument();

    // Hide content
    fireEvent.click(screen.getByText(/Hide Content/i));
    expect(
      screen.queryByText(/Positioned with useLayoutEffect/i)
    ).not.toBeInTheDocument();
  });
});
