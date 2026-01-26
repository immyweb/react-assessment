/**
 * React State Management Exercises
 *
 * This file contains exercises covering React state management concepts:
 * - useState hook fundamentals
 * - State updates and batching
 * - State structure design
 * - Avoiding state mutations
 * - State lifting patterns
 * - useReducer for complex state
 * - State normalization techniques
 */

import { useState, useReducer, ReactElement, ChangeEvent } from 'react';

// =============================================================================
// EXERCISE 1: useState Hook Fundamentals
// =============================================================================

/**
 * Create a simple counter component using useState.
 * Should display current count (starting at 0)
 * Should have increment, decrement, and reset buttons
 * Should handle button clicks to update state
 *
 * Expected behavior:
 * - Increment button increases count by 1
 * - Decrement button decreases count by 1
 * - Reset button sets count to 0
 */
export function Counter(): ReactElement {
  const [count, setCount] = useState<number>(0);

  return (
    <>
      <div>Current count: {count}</div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </>
  );
}

/**
 * Create a user profile component with multiple independent state variables.
 * State variables: name, email, age
 * Should have inputs to update each state variable
 * Should display current state values
 * Should handle form submission (console.log the values)
 */
export function UserProfile(): ReactElement {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [age, setAge] = useState<number>(0);

  function onSubmit(formData: FormData) {
    const result = {
      name: formData.get('name'),
      email: formData.get('email'),
      age: formData.get('age')
    };
    console.log(result);
  }

  return (
    <>
      <div>
        <p>{name}</p>
        <p>{email}</p>
        <p>{age}</p>
      </div>
      <form action={onSubmit} role="form">
        <label>
          Name:{' '}
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label>
          Email:{' '}
          <input
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          Age:{' '}
          <input
            name="age"
            type="number"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
          />
        </label>
      </form>
    </>
  );
}

// =============================================================================
// EXERCISE 2: State Updates and Batching
// =============================================================================

/**
 * Create a component that demonstrates functional state updates for reliability.
 * Should have a counter that can be incremented multiple times rapidly
 * Should demonstrate difference between direct updates and functional updates
 * Should have buttons for both approaches
 * The direct update can miss increments because React batches state updates.
 * The functional update always works as expected, even with rapid clicks.
 *
 * Expected behavior:
 * - Direct update button may not work correctly when clicked rapidly
 * - Functional update button should work correctly in all cases
 */
export function FunctionalUpdates(): ReactElement {
  const [count, setCount] = useState<number>(0);

  return (
    <>
      <p>Count {count}</p>
      <button onClick={() => setCount(count + 1)}>Direct update</button>
      <button onClick={() => setCount((prev) => prev + 1)}>
        Functional update
      </button>
      <button onClick={() => setCount(0)}>Reset</button>
    </>
  );
}

// =============================================================================
// EXERCISE 3: Object State Management
// =============================================================================

/**
 * Create a component that manages object state properly without mutations.
 * Should manage a person object with name, age, and email properties
 * Should update individual properties without losing others
 * Should demonstrate proper object spreading
 *
 * Expected behavior:
 * - Updating name should preserve age and email
 * - Updating age should preserve name and email
 * - Should display current object state
 */
interface Person {
  name: string;
  age: number;
  email: string;
}

export function PersonInfo(): ReactElement {
  const [person, setPerson] = useState<Person>({
    name: '',
    age: 0,
    email: ''
  });

  return (
    <>
      <div>
        <p>{person.name}</p>
        <p>{person.age}</p>
        <p>{person.email}</p>
      </div>
      <label>
        Name{' '}
        <input
          name="name"
          value={person.name}
          onChange={(e) => setPerson({ ...person, name: e.target.value })}
        />
      </label>
      <label>
        Age{' '}
        <input
          name="age"
          type="number"
          value={person.age}
          onChange={(e) =>
            setPerson({ ...person, age: Number(e.target.value) })
          }
        />
      </label>
      <label>
        Email{' '}
        <input
          name="email"
          value={person.email}
          onChange={(e) => setPerson({ ...person, email: e.target.value })}
        />
      </label>
    </>
  );
}

