/**
 * Forms:
 *
 * 1. Uncontrolled inputs mixed with controlled
 * 2. Not preventing default on form submit
 * 3. No validation
 * 4. Not clearing form after submit
 */

import React, { useState, useEffect } from 'react';

// =============================================================================
// 1. Uncontrolled Inputs Mixed with Controlled
// =============================================================================

// ❌ Bad - Mixing controlled and uncontrolled inputs:

function ContactForm() {
  const [email, setEmail] = useState('');
  // ❌ No state for name - uncontrolled

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email:', email);
    // ❌ How do we get the name value?
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ❌ Uncontrolled - no value prop, no onChange */}
      <input type="text" name="name" placeholder="Name" />

      {/* ✅ Controlled */}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />

      <button type="submit">Submit</button>
    </form>
  );
}

// ❌ Bad - Starting controlled then becoming uncontrolled:

function UserForm() {
  const [formData, setFormData] = useState({
    username: 'John',
    email: null // ❌ null will make input uncontrolled
  });

  return (
    <form>
      {/* ✅ Controlled - has string value */}
      <input
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
      />

      {/* ❌ Uncontrolled - value is null, then becomes controlled when changed
          React will warn: "A component is changing an uncontrolled input to be controlled" */}
      <input
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
    </form>
  );
}

// ❌ Bad - Using refs with controlled inputs inconsistently:

function LoginForm() {
  const [username, setUsername] = useState('');
  const passwordRef = useRef(); // ❌ Mixing patterns

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Username:', username);
    console.log('Password:', passwordRef.current.value); // ❌ Inconsistent access pattern
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ✅ Controlled */}
      <input value={username} onChange={(e) => setUsername(e.target.value)} />

      {/* ❌ Uncontrolled with ref */}
      <input type="password" ref={passwordRef} />

      <button type="submit">Login</button>
    </form>
  );
}

// ✅ Good - All controlled inputs:

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
      />

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />

      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Message"
      />

      <button type="submit">Submit</button>
    </form>
  );
}

// ✅ Good - Initialize with empty strings, not null/undefined:

function UserForm() {
  // ✅ All fields initialized with strings
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form>
      <input
        name="username"
        value={formData.username}
        onChange={handleChange}
      />
      <input name="email" value={formData.email} onChange={handleChange} />
      <input name="phone" value={formData.phone} onChange={handleChange} />
    </form>
  );
}

// Checkbox example:

// ❌ Bad - Checkbox incorrectly controlled
function SettingsForm() {
  const [settings, setSettings] = useState({
    newsletter: false
  });

  return (
    <form>
      {/* ❌ Wrong: using value instead of checked */}
      <input
        type="checkbox"
        value={settings.newsletter}
        onChange={(e) =>
          setSettings({ ...settings, newsletter: e.target.value })
        }
      />
    </form>
  );
}

// ✅ Good - Checkbox properly controlled
function SettingsForm() {
  const [settings, setSettings] = useState({
    newsletter: false,
    notifications: true
  });

  const handleCheckboxChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.checked // ✅ Use checked, not value
    });
  };

  return (
    <form>
      <label>
        <input
          type="checkbox"
          name="newsletter"
          checked={settings.newsletter} // ✅ Use checked prop
          onChange={handleCheckboxChange}
        />
        Subscribe to newsletter
      </label>

      <label>
        <input
          type="checkbox"
          name="notifications"
          checked={settings.notifications}
          onChange={handleCheckboxChange}
        />
        Enable notifications
      </label>
    </form>
  );
}

// =============================================================================
// 2. Not Preventing Default on Form Submit
// =============================================================================

// ❌ Bad - No preventDefault:

function SearchForm() {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    // ❌ Missing e.preventDefault()
    // Page will reload, losing all state!
    console.log('Searching for:', query);

    fetch(`/api/search?q=${query}`)
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <button type="submit">Search</button>
    </form>
  );
}

// ❌ Bad - preventDefault on button instead of form:

function LoginForm() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleLogin = (e) => {
    e.preventDefault(); // ❌ This won't work - button click, not form submit
    console.log('Logging in:', credentials);
  };

  return (
    <form>
      {' '}
      // ❌ No onSubmit handler
      <input
        value={credentials.username}
        onChange={(e) =>
          setCredentials({ ...credentials, username: e.target.value })
        }
      />
      <input
        type="password"
        value={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
      />
      // ❌ onClick on button instead of onSubmit on form
      <button onClick={handleLogin}>Login</button>
    </form>
  );
}

