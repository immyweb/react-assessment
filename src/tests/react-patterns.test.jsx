import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  // Exercise 1: Higher-Order Components
  withLoading,
  withClickCounter,

  // Exercise 2: Render Props
  Counter,
  Toggle,

  // Exercise 3: Compound Components
  Modal,
  Card,

  // Exercise 4: Polymorphic Components
  Button,
  Text,

  // Exercise 5: Headless Components
  HeadlessCounter,
  HeadlessToggle,

  // Exercise 6: Provider Patterns
  ThemeProvider,
  useTheme,
  UserProvider,
  useUser,

  // Exercise 7: Inversion of Control
  ConfigurableButton,
  ConfigurableForm
} from '../exercises/react-patterns.jsx';

// =============================================================================
// EXERCISE 1: Higher-Order Components (HOCs) Tests
// =============================================================================

describe('Higher-Order Components', () => {
  describe('withLoading', () => {
    it('should display loading state when isLoading is true', () => {
      const TestComponent = () => <div>Content loaded</div>;
      const WithLoadingComponent = withLoading(TestComponent);

      render(<WithLoadingComponent isLoading={true} />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByText('Content loaded')).not.toBeInTheDocument();
    });

    it('should display wrapped component when isLoading is false', () => {
      const TestComponent = () => <div>Content loaded</div>;
      const WithLoadingComponent = withLoading(TestComponent);

      render(<WithLoadingComponent isLoading={false} />);

      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.getByText('Content loaded')).toBeInTheDocument();
    });

    it('should pass through other props to wrapped component', () => {
      const TestComponent = ({ title, data }) => (
        <div>
          <h1>{title}</h1>
          <p>{data}</p>
        </div>
      );
      const WithLoadingComponent = withLoading(TestComponent);

      render(
        <WithLoadingComponent
          isLoading={false}
          title="Test Title"
          data="Test Data"
        />
      );

      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Data')).toBeInTheDocument();
    });
  });

  describe('withClickCounter', () => {
    it('should track click count and provide it to wrapped component', async () => {
      const TestComponent = ({ clickCount, onClick }) => (
        <button onClick={onClick}>Clicked {clickCount} times</button>
      );
      const WithClickCounterComponent = withClickCounter(TestComponent);

      render(<WithClickCounterComponent />);

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Clicked 0 times');

      await userEvent.click(button);
      expect(button).toHaveTextContent('Clicked 1 times');

      await userEvent.click(button);
      expect(button).toHaveTextContent('Clicked 2 times');
    });

    it('should reset click count when resetCount is called', async () => {
      const TestComponent = ({ clickCount, onClick, resetCount }) => (
        <div>
          <button onClick={onClick}>Click me</button>
          <button onClick={resetCount}>Reset</button>
          <span>Count: {clickCount}</span>
        </div>
      );
      const WithClickCounterComponent = withClickCounter(TestComponent);

      render(<WithClickCounterComponent />);

      const clickButton = screen.getByText('Click me');
      const resetButton = screen.getByText('Reset');

      await userEvent.click(clickButton);
      await userEvent.click(clickButton);
      expect(screen.getByText('Count: 2')).toBeInTheDocument();

      await userEvent.click(resetButton);
      expect(screen.getByText('Count: 0')).toBeInTheDocument();
    });
  });
});

// =============================================================================
// EXERCISE 2: Render Props Pattern Tests
// =============================================================================

describe('Render Props Pattern', () => {
  describe('Counter', () => {
    it('should provide counter state and controls through render prop', async () => {
      render(
        <Counter initialCount={5}>
          {({ count, increment, decrement, reset }) => (
            <div>
              <span>Count: {count}</span>
              <button onClick={increment}>+</button>
              <button onClick={decrement}>-</button>
              <button onClick={reset}>Reset</button>
            </div>
          )}
        </Counter>
      );

      expect(screen.getByText('Count: 5')).toBeInTheDocument();

      await userEvent.click(screen.getByText('+'));
      expect(screen.getByText('Count: 6')).toBeInTheDocument();

      await userEvent.click(screen.getByText('-'));
      expect(screen.getByText('Count: 5')).toBeInTheDocument();

      await userEvent.click(screen.getByText('Reset'));
      expect(screen.getByText('Count: 5')).toBeInTheDocument();
    });

    it('should default to 0 when no initial count provided', () => {
      render(<Counter>{({ count }) => <span>Count: {count}</span>}</Counter>);

      expect(screen.getByText('Count: 0')).toBeInTheDocument();
    });
  });

  describe('Toggle', () => {
    it('should provide toggle state and controls through render prop', async () => {
      render(
        <Toggle initialValue={false}>
          {({ isOn, toggle, turnOn, turnOff }) => (
            <div>
              <span>Status: {isOn ? 'ON' : 'OFF'}</span>
              <button onClick={toggle}>Toggle</button>
              <button onClick={turnOn}>Turn On</button>
              <button onClick={turnOff}>Turn Off</button>
            </div>
          )}
        </Toggle>
      );

      expect(screen.getByText('Status: OFF')).toBeInTheDocument();

      await userEvent.click(screen.getByText('Toggle'));
      expect(screen.getByText('Status: ON')).toBeInTheDocument();

      await userEvent.click(screen.getByText('Turn Off'));
      expect(screen.getByText('Status: OFF')).toBeInTheDocument();

      await userEvent.click(screen.getByText('Turn On'));
      expect(screen.getByText('Status: ON')).toBeInTheDocument();
    });

    it('should respect initial value', () => {
      render(
        <Toggle initialValue={true}>
          {({ isOn }) => <span>Status: {isOn ? 'ON' : 'OFF'}</span>}
        </Toggle>
      );

      expect(screen.getByText('Status: ON')).toBeInTheDocument();
    });
  });
});

