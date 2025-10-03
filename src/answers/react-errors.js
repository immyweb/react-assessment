/**
 * React Error Handling Exercises
 *
 * This file contains exercises covering React error handling concepts:
 * - Error boundaries
 * - Error recovery strategies
 * - Async error handling
 * - Error reporting patterns
 * - Graceful degradation
 * - Development vs production errors
 * - Error boundary composition
 *
 * Each exercise includes:
 * - Clear documentation with examples
 * - Expected behavior description
 * - Component requirements
 */

import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// =============================================================================
// EXERCISE 1: Basic Error Boundary
// =============================================================================

/**
 * Create a basic error boundary component that catches errors in its children.
 * The component should:
 * - Implement getDerivedStateFromError to update state when an error occurs
 * - Implement componentDidCatch to log error information
 * - Render a fallback UI when an error is caught
 * - Otherwise render its children
 *
 * Example usage:
 * <ErrorBoundary>
 *   <ComponentThatMightError />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error(error, info.componentStack, React.captureOwnerStack());
  }

  render() {
    if (this.state.hasError) {
      return <p>Something went wrong</p>;
    }

    return this.props.children;
  }
}

/**
 * This component is intentionally broken to test error boundaries.
 * DO NOT FIX THE ERROR - it's meant to trigger the error boundary.
 */
export function BrokenComponent() {
  // This will throw an error when rendered
  return <div>{nonExistentVariable.property}</div>;
}

// =============================================================================
// EXERCISE 2: Error Recovery Strategy
// =============================================================================

/**
 * Create a component that demonstrates error recovery.
 * The component should:
 * - Have a button that triggers an error when clicked
 * - Catch the error without crashing the entire application
 * - Provide a "Reset" button that recovers from the error state
 * - Display an error message when in the error state
 *
 * Example usage:
 * <ErrorRecoveryComponent />
 */
export function ErrorRecoveryComponent() {
  const [error, setError] = useState(false);

  function handleClick() {
    try {
      nonExistantFunction();
    } catch (err) {
      setError(true);
    }
  }

  function handleReset() {
    setError(false);
  }

  return (
    <div>
      {<button onClick={handleClick}>Trigger error</button>}
      {error && <p>Error occurred</p>}
      {error && <button onClick={handleReset}>Reset</button>}
    </div>
  );
}

// =============================================================================
// EXERCISE 3: Async Error Handling
// =============================================================================

/**
 * Create a component that handles errors in async operations.
 * The component should:
 * - Fetch data from an API endpoint (you can simulate this with a Promise)
 * - Handle potential errors from the fetch operation
 * - Display appropriate loading, error, and success states
 * - Provide a "Retry" button to attempt the operation again after failure
 *
 * Example usage:
 * <AsyncErrorHandler endpoint="https://api.example.com/data" />
 */
export function AsyncErrorHandler({ endpoint }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);
  const [reset, setReset] = useState(false);

  useEffect(() => {
    async function getData() {
      try {
        setLoading(true);
        setError(false);
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }

        const jsonData = await response.json();
        console.log(jsonData);
        setData(jsonData);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
        setReset(false);
      }
    }
    getData();
  }, [endpoint, reset]);

  if (loading) {
    return <div>loading...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Data fetch failed. Please try again</p>
        <button onClick={() => setReset(true)}>Retry</button>
      </div>
    );
  }

  if (data) {
    return <div>{data.data}</div>;
  }

  return <div>No data found</div>;
}

AsyncErrorHandler.propTypes = {
  endpoint: PropTypes.string.isRequired
};

// =============================================================================
// EXERCISE 4: Error Reporting Pattern
// =============================================================================

/**
 * Create a component that implements error reporting.
 * The component should:
 * - Have a higher-order component or custom hook for error reporting
 * - Capture error details (message, component name, stack trace)
 * - Provide a way to "send" error reports (simulated)
 * - Include user feedback mechanism (e.g., "Report this error" button)
 *
 * Example usage:
 * <ErrorReporter>
 *   <YourComponent />
 * </ErrorReporter>
 */
export function withErrorReporting(WrappedComponent) {
  return class ErrorBoundary extends Component {
    constructor(props) {
      super(props);
      this.state = {
        hasError: false,
        errorMessage: '',
        errorComp: '',
        errorStackTrace: ''
      };
    }

    static getDerivedStateFromError(error) {
      return {
        hasError: true
      };
    }

    componentDidCatch(error, info) {
      console.error(error, info.componentStack, React.captureOwnerStack());
      this.setState({
        errorMessage: error,
        errorComp: info.componentStack,
        errorStackTrace: error.stack
      });
    }

    render() {
      if (this.state.hasError) {
        return (
          <div>
            <p>error occurred</p>
            <button
              onClick={() =>
                console.log(
                  this.state.errorMessage,
                  this.state.errorComp,
                  this.state.errorStackTrace
                )
              }>
              Report this error
            </button>
          </div>
        );
      }

      return <WrappedComponent />;
    }
  };
}