// ✅ Good - Proper preventDefault:

function SearchForm() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault(); // ✅ Prevent page reload

    fetch(`/api/search?q=${query}`)
      .then((res) => res.json())
      .then((data) => setResults(data));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input value={query} onChange={(e) => setQuery(e.target.value)} />
        <button type="submit">Search</button>
      </form>

      <div>
        {results.map((r) => (
          <div key={r.id}>{r.title}</div>
        ))}
      </div>
    </div>
  );
}

// ✅ Good - Multiple submit buttons:

function PostForm() {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // ✅ Always prevent default first

    // ✅ Check which button was clicked
    const action = e.nativeEvent.submitter.value;

    if (action === 'draft') {
      saveDraft(content);
    } else if (action === 'publish') {
      publishPost(content);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <button type="submit" value="draft">
        Save Draft
      </button>
      <button type="submit" value="publish">
        Publish
      </button>
    </form>
  );
}

// Form with Enter key:

// ❌ Bad - Enter key causes page reload
function CommentBox() {
  const [comment, setComment] = useState('');

  const handleSend = () => {
    // ❌ This doesn't prevent form submission on Enter
    console.log('Sending:', comment);
  };

  return (
    <form>
      {' '}
      {/* ❌ No onSubmit handler */}
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </form>
  );
}

// ✅ Good - Handle Enter key properly
function CommentBox() {
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // ✅ Prevent default form submission

    if (comment.trim()) {
      console.log('Sending:', comment);
      setComment('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Press Enter to submit"
      />
      <button type="submit">Send</button>
    </form>
  );
}

// =============================================================================
// 3. No Validation
// =============================================================================

// ❌ Bad - No validation at all:

function SignupForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // ❌ No validation - submits even if fields are empty
    // ❌ No email format check
    // ❌ No password strength check
    fetch('/api/signup', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Username"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}

// ❌ Bad - Validation but no error display:

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // ❌ Validation exists but user doesn't see errors
    if (formData.name.length < 2) {
      console.log('Name too short'); // ❌ Only in console
      return;
    }

    if (!formData.email.includes('@')) {
      console.log('Invalid email'); // ❌ Only in console
      return;
    }

    if (formData.message.length < 10) {
      console.log('Message too short'); // ❌ Only in console
      return;
    }

    // Submit form
    submitForm(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ❌ No error messages shown to user */}
      <input
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <textarea
        placeholder="Message"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

// ✅ Good - Proper validation with error display:

function SignupForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (formData.username.length > 20) {
      newErrors.username = 'Username must be less than 20 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain an uppercase letter';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Password must contain a number';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Form is valid, submit
    setErrors({});
    fetch('/api/signup', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // ✅ Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className={errors.username ? 'error' : ''}
        />
        {errors.username && (
          <span className="error-message">{errors.username}</span>
        )}
      </div>

      <div>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div>
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className={errors.password ? 'error' : ''}
        />
        {errors.password && (
          <span className="error-message">{errors.password}</span>
        )}
      </div>

      <button type="submit">Sign Up</button>
    </form>
  );
}

// ✅ Good - Real-time validation:

function EmailForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const validateEmail = (value) => {
    if (!value) {
      return 'Email is required';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email';
    }
    return '';
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // ✅ Validate in real-time if field has been touched
    if (touched) {
      setError(validateEmail(value));
    }
  };

  const handleBlur = () => {
    setTouched(true);
    setError(validateEmail(email));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      setTouched(true);
      return;
    }

    // Submit form
    console.log('Submitting:', email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="email"
          value={email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Email"
          className={touched && error ? 'error' : ''}
        />
        {touched && error && <span className="error-message">{error}</span>}
      </div>
      <button type="submit" disabled={touched && error}>
        Submit
      </button>
    </form>
  );
}

// =============================================================================
// 4. Not Clearing Form After Submit
// =============================================================================

// ❌ Bad - Form not cleared after submission:

function FeedbackForm() {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Submit feedback
    fetch('/api/feedback', {
      method: 'POST',
      body: JSON.stringify({ feedback })
    });

    setSubmitted(true);
    // ❌ Forgot to clear the form
    // ❌ User sees old text if they want to submit again
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Your feedback"
      />
      <button type="submit">Submit</button>
      {submitted && <p>Thank you for your feedback!</p>}
    </form>
  );
}

// ❌ Bad - Clearing at wrong time:

function CommentForm({ postId }) {
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setComment(''); // ❌ Cleared before knowing if submission succeeded

    try {
      await fetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify({ postId, comment })
      });
      // If this fails, user lost their comment!
    } catch (error) {
      console.error('Failed to submit');
      // ❌ Comment is already cleared, can't retry
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={comment} onChange={(e) => setComment(e.target.value)} />
      <button type="submit">Comment</button>
    </form>
  );
}