/**
 * Create a component that demonstrates proper state structure organization.
 * Should manage both user data and UI state
 * Should demonstrate when to group vs separate state
 * Should show flat vs nested state patterns
 *
 * Expected behavior:
 * - User data (profile) should be in one state object
 * - UI state (loading, errors) should be separate
 * - Should avoid deeply nested state structures
 * - Should demonstrate derived state calculations
 */
interface User {
  name: string;
  age: number;
  email: string;
}

export function StateStructure(): ReactElement {
  const [user, setUser] = useState<User>({
    name: 'Charlie',
    age: 44,
    email: 'charlie@email.com'
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const isAdult = user.age >= 18;

  return (
    <>
      <div data-testid="user-data">
        <p>Name: {user.name}</p>
        <p>Age: {user.age}</p>
        <p>Email: {user.email}</p>
      </div>
      <div data-testid="state-structure">{JSON.stringify(user)}</div>
      <div data-testid="ui-state">
        <>
          {loading ? <div>loading...</div> : ''}
          {error ? <div>Something went wrong</div> : ''}
          <button onClick={() => setLoading(!loading)}>Toggle loading</button>
          <button onClick={() => setError(!error)}>Toggle error</button>
        </>
      </div>
      <div data-testid="derived-state">
        <p>Is Adult: {isAdult}</p>
      </div>
    </>
  );
}

// =============================================================================
// EXERCISE 4: Array State Management
// =============================================================================

/**
 * Create a todo list component that manages array state properly.
 * Should manage an array of todo items
 * Should add, remove, and toggle todo items
 * Should demonstrate proper array state updates (no mutations)
 *
 * Expected behavior:
 * - Adding todos should not mutate existing array
 * - Removing todos should filter out the item
 * - Each todo should have id, text, and completed properties
 */
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

let nextId = 0;
export function TodoList(): ReactElement {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [item, setItem] = useState<string>('');

  function addTodo() {
    setTodos([...todos, { id: nextId++, text: item, completed: false }]);
    setItem('');
  }

  function removeTodo(id: number) {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  }

  function toogleCompleted(id: number) {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  return (
    <>
      <section>
        {todos.length > 0 ? (
          <ul>
            {todos.map((todo) => {
              return (
                <li key={todo.id}>
                  {todo.text}
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toogleCompleted(todo.id)}
                  />
                  <button onClick={() => removeTodo(todo.id)}>Remove</button>
                </li>
              );
            })}
          </ul>
        ) : (
          'No todos'
        )}
      </section>
      <section>
        <label>
          Add todo{' '}
          <input value={item} onChange={(e) => setItem(e.target.value)} />
        </label>
        <button onClick={() => addTodo()}>Add</button>
      </section>
    </>
  );
}

// =============================================================================
// EXERCISE 5: State Lifting Patterns
// =============================================================================

/**
 * Create parent and child components that demonstrate state lifting.
 * Parent component: TemperatureConverter
 * Child component: TemperatureInput (already provided below)
 * Should lift temperature state to parent
 * Should synchronize both Celsius and Fahrenheit inputs
 *
 * Expected behavior:
 * - Entering value in Celsius should update Fahrenheit automatically
 * - Entering value in Fahrenheit should update Celsius automatically
 * - Should show boiling point message when appropriate
 */

type Scales = 'c' | 'f';

// Helper component for temperature input (DO NOT MODIFY)
const TemperatureInput = ({
  scale,
  temperature,
  onTemperatureChange
}: {
  scale: string;
  temperature: string;
  onTemperatureChange: (value: string) => void;
}): ReactElement => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onTemperatureChange(e.target.value);
  };

  return (
    <fieldset>
      <label htmlFor={`temp-${scale}`}>
        Enter temperature in {scale === 'c' ? 'Celsius' : 'Fahrenheit'}:
      </label>
      <input id={`temp-${scale}`} value={temperature} onChange={handleChange} />
    </fieldset>
  );
};

