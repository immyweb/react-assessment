/**
 * Hook Problems:
 *
 * 1. useEffect with missing dependencies
 * 2. useEffect running too often (missing dependency array)
 * 3. Event handlers recreated on every render (missing useCallback)
 * 4. Expensive calculations not memoized (missing useMemo)
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';

// =============================================================================
// 1. useEffect with Missing Dependencies
// =============================================================================

// ❌ Bad - Missing dependencies:
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Uses userId but it's not in dependency array!
    fetchUser(userId).then(setUser);
  }, []); // ❌ Missing userId

  useEffect(() => {
    // Uses both userId and user.preferences but neither is listed
    if (user) {
      fetchPosts(userId, user.preferences).then(setPosts);
    }
  }, []); // ❌ Missing userId and user

  return <div>...</div>;
}

// ✅ Good - All dependencies included:
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]); // ✅ Includes userId

  useEffect(() => {
    if (user) {
      fetchPosts(userId, user.preferences).then(setPosts);
    }
  }, [userId, user]); // ✅ Includes both dependencies

  return <div>...</div>;
}

// Another example with stale closures:

// ❌ Bad - Stale closure
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // This will always log 0 because count is stale!
      console.log(`Count is: ${count}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []); // ❌ Missing count

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

// ✅ Good - Include dependency or use functional update
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(`Count is: ${count}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [count]); // ✅ Includes count

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}

// =============================================================================
// 2. useEffect Running Too Often (Missing Dependency Array)
// =============================================================================

// ❌ Bad - No dependency array (runs every render):
function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    // This runs after EVERY render - infinite loop!
    fetchSearchResults(query).then((data) => {
      setResults(data); // Causes re-render, which triggers useEffect again!
    });
  }); // ❌ No dependency array

  return <div>{results.map(/* ... */)}</div>;
}

// ✅ Good - Proper dependency array:
function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchSearchResults(query).then(setResults);
  }, [query]); // ✅ Only runs when query changes

  return <div>{results.map(/* ... */)}</div>;
}

// Another example:

// ❌ Bad - Runs on every render
function DocumentTitle({ user, page }) {
  useEffect(() => {
    document.title = `${page} - ${user.name}`;
  }); // ❌ Runs after every single render

  return <div>...</div>;
}

// ✅ Good - Only runs when dependencies change
function DocumentTitle({ user, page }) {
  useEffect(() => {
    document.title = `${page} - ${user.name}`;
  }, [page, user.name]); // ✅ Only runs when page or user.name changes

  return <div>...</div>;
}

// Object/array in dependency causing too many runs:

// ❌ Bad - Object created on every render
function DataFetcher({ filters }) {
  const [data, setData] = useState([]);

  // This object is recreated every render!
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  };

  useEffect(() => {
    fetchData(filters, options).then(setData);
  }, [filters, options]); // ❌ options is always "new", so this runs every render

  return <div>...</div>;
}

// ✅ Good - Move static object outside or use useMemo
const OPTIONS = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
};

function DataFetcher({ filters }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData(filters, OPTIONS).then(setData);
  }, [filters]); // ✅ Only runs when filters changes

  return <div>...</div>;
}

// =============================================================================
// 3. Event Handlers Recreated on Every Render (Missing useCallback)
// =============================================================================

// ❌ Bad - Function recreated every render:
function TodoList({ todos, onToggle }) {
  const [filter, setFilter] = useState('all');

  // This function is recreated on EVERY render
  const handleToggle = (id) => {
    console.log('Toggling:', id);
    onToggle(id);
  };

  // Filtered todos
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'all') return true;
    if (filter === 'active') return !todo.done;
    if (filter === 'done') return todo.done;
  });

  return (
    <div>
      <FilterButtons filter={filter} setFilter={setFilter} />
      {filteredTodos.map((todo) => (
        // Every todo re-renders when filter changes because handleToggle is "new"
        <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} />
      ))}
    </div>
  );
}

// Assume TodoItem is memoized
const TodoItem = React.memo(({ todo, onToggle }) => {
  console.log('TodoItem render:', todo.id);
  return <div onClick={() => onToggle(todo.id)}>{todo.text}</div>;
});

// ✅ Good - Function memoized with useCallback:
function TodoList({ todos, onToggle }) {
  const [filter, setFilter] = useState('all');

  // Function is memoized - same reference across renders
  const handleToggle = useCallback(
    (id) => {
      console.log('Toggling:', id);
      onToggle(id);
    },
    [onToggle]
  ); // ✅ Only recreated if onToggle changes

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'all') return true;
    if (filter === 'active') return !todo.done;
    if (filter === 'done') return todo.done;
  });

  return (
    <div>
      <FilterButtons filter={filter} setFilter={setFilter} />
      {filteredTodos.map((todo) => (
        // TodoItem doesn't re-render unnecessarily
        <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} />
      ))}
    </div>
  );
}

