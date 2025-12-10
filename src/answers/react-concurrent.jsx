/**
 * React Concurrent Features Exercises
 *
 * This file contains exercises covering React concurrent features:
 * - Suspense for data fetching
 * - useTransition for non-urgent updates
 * - useDeferredValue for expensive computations
 * - useOptimistic for optimistic updates
 * - Progressive enhancement patterns
 *
 * Each exercise includes:
 * - Clear documentation with examples
 * - Expected behavior description
 * - Component requirements
 * - Test cases to validate implementation
 */

import {
  useState,
  useTransition,
  useDeferredValue,
  Suspense,
  useOptimistic,
  useRef
} from 'react';

// =============================================================================
// EXERCISE 1: Suspense for Data Fetching
// =============================================================================

/**
 * Create a simple data fetching function that returns a Suspense-compatible resource.
 * This simulates fetching user data with a configurable delay.
 *
 * Requirements:
 * - Accept userId and delay parameters
 * - Return an object with a read() method
 * - Throw a promise while loading (Suspense requirement)
 * - Return data when complete: { id: userId, name: `User ${userId}` }
 *
 * @param {number} userId - The user ID to fetch
 * @param {number} delay - Delay in milliseconds (default: 1000)
 * @returns {Object} Resource object with read() method
 */
export function fetchUser(userId, delay = 1000) {
  let status = 'pending';
  let result;

  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: userId, name: `User ${userId}` });
    }, delay);
  }).then(
    (data) => {
      status = 'success';
      result = data;
    },
    (error) => {
      status = 'error';
      result = error;
    }
  );

  return {
    read() {
      if (status === 'pending') {
        throw promise;
      } else if (status === 'error') {
        throw result;
      } else if (status === 'success') {
        return result;
      }
    }
  };
}

/**
 * Create a component that displays user data using Suspense.
 * Should work with the fetchUser resource created above.
 *
 * Requirements:
 * - Accept a resource prop (from fetchUser)
 * - Call resource.read() to get data
 * - Display user id and name
 * - Render inside a div with className "user-profile"
 */
export function UserProfile({ resource }) {
  const { id, name } = resource.read();

  return (
    <div className="user-profile">
      <p>id: {id}</p>
      <p>{name}</p>
    </div>
  );
}

/**
 * Create a parent component that demonstrates Suspense usage.
 * Should handle loading states with a fallback component.
 *
 * Requirements:
 * - Use Suspense with a loading fallback
 * - Display UserProfile for userId 1
 * - Show "Loading user..." text while fetching
 */
export function SuspenseDemo() {
  const resource = fetchUser(1, 10);

  return (
    <>
      <Suspense fallback={<Loading />}>
        <UserProfile resource={resource} />
      </Suspense>
    </>
  );
}

// =============================================================================
// EXERCISE 2: useTransition for Non-Urgent Updates
// =============================================================================

/**
 * Create a search component that demonstrates useTransition.
 * Should handle expensive filtering without blocking user input.
 *
 * Requirements:
 * - Accept items prop (array of strings)
 * - Maintain search query state
 * - Use useTransition to defer filtering
 * - Show loading indicator during transition
 * - Filter items based on search query (case-insensitive)
 *
 * Expected behavior:
 * - Input should remain responsive during filtering
 * - Show "Searching..." when isPending is true
 * - Display filtered results in a list
 */
export function SearchList({ items = [] }) {
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchItems, setSearchItems] = useState(items);

  function handleSearch(text) {
    setSearchTerm(text);
    startTransition(() => {
      const filtered = items.filter((item) =>
        item.toLowerCase().includes(text.toLowerCase())
      );
      setSearchItems(filtered);
    });
  }

  return (
    <>
      <form role="form">
        <label htmlFor="searchInput">Search</label>
        <input
          id="searchInput"
          name="searchInput"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </form>
      <section>
        {isPending && <div>Searching...</div>}
        <ul>
          {searchItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </>
  );
}

/**
 * Create a tab switcher that uses useTransition for smooth transitions.
 * Should demonstrate non-urgent updates when switching tabs.
 *
 * Requirements:
 * - Three tabs: "About", "Posts", "Contact"
 * - Use useTransition when switching tabs
 * - Show loading indicator on the tab being loaded
 * - Each tab content should render slowly (simulate with expensive render)
 *
 * Tab content:
 * - About: "About content" with 5000 items
 * - Posts: "Posts content" with 5000 items
 * - Contact: "Contact content" with 5000 items
 */
export function TabSwitcher() {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState('about');

  function handleTabChange(tab) {
    startTransition(() => {
      setActiveTab(tab);
    });
  }

  return (
    <>
      <ul>
        <li>
          <button onClick={() => handleTabChange('about')}>About</button>
        </li>
        <li>
          <button onClick={() => handleTabChange('posts')}>Posts</button>
        </li>
        <li>
          <button onClick={() => handleTabChange('contact')}>Contact</button>
        </li>
      </ul>
      <section>
        {isPending && <div>Loading...</div>}
        {activeTab === 'about' && (
          <div>
            <h1>About content</h1>
            <SlowContent text={'about'} count={5000} />
          </div>
        )}
        {activeTab === 'posts' && (
          <div>
            <h1>Posts content</h1>
            <SlowContent text={'posts'} count={5000} />
          </div>
        )}
        {activeTab === 'contact' && (
          <div>
            <h1>Contact content</h1>
            <SlowContent text={'contact'} count={5000} />
          </div>
        )}
      </section>
    </>
  );
}