export function TemperatureConverter(): ReactElement {
  const [temp, setTemp] = useState<string>('');
  const [scale, setScale] = useState<Scales>('c');

  function toFahrenheit(celsius: string) {
    return ((Number(celsius) * 9) / 5 + 32).toString();
  }

  function toCelsius(fahrenheit: string) {
    return (((Number(fahrenheit) - 32) * 5) / 9).toString();
  }

  function handleCelsiusChange(value: string) {
    setTemp(value);
    setScale('c');
  }

  function handleFahrenheitChange(value: string) {
    setTemp(value);
    setScale('f');
  }

  // Determine the values to display in each input
  const celsius = scale === 'f' ? (temp === '' ? '' : toCelsius(temp)) : temp;
  const fahrenheit =
    scale === 'c' ? (temp === '' ? '' : toFahrenheit(temp)) : temp;

  // Only show boiling point if celsius is a valid number
  const celsiusNum = Number(celsius);
  const boiling = celsius !== '' && !isNaN(celsiusNum) && celsiusNum >= 100;

  return (
    <>
      <TemperatureInput
        scale="c"
        temperature={celsius}
        onTemperatureChange={handleCelsiusChange}
      />
      <TemperatureInput
        scale="f"
        temperature={fahrenheit}
        onTemperatureChange={handleFahrenheitChange}
      />
      {boiling ? <p>Boiling point achieved</p> : ''}
    </>
  );
}

// =============================================================================
// EXERCISE 6: useReducer for Complex State
// =============================================================================

/**
 * Create a counter component using useReducer instead of useState.
 * Should support increment, decrement, reset, and set actions
 * Should use useReducer for state management
 * Should define action types and reducer function
 *
 * Expected behavior:
 * - Should work exactly like useState counter but with useReducer
 * - Should demonstrate action-based state updates
 */

type ACTIONTYPE =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'set'; count: number }
  | { type: 'reset' };

const initialCountState = { count: 0 };

function reducer(state: typeof initialCountState, action: ACTIONTYPE) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'set':
      return { count: action.count };
    case 'reset':
      return { count: 0 };
    default:
      throw new Error(`Action not recognised`);
  }
}

export function ReducerCounter(): ReactElement {
  const [state, dispatch] = useReducer(reducer, initialCountState);

  return (
    <>
      <div>Current count: {state.count}</div>
      <button onClick={() => dispatch({ type: 'increment' })}>Increment</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>Decrement</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>

      <label>
        Set{' '}
        <input
          name="set"
          onChange={(e) =>
            dispatch({ type: 'set', count: Number(e.target.value) })
          }
        />
      </label>
    </>
  );
}

/**
 * Create a shopping cart component with complex state using useReducer.
 * Should manage cart items with add, remove, and update quantity actions
 * Should calculate totals based on cart state
 * Should handle existing items by updating quantity
 *
 * Expected behavior:
 * - Adding existing item should increase quantity
 * - Adding new item should add to cart
 * - Should display total price
 * - Should allow clearing entire cart
 */

type ShoppingItem = {
  id: number;
  item: string;
  quantity: number;
  price: string;
};

type CartState = ShoppingItem[];

type AddAction = { type: 'add' } & ShoppingItem;
type RemoveAction = { type: 'remove' } & Pick<ShoppingItem, 'id'>;
type UpdateAction = { type: 'update' } & Pick<ShoppingItem, 'id'> &
  Partial<Omit<ShoppingItem, 'id'>>;
type ResetAction = { type: 'reset' };
type CartAction = AddAction | RemoveAction | UpdateAction | ResetAction;