// =============================================================================
// EXERCISE 3: Compound Components Tests
// =============================================================================

describe('Compound Components', () => {
  describe('Modal', () => {
    it('should render modal with header, body, and footer', () => {
      render(
        <Modal isOpen={true}>
          <Modal.Header>Test Header</Modal.Header>
          <Modal.Body>Test Body Content</Modal.Body>
          <Modal.Footer>Test Footer</Modal.Footer>
        </Modal>
      );

      expect(screen.getByText('Test Header')).toBeInTheDocument();
      expect(screen.getByText('Test Body Content')).toBeInTheDocument();
      expect(screen.getByText('Test Footer')).toBeInTheDocument();
    });

    it('should not render when isOpen is false', () => {
      render(
        <Modal isOpen={false}>
          <Modal.Header>Test Header</Modal.Header>
          <Modal.Body>Test Body Content</Modal.Body>
        </Modal>
      );

      expect(screen.queryByText('Test Header')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Body Content')).not.toBeInTheDocument();
    });

    it('should call onClose when close action is triggered', async () => {
      const onClose = vi.fn();

      render(
        <Modal isOpen={true} onClose={onClose}>
          <Modal.Header>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );

      const closeButton = screen.getByRole('button');
      await userEvent.click(closeButton);

      expect(onClose).toHaveBeenCalledOnce();
    });
  });

  describe('Card', () => {
    it('should render card with header, body, and footer', () => {
      render(
        <Card>
          <Card.Header>Card Title</Card.Header>
          <Card.Body>Card content goes here</Card.Body>
          <Card.Footer>Card footer</Card.Footer>
        </Card>
      );

      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card content goes here')).toBeInTheDocument();
      expect(screen.getByText('Card footer')).toBeInTheDocument();
    });

    it('should handle missing compound components gracefully', () => {
      render(
        <Card>
          <Card.Body>Only body content</Card.Body>
        </Card>
      );

      expect(screen.getByText('Only body content')).toBeInTheDocument();
    });
  });
});

// =============================================================================
// EXERCISE 4: Polymorphic Components Tests
// =============================================================================

describe('Polymorphic Components', () => {
  describe('Button', () => {
    it('should render as button element by default', () => {
      render(<Button>Click me</Button>);

      const element = screen.getByRole('button');
      expect(element.tagName.toLowerCase()).toBe('button');
    });

    it('should render as specified element when as prop is provided', () => {
      render(
        <Button as="a" href="https://example.com">
          Link button
        </Button>
      );

      const element = screen.getByRole('link');
      expect(element.tagName.toLowerCase()).toBe('a');
      expect(element).toHaveAttribute('href', 'https://example.com');
    });

    it('should apply variant styles correctly', () => {
      render(<Button variant="primary">Primary button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('primary');
    });

    it('should handle click events', async () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Clickable</Button>);

      await userEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledOnce();
    });
  });

  describe('Text', () => {
    it('should render as span by default', () => {
      render(<Text>Some text</Text>);

      const element = screen.getByText('Some text');
      expect(element.tagName.toLowerCase()).toBe('span');
    });

    it('should render as specified element when as prop is provided', () => {
      render(<Text as="h1">Heading text</Text>);

      const element = screen.getByRole('heading');
      expect(element.tagName.toLowerCase()).toBe('h1');
    });

    it('should apply size styles correctly', () => {
      render(<Text size="large">Large text</Text>);

      const element = screen.getByText('Large text');
      expect(element).toHaveClass('large');
    });
  });
});

