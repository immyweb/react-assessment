# React TDD Exercises

A set of tasks to assesses the skills of a candidate for a React position, or to evaluate and improve one's own skills.
Fundamental concept demonstrations for learning/assessment of React.
Simple exercises that clearly isolate each concept.

1. Clear documentation blocks with examples and expected outputs
2. Graduated difficulty from basic concepts to advanced patterns

# Technologies

## Core Testing Framework:

- vitest - Main testing framework
- @vitest/ui - Visual test interface
- @vitest/coverage-v8 - Code coverage reports
- @vitest/browser - Browser-based testing
- playwright - Browser automation for realistic testing

## DOM Environment:

- jsdom - DOM simulation for testing

## React Testing Libraries:

- @testing-library/react - React component testing utilities
- @testing-library/jest-dom - Custom DOM matchers
- @testing-library/user-event - User interaction simulation

## Mocking:

- msw - Mock Service Worker for API mocking

## React & Build Tools:

- react - React library
- react-dom - React DOM renderer
- @vitejs/plugin-react - Vite plugin for React support

## File and Folder Stucture

src/
├── exercises/
│ ├── react-fundamentals.jsx
│ ├── react-state.jsx
│ ├── react-effects.jsx
│ ├── react-context.jsx
│ ├── react-hooks.jsx
│ ├── react-performance.jsx
│ ├── react-patterns.jsx
│ ├── react-forms.jsx
│ ├── react-errors.jsx
│ ├── react-testing.jsx
│ ├── react-architecture.jsx
│ └── react-concurrent.jsx
├── tests/
│ ├── react-fundamentals.test.jsx
│ ├── react-state.test.jsx
│ ├── react-effects.test.jsx
│ ├── react-context.test.jsx
│ ├── react-hooks.test.jsx
│ ├── react-performance.test.jsx
│ ├── react-patterns.test.jsx
│ ├── react-forms.test.jsx
│ ├── react-errors.test.jsx
│ ├── react-testing.test.jsx
│ ├── react-architecture.test.jsx
│ └── react-concurrent.test.jsx
└── answers/
├── react-fundamentals.jsx
├── react-state.jsx
├── react-effects.jsx
├── react-context.jsx
├── react-hooks.jsx
├── react-performance.jsx
├── react-patterns.jsx
├── react-forms.jsx
├── react-errors.jsx
├── react-testing.test.jsx
├── react-architecture.jsx
└── react-concurrent.jsx

## Example Exercise Pattern

Each exercise would follow this structure:

```
/**
 * Create a custom hook that manages online/offline status
 * Should return boolean indicating if user is online
 * Should handle both initial state and status changes
 *
 * const OnlineStatus = () => {
 *   const isOnline = useOnlineStatus();
 *   return <div>{isOnline ? 'Online' : 'Offline'}</div>;
 * };
 */
export function useOnlineStatus() {
  // TODO: Implement custom hook
}
```

## Topics covered

### 1. Core React Concepts (react-fundamentals.jsx)

- Component creation and JSX
- Props and prop validation
- Event handling and synthetic events
- Conditional rendering patterns
- Lists and keys
- Component composition patterns
- Controlled vs uncontrolled components

### 2. State Management (react-state.jsx)

- useState hook fundamentals
- State updates and batching
- State structure design
- Avoiding state mutations
- State lifting patterns
- useReducer for complex state
- State normalization techniques

### 3. Effects and Side Effects (react-effects.jsx)

- useEffect hook patterns
- Effect dependencies and cleanup
- Effect timing (layout effects)
- Data fetching patterns
- Subscription management
- Race condition handling
- Effect optimization

### 4. Context and Global State (react-context.jsx)

- createContext and useContext
- Context provider patterns
- Avoiding prop drilling
- Multiple context composition
- Context optimization techniques
- Custom context hooks
- Context vs state management libraries

### 5. Advanced Hooks (react-hooks.jsx)

- useMemo and useCallback optimization
- useRef for DOM access and values
- useImperativeHandle patterns
- Custom hook creation
- Hook composition patterns
- useLayoutEffect use cases
- useSyncExternalStore integration

### 6. Performance Optimization (react-performance.jsx)

- React.memo and memoization
- Component splitting strategies
- Bundle splitting techniques
- Lazy loading and Suspense
- Virtual list implementations
- Render optimization patterns
- Performance measurement tools

### 7. Advanced Patterns (react-patterns.jsx)

- Higher-Order Components (HOCs)
- Render props pattern
- Compound components
- Polymorphic components
- Headless component patterns
- Provider pattern variations
- Inversion of control patterns

### 8. Forms and Validation (react-forms.jsx)

- Controlled form patterns
- Form validation strategies
- Dynamic form generation
- File upload handling
- Form state management
- Custom form hooks
- Accessibility in forms

### 9. Error Handling (react-errors.jsx)

- Error boundaries
- Error recovery strategies
- Async error handling
- Error reporting patterns
- Graceful degradation
- Development vs production errors
- Error boundary composition

### 10. Testing Patterns (react-testing.jsx)

- Component testing strategies
- Hook testing patterns
- Mock and stub techniques
- Integration testing approaches
- Accessibility testing
- Performance testing
- Test utilities creation

### 11. Architecture and Design (react-architecture.jsx)

- Component organization
- Code splitting strategies
- State architecture patterns
- API integration patterns
- Routing integration
- Authentication patterns
- Feature-based organization

### 12. Concurrent Features (react-concurrent.jsx)

- Suspense for data fetching
- Concurrent rendering concepts
- useTransition for non-urgent updates
- useDeferredValue for expensive computations
- Server-side rendering considerations
- Streaming and partial hydration
- Progressive enhancement
