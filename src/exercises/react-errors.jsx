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
  // TODO: Implement the error boundary
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
  // TODO: Implement error recovery strategy
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
  // TODO: Implement async error handling
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
  // TODO: Implement error reporting HOC
}

// A custom hook version for error reporting
export function useErrorReporting() {
  // TODO: Implement error reporting hook
}

// Example component that uses the error reporting
export function ErrorReportingExample() {
  // TODO: Use either the HOC or custom hook for error reporting
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
  // TODO: Implement graceful degradation
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
  // TODO: Implement environment-specific error handling
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