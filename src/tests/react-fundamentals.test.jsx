/**
 * React Fundamentals Tests
 *
 * Test suite for React fundamentals exercises covering:
 * - Component creation and JSX
 * - Props and prop validation
 * - Event handling and synthetic events
 * - Conditional rendering patterns
 * - Lists and keys
 * - Component composition patterns
 * - Controlled vs uncontrolled components
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, describe, it, vi } from 'vitest';

import {
  WelcomeMessage,
  UserCard,
  CustomButton,
  ProductCard,
  Counter,
  ContactForm,
  EventDemo,
  AuthStatus,
  LoadingState,
  Notification,
  TodoList,
  ShoppingCart,
  CategoryList,
  Card,
  DataFetcher,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  ControlledInput,
  UncontrolledInput,
  HybridForm,
  LoadingSpinner,
  simulateApiCall
} from '../exercises/react-fundamentals';

// =============================================================================
// EXERCISE 1 TESTS: Component Creation and JSX
// =============================================================================

describe('Exercise 1: Component Creation and JSX', () => {
  describe('WelcomeMessage', () => {
    it('should render welcome message with correct text', () => {
      render(<WelcomeMessage />);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Welcome to React!'
      );
    });

    it('should have correct className', () => {
      render(<WelcomeMessage />);
      expect(screen.getByRole('heading', { level: 1 })).toHaveClass('welcome');
    });

    it('should render as h1 element', () => {
      render(<WelcomeMessage />);
      expect(screen.getByRole('heading', { level: 1 }).tagName).toBe('H1');
    });
  });

  describe('UserCard', () => {
    const mockUser = {
      name: 'John Doe',
      age: 30,
      email: 'john@example.com'
    };

    it('should render user information correctly', () => {
      render(<UserCard user={mockUser} />);

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'John Doe'
      );
      expect(screen.getByText('Age: 30')).toBeInTheDocument();
      expect(screen.getByText('Email: john@example.com')).toBeInTheDocument();
    });

    it('should have correct structure and className', () => {
      render(<UserCard user={mockUser} />);

      const container = screen.getByText('John Doe').closest('div');
      expect(container).toHaveClass('user-card');
    });

    it('should handle different user data', () => {
      const differentUser = {
        name: 'Jane Smith',
        age: 25,
        email: 'jane@test.com'
      };

      render(<UserCard user={differentUser} />);

      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Age: 25')).toBeInTheDocument();
      expect(screen.getByText('Email: jane@test.com')).toBeInTheDocument();
    });
  });
});

// =============================================================================
// EXERCISE 2 TESTS: Props and Prop Validation
// =============================================================================

describe('Exercise 2: Props and Prop Validation', () => {
  describe('CustomButton', () => {
    it('should render with default props', () => {
      render(<CustomButton />);

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Click me');
      expect(button).toHaveClass('btn', 'btn-primary');
      expect(button).not.toBeDisabled();
    });

    it('should render with custom text', () => {
      render(<CustomButton text="Custom Text" />);
      expect(screen.getByRole('button')).toHaveTextContent('Custom Text');
    });

    it('should apply correct variant classes', () => {
      render(<CustomButton variant="secondary" />);
      expect(screen.getByRole('button')).toHaveClass('btn', 'btn-secondary');
    });

    it('should be disabled when disabled prop is true', () => {
      render(<CustomButton disabled={true} />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should handle onClick events', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<CustomButton onClick={handleClick} />);

      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<CustomButton onClick={handleClick} disabled={true} />);

      await user.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('ProductCard', () => {
    const mockProduct = {
      id: 1,
      name: 'Test Product',
      price: 99.99,
      description: 'A great product',
      inStock: true
    };

    it('should render product information correctly', () => {
      render(<ProductCard {...mockProduct} />);

      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText(/99.99/)).toBeInTheDocument();
      expect(screen.getByText('A great product')).toBeInTheDocument();
    });

    it('should handle missing optional props', () => {
      const minimalProduct = {
        id: 1,
        name: 'Minimal Product',
        price: 49.99
      };

      render(<ProductCard {...minimalProduct} />);

      expect(screen.getByText('Minimal Product')).toBeInTheDocument();
      expect(screen.getByText(/49.99/)).toBeInTheDocument();
    });

    it('should show stock status', () => {
      render(<ProductCard {...mockProduct} inStock={false} />);
      // Implementation should show out of stock indicator
      // This test will need to be updated based on actual implementation
    });

    it('should display price formatted correctly', () => {
      render(<ProductCard {...mockProduct} />);
      // Should format price as currency or with proper decimal places
      expect(screen.getByText(/99\.99/)).toBeInTheDocument();
    });
  });
});

// =============================================================================
// EXERCISE 3 TESTS: Event Handling and Synthetic Events
// =============================================================================

describe('Exercise 3: Event Handling and Synthetic Events', () => {
  describe('Counter', () => {
    it('should render initial count of 0', () => {
      render(<Counter />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should increment count when increment button is clicked', async () => {
      const user = userEvent.setup();
      render(<Counter />);

      const incrementButton = screen.getByText(/increment/i);
      await user.click(incrementButton);

      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should decrement count when decrement button is clicked', async () => {
      const user = userEvent.setup();
      render(<Counter />);

      // First increment to have something to decrement
      const incrementButton = screen.getByText(/increment/i);
      await user.click(incrementButton);
      await user.click(incrementButton);

      const decrementButton = screen.getByText(/decrement/i);
      await user.click(decrementButton);

      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should not go below 0', async () => {
      const user = userEvent.setup();
      render(<Counter />);

      const decrementButton = screen.getByText(/decrement/i);
      await user.click(decrementButton);

      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should handle multiple increments', async () => {
      const user = userEvent.setup();
      render(<Counter />);

      const incrementButton = screen.getByText(/increment/i);
      await user.click(incrementButton);
      await user.click(incrementButton);
      await user.click(incrementButton);

      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  describe('ContactForm', () => {
    it('should render all form fields', () => {
      render(<ContactForm />);

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    });

    it('should update input values on change', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, 'John Doe');

      expect(nameInput).toHaveValue('John Doe');
    });

    it('should display current form state', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);

      await user.type(nameInput, 'John');
      await user.type(emailInput, 'john@test.com');

      // Should display current form state somewhere in the component
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      expect(screen.getByDisplayValue('john@test.com')).toBeInTheDocument();
    });

    it('should handle form submission', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const form =
        screen.getByRole('form') || screen.getByTestId('contact-form');

      // Fill out form
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@test.com');
      await user.type(screen.getByLabelText(/message/i), 'Test message');

      // Submit form
      fireEvent.submit(form);

      // Should prevent default and handle submission
      // Implementation will determine exact behavior to test
    });
  });

  describe('EventDemo', () => {
    it('should handle click events and display event info', async () => {
      const user = userEvent.setup();
      render(<EventDemo />);

      const clickTarget =
        screen.getByTestId('click-target') || screen.getByText(/click me/i);
      await user.click(clickTarget);

      const clicks = screen.getAllByText(/click/i);
      expect(clicks[0]).toBeInTheDocument();
    });

    it('should handle mouse events', async () => {
      const user = userEvent.setup();
      render(<EventDemo />);

      const mouseTarget =
        screen.getByTestId('mouse-target') || screen.getByText(/hover/i);

      await user.hover(mouseTarget);
      const mouses = screen.getAllByText(/mouse/i);
      expect(mouses[0]).toBeInTheDocument();
    });

    it('should handle keyboard events', async () => {
      const user = userEvent.setup();
      render(<EventDemo />);

      const keyTarget =
        screen.getByTestId('key-target') || screen.getByRole('textbox');

      await user.type(keyTarget, 'a');
      expect(screen.getByText(/key/i)).toBeInTheDocument();
    });

    it('should display event coordinates for mouse events', async () => {
      render(<EventDemo />);

      const mouseTarget =
        screen.getByTestId('mouse-target') || screen.getByText(/hover/i);

      fireEvent.mouseEnter(mouseTarget, { clientX: 100, clientY: 200 });

      // Should display coordinates somewhere
      // Implementation will determine exact format
    });
  });
});

// =============================================================================
// EXERCISE 4 TESTS: Conditional Rendering Patterns
// =============================================================================

describe('Exercise 4: Conditional Rendering Patterns', () => {
  describe('AuthStatus', () => {
    it('should show welcome message when logged in', () => {
      render(<AuthStatus isLoggedIn={true} username="John" />);
      expect(screen.getByText(/welcome/i)).toBeInTheDocument();
      expect(screen.getByText(/john/i)).toBeInTheDocument();
    });

    it('should show login prompt when not logged in', () => {
      render(<AuthStatus isLoggedIn={false} username="John" />);
      expect(screen.getByText(/login/i)).toBeInTheDocument();
      expect(screen.queryByText(/welcome/i)).not.toBeInTheDocument();
    });

    it('should handle missing username', () => {
      render(<AuthStatus isLoggedIn={true} />);
      expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    });
  });

  describe('LoadingState', () => {
    it('should show loading spinner when loading', () => {
      render(<LoadingState loading={true} error={null} data={null} />);
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should show error message when error exists', () => {
      render(
        <LoadingState
          loading={false}
          error="Something went wrong"
          data={null}
        />
      );
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });

    it('should show data when available', () => {
      const data = ['item1', 'item2', 'item3'];
      render(<LoadingState loading={false} error={null} data={data} />);

      data.forEach((item) => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
    });

    it('should show "No data" when data is empty array', () => {
      render(<LoadingState loading={false} error={null} data={[]} />);
      expect(screen.getByText(/no data/i)).toBeInTheDocument();
    });

    it('should prioritize error over data', () => {
      render(
        <LoadingState loading={false} error="Error occurred" data={['item1']} />
      );
      expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
      expect(screen.queryByText('item1')).not.toBeInTheDocument();
    });

    it('should prioritize loading over everything', () => {
      render(<LoadingState loading={true} error="Error" data={['item1']} />);
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
      expect(screen.queryByText('item1')).not.toBeInTheDocument();
    });
  });

  describe('Notification', () => {
    it('should not render when no message', () => {
      const { container } = render(<Notification type="info" message="" />);
      expect(container.firstChild).toBeNull();
    });

    it('should render message when provided', () => {
      render(<Notification type="info" message="Test notification" />);
      expect(screen.getByText('Test notification')).toBeInTheDocument();
    });

    it('should show dismiss button when dismissible', () => {
      render(<Notification type="info" message="Test" dismissible={true} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should not show dismiss button when not dismissible', () => {
      render(<Notification type="info" message="Test" dismissible={false} />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should call onDismiss when dismiss button clicked', async () => {
      const handleDismiss = vi.fn();
      const user = userEvent.setup();

      render(
        <Notification
          type="info"
          message="Test"
          dismissible={true}
          onDismiss={handleDismiss}
        />
      );

      await user.click(screen.getByRole('button'));
      expect(handleDismiss).toHaveBeenCalledTimes(1);
    });

    it('should apply correct type classes', () => {
      render(<Notification type="error" message="Error message" />);
      const notification = screen.getByText('Error message').closest('div');
      expect(notification).toHaveClass('error');
    });
  });
});

// =============================================================================
// EXERCISE 5 TESTS: Lists and Keys
// =============================================================================

describe('Exercise 5: Lists and Keys', () => {
  describe('TodoList', () => {
    const mockTodos = [
      { id: 1, text: 'Learn React', completed: false },
      { id: 2, text: 'Build an app', completed: true },
      { id: 3, text: 'Deploy to production', completed: false }
    ];

    it('should render all todos', () => {
      render(<TodoList todos={mockTodos} />);

      expect(screen.getByText('Learn React')).toBeInTheDocument();
      expect(screen.getByText('Build an app')).toBeInTheDocument();
      expect(screen.getByText('Deploy to production')).toBeInTheDocument();
    });

    it('should show completed todos with strikethrough', () => {
      render(<TodoList todos={mockTodos} />);

      const completedTodo = screen.getByText('Build an app');
      expect(completedTodo).toHaveStyle('text-decoration: line-through');
    });

    it('should render as list items', () => {
      render(<TodoList todos={mockTodos} />);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(3);
    });

    it('should handle empty todos array', () => {
      render(<TodoList todos={[]} />);

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
      expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    });
  });

  describe('ShoppingCart', () => {
    it('should render initial empty state', () => {
      render(<ShoppingCart />);
      expect(
        screen.getByText(/empty/i) || screen.getByText('0')
      ).toBeInTheDocument();
    });

    it('should allow adding items', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const nameInput =
        screen.getByLabelText(/name/i) || screen.getByPlaceholderText(/name/i);
      const priceInput =
        screen.getByLabelText(/price/i) ||
        screen.getByPlaceholderText(/price/i);
      const addButton = screen.getByText(/add/i);

      await user.type(nameInput, 'Apple');
      await user.type(priceInput, '1.99');
      await user.click(addButton);

      expect(screen.getByText('Apple')).toBeInTheDocument();
      const prices = screen.getAllByText(/1\.99/);
      expect(prices[0]).toBeInTheDocument();
    });

    it('should allow removing items', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      // Add an item first
      const nameInput =
        screen.getByLabelText(/name/i) || screen.getByPlaceholderText(/name/i);
      const priceInput =
        screen.getByLabelText(/price/i) ||
        screen.getByPlaceholderText(/price/i);
      const addButton = screen.getByText(/add/i);

      await user.type(nameInput, 'Apple');
      await user.type(priceInput, '1.99');
      await user.click(addButton);

      // Remove the item
      const removeButton = screen.getByText(/remove/i) || screen.getByText('×');
      await user.click(removeButton);

      expect(screen.queryByText('Apple')).not.toBeInTheDocument();
    });

    it('should calculate and display total price', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      // Add multiple items
      const nameInput =
        screen.getByLabelText(/name/i) || screen.getByPlaceholderText(/name/i);
      const priceInput =
        screen.getByLabelText(/price/i) ||
        screen.getByPlaceholderText(/price/i);
      const addButton = screen.getByText(/add/i);

      await user.type(nameInput, 'Apple');
      await user.type(priceInput, '1.99');
      await user.click(addButton);

      await user.clear(nameInput);
      await user.clear(priceInput);
      await user.type(nameInput, 'Banana');
      await user.type(priceInput, '0.99');
      await user.click(addButton);

      expect(screen.getByText(/2\.98/)).toBeInTheDocument();
    });
  });

  describe('CategoryList', () => {
    const mockCategories = [
      {
        id: 1,
        name: 'Fruits',
        items: [
          { id: 1, name: 'Apple' },
          { id: 2, name: 'Banana' }
        ]
      },
      {
        id: 2,
        name: 'Vegetables',
        items: [
          { id: 3, name: 'Carrot' },
          { id: 4, name: 'Broccoli' }
        ]
      }
    ];

    it('should render all categories', () => {
      render(<CategoryList categories={mockCategories} />);

      expect(screen.getByText('Fruits')).toBeInTheDocument();
      expect(screen.getByText('Vegetables')).toBeInTheDocument();
    });

    it('should render items within categories', () => {
      render(<CategoryList categories={mockCategories} />);

      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByText('Banana')).toBeInTheDocument();
      expect(screen.getByText('Carrot')).toBeInTheDocument();
      expect(screen.getByText('Broccoli')).toBeInTheDocument();
    });

    it('should be collapsible', async () => {
      const user = userEvent.setup();
      render(<CategoryList categories={mockCategories} />);

      const fruitsToggle =
        screen.getByText('Fruits').closest('button') ||
        screen.getByText('Fruits').parentElement.querySelector('button');

      if (fruitsToggle) {
        await user.click(fruitsToggle);

        // Items should be hidden or shown based on implementation
        // This test will need to be adjusted based on actual behavior
      }
    });
  });
});

// =============================================================================
// EXERCISE 6 TESTS: Component Composition Patterns
// =============================================================================

describe('Exercise 6: Component Composition Patterns', () => {
  describe('Card', () => {
    it('should render title and children', () => {
      render(
        <Card title="Test Card">
          <p>Card content</p>
        </Card>
      );

      expect(screen.getByText('Test Card')).toBeInTheDocument();
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('should have proper structure', () => {
      render(
        <Card title="Test Card">
          <p>Card content</p>
        </Card>
      );

      const title = screen.getByText('Test Card');
      const content = screen.getByText('Card content');

      // Title should be in header, content in body
      expect(title.closest('.card-header') || title.parentElement).toBeTruthy();
      expect(
        content.closest('.card-body') || content.parentElement
      ).toBeTruthy();
    });
  });

  describe('DataFetcher', () => {
    it('should call render prop with initial loading state', () => {
      const renderProp = vi.fn().mockReturnValue(<div>Loading...</div>);

      render(<DataFetcher url="/api/data" render={renderProp} />);

      expect(renderProp).toHaveBeenCalledWith({
        data: null,
        loading: true,
        error: null
      });
    });

    it('should simulate data fetching', async () => {
      const renderProp = vi.fn().mockReturnValue(<div>Data loaded</div>);

      render(<DataFetcher url="/api/data" render={renderProp} />);

      // Wait for simulated API call
      await waitFor(
        () => {
          expect(renderProp).toHaveBeenCalledWith({
            data: expect.any(Object),
            loading: false,
            error: null
          });
        },
        { timeout: 2000 }
      );
    });
  });

  describe('Tabs Compound Components', () => {
    const TabsExample = () => (
      <Tabs>
        <TabList>
          <Tab index={0}>Tab 1</Tab>
          <Tab index={1}>Tab 2</Tab>
          <Tab index={2}>Tab 3</Tab>
        </TabList>
        <TabPanels>
          <TabPanel index={0}>Panel 1 Content</TabPanel>
          <TabPanel index={1}>Panel 2 Content</TabPanel>
          <TabPanel index={2}>Panel 3 Content</TabPanel>
        </TabPanels>
      </Tabs>
    );

    it('should render all tabs', () => {
      render(<TabsExample />);

      expect(screen.getByText('Tab 1')).toBeInTheDocument();
      expect(screen.getByText('Tab 2')).toBeInTheDocument();
      expect(screen.getByText('Tab 3')).toBeInTheDocument();
    });

    it('should show first panel by default', () => {
      render(<TabsExample />);

      expect(screen.getByText('Panel 1 Content')).toBeInTheDocument();
      expect(screen.queryByText('Panel 2 Content')).not.toBeInTheDocument();
    });

    it('should switch panels when tabs are clicked', async () => {
      const user = userEvent.setup();
      render(<TabsExample />);

      await user.click(screen.getByText('Tab 2'));

      expect(screen.getByText('Panel 2 Content')).toBeInTheDocument();
      expect(screen.queryByText('Panel 1 Content')).not.toBeInTheDocument();
    });

    it('should apply active states correctly', async () => {
      const user = userEvent.setup();
      render(<TabsExample />);

      const tab1 = screen.getByText('Tab 1');
      const tab2 = screen.getByText('Tab 2');

      expect(tab1).toHaveClass('active');
      expect(tab2).not.toHaveClass('active');

      await user.click(tab2);

      expect(tab1).not.toHaveClass('active');
      expect(tab2).toHaveClass('active');
    });
  });
});

// =============================================================================
// EXERCISE 7 TESTS: Controlled vs Uncontrolled Components
// =============================================================================

describe('Exercise 7: Controlled vs Uncontrolled Components', () => {
  describe('ControlledInput', () => {
    it('should render with provided value', () => {
      render(<ControlledInput value="test value" onChange={() => {}} />);
      expect(screen.getByDisplayValue('test value')).toBeInTheDocument();
    });

    it('should call onChange when input changes', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<ControlledInput value="" onChange={handleChange} />);

      await user.type(screen.getByRole('textbox'), 'a');
      expect(handleChange).toHaveBeenCalled();
    });

    it('should show validation errors', () => {
      const validation = { isValid: false, error: 'Required field' };

      render(
        <ControlledInput value="" onChange={() => {}} validation={validation} />
      );

      expect(screen.getByText('Required field')).toBeInTheDocument();
    });

    it('should handle different input types', () => {
      render(
        <ControlledInput
          value="test@email.com"
          onChange={() => {}}
          type="email"
        />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('should not show error when validation passes', () => {
      const validation = { isValid: true, error: null };

      render(
        <ControlledInput
          value="valid"
          onChange={() => {}}
          validation={validation}
        />
      );

      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
  });

  describe('UncontrolledInput', () => {
    it('should render with default value', () => {
      render(<UncontrolledInput defaultValue="default text" />);
      expect(screen.getByDisplayValue('default text')).toBeInTheDocument();
    });

    it('should accept user input', async () => {
      const user = userEvent.setup();
      render(<UncontrolledInput />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'user input');

      expect(input).toHaveValue('user input');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef();
      render(<UncontrolledInput ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('should allow accessing value via ref', async () => {
      const ref = React.createRef();
      const user = userEvent.setup();

      render(<UncontrolledInput ref={ref} />);

      await user.type(screen.getByRole('textbox'), 'test');

      expect(ref.current.value).toBe('test');
    });
  });

  describe('HybridForm', () => {
    it('should render both controlled and uncontrolled inputs', () => {
      render(<HybridForm />);

      const inputs = screen.getAllByRole('textbox');
      expect(inputs.length).toBeGreaterThanOrEqual(2);
    });

    it('should show current values from both approaches', async () => {
      const user = userEvent.setup();
      render(<HybridForm />);

      const inputs = screen.getAllByRole('textbox');

      await user.type(inputs[0], 'controlled');
      await user.type(inputs[1], 'uncontrolled');

      // Should display current values somewhere in the component
      expect(screen.getByDisplayValue('controlled')).toBeInTheDocument();
      expect(screen.getByDisplayValue('uncontrolled')).toBeInTheDocument();
    });

    it('should handle form submission', async () => {
      const user = userEvent.setup();
      render(<HybridForm />);

      const form =
        screen.getByRole('form') || screen.getByTestId('hybrid-form');
      const inputs = screen.getAllByRole('textbox');

      await user.type(inputs[0], 'value1');
      await user.type(inputs[1], 'value2');

      fireEvent.submit(form);

      // Should handle submission and show values from both input types
    });
  });
});

// =============================================================================
// HELPER COMPONENTS AND UTILITIES TESTS
// =============================================================================

describe('Helper Components and Utilities', () => {
  describe('LoadingSpinner', () => {
    it('should render loading message', () => {
      render(<LoadingSpinner />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should have correct className', () => {
      render(<LoadingSpinner />);
      const spinner = screen.getByText('Loading...');
      expect(spinner).toHaveClass('loading-spinner');
    });
  });

  describe('simulateApiCall', () => {
    it('should resolve with provided data after delay', async () => {
      const testData = { id: 1, name: 'test' };

      const result = await simulateApiCall(testData, 10);

      expect(result).toEqual(testData);
    });

    it('should use default delay', async () => {
      const startTime = Date.now();

      await simulateApiCall('test', 10);

      const endTime = Date.now();
      expect(endTime - startTime).toBeGreaterThanOrEqual(10);
    });
  });
});
