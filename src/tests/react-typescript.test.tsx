/**
 * React TypeScript Integration Tests
 *
 * Test suite for React TypeScript exercises covering:
 * - Advanced TypeScript patterns with React
 * - Generic components
 * - Proper typing of refs, forwardRef, and useImperativeHandle
 * - Event handler typing
 * - React.ReactNode vs React.ReactElement vs PropsWithChildren
 * - Discriminated unions with props
 */

import React, { createRef } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, describe, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

import {
  UserProfile,
  List,
  Button,
  LoginForm,
  CustomInput,
  Modal,
  type ModalHandle,
  Container,
  StrictContainer,
  Card,
  Text,
  useLocalStorage,
  DataTable,
  ResponseDisplay,
  UserBasicCard,
  PublicUserCard,
  UserForm
} from '../exercises/react-typescript';

// =============================================================================
// EXERCISE 1 TESTS: Basic TypeScript Component Props
// =============================================================================

describe('Exercise 1: Basic TypeScript Component Props', () => {
  describe('UserProfile', () => {
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      role: 'admin' as const
    };

    it('should render user information', () => {
      render(<UserProfile user={mockUser} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText(/john@example.com/)).toBeInTheDocument();
      expect(screen.getByText(/30/)).toBeInTheDocument();
      expect(screen.getByText(/admin/)).toBeInTheDocument();
    });

    it('should render edit button when onEdit is provided', () => {
      const handleEdit = vi.fn();
      render(<UserProfile user={mockUser} onEdit={handleEdit} />);

      const editButton = screen.getByRole('button', { name: /edit/i });
      expect(editButton).toBeInTheDocument();
    });

    it('should call onEdit with user when button is clicked', async () => {
      const handleEdit = vi.fn();
      render(<UserProfile user={mockUser} onEdit={handleEdit} />);

      const editButton = screen.getByRole('button', { name: /edit/i });
      await userEvent.click(editButton);

      expect(handleEdit).toHaveBeenCalledWith(mockUser);
    });

    it('should not render edit button when onEdit is not provided', () => {
      render(<UserProfile user={mockUser} />);

      expect(
        screen.queryByRole('button', { name: /edit/i })
      ).not.toBeInTheDocument();
    });

    it('should accept different role types', () => {
      const users = [
        { ...mockUser, role: 'admin' as const },
        { ...mockUser, role: 'user' as const },
        { ...mockUser, role: 'guest' as const }
      ];

      users.forEach((user) => {
        const { unmount } = render(<UserProfile user={user} />);
        expect(screen.getByText(new RegExp(user.role))).toBeInTheDocument();
        unmount();
      });
    });
  });
});

// =============================================================================
// EXERCISE 2 TESTS: Generic Components
// =============================================================================

describe('Exercise 2: Generic Components', () => {
  describe('List', () => {
    interface TestItem {
      id: number;
      name: string;
    }

    const items: TestItem[] = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' }
    ];

    it('should render list items using renderItem function', () => {
      render(
        <List
          items={items}
          renderItem={(item) => <div>{item.name}</div>}
          keyExtractor={(item) => item.id}
        />
      );

      items.forEach((item) => {
        expect(screen.getByText(item.name)).toBeInTheDocument();
      });
    });

    it('should use keyExtractor for unique keys', () => {
      const { container } = render(
        <List
          items={items}
          renderItem={(item) => <div>{item.name}</div>}
          keyExtractor={(item) => `item-${item.id}`}
        />
      );

      const elements = container.querySelectorAll('[data-testid], div > div');
      expect(elements.length).toBeGreaterThan(0);
    });

    it('should work with different data types', () => {
      const numbers = [1, 2, 3, 4, 5];

      render(
        <List
          items={numbers}
          renderItem={(num) => <span>Number: {num}</span>}
          keyExtractor={(num) => num}
        />
      );

      numbers.forEach((num) => {
        expect(screen.getByText(`Number: ${num}`)).toBeInTheDocument();
      });
    });

    it('should render empty list correctly', () => {
      const { container } = render(
        <List
          items={[]}
          renderItem={(item: TestItem) => <div>{item.name}</div>}
          keyExtractor={(item) => item.id}
        />
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should maintain type safety in renderItem', () => {
      render(
        <List
          items={items}
          renderItem={(item) => {
            // Type assertion test - item should be TestItem
            const name: string = item.name;
            const id: number = item.id;
            return (
              <div>
                {name}-{id}
              </div>
            );
          }}
          keyExtractor={(item) => item.id}
        />
      );

      expect(screen.getByText(/Item 1-1/)).toBeInTheDocument();
    });
  });
});