// =============================================================================
// EXERCISE 5: Headless Components Tests
// =============================================================================

describe('Headless Components', () => {
  describe('HeadlessCounter', () => {
    it('should provide counter logic without UI', async () => {
      render(
        <HeadlessCounter initialValue={10}>
          {({ count, increment, decrement, reset }) => (
            <div>
              <span data-testid="count">Count: {count}</span>
              <button data-testid="increment" onClick={increment}>
                +
              </button>
              <button data-testid="decrement" onClick={decrement}>
                -
              </button>
              <button data-testid="reset" onClick={reset}>
                Reset
              </button>
            </div>
          )}
        </HeadlessCounter>
      );

      expect(screen.getByTestId('count')).toHaveTextContent('Count: 10');

      await userEvent.click(screen.getByTestId('increment'));
      expect(screen.getByTestId('count')).toHaveTextContent('Count: 11');

      await userEvent.click(screen.getByTestId('decrement'));
      expect(screen.getByTestId('count')).toHaveTextContent('Count: 10');

      await userEvent.click(screen.getByTestId('reset'));
      expect(screen.getByTestId('count')).toHaveTextContent('Count: 10');
    });

    it('should default to 0 when no initial value provided', () => {
      render(
        <HeadlessCounter>
          {({ count }) => <span data-testid="count">{count}</span>}
        </HeadlessCounter>
      );

      expect(screen.getByTestId('count')).toHaveTextContent('0');
    });
  });

  describe('HeadlessToggle', () => {
    it('should provide toggle logic without UI', async () => {
      render(
        <HeadlessToggle initialValue={true}>
          {({ isOn, toggle, turnOn, turnOff }) => (
            <div>
              <span data-testid="status">Status: {isOn ? 'ON' : 'OFF'}</span>
              <button data-testid="toggle" onClick={toggle}>
                Toggle
              </button>
              <button data-testid="turn-on" onClick={turnOn}>
                Turn On
              </button>
              <button data-testid="turn-off" onClick={turnOff}>
                Turn Off
              </button>
            </div>
          )}
        </HeadlessToggle>
      );

      expect(screen.getByTestId('status')).toHaveTextContent('Status: ON');

      await userEvent.click(screen.getByTestId('toggle'));
      expect(screen.getByTestId('status')).toHaveTextContent('Status: OFF');

      await userEvent.click(screen.getByTestId('turn-on'));
      expect(screen.getByTestId('status')).toHaveTextContent('Status: ON');

      await userEvent.click(screen.getByTestId('turn-off'));
      expect(screen.getByTestId('status')).toHaveTextContent('Status: OFF');
    });
  });
});

// =============================================================================
// EXERCISE 6: Provider Pattern Tests
// =============================================================================

describe('Provider Patterns', () => {
  describe('ThemeProvider', () => {
    it('should provide theme context to children', () => {
      const TestComponent = () => {
        const { currentTheme, themes } = useTheme();
        return (
          <div>
            <span data-testid="current-theme">{currentTheme}</span>
            <span data-testid="available-themes">
              {Object.keys(themes).join(',')}
            </span>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      expect(screen.getByTestId('available-themes')).toHaveTextContent(
        'light,dark'
      );
    });

    it('should allow theme switching', async () => {
      const TestComponent = () => {
        const { currentTheme, toggleTheme } = useTheme();
        return (
          <div>
            <span data-testid="current-theme">{currentTheme}</span>
            <button onClick={toggleTheme}>Toggle Theme</button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');

      await userEvent.click(screen.getByText('Toggle Theme'));
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    });

    it('should throw error when useTheme is used outside provider', () => {
      const TestComponent = () => {
        useTheme();
        return <div>Test</div>;
      };

      // Suppress console.error for this test
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => render(<TestComponent />)).toThrow();

      consoleSpy.mockRestore();
    });
  });

  describe('UserProvider', () => {
    it('should provide user context to children', () => {
      const TestComponent = () => {
        const { user, isAuthenticated } = useUser();
        return (
          <div>
            <span data-testid="auth-status">
              {isAuthenticated ? 'authenticated' : 'not authenticated'}
            </span>
            <span data-testid="user-name">{user?.name || 'no user'}</span>
          </div>
        );
      };

      render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );

      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'not authenticated'
      );
      expect(screen.getByTestId('user-name')).toHaveTextContent('no user');
    });

    it('should handle login and logout', async () => {
      const TestComponent = () => {
        const { user, isAuthenticated, login, logout } = useUser();
        return (
          <div>
            <span data-testid="auth-status">
              {isAuthenticated ? 'authenticated' : 'not authenticated'}
            </span>
            <span data-testid="user-name">{user?.name || 'no user'}</span>
            <button
              onClick={() =>
                login({ name: 'John Doe', email: 'john@example.com' })
              }>
              Login
            </button>
            <button onClick={logout}>Logout</button>
          </div>
        );
      };

      render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );

      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'not authenticated'
      );

      await userEvent.click(screen.getByText('Login'));
      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'authenticated'
      );
      expect(screen.getByTestId('user-name')).toHaveTextContent('John Doe');

      await userEvent.click(screen.getByText('Logout'));
      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'not authenticated'
      );
      expect(screen.getByTestId('user-name')).toHaveTextContent('no user');
    });
  });
});