// ✅ Good - Clear form after successful submission:
function FeedbackForm() {
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus('submitting');
    setError(null);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback })
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      // ✅ Only clear after successful submission
      setFeedback('');
      setStatus('success');

      // ✅ Reset success message after a delay
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      setStatus('error');
      setError(err.message);
      // ✅ Don't clear form on error - user can fix and retry
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Your feedback"
        disabled={status === 'submitting'}
      />

      <button
        type="submit"
        disabled={status === 'submitting' || !feedback.trim()}>
        {status === 'submitting' ? 'Submitting...' : 'Submit'}
      </button>

      {status === 'success' && (
        <p className="success">Thank you for your feedback!</p>
      )}

      {status === 'error' && <p className="error">Error: {error}</p>}
    </form>
  );
}

// ✅ Good - Clear complex form:
function ProductForm() {
  const initialFormState = {
    name: '',
    price: '',
    category: '',
    description: '',
    inStock: false
  };

  const [formData, setFormData] = useState(initialFormState);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      // ✅ Reset to initial state
      setFormData(initialFormState);
      setSubmitted(true);

      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Product Name"
      />

      <input
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price"
      />

      <select name="category" value={formData.category} onChange={handleChange}>
        <option value="">Select Category</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
        <option value="books">Books</option>
      </select>

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
      />

      <label>
        <input
          type="checkbox"
          name="inStock"
          checked={formData.inStock}
          onChange={handleChange}
        />
        In Stock
      </label>

      <button type="submit">Create Product</button>

      {submitted && <p>Product created successfully!</p>}
    </form>
  );
}

// ✅ Good - Clear with confirmation:

function MessageForm() {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch('/api/messages', {
        method: 'POST',
        body: JSON.stringify({ message, attachments })
      });

      // ✅ Clear form fields
      setMessage('');
      setAttachments([]);

      alert('Message sent successfully!');
    } catch (error) {
      alert('Failed to send message. Please try again.');
    }
  };

  const handleReset = () => {
    // ✅ Provide manual reset option
    if (message || attachments.length > 0) {
      if (window.confirm('Are you sure you want to clear the form?')) {
        setMessage('');
        setAttachments([]);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message"
      />

      <div>
        {attachments.map((file, index) => (
          <div key={index}>{file.name}</div>
        ))}
      </div>

      <input
        type="file"
        onChange={(e) => setAttachments([...attachments, ...e.target.files])}
        multiple
      />

      <button type="submit">Send</button>
      <button type="button" onClick={handleReset}>
        Clear
      </button>
    </form>
  );
}

// Form with draft saving:

// ✅ Good - Save draft before clearing
function BlogPostForm() {
  const [post, setPost] = useState({
    title: '',
    content: ''
  });
  const [lastSaved, setLastSaved] = useState(null);

  // Auto-save draft
  useEffect(() => {
    if (post.title || post.content) {
      const timer = setTimeout(() => {
        localStorage.setItem('draft', JSON.stringify(post));
        setLastSaved(new Date());
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [post]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('draft');
    if (draft) {
      setPost(JSON.parse(draft));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify(post)
      });

      // ✅ Clear form and draft after publishing
      setPost({ title: '', content: '' });
      localStorage.removeItem('draft');
      setLastSaved(null);

      alert('Post published!');
    } catch (error) {
      alert('Failed to publish post');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={post.title}
        onChange={(e) => setPost({ ...post, title: e.target.value })}
        placeholder="Title"
      />

      <textarea
        value={post.content}
        onChange={(e) => setPost({ ...post, content: e.target.value })}
        placeholder="Content"
      />

      {lastSaved && <p>Draft saved at {lastSaved.toLocaleTimeString()}</p>}

      <button type="submit">Publish</button>
    </form>
  );
}
