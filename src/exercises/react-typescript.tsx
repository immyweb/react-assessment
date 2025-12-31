/**
 * React TypeScript Integration Exercises
 *
 * This file contains exercises covering TypeScript patterns with React:
 * - Advanced TypeScript patterns with React
 * - Generic components
 * - Proper typing of refs, forwardRef, and useImperativeHandle
 * - Event handler typing
 * - React.ReactNode vs React.ReactElement vs PropsWithChildren
 * - Discriminated unions with props
 *
 * Each exercise includes:
 * - Clear documentation with examples
 * - Expected behavior description
 * - Component requirements
 * - Test cases to validate implementation
 */

import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
  useState,
  ReactNode,
  ReactElement,
  PropsWithChildren,
  ComponentProps,
  ElementType,
  MouseEvent,
  ChangeEvent,
  FormEvent
} from 'react';

// =============================================================================
// EXERCISE 1: Basic TypeScript Component Props
// =============================================================================

/**
 * Create a strongly typed user profile component.
 * Should define proper TypeScript interfaces for props.
 *
 * Requirements:
 * - Define User interface with: id, name, email, age, role
 * - role should be a union type: 'admin' | 'user' | 'guest'
 * - Create UserProfileProps interface
 * - Component should display all user information
 * - Optional onEdit callback with user parameter
 *
 * Expected structure:
 * <div className="user-profile">
 *   <h2>{user.name}</h2>
 *   <p>Email: {user.email}</p>
 *   <p>Age: {user.age}</p>
 *   <p>Role: {user.role}</p>
 *   {onEdit && <button onClick={() => onEdit(user)}>Edit</button>}
 * </div>
 */

// TODO: Define User interface
interface User {
  // TODO: Add properties
}

// TODO: Define UserProfileProps interface
interface UserProfileProps {
  // TODO: Add properties
}

export function UserProfile({ user, onEdit }: UserProfileProps): ReactElement {
  // TODO: Implement this component
  return <div>TODO</div>;
}

// =============================================================================
// EXERCISE 2: Generic Components
// =============================================================================

/**
 * Create a generic List component that can render any type of item.
 * Should use TypeScript generics to ensure type safety.
 *
 * Requirements:
 * - Component should accept a generic type parameter T
 * - Props: items (T[]), renderItem ((item: T) => ReactNode), keyExtractor ((item: T) => string | number)
 * - Should map over items and render using renderItem function
 * - Should use keyExtractor for unique keys
 *
 * Example usage:
 * <List<User>
 *   items={users}
 *   renderItem={(user) => <div>{user.name}</div>}
 *   keyExtractor={(user) => user.id}
 * />
 */

// TODO: Define ListProps interface with generic type
interface ListProps<T> {
  // TODO: Add properties
}

export function List<T>({
  items,
  renderItem,
  keyExtractor
}: ListProps<T>): ReactElement {
  // TODO: Implement generic list component
  return <div>TODO</div>;
}

// =============================================================================
// EXERCISE 3: Discriminated Unions with Props
// =============================================================================

/**
 * Create a Button component with discriminated union props.
 * Should have different prop combinations based on variant.
 *
 * Requirements:
 * - Variant 'link': requires href prop
 * - Variant 'button': requires onClick prop
 * - Variant 'submit': no additional props needed
 * - Common props: children, disabled, className
 * - Use discriminated union for type safety
 *
 * Example usage:
 * <Button variant="link" href="/home">Home</Button>
 * <Button variant="button" onClick={handleClick}>Click</Button>
 * <Button variant="submit">Submit</Button>
 */

// TODO: Define discriminated union types for button variants
type ButtonLinkProps = {
  variant: 'link';
  href: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
};

type ButtonClickProps = {
  // TODO: Define for variant 'button'
};

type ButtonSubmitProps = {
  // TODO: Define for variant 'submit'
};

type ButtonProps = ButtonLinkProps | ButtonClickProps | ButtonSubmitProps;