// =============================================================================
// EXERCISE 3 TESTS: Discriminated Unions with Props
// =============================================================================

describe('Exercise 3: Discriminated Unions with Props', () => {
  describe('Button', () => {
    it('should render link variant with href', () => {
      render(
        <Button variant="link" href="/home">
          Home
        </Button>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/home');
      expect(link).toHaveTextContent('Home');
    });

    it('should render button variant with onClick', async () => {
      const handleClick = vi.fn();
      render(
        <Button variant="button" onClick={handleClick}>
          Click Me
        </Button>
      );

      const button = screen.getByRole('button');
      await userEvent.click(button);

      expect(handleClick).toHaveBeenCalled();
      expect(button).toHaveTextContent('Click Me');
    });

    it('should render submit variant', () => {
      render(<Button variant="submit">Submit Form</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toHaveTextContent('Submit Form');
    });

    it('should handle disabled state', () => {
      render(
        <Button variant="button" onClick={vi.fn()} disabled>
          Disabled
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should apply className prop', () => {
      render(
        <Button variant="button" onClick={vi.fn()} className="custom-class">
          Styled
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });
  });
});

// =============================================================================
// EXERCISE 4 TESTS: Event Handler Typing
// =============================================================================

describe('Exercise 4: Event Handler Typing', () => {
  describe('LoginForm', () => {
    it('should handle email input change', async () => {
      const handleSubmit = vi.fn();
      render(<LoginForm onSubmit={handleSubmit} />);

      const emailInput = screen.getByPlaceholderText('Email');
      await userEvent.type(emailInput, 'test@example.com');

      expect(emailInput).toHaveValue('test@example.com');
    });

    it('should handle password input change', async () => {
      const handleSubmit = vi.fn();
      render(<LoginForm onSubmit={handleSubmit} />);

      const passwordInput = screen.getByPlaceholderText('Password');
      await userEvent.type(passwordInput, 'password123');

      expect(passwordInput).toHaveValue('password123');
    });

    it('should handle checkbox change', async () => {
      const handleSubmit = vi.fn();
      render(<LoginForm onSubmit={handleSubmit} />);

      const checkbox = screen.getByRole('checkbox');
      await userEvent.click(checkbox);

      expect(checkbox).toBeChecked();
    });

    it('should submit form with correct data', async () => {
      const handleSubmit = vi.fn();
      render(<LoginForm onSubmit={handleSubmit} />);

      await userEvent.type(
        screen.getByPlaceholderText('Email'),
        'user@test.com'
      );
      await userEvent.type(screen.getByPlaceholderText('Password'), 'secret');
      await userEvent.click(screen.getByRole('checkbox'));

      const submitButton = screen.getByRole('button', { name: /login/i });
      await userEvent.click(submitButton);

      expect(handleSubmit).toHaveBeenCalledWith({
        email: 'user@test.com',
        password: 'secret',
        remember: true
      });
    });

    it('should prevent default form submission', async () => {
      const handleSubmit = vi.fn();
      render(<LoginForm onSubmit={handleSubmit} />);

      const form = screen
        .getByRole('button', { name: /login/i })
        .closest('form');
      const submitEvent = new Event('submit', {
        bubbles: true,
        cancelable: true
      });

      form?.dispatchEvent(submitEvent);

      expect(submitEvent.defaultPrevented).toBe(true);
    });
  });
});

// =============================================================================
// EXERCISE 5 TESTS: forwardRef and Refs Typing
// =============================================================================

describe('Exercise 5: forwardRef and Refs Typing', () => {
  describe('CustomInput', () => {
    it('should render with label', () => {
      render(<CustomInput label="Username" />);
      expect(screen.getByText('Username')).toBeInTheDocument();
    });

    it('should forward ref to input element', () => {
      const ref = createRef<HTMLInputElement>();
      render(<CustomInput label="Test" ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('should allow focusing via ref', () => {
      const ref = createRef<HTMLInputElement>();
      render(<CustomInput label="Test" ref={ref} />);

      ref.current?.focus();
      expect(ref.current).toHaveFocus();
    });

    it('should display error message', () => {
      render(<CustomInput label="Email" error="Invalid email" />);
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });

    it('should pass through standard input props', () => {
      render(
        <CustomInput
          label="Test"
          type="email"
          placeholder="Enter email"
          required
        />
      );

      const input = screen.getByPlaceholderText('Enter email');
      expect(input).toHaveAttribute('type', 'email');
      expect(input).toBeRequired();
    });
  });
});

// =============================================================================
// EXERCISE 6 TESTS: useImperativeHandle Typing
// =============================================================================

describe('Exercise 6: useImperativeHandle Typing', () => {
  describe('Modal', () => {
    it('should expose open method via ref', () => {
      const ref = createRef<ModalHandle>();
      render(<Modal ref={ref}>Modal Content</Modal>);

      expect(ref.current).toBeTruthy();
      expect(ref.current?.open).toBeInstanceOf(Function);
    });

    it('should open modal when open method is called', () => {
      const ref = createRef<ModalHandle>();
      render(<Modal ref={ref}>Modal Content</Modal>);

      expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();

      ref.current?.open();

      waitFor(() => {
        expect(screen.getByText('Modal Content')).toBeInTheDocument();
      });
    });

    it('should close modal when close method is called', async () => {
      const ref = createRef<ModalHandle>();
      render(<Modal ref={ref}>Modal Content</Modal>);

      ref.current?.open();
      await waitFor(() => {
        expect(screen.getByText('Modal Content')).toBeInTheDocument();
      });

      ref.current?.close();
      await waitFor(() => {
        expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
      });
    });

    it('should report isOpen state correctly', () => {
      const ref = createRef<ModalHandle>();
      render(<Modal ref={ref}>Content</Modal>);

      expect(ref.current?.isOpen()).toBe(false);

      ref.current?.open();
      expect(ref.current?.isOpen()).toBe(true);

      ref.current?.close();
      expect(ref.current?.isOpen()).toBe(false);
    });

    it('should call onClose callback', async () => {
      const handleClose = vi.fn();
      const ref = createRef<ModalHandle>();
      render(
        <Modal ref={ref} onClose={handleClose}>
          Content
        </Modal>
      );

      ref.current?.open();
      await waitFor(() => screen.getByText('Content'));

      const closeButton = screen.getByRole('button', { name: /close/i });
      await userEvent.click(closeButton);

      expect(handleClose).toHaveBeenCalled();
    });
  });
});

// =============================================================================
// EXERCISE 7 TESTS: ReactNode vs ReactElement vs PropsWithChildren
// =============================================================================

describe('Exercise 7: ReactNode vs ReactElement vs PropsWithChildren', () => {
  describe('Container', () => {
    it('should accept string children', () => {
      render(<Container>Hello World</Container>);
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('should accept number children', () => {
      render(<Container>{42}</Container>);
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('should accept element children', () => {
      render(
        <Container>
          <span>Element Child</span>
        </Container>
      );
      expect(screen.getByText('Element Child')).toBeInTheDocument();
    });

    it('should accept array of children', () => {
      render(
        <Container>
          {['one', 'two', 'three'].map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </Container>
      );
      expect(screen.getByText('one')).toBeInTheDocument();
      expect(screen.getByText('three')).toBeInTheDocument();
    });

    it('should apply className', () => {
      const { container } = render(
        <Container className="custom">Content</Container>
      );
      expect(container.firstChild).toHaveClass('custom');
    });
  });

  describe('StrictContainer', () => {
    it('should accept ReactElement children', () => {
      render(
        <StrictContainer>
          <div>Element Only</div>
        </StrictContainer>
      );
      expect(screen.getByText('Element Only')).toBeInTheDocument();
    });

    it('should accept array of ReactElements', () => {
      render(
        <StrictContainer>
          {[<div key="1">First</div>, <div key="2">Second</div>]}
        </StrictContainer>
      );
      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
    });
  });

  describe('Card', () => {
    it('should render with title and children', () => {
      render(
        <Card title="Card Title">
          <p>Card Content</p>
        </Card>
      );
      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('should render footer when provided', () => {
      render(
        <Card title="Title" footer={<button>Action</button>}>
          Content
        </Card>
      );
      expect(
        screen.getByRole('button', { name: 'Action' })
      ).toBeInTheDocument();
    });

    it('should not render footer when not provided', () => {
      const { container } = render(<Card title="Title">Content</Card>);
      expect(container.querySelector('.card-footer')).not.toBeInTheDocument();
    });
  });
});

// =============================================================================
// EXERCISE 8 TESTS: Polymorphic Component
// =============================================================================

describe('Exercise 8: Polymorphic Component', () => {
  describe('Text', () => {
    it('should render as span by default', () => {
      const { container } = render(<Text>Default</Text>);
      expect(container.querySelector('span')).toBeInTheDocument();
    });

    it('should render as specified element', () => {
      render(<Text as="h1">Heading</Text>);
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('should render as different elements', () => {
      const { rerender } = render(<Text as="p">Paragraph</Text>);
      expect(screen.getByText('Paragraph').tagName).toBe('P');

      rerender(<Text as="div">Division</Text>);
      expect(screen.getByText('Division').tagName).toBe('DIV');

      rerender(<Text as="label">Label</Text>);
      expect(screen.getByText('Label').tagName).toBe('LABEL');
    });

    it('should apply color prop', () => {
      const { container } = render(<Text color="primary">Text</Text>);
      // Implementation should add appropriate class or style
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should pass through element-specific props', () => {
      render(
        <Text as="a" href="/test" target="_blank">
          Link
        </Text>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/test');
      expect(link).toHaveAttribute('target', '_blank');
    });

    it('should handle button props when as="button"', async () => {
      const handleClick = vi.fn();
      render(
        <Text as="button" onClick={handleClick} type="button">
          Click Me
        </Text>
      );

      const button = screen.getByRole('button');
      await userEvent.click(button);
      expect(handleClick).toHaveBeenCalled();
    });
  });
});

// =============================================================================
// EXERCISE 9 TESTS: Generic Hook with TypeScript
// =============================================================================

describe('Exercise 9: Generic Hook with TypeScript', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('useLocalStorage', () => {
    it('should return initial value', () => {
      const TestComponent = () => {
        const [value] = useLocalStorage('test-key', 'initial');
        return <div>{value}</div>;
      };

      render(<TestComponent />);
      expect(screen.getByText('initial')).toBeInTheDocument();
    });

    it('should store and retrieve string values', () => {
      const TestComponent = () => {
        const [value, setValue] = useLocalStorage('test-string', 'hello');
        return (
          <div>
            <span>{value}</span>
            <button onClick={() => setValue('world')}>Update</button>
          </div>
        );
      };

      render(<TestComponent />);
      expect(screen.getByText('hello')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button'));
      expect(localStorage.getItem('test-string')).toBeTruthy();
    });

    it('should store and retrieve object values', () => {
      interface User {
        name: string;
        age: number;
      }

      const TestComponent = () => {
        const [user, setUser] = useLocalStorage<User>('user', {
          name: 'John',
          age: 30
        });

        return (
          <div>
            <span>{user.name}</span>
            <button onClick={() => setUser({ name: 'Jane', age: 25 })}>
              Update
            </button>
          </div>
        );
      };

      render(<TestComponent />);
      expect(screen.getByText('John')).toBeInTheDocument();
    });

    it('should support updater function', () => {
      const TestComponent = () => {
        const [count, setCount] = useLocalStorage('count', 0);
        return (
          <div>
            <span>{count}</span>
            <button onClick={() => setCount((prev) => prev + 1)}>
              Increment
            </button>
          </div>
        );
      };

      render(<TestComponent />);
      expect(screen.getByText('0')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should remove value', () => {
      const TestComponent = () => {
        const [value, , removeValue] = useLocalStorage('test', 'value');
        return (
          <div>
            <span>{value}</span>
            <button onClick={removeValue}>Remove</button>
          </div>
        );
      };

      render(<TestComponent />);
      fireEvent.click(screen.getByRole('button'));
      expect(localStorage.getItem('test')).toBeNull();
    });
  });
});

// =============================================================================
// EXERCISE 10 TESTS: Complex Generic Component with Constraints
// =============================================================================

describe('Exercise 10: Complex Generic Component with Constraints', () => {
  describe('DataTable', () => {
    interface Product {
      id: number;
      name: string;
      price: number;
      stock: number;
    }

    const products: Product[] = [
      { id: 1, name: 'Product 1', price: 10, stock: 5 },
      { id: 2, name: 'Product 2', price: 20, stock: 10 }
    ];

    const columns = [
      { key: 'name' as const, header: 'Name' },
      { key: 'price' as const, header: 'Price' },
      { key: 'stock' as const, header: 'Stock' }
    ];

    it('should render table with data', () => {
      render(<DataTable data={products} columns={columns} />);

      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });

    it('should render column headers', () => {
      render(<DataTable data={products} columns={columns} />);

      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Price')).toBeInTheDocument();
      expect(screen.getByText('Stock')).toBeInTheDocument();
    });

    it('should use custom render function', () => {
      const customColumns = [
        {
          key: 'price' as const,
          header: 'Price',
          render: (value: number) => `$${value.toFixed(2)}`
        }
      ];

      render(<DataTable data={products} columns={customColumns} />);

      expect(screen.getByText('$10.00')).toBeInTheDocument();
      expect(screen.getByText('$20.00')).toBeInTheDocument();
    });

    it('should call onRowClick when row is clicked', async () => {
      const handleRowClick = vi.fn();
      render(
        <DataTable
          data={products}
          columns={columns}
          onRowClick={handleRowClick}
        />
      );

      const firstRow = screen.getByText('Product 1').closest('tr');
      if (firstRow) {
        await userEvent.click(firstRow);
        expect(handleRowClick).toHaveBeenCalledWith(products[0]);
      }
    });

    it('should use custom keyExtractor', () => {
      render(
        <DataTable
          data={products}
          columns={columns}
          keyExtractor={(row) => `product-${row.id}`}
        />
      );

      expect(screen.getByText('Product 1')).toBeInTheDocument();
    });
  });
});

// =============================================================================
// EXERCISE 11 TESTS: Type Guards and Narrowing
// =============================================================================

describe('Exercise 11: Type Guards and Narrowing', () => {
  describe('ResponseDisplay', () => {
    it('should display loading state', () => {
      render(
        <ResponseDisplay
          response={{ status: 'loading' }}
          renderData={(data: string) => <div>{data}</div>}
        />
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should display error state', () => {
      render(
        <ResponseDisplay
          response={{ status: 'error', error: 'Something went wrong' }}
          renderData={(data: string) => <div>{data}</div>}
        />
      );

      expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
    });

    it('should display success state with data', () => {
      render(
        <ResponseDisplay
          response={{ status: 'success', data: 'Success message' }}
          renderData={(data: string) => <div>Data: {data}</div>}
        />
      );

      expect(screen.getByText('Data: Success message')).toBeInTheDocument();
    });

    it('should handle complex data types', () => {
      interface User {
        id: number;
        name: string;
      }

      render(
        <ResponseDisplay<User>
          response={{ status: 'success', data: { id: 1, name: 'John' } }}
          renderData={(user) => <div>{user.name}</div>}
        />
      );

      expect(screen.getByText('John')).toBeInTheDocument();
    });
  });
});

// =============================================================================
// EXERCISE 12 TESTS: Utility Types with React
// =============================================================================

describe('Exercise 12: Utility Types with React', () => {
  const baseUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    address: '123 Main St',
    phone: '555-1234'
  };

  describe('UserBasicCard', () => {
    it('should render basic user info', () => {
      const basicUser = {
        id: baseUser.id,
        name: baseUser.name,
        email: baseUser.email
      };

      render(<UserBasicCard user={basicUser} />);

      expect(screen.getByText(/John Doe/)).toBeInTheDocument();
      expect(screen.getByText(/john@example.com/)).toBeInTheDocument();
    });
  });

  describe('PublicUserCard', () => {
    it('should render public user info without sensitive data', () => {
      const publicUser = {
        id: baseUser.id,
        name: baseUser.name,
        age: baseUser.age
      };

      render(<PublicUserCard user={publicUser} />);

      expect(screen.getByText(/John Doe/)).toBeInTheDocument();
      expect(screen.getByText(/30/)).toBeInTheDocument();
    });
  });

  describe('UserForm', () => {
    it('should render form with partial initial values', () => {
      const handleSubmit = vi.fn();
      render(
        <UserForm
          initialUser={{ name: 'John', email: 'john@test.com' }}
          onSubmit={handleSubmit}
        />
      );

      // Form should render
      expect(
        screen.getByRole('form') || screen.getByText(/john/i)
      ).toBeInTheDocument();
    });

    it('should render empty form when no initial values', () => {
      const handleSubmit = vi.fn();
      render(<UserForm onSubmit={handleSubmit} />);

      // Form should still render
      const form = screen.getByRole('form') || document.querySelector('form');
      expect(form).toBeInTheDocument();
    });
  });
});

// =============================================================================
// INTEGRATION TESTS
// =============================================================================

describe('TypeScript Integration Tests', () => {
  it('should work with generic list and typed data', () => {
    interface Task {
      id: number;
      title: string;
      completed: boolean;
    }

    const tasks: Task[] = [
      { id: 1, title: 'Task 1', completed: false },
      { id: 2, title: 'Task 2', completed: true }
    ];

    render(
      <List
        items={tasks}
        renderItem={(task) => (
          <div>
            <span>{task.title}</span>
            <span>{task.completed ? '✓' : '○'}</span>
          </div>
        )}
        keyExtractor={(task) => task.id}
      />
    );

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('should handle polymorphic component with event handlers', async () => {
    const handleClick = vi.fn();

    render(
      <Text as="button" onClick={handleClick} color="primary">
        Click Me
      </Text>
    );

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalled();
  });

  it('should use forwardRef with imperative handle in modal', async () => {
    const ref = createRef<ModalHandle>();

    const TestComponent = () => {
      return (
        <div>
          <button onClick={() => ref.current?.open()}>Open Modal</button>
          <Modal ref={ref}>
            <h2>Modal Title</h2>
            <p>Modal Content</p>
          </Modal>
        </div>
      );
    };

    render(<TestComponent />);

    const openButton = screen.getByRole('button', { name: /open modal/i });
    await userEvent.click(openButton);

    await waitFor(() => {
      expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });
  });
});
