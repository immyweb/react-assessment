/**
 * React Error Handling Tests
 *
 * This file contains tests for the error handling exercises.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
  ErrorBoundary,
  BrokenComponent,
  ErrorRecoveryComponent,
  AsyncErrorHandler,
  withErrorReporting,
  useErrorReporting,
  ErrorReportingExample,
  GracefulDegradation,
  EnvironmentAwareErrorHandler,
  NetworkErrorBoundary,
  ValidationErrorBoundary,
  ComposedErrorExample
} from '../exercises/react-errors';

// Helper function to suppress expected console errors in tests
const suppressConsoleErrors = () => {
  let originalConsoleError = console.error;
  beforeEach(() => {
    console.error = vi.fn();
  });
  afterEach(() => {
    console.error = originalConsoleError;
  });
};

describe('ErrorBoundary', () => {
  suppressConsoleErrors();

  it('renders children when there is no error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <div>Child Component</div>
      </ErrorBoundary>
    );
    expect(getByText('Child Component')).toBeInTheDocument();
  });

  it('renders fallback UI when a child throws an error', () => {
    const { queryByText } = render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );
    expect(queryByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('calls componentDidCatch when an error occurs', () => {
    const componentDidCatchSpy = vi.spyOn(
      ErrorBoundary.prototype,
      'componentDidCatch'
    );
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );
    expect(componentDidCatchSpy).toHaveBeenCalled();
    componentDidCatchSpy.mockRestore();
  });
});

describe('ErrorRecoveryComponent', () => {
  suppressConsoleErrors();

  it('starts in a non-error state', () => {
    const { queryByText } = render(<ErrorRecoveryComponent />);
    expect(queryByText(/error/i)).not.toBeInTheDocument();
  });

  it('shows error state when error is triggered', () => {
    const { getByText } = render(<ErrorRecoveryComponent />);
    fireEvent.click(getByText(/trigger error/i));
    expect(getByText(/error occurred/i)).toBeInTheDocument();
  });

  it('recovers from error state when reset button is clicked', async () => {
    const { getByText, queryByText } = render(<ErrorRecoveryComponent />);
    fireEvent.click(getByText(/trigger error/i));
    expect(getByText(/error occurred/i)).toBeInTheDocument();

    fireEvent.click(getByText(/reset/i));
    await waitFor(() => {
      expect(queryByText(/error occurred/i)).not.toBeInTheDocument();
    });
  });
});

describe('AsyncErrorHandler', () => {
  const mockEndpoint = 'https://api.example.com/data';
  let originalFetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('shows loading state initially', () => {
    global.fetch.mockImplementationOnce(() => new Promise(() => {}));
    const { getByText } = render(<AsyncErrorHandler endpoint={mockEndpoint} />);
    expect(getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows error state when fetch fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    const { findByText } = render(
      <AsyncErrorHandler endpoint={mockEndpoint} />
    );
    expect(await findByText(/failed/i)).toBeInTheDocument();
  });

  it('allows retry after failure', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    const { findByText, getByText } = render(
      <AsyncErrorHandler endpoint={mockEndpoint} />
    );

    await findByText(/failed/i);
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: 'Success' })
    });

    fireEvent.click(getByText(/retry/i));
    expect(await findByText(/success/i)).toBeInTheDocument();
  });
});

describe('ErrorReporting', () => {
  suppressConsoleErrors();

  it('captures errors in withErrorReporting HOC', () => {
    const ErrorComponent = () => {
      throw new Error('Test error');
    };
    const WrappedComponent = withErrorReporting(ErrorComponent);

    const { getByText } = render(<WrappedComponent />);
    expect(getByText(/error occurred/i)).toBeInTheDocument();
    expect(getByText(/report/i)).toBeInTheDocument();
  });

  it('captures errors in useErrorReporting hook', () => {
    const { getByText } = render(<ErrorReportingExample />);
    fireEvent.click(getByText(/trigger error/i));
    expect(getByText(/error occurred/i)).toBeInTheDocument();
  });
});

describe('GracefulDegradation', () => {
  it('renders all working features', () => {
    const { getByText } = render(<GracefulDegradation />);
    expect(getByText(/feature 1/i)).toBeInTheDocument();
    expect(getByText(/feature 2/i)).toBeInTheDocument();
  });

  it('shows appropriate message when a feature is unavailable', () => {
    // Mock one feature to fail
    vi.spyOn(window, 'localStorage').mockImplementationOnce(() => {
      throw new Error('localStorage not available');
    });

    const { getByText } = render(<GracefulDegradation />);
    expect(getByText(/feature unavailable/i)).toBeInTheDocument();
  });
});

describe('EnvironmentAwareErrorHandler', () => {
  suppressConsoleErrors();
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('shows detailed error in development mode', () => {
    process.env.NODE_ENV = 'development';
    const { getByText } = render(<EnvironmentAwareErrorHandler />);
    fireEvent.click(getByText(/trigger error/i));
    expect(getByText(/stack trace/i)).toBeInTheDocument();
  });

  it('shows user-friendly error in production mode', () => {
    process.env.NODE_ENV = 'production';
    const { getByText, queryByText } = render(<EnvironmentAwareErrorHandler />);
    fireEvent.click(getByText(/trigger error/i));
    expect(getByText(/something went wrong/i)).toBeInTheDocument();
    expect(queryByText(/stack trace/i)).not.toBeInTheDocument();
  });
});

describe('Error Boundary Composition', () => {
  suppressConsoleErrors();

  it('handles network errors in NetworkErrorBoundary', () => {
    const ThrowNetworkError = () => {
      throw new Error('Failed to fetch');
    };

    const { getByText } = render(
      <NetworkErrorBoundary>
        <ThrowNetworkError />
      </NetworkErrorBoundary>
    );

    expect(getByText(/network error/i)).toBeInTheDocument();
  });

  it('handles validation errors in ValidationErrorBoundary', () => {
    const ThrowValidationError = () => {
      throw new Error('Validation failed');
    };

    const { getByText } = render(
      <ValidationErrorBoundary>
        <ThrowValidationError />
      </ValidationErrorBoundary>
    );

    expect(getByText(/validation error/i)).toBeInTheDocument();
  });

  it('demonstrates composition of error boundaries', () => {
    const { getByText } = render(<ComposedErrorExample />);
    expect(getByText(/nested error boundaries/i)).toBeInTheDocument();
  });
});