export function Button(props: ButtonProps): ReactElement {
  // TODO: Implement button with discriminated union
  // Use type guards to handle different variants
  return <button>TODO</button>;
}

// =============================================================================
// EXERCISE 4: Event Handler Typing
// =============================================================================

/**
 * Create a form component with properly typed event handlers.
 * Should demonstrate correct typing for various event types.
 *
 * Requirements:
 * - Type input change events correctly
 * - Type form submit events correctly
 * - Type button click events correctly
 * - Type mouse hover events correctly
 * - Prevent default on form submission
 * - Extract proper types from events
 *
 * Form fields: email, password, remember (checkbox)
 */

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
}

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

export function LoginForm({ onSubmit }: LoginFormProps): ReactElement {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [remember, setRemember] = useState<boolean>(false);

  // TODO: Type this event handler correctly
  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };

  // TODO: Type this event handler correctly
  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  };

  // TODO: Type this event handler correctly
  const handleRememberChange = (e: any) => {
    setRemember(e.target.checked);
  };

  // TODO: Type this event handler correctly
  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit({ email, password, remember });
  };

  // TODO: Type this event handler correctly
  const handleButtonClick = (e: any) => {
    console.log('Button clicked at:', e.clientX, e.clientY);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="Password"
      />
      <label>
        <input
          type="checkbox"
          checked={remember}
          onChange={handleRememberChange}
        />
        Remember me
      </label>
      <button type="submit" onClick={handleButtonClick}>
        Login
      </button>
    </form>
  );
}

// =============================================================================
// EXERCISE 5: forwardRef and Refs Typing
// =============================================================================

/**
 * Create an Input component using forwardRef with proper typing.
 * Should expose the underlying input element via ref.
 *
 * Requirements:
 * - Use forwardRef with correct generic types
 * - Accept standard input props
 * - Forward ref to input element
 * - Add custom label prop
 * - Component should be fully typed
 */

interface CustomInputProps {
  label: string;
  error?: string;
  // TODO: Add other input props using ComponentProps
}

// TODO: Implement forwardRef with proper typing
export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ label, error, ...props }, ref) => {
    // TODO: Implement component
    return (
      <div>
        <label>{label}</label>
        <input ref={ref} {...props} />
        {error && <span className="error">{error}</span>}
      </div>
    );
  }
);

CustomInput.displayName = 'CustomInput';

// =============================================================================
// EXERCISE 6: useImperativeHandle Typing
// =============================================================================

/**
 * Create a Modal component that exposes imperative methods.
 * Should use useImperativeHandle with proper typing.
 *
 * Requirements:
 * - Define ModalHandle interface with open() and close() methods
 * - Use forwardRef with custom ref type
 * - Use useImperativeHandle to expose methods
 * - Component should manage its own open/closed state
 * - Render children in modal when open
 */

// TODO: Define ModalHandle interface
export interface ModalHandle {
  open: () => void;
  close: () => void;
  isOpen: () => boolean;
}

interface ModalProps {
  children: ReactNode;
  onClose?: () => void;
}

// TODO: Implement Modal with useImperativeHandle
export const Modal = forwardRef<ModalHandle, ModalProps>(
  ({ children, onClose }, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    // TODO: Use useImperativeHandle to expose methods
    useImperativeHandle(ref, () => ({
      // TODO: Implement interface methods
      open: () => {},
      close: () => {},
      isOpen: () => false
    }));

    if (!isOpen) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          {children}
          <button onClick={() => setIsOpen(false)}>Close</button>
        </div>
      </div>
    );
  }
);

Modal.displayName = 'Modal';

// =============================================================================
// EXERCISE 7: ReactNode vs ReactElement vs PropsWithChildren
// =============================================================================

/**
 * Create components demonstrating the differences between
 * ReactNode, ReactElement, and PropsWithChildren.
 *
 * Requirements:
 * - Container: accepts ReactNode children (most flexible)
 * - StrictContainer: accepts only ReactElement children
 * - TypedContainer: uses PropsWithChildren<T> for typed props
 * - Each should render children appropriately
 */