// Another example with useEffect dependency:

// ❌ Bad - useEffect runs on every render
function SearchBox({ onSearch }) {
  const [query, setQuery] = useState('');

  const performSearch = (searchQuery) => {
    onSearch(searchQuery);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query, performSearch]); // ❌ performSearch changes every render

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}

// ✅ Good - performSearch is stable
function SearchBox({ onSearch }) {
  const [query, setQuery] = useState('');

  const performSearch = useCallback(
    (searchQuery) => {
      onSearch(searchQuery);
    },
    [onSearch]
  ); // ✅ Stable function reference

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query, performSearch]); // ✅ Only runs when query changes

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}

// =============================================================================
// 4. Expensive Calculations Not Memoized (Missing useMemo)
// =============================================================================

// ❌ Bad - Expensive calculation runs every render:

function ProductList({ products, filter, sortBy }) {
  const [selectedId, setSelectedId] = useState(null);

  // This runs on EVERY render, even when just selectedId changes!
  const processedProducts = products
    .filter((p) => p.category === filter)
    .sort((a, b) => {
      // Complex sorting logic
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return a.name.localeCompare(b.name);
    })
    .map((p) => ({
      ...p,
      displayPrice: formatCurrency(p.price),
      discountedPrice: calculateDiscount(p)
    }));

  return (
    <div>
      {processedProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isSelected={product.id === selectedId}
          onSelect={() => setSelectedId(product.id)}
        />
      ))}
    </div>
  );
}

// ✅ Good - Expensive calculation memoized:

function ProductList({ products, filter, sortBy }) {
  const [selectedId, setSelectedId] = useState(null);

  // Only recalculates when products, filter, or sortBy changes
  const processedProducts = useMemo(() => {
    return products
      .filter((p) => p.category === filter)
      .sort((a, b) => {
        if (sortBy === 'price') return a.price - b.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return a.name.localeCompare(b.name);
      })
      .map((p) => ({
        ...p,
        displayPrice: formatCurrency(p.price),
        discountedPrice: calculateDiscount(p)
      }));
  }, [products, filter, sortBy]); // ✅ Only recalculates when these change

  return (
    <div>
      {processedProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isSelected={product.id === selectedId}
          onSelect={() => setSelectedId(product.id)}
        />
      ))}
    </div>
  );
}

// Another example:

// ❌ Bad - Expensive regex and stats calculated every render
function DataDashboard({ data, searchTerm }) {
  const [view, setView] = useState('grid');

  // These run even when only 'view' changes!
  const filteredData = data.filter((item) =>
    new RegExp(searchTerm, 'i').test(item.name)
  );

  const statistics = {
    total: filteredData.length,
    average:
      filteredData.reduce((sum, item) => sum + item.value, 0) /
      filteredData.length,
    max: Math.max(...filteredData.map((item) => item.value)),
    min: Math.min(...filteredData.map((item) => item.value))
  };

  return (
    <div>
      <ViewToggle view={view} setView={setView} />
      <Stats stats={statistics} />
      <DataGrid data={filteredData} view={view} />
    </div>
  );
}

// ✅ Good - Memoize expensive calculations
function DataDashboard({ data, searchTerm }) {
  const [view, setView] = useState('grid');

  const filteredData = useMemo(() => {
    const regex = new RegExp(searchTerm, 'i');
    return data.filter((item) => regex.test(item.name));
  }, [data, searchTerm]); // ✅ Only filters when data or searchTerm changes

  const statistics = useMemo(
    () => ({
      total: filteredData.length,
      average:
        filteredData.reduce((sum, item) => sum + item.value, 0) /
        filteredData.length,
      max: Math.max(...filteredData.map((item) => item.value)),
      min: Math.min(...filteredData.map((item) => item.value))
    }),
    [filteredData]
  ); // ✅ Only recalculates when filteredData changes

  return (
    <div>
      <ViewToggle view={view} setView={setView} />
      <Stats stats={statistics} />
      <DataGrid data={filteredData} view={view} />
    </div>
  );
}

// Creating objects/arrays unnecessarily:

// ❌ Bad - Object created every render causes child re-renders
function ParentComponent({ userId }) {
  const [count, setCount] = useState(0);

  // New object every render!
  const config = {
    userId: userId,
    theme: 'dark',
    lang: 'en'
  };

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <ChildComponent config={config} />
    </div>
  );
}

const ChildComponent = React.memo(({ config }) => {
  console.log('Child rendered');
  return <div>User: {config.userId}</div>;
});

// ✅ Good - Memoize the object
function ParentComponent({ userId }) {
  const [count, setCount] = useState(0);

  const config = useMemo(
    () => ({
      userId: userId,
      theme: 'dark',
      lang: 'en'
    }),
    [userId]
  ); // ✅ Only creates new object when userId changes

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <ChildComponent config={config} />
    </div>
  );
}