// =============================================================================
// EXERCISE 7: Inversion of Control Tests
// =============================================================================

describe('Inversion of Control Patterns', () => {
  describe('ConfigurableButton', () => {
    it('should apply configuration for styling and behavior', () => {
      const config = {
        variant: 'primary',
        size: 'large',
        disabled: false
      };

      render(
        <ConfigurableButton config={config}>
          Configured Button
        </ConfigurableButton>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('primary', 'large');
      expect(button).not.toBeDisabled();
    });

    it('should call provided handlers for events', async () => {
      const onClick = vi.fn();
      const onHover = vi.fn();
      const handlers = { onClick, onHover };

      render(
        <ConfigurableButton handlers={handlers}>
          Interactive Button
        </ConfigurableButton>
      );

      const button = screen.getByRole('button');

      await userEvent.click(button);
      expect(onClick).toHaveBeenCalledOnce();

      await userEvent.hover(button);
      expect(onHover).toHaveBeenCalledOnce();
    });

    it('should handle disabled state', () => {
      const config = { disabled: true };
      const onClick = vi.fn();
      const handlers = { onClick };

      render(
        <ConfigurableButton config={config} handlers={handlers}>
          Disabled Button
        </ConfigurableButton>
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('ConfigurableForm', () => {
    it('should render fields based on configuration', () => {
      const fields = [
        { name: 'email', type: 'email', label: 'Email', required: true },
        {
          name: 'password',
          type: 'password',
          label: 'Password',
          required: true
        },
        { name: 'age', type: 'number', label: 'Age', required: false }
      ];

      render(<ConfigurableForm fields={fields} />);

      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByLabelText('Age')).toBeInTheDocument();

      // Check field types
      expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
      expect(screen.getByLabelText('Password')).toHaveAttribute(
        'type',
        'password'
      );
      expect(screen.getByLabelText('Age')).toHaveAttribute('type', 'number');

      // Check required attributes
      expect(screen.getByLabelText('Email')).toBeRequired();
      expect(screen.getByLabelText('Password')).toBeRequired();
      expect(screen.getByLabelText('Age')).not.toBeRequired();
    });

    it('should handle form submission', async () => {
      const onSubmit = vi.fn();
      const fields = [
        { name: 'email', type: 'email', label: 'Email', required: true }
      ];

      render(<ConfigurableForm fields={fields} onSubmit={onSubmit} />);

      const emailInput = screen.getByLabelText('Email');
      const submitButton = screen.getByRole('button', { name: /submit/i });

      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.click(submitButton);

      expect(onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com'
      });
    });

    it('should handle validation', async () => {
      const validate = vi.fn((values) => {
        const errors = {};
        if (!values.email?.includes('@')) {
          errors.email = 'Invalid email';
        }
        return errors;
      });

      const fields = [
        { name: 'email', type: 'email', label: 'Email', required: true }
      ];

      render(<ConfigurableForm fields={fields} validate={validate} />);

      const emailInput = screen.getByLabelText('Email');

      await userEvent.type(emailInput, 'invalid-email');
      await userEvent.tab(); // Trigger validation

      await waitFor(() => {
        expect(screen.getByText('Invalid email')).toBeInTheDocument();
      });

      expect(validate).toHaveBeenCalledWith({ email: 'invalid-email' });
    });

    it('should prevent submission when validation fails', async () => {
      const onSubmit = vi.fn();
      const validate = vi.fn(() => ({ email: 'Invalid email' }));

      const fields = [
        { name: 'email', type: 'email', label: 'Email', required: true }
      ];

      render(
        <ConfigurableForm
          fields={fields}
          onSubmit={onSubmit}
          validate={validate}
        />
      );

      const submitButton = screen.getByRole('button', { name: /submit/i });
      await userEvent.click(submitButton);

      expect(onSubmit).not.toHaveBeenCalled();
    });
  });
});