// TODO: Component that accepts ReactNode (strings, numbers, elements, arrays, etc.)
interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({
  children,
  className
}: ContainerProps): ReactElement {
  // TODO: Implement container
  return <div className={className}>{children}</div>;
}

// TODO: Component that accepts only ReactElement (strict typing)
interface StrictContainerProps {
  children: ReactElement | ReactElement[];
  wrapper?: string;
}

export function StrictContainer({
  children,
  wrapper
}: StrictContainerProps): ReactElement {
  // TODO: Implement strict container
  return <div>{children}</div>;
}

// TODO: Component using PropsWithChildren utility type
interface CardProps {
  title: string;
  footer?: ReactNode;
}

export function Card({
  title,
  footer,
  children
}: PropsWithChildren<CardProps>): ReactElement {
  // TODO: Implement card with PropsWithChildren
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}

// =============================================================================
// EXERCISE 8: Polymorphic Component (as prop pattern)
// =============================================================================

/**
 * Create a polymorphic Text component that can render as different elements.
 * Should accept an 'as' prop to change the rendered element type.
 *
 * Requirements:
 * - Accept 'as' prop that can be any HTML element or component
 * - Props should match the element type specified in 'as'
 * - Default element should be 'span'
 * - Should have custom color and weight props
 * - All other props should be passed through with correct types
 */

type TextOwnProps<E extends ElementType = ElementType> = {
  as?: E;
  color?: 'primary' | 'secondary' | 'danger' | 'success';
  weight?: 'normal' | 'bold' | 'light';
  children: ReactNode;
};

type TextProps<E extends ElementType> = TextOwnProps<E> &
  Omit<ComponentProps<E>, keyof TextOwnProps>;

// TODO: Implement polymorphic component
export function Text<E extends ElementType = 'span'>({
  as,
  color = 'primary',
  weight = 'normal',
  children,
  ...props
}: TextProps<E>): ReactElement {
  // TODO: Implement polymorphic text component
  const Component = as || 'span';
  return <Component {...props}>{children}</Component>;
}

// =============================================================================
// EXERCISE 9: Generic Hook with TypeScript
// =============================================================================

/**
 * Create a generic useLocalStorage hook with proper typing.
 * Should provide type-safe localStorage access.
 *
 * Requirements:
 * - Generic type parameter for stored value
 * - Return tuple: [value, setValue, removeValue]
 * - Handle JSON serialization/deserialization
 * - Handle storage errors gracefully
 * - Type safe set and get operations
 */

type UseLocalStorageReturn<T> = [
  T,
  (value: T | ((prev: T) => T)) => void,
  () => void
];

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T> {
  // TODO: Implement generic useLocalStorage hook
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  const setValue = (value: T | ((prev: T) => T)) => {
    // TODO: Implement setValue
  };

  const removeValue = () => {
    // TODO: Implement removeValue
  };

  return [storedValue, setValue, removeValue];
}

// =============================================================================
// EXERCISE 10: Complex Generic Component with Constraints
// =============================================================================

/**
 * Create a DataTable component with generic constraints.
 * Should enforce that data items have an id property.
 *
 * Requirements:
 * - Generic type T must extend { id: string | number }
 * - Accept columns configuration with proper typing
 * - Column render function should be type-safe
 * - Support sortable columns with proper typing
 * - onRowClick should provide typed row data
 */

// TODO: Define base type constraint
interface HasId {
  id: string | number;
}

// TODO: Define Column interface
interface Column<T extends HasId> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
  sortable?: boolean;
}

// TODO: Define DataTableProps
interface DataTableProps<T extends HasId> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  keyExtractor?: (row: T) => string | number;
}