function shoppingReducer(cart: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add':
      const existing = cart.find((c) => c.id === action.id);
      if (existing) {
        return cart.map((c) =>
          c.id === action.id
            ? { ...c, quantity: c.quantity + (action.quantity || 1) }
            : c
        );
      } else {
        return [
          ...cart,
          {
            id: action.id,
            item: action.item,
            quantity: action.quantity || 1,
            price: action.price
          }
        ];
      }
    case 'remove':
      return cart.filter((c) => c.id !== action.id);
    case 'update':
      return cart.map((c) => {
        if (c.id === action.id) {
          return {
            id: action.id,
            item: action.item || c.item,
            quantity: action.quantity || c.quantity,
            price: action.price || c.price
          };
        } else {
          return c;
        }
      });
    case 'reset':
      return [];
    default:
      throw new Error(`Action not recognised`);
  }
}

export function ShoppingCart(): ReactElement {
  const [state, dispatch] = useReducer(shoppingReducer, []);

  // Calculate total price (ensure price is treated as a number)
  const total = state.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <>
      <section>
        <h3>Basket</h3>
        {state.length > 0 ? (
          <>
            {state.map((item) => {
              return (
                <div key={item.id} data-testid={item.id}>
                  <p>{item.item}</p>
                  <p data-testid={`quantity-${item.quantity}`}>
                    Quantity: {item.quantity}
                  </p>
                  <p>Price: £{Number(item.price).toFixed(2)}</p>
                  <button
                    onClick={() => dispatch({ type: 'remove', id: item.id })}>
                    Remove item
                  </button>
                </div>
              );
            })}
            <div
              style={{ fontWeight: 'bold', marginTop: '1em' }}
              data-testid="total">
              Total: £{total.toFixed(2)}
            </div>
          </>
        ) : (
          <div data-testid="cart-empty">Your cart is empty</div>
        )}

        <button onClick={() => dispatch({ type: 'reset' })}>
          Clear basket
        </button>
      </section>
      <section>
        <ul>
          <li>
            <p>Teapot</p>
            <p>Price: £25.00</p>
            <button
              onClick={() =>
                dispatch({
                  type: 'add',
                  item: 'Teapot',
                  price: '25',
                  quantity: 1,
                  id: 1
                })
              }>
              Add to cart
            </button>
          </li>
          <li>
            <p>Trendy Bag</p>
            <p>Price: £125.00</p>
            <button
              onClick={() =>
                dispatch({
                  type: 'add',
                  item: 'Trendy Bag',
                  price: '125',
                  quantity: 1,
                  id: 2
                })
              }>
              Add to cart
            </button>
          </li>
          <li>
            <p>Umbrella</p>
            <p>Price: £50.00</p>
            <button
              onClick={() =>
                dispatch({
                  type: 'add',
                  item: 'Umbrella',
                  price: '50',
                  quantity: 1,
                  id: 3
                })
              }>
              Add to cart
            </button>
          </li>
        </ul>
      </section>
    </>
  );
}

// =============================================================================
// EXERCISE 7: State Normalization Techniques
// =============================================================================

/**
 * Create a component that manages normalized relational data efficiently.
 * Should manage users, posts, and comments in normalized form
 * Should demonstrate efficient lookups and updates
 * Should avoid nested data structures
 *
 * Expected behavior:
 * - Data should be stored in separate entities (users, posts, comments)
 * - Should use IDs to reference relationships
 * - Should provide efficient data access patterns
 * - Should handle adding/removing data without deep mutations
 */
type UserType = { id: string; name: string };
type PostType = { id: string; userId: string; title: string; content: string };
type CommentType = { id: string; postId: string; text: string };

type BlogState = {
  users: Record<string, UserType>;
  posts: Record<string, PostType>;
  comments: Record<string, CommentType>;
};

const initialState: BlogState = {
  users: {},
  posts: {},
  comments: {}
};

const ADD_USER = 'ADD_USER';
const ADD_POST = 'ADD_POST';
const ADD_COMMENT = 'ADD_COMMENT';
const REMOVE_POST = 'REMOVE_POST';
const REMOVE_COMMENT = 'REMOVE_COMMENT';

