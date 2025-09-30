/**
 * React Hooks Exercises - Simplified
 *
 * This file contains simplified exercises covering fundamental React hooks concepts:
 * - useMemo for performance optimization
 * - useCallback for stable references
 * - useRef for DOM access and persistent values
 * - useImperativeHandle and forwardRef
 * - Custom hooks
 * - useLayoutEffect vs useEffect timing differences
 *
 * Each exercise focuses on one clear example per hook concept
 * with straightforward requirements.
 */

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useImperativeHandle,
  useLayoutEffect,
  forwardRef
} from 'react';

// =============================================================================
// EXERCISE 1: useMemo for Performance Optimization
// =============================================================================

/**
 * Exercise 1: Use useMemo to optimize an expensive calculation
 *
 * Requirements:
 * - Implement a fibonacci calculator that computes fibonacci(n)
 * - Use useMemo to prevent recalculation on every render
 * - Track whether calculation is using cached value
 *
 * The fibonacci sequence is defined as:
 * - fib(0) = 0
 * - fib(1) = 1
 * - fib(n) = fib(n-1) + fib(n-2) for n > 1
 */
export function MemoCalculator({ number }) {
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState('recalculated');

  const fibonacci = useMemo(() => {
    let result = [0, 1];

    for (let i = 2; i <= number; i++) {
      result[i] = result[i - 1] + result[i - 2];
    }
    console.log('calculating');
    setStatus('recalculated');
    return result[number];
  }, [number]);

  useEffect(() => {
    // If count changes but number does not, value is cached
    setStatus('cached');
  }, [count]);

  return (
    <div>
      <h2>Fibonacci Calculator</h2>
      <p>
        Fibonacci of {number}: {fibonacci}
      </p>
      <p>This is {status}</p>
      <button onClick={() => setCount((c) => c + 1)}>
        Clicked {count} times (shouldn't trigger recalculation)
      </button>
    </div>
  );
}

// =============================================================================
// EXERCISE 2: useCallback for Stable References
// =============================================================================

/**
 * Exercise 2: Use useCallback to optimize child component renders
 *
 * Requirements:
 * - Create a parent component with a counter button
 * - Pass a callback to the MemoizedChildComponent
 * - Use useCallback to prevent unnecessary re-renders of child
 * - Demonstrate when the callback is recreated vs reused
 */
export function CallbackDemo() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  const handleChildClick = useCallback(() => {
    console.log(`You clicked on: ${text}`);
  }, [text]);

  return (
    <div>
      <h2>Callback Optimization</h2>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something"
      />
      <button onClick={() => setCount((c) => c + 1)}>
        Parent count: {count}
      </button>

      <MemoizedChildComponent text={text} onClick={handleChildClick} />
    </div>
  );
}

export const MemoizedChildComponent = React.memo(function ChildComponent({
  text,
  onClick
}) {
  console.log('Child component rendered');

  return (
    <div onClick={onClick}>
      <h3>Memoized Child</h3>
      <p>Text: {text}</p>
    </div>
  );
});

// =============================================================================
// EXERCISE 3: useRef for DOM References and Persistent Values
// =============================================================================

/**
 * Exercise 3: Use useRef for DOM manipulation and persistent values
 *
 * Requirements:
 * - Create a component with an input field and focus button
 * - Use useRef to focus the input when button is clicked
 * - Track the number of renders without causing re-renders
 */
export function RefExample() {
  const [value, setValue] = useState('');

  const inputRef = useRef(null);
  const renderCountRef = useRef(0);

  renderCountRef.current = renderCountRef.current + 1;

  return (
    <div>
      <h2>useRef Example</h2>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type here"
        ref={inputRef}
      />
      <button
        onClick={() => {
          inputRef.current.focus();
        }}>
        Focus Input
      </button>
      <p>Current value: {value}</p>
      <p>This component has rendered {renderCountRef.current} times</p>
    </div>
  );
}

// =============================================================================
// EXERCISE 4: useImperativeHandle and forwardRef
// =============================================================================

/**
 * Exercise 4: Create a custom input with imperative methods
 *
 * Requirements:
 * - Create a CustomInput component that forwards ref
 * - Use useImperativeHandle to expose focus() and reset() methods
 * - Demonstrate the imperative methods in a parent component
 */