export function DataTable<T extends HasId>({
  data,
  columns,
  onRowClick,
  keyExtractor = (row) => row.id
}: DataTableProps<T>): ReactElement {
  // TODO: Implement generic data table
  return (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={String(col.key)}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={keyExtractor(row)} onClick={() => onRowClick?.(row)}>
            {columns.map((col) => (
              <td key={String(col.key)}>
                {col.render
                  ? col.render(row[col.key], row)
                  : String(row[col.key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// =============================================================================
// EXERCISE 11: Type Guards and Narrowing
// =============================================================================

/**
 * Create a component that uses type guards for runtime type checking.
 * Should handle different response types safely.
 *
 * Requirements:
 * - Define multiple response types (success, error, loading)
 * - Create type guard functions
 * - Use discriminated unions
 * - Render different UI based on response type
 */

// TODO: Define response types with discriminated union
interface LoadingResponse {
  status: 'loading';
}

interface SuccessResponse<T> {
  status: 'success';
  data: T;
}

interface ErrorResponse {
  status: 'error';
  error: string;
}

type ApiResponse<T> = LoadingResponse | SuccessResponse<T> | ErrorResponse;

// TODO: Create type guard functions
function isLoading<T>(response: ApiResponse<T>): response is LoadingResponse {
  return response.status === 'loading';
}

function isSuccess<T>(
  response: ApiResponse<T>
): response is SuccessResponse<T> {
  // TODO: Implement type guard
  return false;
}

function isError<T>(response: ApiResponse<T>): response is ErrorResponse {
  // TODO: Implement type guard
  return false;
}

// TODO: Component using type guards
interface ResponseDisplayProps<T> {
  response: ApiResponse<T>;
  renderData: (data: T) => ReactNode;
}

export function ResponseDisplay<T>({
  response,
  renderData
}: ResponseDisplayProps<T>): ReactElement {
  // TODO: Use type guards to render appropriate UI
  if (isLoading(response)) {
    return <div>Loading...</div>;
  }

  if (isError(response)) {
    return <div>Error: {response.error}</div>;
  }

  if (isSuccess(response)) {
    return <div>{renderData(response.data)}</div>;
  }

  return <div>Unknown state</div>;
}

// =============================================================================
// EXERCISE 12: Utility Types with React
// =============================================================================

/**
 * Create components demonstrating TypeScript utility types.
 *
 * Requirements:
 * - Use Pick to extract subset of props
 * - Use Omit to exclude props
 * - Use Partial for optional props
 * - Use Required for required props
 * - Use Readonly for immutable props
 */

// Base user type
interface BaseUser {
  id: number;
  name: string;
  email: string;
  age: number;
  address: string;
  phone: string;
}

// TODO: Component using Pick - only show basic info
type UserBasicInfo = Pick<BaseUser, 'id' | 'name' | 'email'>;

interface UserBasicCardProps {
  user: UserBasicInfo;
}

export function UserBasicCard({ user }: UserBasicCardProps): ReactElement {
  // TODO: Implement component showing only picked properties
  return <div>TODO</div>;
}

// TODO: Component using Omit - exclude sensitive info
type PublicUser = Omit<BaseUser, 'email' | 'phone' | 'address'>;

interface PublicUserCardProps {
  user: PublicUser;
}

export function PublicUserCard({ user }: PublicUserCardProps): ReactElement {
  // TODO: Implement component with omitted properties
  return <div>TODO</div>;
}

// TODO: Component using Partial - all props optional for editing
interface UserFormProps {
  initialUser?: Partial<BaseUser>;
  onSubmit: (user: BaseUser) => void;
}

export function UserForm({
  initialUser,
  onSubmit
}: UserFormProps): ReactElement {
  // TODO: Implement form with partial initial values
  return <form>TODO</form>;
}

// =============================================================================
// HELPER TYPES AND UTILITIES
// =============================================================================

/**
 * Extract prop types from a component
 */
export type PropsOf<
  T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>
> = T extends keyof JSX.IntrinsicElements
  ? JSX.IntrinsicElements[T]
  : T extends React.JSXElementConstructor<infer P>
  ? P
  : never;

/**
 * Make specific properties required
 */
export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Make specific properties optional
 */
export type WithOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;