// A custom hook version for error reporting
export function useErrorReporting() {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorComp, setErrorComp] = useState('');
  const [errorStackTrace, setErrorStackTrace] = useState('');

  function reportError(error, info) {
    setHasError(true);
    setErrorMessage(error.message);
    if (info) {
      setErrorComp(info.componentStack);
    }
    setErrorStackTrace(error.stack);
  }

  function sendReport() {
    console.error(hasError, errorMessage, errorComp, errorStackTrace);
  }

  return { hasError, reportError, sendReport };
}

// Example component that uses the error reporting
export function ErrorReportingExample() {
  const { hasError, reportError, sendReport } = useErrorReporting();

  function handleClick() {
    try {
      callNonExistantFunction();
    } catch (err) {
      reportError(err);
    }
  }

  return (
    <div>
      <button onClick={() => handleClick()}>Trigger error</button>
      {hasError && (
        <div>
          error occurred.{' '}
          <button onClick={() => sendReport()}>Report error</button>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// EXERCISE 5: Graceful Degradation
// =============================================================================

/**
 * Create a component that demonstrates graceful degradation.
 * The component should:
 * - Have multiple features that might fail independently
 * - If one feature fails, the others should still work
 * - Implement progressive enhancement where features are added if supported
 * - Provide appropriate UI feedback for unavailable features
 *
 * Example usage:
 * <GracefulDegradation />
 */
export function GracefulDegradation() {
  const [items, setItems] = useState([]);
  const [location, setLocation] = useState(null);

  // Localstorage
  useEffect(() => {
    try {
      const items = JSON.parse(localStorage.getItem('items'));
      if (items) {
        setItems(items);
      }
    } catch (err) {
      console.log(err.message);
    }
  }, []);

  // Geolocation
  useEffect(() => {
    function success(position) {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    }

    function error() {
      console.log('Sorry, no position available.');
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }, []);

  function isLocalStorageEnabled() {
    try {
      const key = `__storage__test`;
      window.localStorage.setItem(key, null);
      window.localStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  }

  return (
    <div>
      {isLocalStorageEnabled() ? (
        <section>
          <p>feature 1 localStorage</p>
          <div>
            {items.map((item) => {
              return <div>{item}</div>;
            })}
          </div>
        </section>
      ) : (
        <div>feature unavailable: localstorage</div>
      )}

      {navigator.geolocation && location !== null ? (
        <section>
          <p>feature 2 geolocation</p>
          <div>
            location is: {`Latitude: ${location.lat}`} and{' '}
            {`Longitude: ${location.lng}`}
          </div>
        </section>
      ) : (
        <div>feature unavailable: Geolocation</div>
      )}
    </div>
  );
}

// =============================================================================
// EXERCISE 6: Development vs Production Errors
// =============================================================================

/**
 * Create a component that handles errors differently in dev and prod modes.
 * The component should:
 * - Detect whether it's running in development or production mode
 * - In development: show detailed error information
 * - In production: show user-friendly messages without technical details
 * - Log errors differently based on environment
 *
 * Example usage:
 * <EnvironmentAwareErrorHandler />
 */
export function EnvironmentAwareErrorHandler() {
  const [hasError, setHasError] = useState(false);
  const [errStack, setErrStack] = useState('');

  const { NODE_ENV } = process.env;

  function handleClick() {
    try {
      callNonExistantFunction();
    } catch (err) {
      setHasError(true);
      if (NODE_ENV === 'production') {
        // Send to external service
      }
      if (NODE_ENV === 'development') {
        console.log(err.message, err.stack);
        setErrStack(err.stack);
      }
    }
  }

  return (
    <div>
      <button onClick={() => handleClick()}>Trigger error</button>
      {NODE_ENV === 'development' && hasError && (
        <div>
          <p>Stack trace: {errStack}</p>
        </div>
      )}
      {NODE_ENV === 'production' && hasError && (
        <div>
          <p>something went wrong</p>
        </div>
      )}
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    </div>
  );
}

// =============================================================================
// EXERCISE 7: Error Boundary Composition
// =============================================================================

/**
 * Create a set of specialized error boundaries that can be composed together.
 * The components should:
 * - Create specific error boundaries for different types of errors
 *   (e.g., NetworkErrorBoundary, ValidationErrorBoundary)
 * - Allow boundaries to be nested with appropriate error propagation
 * - Implement different recovery strategies based on error type
 *
 * Example usage:
 * <NetworkErrorBoundary>
 *   <ValidationErrorBoundary>
 *     <YourComponent />
 *   </ValidationErrorBoundary>
 * </NetworkErrorBoundary>
 */
export class NetworkErrorBoundary extends Component {
  // TODO: Implement network-specific error boundary
}

export class ValidationErrorBoundary extends Component {
  // TODO: Implement validation-specific error boundary
}

// Example of error boundary composition
export function ComposedErrorExample() {
  // TODO: Implement an example of composed error boundaries
}