export const CustomInput = forwardRef(function CustomInput(props, ref) {
  const [value, setValue] = useState(props.defaultValue || '');
  const inputRef = useRef(null);

  useImperativeHandle(
    ref,
    () => {
      return {
        focus() {
          inputRef.current.focus();
        },
        reset() {
          setValue('');
        }
      };
    },
    []
  );

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      {...props}
    />
  );
});

export function ImperativeHandleDemo() {
  const inputRef = useRef(null);

  return (
    <div>
      <h2>Imperative Handle Demo</h2>
      <CustomInput placeholder="Type something..." ref={inputRef} />
      <div>
        <button
          onClick={() => {
            inputRef.current.focus();
          }}>
          Focus Input
        </button>
        <button
          onClick={() => {
            inputRef.current.reset();
          }}>
          Reset Input
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// EXERCISE 5: Custom Hooks
// =============================================================================

/**
 * Exercise 5a: Create a useLocalStorage hook
 *
 * Requirements:
 * - Hook should work like useState but persist to localStorage
 * - Should handle serialization/deserialization of values
 * - Should return [value, setValue] just like useState
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(getStoredValue(key) || initialValue);

  function getStoredValue(key) {
    const data = localStorage.getItem(key);

    try {
      return JSON.parse(data);
    } catch (err) {
      return null;
    }
  }

  function setStoredValue(newValue) {
    localStorage.setItem(key, JSON.stringify(newValue));
    setValue(newValue);
  }

  useEffect(() => {
    setValue(getStoredValue(key) || initialValue);
  }, [key]);

  return [value, setStoredValue];
}

/**
 * Exercise 5b: Create a useWindowSize hook
 *
 * Requirements:
 * - Hook should track window dimensions
 * - Should update when window is resized
 * - Should clean up event listeners
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    width: windowSize.width,
    height: windowSize.height
  };
}

/**
 * Demo component to showcase both custom hooks
 */
export function CustomHooksDemo() {
  const { width, height } = useWindowSize();
  const [value, setValue] = useLocalStorage('testKey', 'defaultValue');

  return (
    <div>
      <h2>Custom Hooks Demo</h2>
      <div>
        <h3>Local Storage</h3>
        <input
          type="text"
          placeholder="Value persists in localStorage"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <p>Stored value: {value}</p>
      </div>

      <div>
        <h3>Window Size</h3>
        <p>
          Current window dimensions: {width} x {height}
        </p>
        <p>
          <small>Try resizing your browser window</small>
        </p>
      </div>
    </div>
  );
}

// =============================================================================
// EXERCISE 6: useLayoutEffect vs useEffect
// =============================================================================

/**
 * Exercise 6: Compare useLayoutEffect and useEffect timing
 *
 * Requirements:
 * - Create a component with a toggle button for content visibility
 * - Implement positioning logic with both hooks
 * - Demonstrate how useLayoutEffect runs synchronously before paint
 * - Show the difference in timing between useLayoutEffect and useEffect
 */
export function LayoutEffectDemo() {
  const [showContent, setShowContent] = useState(false);
  const layoutEffectBoxRef = useRef();
  const effectBoxRef = useRef();

  useLayoutEffect(() => {
    if (showContent) {
      const { height } = layoutEffectBoxRef.current.getBoundingClientRect();
      console.log(`useLayoutEffect: ${height}`);
    }
  }, []);

  useEffect(() => {
    if (showContent) {
      const { height } = effectBoxRef.current.getBoundingClientRect();
      console.log(`useEffect: ${height}`);
    }
  }, []);

  return (
    <div>
      <h2>Layout Effect vs Effect Demo</h2>
      <button onClick={() => setShowContent((prev) => !prev)}>
        {showContent ? 'Hide' : 'Show'} Content
      </button>

      <div style={{ position: 'relative', marginTop: '20px' }}>
        {showContent && (
          <>
            <div
              ref={layoutEffectBoxRef}
              style={{
                position: 'absolute',
                left: '0',
                backgroundColor: 'lightblue',
                padding: '10px',
                border: '1px solid blue'
              }}>
              Positioned with useLayoutEffect
            </div>

            <div
              ref={effectBoxRef}
              style={{
                position: 'absolute',
                left: '0',
                top: '50px',
                backgroundColor: 'lightpink',
                padding: '10px',
                border: '1px solid red'
              }}>
              Positioned with useEffect
            </div>
          </>
        )}
      </div>
    </div>
  );
}