type AddUserAction = {
  type: typeof ADD_USER;
  payload: { id: string; name: string };
};
type AddPostAction = {
  type: typeof ADD_POST;
  payload: { id: string; userId: string; title: string; content: string };
};
type AddCommentAction = {
  type: typeof ADD_COMMENT;
  payload: {
    id: string;
    postId: string;
    text: string;
  };
};
type RemovePostAction = {
  type: typeof REMOVE_POST;
  payload: string;
};
type RemoveCommentAction = {
  type: typeof REMOVE_COMMENT;
  payload: string;
};
type BlogActions =
  | AddUserAction
  | AddPostAction
  | AddCommentAction
  | RemovePostAction
  | RemoveCommentAction;

function blogReducer(state: BlogState, action: BlogActions): BlogState {
  switch (action.type) {
    case ADD_USER:
      return {
        ...state,
        users: {
          ...state.users,
          [action.payload.id]: action.payload
        }
      };

    case ADD_POST:
      return {
        ...state,
        posts: {
          ...state.posts,
          [action.payload.id]: action.payload
        }
      };

    case ADD_COMMENT:
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.payload.id]: action.payload
        }
      };

    case REMOVE_POST:
      const { [action.payload]: removedPost, ...remainingPosts } = state.posts;
      return {
        ...state,
        posts: remainingPosts,
        comments: Object.fromEntries(
          Object.entries(state.comments).filter(
            ([_, comment]) => comment.postId !== action.payload
          )
        )
      };

    case REMOVE_COMMENT:
      const { [action.payload]: removedComment, ...remainingComments } =
        state.comments;
      return {
        ...state,
        comments: remainingComments
      };

    default:
      return state;
  }
}

export function BlogManager(): ReactElement {
  const [state, dispatch] = useReducer(blogReducer, initialState);

  // Handlers
  const addUser = (name: string) => {
    const id = `user-${Date.now()}`;
    dispatch({ type: ADD_USER, payload: { id, name } });
  };

  const addPost = (userId: string, title: string, content: string) => {
    const id = `post-${Date.now()}`;
    dispatch({ type: ADD_POST, payload: { id, userId, title, content } });
  };

  const addComment = (postId: string, text: string) => {
    const id = `comment-${Date.now()}`;
    dispatch({ type: ADD_COMMENT, payload: { id, postId, text } });
  };

  const removePost = (postId: string) => {
    dispatch({ type: REMOVE_POST, payload: postId });
  };

  const removeComment = (commentId: string) => {
    dispatch({ type: REMOVE_COMMENT, payload: commentId });
  };

  return (
    <div data-testid="blog-manager">
      <h1>Blog Manager</h1>

      {/* Add User */}
      <button onClick={() => addUser('John Doe')}>Add User</button>

      {/* Add Post */}
      <button
        onClick={() =>
          addPost('user-1', 'My First Post', 'This is the content of the post.')
        }>
        Add Post
      </button>

      {/* Add Comment */}
      <button onClick={() => addComment('post-1', 'Great post!')}>
        Add Comment
      </button>

      <div data-testid="data-display">
        {/* Display Users */}
        <h2>Users</h2>
        <ul>
          {Object.values(state.users).map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>

        {/* Display Posts */}
        <h2>Posts</h2>
        <ul data-testid="relationships">
          {Object.values(state.posts).map((post) => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <p>Author: {state.users[post.userId]?.name}</p>
              <button onClick={() => removePost(post.id)}>Remove Post</button>

              {/* Display Comments */}
              <h4>Comments</h4>
              <ul>
                {Object.values(state.comments)
                  .filter((comment) => comment.postId === post.id)
                  .map((comment) => (
                    <li key={comment.id}>
                      {comment.text}
                      <button onClick={() => removeComment(comment.id)}>
                        Remove Comment
                      </button>
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