/**
 * Helper component to simulate slow rendering.
 * DO NOT MODIFY - Used by tests and tab switcher.
 */
export function SlowContent({ text, count = 100 }) {
  const items = Array.from({ length: count }, (_, i) => `${text} ${i + 1}`);
  return (
    <ul>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

// =============================================================================
// EXERCISE 3: useDeferredValue for Expensive Computations
// =============================================================================

/**
 * Create a component that uses useDeferredValue to defer expensive filtering.
 * Similar to SearchList but using useDeferredValue instead of useTransition.
 *
 * Requirements:
 * - Accept items prop (array of strings)
 * - Maintain search query state
 * - Use useDeferredValue on the search query
 * - Filter based on deferred value
 * - Show visual indicator when value is stale
 *
 * Expected behavior:
 * - Input updates immediately
 * - Filtering uses deferred value
 * - Show opacity: 0.5 when deferredQuery !== query
 */
export function DeferredSearchList({ items = [] }) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [searchResults, setSearchResults] = useState(items);
  const isStale = query !== deferredQuery;

  function handleSearch(text) {
    setQuery(text);
    const filtered = items.filter((item) =>
      item.toLowerCase().includes(deferredQuery.toLowerCase())
    );
    setSearchResults(filtered);
  }

  return (
    <>
      <form role="form">
        <label htmlFor="searchInput">Search</label>
        <input
          id="searchInput"
          name="searchInput"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </form>
      <section>
        <div
          style={{
            opacity: isStale ? 0.5 : 1,
            transition: isStale
              ? 'opacity 0.2s 0.2s linear'
              : 'opacity 0s 0s linear'
          }}>
          <ul>
            {searchResults.map((result, i) => {
              return <li key={`${result}-${i}`}>{result}</li>;
            })}
          </ul>
        </div>
      </section>
    </>
  );
}

// =============================================================================
// EXERCISE 4: useOptimistic for Optimistic Updates
// =============================================================================

/**
 * Simulate an API call that adds a todo item.
 * DO NOT MODIFY - Used by tests.
 *
 * @param {string} text - Todo text
 * @returns {Promise<Object>} Resolves with todo object after delay
 */
export function addTodoAPI(text) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Date.now(),
        text,
        completed: false
      });
    }, 1000);
  });
}

/**
 * Create a todo list with optimistic updates using useOptimistic.
 * Should show new items immediately before server confirmation.
 *
 * Requirements:
 * - Maintain todos state (array of { id, text, completed })
 * - Use useOptimistic for optimistic updates
 * - Add new todos optimistically when form submits
 * - Show pending todos with different styling (opacity: 0.5)
 * - Update with server response when complete
 *
 * Form requirements:
 * - Input for new todo text
 * - Submit button (disabled during submission)
 * - Clear input after submission starts
 */
