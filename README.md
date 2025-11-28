# Test Driven React Assessment

A set of tasks to assesses the skills of a candidate for a React position, or to evaluate and improve one's own skills.
Fundamental concept demonstrations for learning/assessment of React.
Simple exercises that clearly isolate each concept.

1. Clear documentation blocks with examples and expected outputs
2. Graduated difficulty from basic concepts to advanced patterns

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

### 10. Architecture and Design (react-architecture.jsx)

- Code splitting strategies
- State architecture patterns
- API integration patterns
- Authentication patterns

### 11. Concurrent Features (react-concurrent.jsx)

- Suspense for data fetching
- useTransition for non-urgent updates
- useDeferredValue for expensive computations
- useOptimistic for optimistic updates
- Progressive enhancement

### 12. Libraries (react-libraries.jsx)

- Axios - data fetching
- React Query - date fetching
- Redux - state management
- Zustand - state management

## React issues

### State management

- Unnecessary state (could it be derived?)
- State in wrong component (should it be lifted up or down?)
- Missing state (hardcoded values that should be dynamic)
- Improper state updates (mutating state directly)

### Hook problems

- useEffect with missing dependencies
- useEffect running too often (missing dependency array)
- Event handlers recreated on every render (missing useCallback)
- Expensive calculations not memoized (missing useMemo)

### Common mistakes

- Keys missing or using array indices as keys
- Inline function definitions in JSX (performance issue)
- Not handling loading/error states
- Props not validated or typed

### Code quality

- Unclear variable/function names
- Repeated code that should be extracted
- Magic numbers or strings (should be constants)
- Overly complex components (doing too much)

### Data Fetching

- Fetching in wrong place (not in useEffect)
- No cleanup in useEffect
- No loading states
- No error handling
- Race conditions (multiple fetches)

### Forms

- Uncontrolled inputs mixed with controlled
- Not preventing default on form submit
- No validation
- Not clearing form after submit

### Accessibility Issues

- Missing alt text on images
- Buttons that should be buttons (not divs with onClick)
- Missing labels on form inputs
- Poor heading hierarchy
- No keyboard navigation support

### Performance Red Flags

- Creating objects/arrays in render
- Not using keys properly in lists
- Unnecessary component re-renders
- Large components that should be split
