# AI Coding Agent Instructions

Welcome to the **React Assessment** codebase! This document provides essential guidelines for AI coding agents to be productive and aligned with the project's structure, conventions, and workflows.

## Project Overview

This project evaluates and improves React skills through exercises, tests, and issue analysis. It covers topics like React fundamentals, state management, hooks, performance optimization, and TypeScript integration.

### Key Directories

- **`src/exercises/`**: Contains React exercises for various topics (e.g., `react-fundamentals.jsx`, `react-state.jsx`).
- **`src/answers/`**: Reference solutions for the exercises.
- **`src/tests/`**: Unit tests for exercises, following the `*.test.jsx` naming convention.
- **`src/issues/`**: Common React issues categorized by topic (e.g., `state-management.jsx`, `hooks-problems.jsx`).
- **`docs/`**: Documentation, including architectural decisions.

## Developer Workflows

### Running Tests

- **Test Framework**: This project uses [Vitest](https://vitest.dev/).
- **Run All Tests**: `npx vitest`
- **Run Tests for a Specific File**: `npx vitest src/tests/<test-file>.test.jsx`
- **Watch Mode**: `npx vitest --watch`

### Debugging

- Use `console.log` for debugging React components.
- For tests, use `debug()` from React Testing Library to inspect DOM output.

### Build and Setup

- Install dependencies: `npm install`
- No explicit build step; exercises and tests run directly in the development environment.

## Project-Specific Conventions

### File Naming

- Exercises and their solutions share the same name but are in different directories (e.g., `src/exercises/react-fundamentals.jsx` and `src/answers/react-fundamentals.jsx`).
- Tests follow the `*.test.jsx` naming convention.

### TypeScript

- TypeScript is used in `react-typescript.tsx`.
- Focus on typing props, refs, and event handlers.
- Use utility types like `Pick`, `Omit`, and `Partial` for reusable type definitions.

## Integration Points

- **Libraries**:
  - `axios` for data fetching.
  - `React Query` for server state management.
  - `Zustand` and `Redux` for global state management.
  - `React Hook Form` for form handling.
- **Testing**:
  - React Testing Library for component tests.
  - Vitest for test execution.

## Examples

### React Component

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count - 1)}>-</button>
      <span>{count}</span>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}
```

### Test Example

```jsx
test('increments counter', () => {
  render(<Counter />);
  const button = screen.getByText('+');
  fireEvent.click(button);
  expect(screen.getByText('1')).toBeInTheDocument();
});
```

---

For further details, refer to the [README.md](../README.md) or the `docs/` directory.
