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

  // TODO: Implement useMemo to calculate fibonacci(number)
  // This calculation should only run when number changes
  // Hint: Add console.log in the calculation to see when it runs

  return (
    <div>
      <h2>Fibonacci Calculator</h2>
      <p>
        Fibonacci of {number}: {/* Display fibonacci result here */}
      </p>
      <p>This is {/* Show if using cached value or not */}</p>
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

  // TODO: Implement useCallback to optimize this function
  // This function should only be recreated when text changes
  // Not when count changes
  const handleChildClick = () => {
    console.log(`You clicked on: ${text}`);
  };

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

  // TODO: Implement useRef for input element
  // TODO: Implement useRef for render counting

  // TODO: Increment render count on each render

  return (
    <div>
      <h2>useRef Example</h2>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type here"
        // TODO: Add ref to this input
      />
      <button
        onClick={() => {
          // TODO: Implement focus functionality
        }}>
        Focus Input
      </button>
      <p>Current value: {value}</p>
      <p>This component has rendered {/* Show render count */} times</p>
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
  const [value, setValue] = useState('');
  const inputRef = useRef();

  // TODO: Implement useImperativeHandle to expose methods:
  // 1. focus() - should focus the input element
  // 2. reset() - should clear the input value

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
  // TODO: Create a ref to control the CustomInput

  return (
    <div>
      <h2>Imperative Handle Demo</h2>
      <CustomInput placeholder="Type something..." />
      <div>
        <button
          onClick={() => {
            // TODO: Call focus() on the CustomInput
          }}>
          Focus Input
        </button>
        <button
          onClick={() => {
            // TODO: Call reset() on the CustomInput
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
  // TODO: Implement localStorage hook
  // 1. Initialize state by reading from localStorage
  // 2. Create setValue function that updates both state and localStorage
  // 3. Return [value, setValue] like useState
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
  // TODO: Implement window dimensions hook
  // 1. Create state for width and height
  // 2. Add resize event listener to update dimensions
  // 3. Clean up event listener in useEffect return function
  // 4. Return current dimensions object
}

/**
 * Demo component to showcase both custom hooks
 */
export function CustomHooksDemo() {
  // TODO: Use both custom hooks in this component

  return (
    <div>
      <h2>Custom Hooks Demo</h2>
      <div>
        <h3>Local Storage</h3>
        <input
          type="text"
          placeholder="Value persists in localStorage"
          // TODO: Connect to useLocalStorage
        />
        <p>Stored value: {/* Display stored value */}</p>
      </div>

      <div>
        <h3>Window Size</h3>
        <p>
          Current window dimensions: {/* Display width */} x{' '}
          {/* Display height */}
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

  // TODO: Implement useLayoutEffect example
  // This should run synchronously before browser paint

  // TODO: Implement useEffect example
  // This will run asynchronously after browser paint

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