export function OptimisticTodoList() {
  const [item, setItem] = useState('');
  const [todos, setTodos] = useState([]);
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (currentTodos, newTodo) => [
      { ...newTodo, optimistic: true },
      ...currentTodos
    ]
  );
  const [isPending, startTransition] = useTransition();

  function submitTodo(text) {
    addOptimisticTodo({ id: Date.now(), text, completed: false });

    startTransition(async () => {
      try {
        const savedTodo = await addTodoAPI(text);
        setTodos((prev) => [{ ...savedTodo }, ...prev]);
        setItem('');
      } catch (err) {
        console.error('Failed to add todo:', err);
      }
    });
  }

  return (
    <>
      <form
        role="form"
        action={async (formData) => {
          submitTodo(formData.get('newTodo'));
        }}>
        <label htmlFor="newTodo">Add todo</label>
        <input
          id="newTodo"
          name="newTodo"
          value={item}
          onChange={(e) => setItem(e.target.value)}
        />
        <button type="submit" disabled={isPending}>
          Add
        </button>
      </form>
      <section>
        <ul>
          {optimisticTodos.map((todo) => {
            return (
              <li
                key={todo.id}
                className={todo.optimistic ? 'text-gray-500' : ''}>
                {todo.text}{' '}
                <span>{todo.completed ? 'completed' : 'not completed'}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}

/**
 * Create a like button with optimistic updates.
 * Shows immediate feedback while waiting for server response.
 *
 * Requirements:
 * - Accept initialLikes prop (default: 0)
 * - Use useOptimistic for like count
 * - Increment optimistically on click
 * - Simulate server call (1 second delay)
 * - Show pending state during update
 * - Button disabled while pending
 *
 * Expected output:
 * - Button text: "Like ({count})" or "Liking... ({count})"
 * - Button disabled when pending
 */
function addCountAPI() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

export function OptimisticLikeButton({ initialLikes = 0 }) {
  const [count, setCount] = useState(initialLikes);
  const [optimisticCount, addOptimisticCount] = useOptimistic(
    count,
    (currentCount) => currentCount + 1
  );
  const [isPending, startTransition] = useTransition();

  function handleAddLike() {
    startTransition(async () => {
      addOptimisticCount();
      try {
        await addCountAPI();
        setCount((prev) => prev + 1);
      } catch (err) {
        console.error('Failed to add count:', err);
      }
    });
  }

  return (
    <>
      <button onClick={() => handleAddLike()} disabled={isPending}>
        {isPending
          ? `Liking... (${optimisticCount})`
          : `Like (${optimisticCount})`}
      </button>
    </>
  );
}

// =============================================================================
// EXERCISE 5: Progressive Enhancement
// =============================================================================

/**
 * Create a form that works with and without JavaScript (progressive enhancement).
 * Uses useOptimistic for enhanced experience when JS is available.
 *
 * Requirements:
 * - Form with name and email inputs
 * - Submit using form action (works without JS)
 * - Enhanced with useOptimistic when JS available
 * - Show optimistic feedback on submit
 * - Display submitted data in a list
 * - Clear form after successful submission
 *
 * Each submission should create an object: { id, name, email, pending: boolean }
 */
export function ProgressiveForm({ onSubmit }) {
  const [submittedUsers, setSubmittedUser] = useState([]);
  const [optimisticUsers, addOptimisticUser] = useOptimistic(
    submittedUsers,
    (currentUsers, newUser) => [{ ...newUser }, ...currentUsers]
  );
  const [isPending, startTransition] = useTransition();

  async function addUser(formData) {
    'use server';

    const data = {
      id: Date.now(),
      name: formData.get('nameInput'),
      email: formData.get('emailInput'),
      pending: true
    };
    addOptimisticUser(data);

    startTransition(() => {
      try {
        onSubmit(data);
        setSubmittedUser((prev) => [...prev, { ...data, pending: false }]);
      } catch (err) {
        console.error('Failed to submit data:', err);
      }
    });
  }

  return (
    <>
      <form role="form" action={addUser}>
        <label htmlFor="nameInput">Name</label>
        <input id="nameInput" name="nameInput" />

        <label htmlFor="emailInput">Email</label>
        <input id="emailInput" name="emailInput" type="email" />

        <button type="submit" disabled={isPending}>
          Submit
        </button>
      </form>
      <ul>
        {optimisticUsers.map((user) => {
          return (
            <li
              key={user.id}
              style={user.pending ? { opacity: 0.5 } : { opacity: 1 }}>
              Name: {user.name}, Email: {user.email}
            </li>
          );
        })}
      </ul>
    </>
  );
}

/**
 * Create a comment section with progressive enhancement.
 * Shows comments immediately (optimistically) while posting to server.
 *
 * Requirements:
 * - Accept initialComments prop (array of { id, text, author })
 * - Use useOptimistic for comment updates
 * - Add comments optimistically with pending state
 * - Show pending comments with visual indicator (italic text)
 * - Simulate server delay (1.5 seconds)
 * - Form with author and text inputs
 *
 * Expected behavior:
 * - New comments appear immediately (optimistic)
 * - Pending comments shown in italics
 * - Updates to real state after server confirms
 */
function addCommentAPI(comment) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(comment);
    }, 1000);
  });
}

export function OptimisticComments({ initialComments = [] }) {
  const [comments, setComments] = useState(initialComments);
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (currentComments, newComment) => [
      { ...newComment, optimistic: true },
      ...currentComments
    ]
  );
  const [isPending, startTransition] = useTransition();
  const formRef = useRef();

  function addComment(formData) {
    'use server';

    const data = {
      id: Date.now(),
      author: formData.get('authorInput'),
      text: formData.get('commentInput')
    };
    addOptimisticComment(data);
    formRef.current.reset();

    startTransition(async () => {
      try {
        await addCommentAPI(data);
        setComments((prev) => [{ ...data, optimistic: false }, ...prev]);
      } catch (err) {
        console.error('Failed to submit comment:', err);
      }
    });
  }

  return (
    <>
      <form role="form" action={addComment} ref={formRef}>
        <label htmlFor="authorInput">Author</label>
        <input id="authorInput" name="authorInput" />

        <label htmlFor="commentInput">Comment</label>
        <textarea id="commentInput" name="commentInput" />

        <button type="submit" disabled={isPending}>
          Post
        </button>
      </form>
      <ul>
        {optimisticComments.length > 0 &&
          optimisticComments.map((c) => {
            return (
              <li
                key={c.id}
                style={
                  c.optimistic
                    ? { fontStyle: 'italic' }
                    : { fontStyle: 'normal' }
                }>
                {c.text} <span>{c.author}</span>
              </li>
            );
          })}
      </ul>
    </>
  );
}

/* Utils */

function Loading() {
  return <h2>🌀 Loading user...</h2>;
}
