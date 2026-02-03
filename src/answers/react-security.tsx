/**
 * React Security Practices Exercises
 *
 * This file contains exercises covering security concepts in React:
 * - XSS (Cross-Site Scripting) prevention techniques
 * - Safe usage of dangerouslySetInnerHTML
 * - Input sanitization strategies
 * - CSRF protection in forms
 * - Content Security Policy integration
 * - Secure data handling
 *
 */

import { FormEvent, ReactElement, useEffect, useState } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';

// =============================================================================
// EXERCISE 1: XSS Prevention - Safe User Content Display
// =============================================================================

/**
 * Create a component that safely displays user-generated content.
 * Should prevent XSS attacks by properly escaping user input.
 * Should NOT use dangerouslySetInnerHTML for user input.
 *
 * Requirements:
 * - Accept username and bio as props
 * - Display both fields safely
 * - Automatically escape any HTML/script tags in the content
 * - Should render as plain text, not as HTML
 *
 * Example:
 * Input: username="<script>alert('xss')</script>John"
 * Should display: "<script>alert('xss')</script>John" (as visible text)
 * Should NOT execute the script
 *
 * Expected structure:
 * <div className="user-profile">
 *   <h2>{username}</h2>
 *   <p>{bio}</p>
 * </div>
 */
export function SafeUserProfile({
  username,
  bio
}: {
  username: string;
  bio: string;
}): ReactElement {
  return (
    <div className="user-profile">
      <h2>{username}</h2>
      <p>{bio}</p>
    </div>
  );
}

// =============================================================================
// EXERCISE 2: Safe HTML Rendering with Sanitization
// =============================================================================

/**
 * Create a component that safely renders HTML content from a trusted source.
 * Should use DOMPurify or similar library to sanitize HTML before rendering.
 *
 * Requirements:
 * - Accept htmlContent prop (string containing HTML)
 * - Sanitize the HTML to remove dangerous elements/attributes
 * - Remove script tags, event handlers, and dangerous protocols
 * - Safely render the sanitized HTML using dangerouslySetInnerHTML
 *
 * Dangerous content to remove:
 * - <script> tags
 * - Event handlers (onclick, onerror, etc.)
 * - javascript: protocol in href/src
 * - <iframe> tags
 * - <object> and <embed> tags
 *
 * Install: npm install dompurify
 * For tests: npm install isomorphic-dompurify
 *
 * Example usage:
 * <SanitizedHTML htmlContent="<p>Safe content</p><script>alert('xss')</script>" />
 * Should render: <p>Safe content</p> (script removed)
 */
export function SanitizedHTML({
  htmlContent
}: {
  htmlContent: string;
}): ReactElement {
  const sanitized = DOMPurify.sanitize(htmlContent);

  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}

// =============================================================================
// EXERCISE 3: Safe Link Rendering
// =============================================================================

/**
 * Create a component that safely renders user-provided URLs.
 * Should prevent javascript: protocol and other dangerous URL schemes.
 *
 * Requirements:
 * - Accept url and text props
 * - Validate URL to ensure it uses safe protocols (http/https/mailto)
 * - Prevent javascript:, data:, vbscript: protocols
 * - Add rel="noopener noreferrer" for external links
 * - Render a safe link or fallback to plain text
 *
 * Safe protocols: http, https, mailto
 * Dangerous protocols: javascript, data, vbscript, file
 *
 * Expected behavior:
 * - Safe URL: Render as link
 * - Dangerous URL: Render as plain text with warning
 * - Invalid URL: Render as plain text
 */
export function SafeLink({
  url,
  text,
  external = true
}: {
  url: string;
  text: string;
  external?: boolean;
}): ReactElement {
  try {
    const { protocol } = new URL(url);

    if (
      protocol !== 'http:' &&
      protocol !== 'https:' &&
      protocol !== 'mailto:'
    ) {
      return <span>{text}</span>;
    }

    return (
      <a
        href={url}
        rel="noopener noreferrer"
        target={protocol !== 'mailto:' && external ? '_blank' : undefined}>
        {text}
      </a>
    );
  } catch {
    return <span>{text}</span>;
  }
}

// =============================================================================
// EXERCISE 4: CSRF-Protected Form
// =============================================================================

/**
 * Create a form component with CSRF protection.
 * Should include a CSRF token in form submissions.
 *
 * Requirements:
 * - Accept csrfToken prop
 * - Include hidden input with CSRF token
 * - Form should have method="post" and action
 * - Include email and message fields
 * - Prevent submission if CSRF token is missing
 *
 * CSRF Token should:
 * - Be included as a hidden input field
 * - Have name="csrf_token" or "csrfToken"
 * - Be sent with every form submission
 *
 * Expected structure:
 * <form method="post" action="/api/submit">
 *   <input type="hidden" name="csrf_token" value={csrfToken} />
 *   <input name="email" />
 *   <textarea name="message" />
 *   <button type="submit">Submit</button>
 * </form>
 */
export function CSRFProtectedForm({
  csrfToken,
  onSubmit
}: {
  csrfToken: string;
  onSubmit: (data: {
    email: string;
    message: string;
    csrf_token: string;
  }) => void;
}): ReactElement {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (email && message && csrfToken) {
      onSubmit({
        email,
        message,
        csrf_token: csrfToken
      });
    } else {
      setError('csrf token is missing');
    }
  }

  return (
    <form method="post" action="/api/submit" onSubmit={handleSubmit}>
      <input type="hidden" name="csrf_token" value={csrfToken} />
      <label htmlFor="email">Email</label>
      <input
        name="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label htmlFor="message">Message</label>
      <textarea
        name="message"
        id="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">Submit</button>
      {error && <span>{error}</span>}
    </form>
  );
}

// =============================================================================
// EXERCISE 5: Safe Markdown Renderer
// =============================================================================

/**
 * Create a component that safely renders Markdown content.
 * Should parse Markdown and render as HTML with proper sanitization.
 *
 * Requirements:
 * - Accept markdown prop (string)
 * - Parse Markdown to HTML using marked or similar library
 * - Sanitize the resulting HTML
 * - Prevent XSS through Markdown syntax
 * - Allow safe HTML tags (p, h1-h6, ul, ol, li, em, strong, a, code, pre)
 * - Remove dangerous content
 *
 * Install: npm install marked dompurify
 *
 * Security considerations:
 * - Markdown can contain raw HTML
 * - Links in Markdown might use javascript: protocol
 * - Images might have onerror handlers
 *
 * Example:
 * Input: "# Hello\n[Click](javascript:alert('xss'))"
 * Output: <h1>Hello</h1><a>Click</a> (href sanitized)
 */
export function SafeMarkdownRenderer({
  markdown
}: {
  markdown: string;
}): ReactElement {
  // Parse Markdown to HTML
  const rawHtml = marked.parse(markdown) as string;

  // Sanitize the HTML with allowed tags and attributes
  const sanitizedHtml = DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: [
      'p',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'ul',
      'ol',
      'li',
      'em',
      'strong',
      'a',
      'code',
      'pre'
    ],
    ALLOWED_ATTR: ['href', 'title', 'target']
  });

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
}

// =============================================================================
// EXERCISE 6: Secure Data Attribute Handler
// =============================================================================

/**
 * Create a component that safely handles data-* attributes.
 * Should sanitize attribute values to prevent XSS.
 *
 * Requirements:
 * - Accept dataAttributes object prop
 * - Apply data-* attributes to a div
 * - Sanitize attribute values (remove quotes, angle brackets, etc.)
 * - Log warning if dangerous content is detected
 *
 * Dangerous characters in attributes: < > " '
 *
 * Example:
 * Input: { userId: "123", tooltip: "<script>alert('xss')</script>" }
 * Output: <div data-user-id="123" data-tooltip="[sanitized]" />
 */
export function SecureDataAttributes({
  dataAttributes,
  children
}: {
  dataAttributes: {
    [key: string]: string;
  };
  children: React.ReactNode;
}): ReactElement {
  const converted = Object.entries(dataAttributes).map((pair) => {
    const sanitised = [
      `data-${pair[0]}`.toLowerCase(),
      DOMPurify.sanitize(pair[1])
    ];

    if (sanitised[1] !== pair[1]) {
      console.warn(`Sanitization applied: "${pair[1]}" -> "${sanitised[1]}"`);
    }

    return sanitised;
  });

  const obj = Object.fromEntries(converted);

  return <div {...obj}>{children}</div>;
}

// =============================================================================
// EXERCISE 7: Content Security Policy Reporter
// =============================================================================

/**
 * Create a component that handles CSP violation reports.
 * Should display CSP violations for debugging.
 *
 * Requirements:
 * - Listen for CSP violation events
 * - Display violation details in development
 * - Show: violated directive, blocked URI, source file
 * - Clean up event listener on unmount
 *
 * CSP violations occur when:
 * - Inline scripts are blocked
 * - Unsafe resources are loaded
 * - Eval is used when blocked
 *
 * Expected structure:
 * <div className="csp-violations">
 *   <h3>CSP Violations</h3>
 *   <ul>
 *     {violations.map(v => <li key={v.id}>{v.message}</li>)}
 *   </ul>
 * </div>
 */
type Violation = {
  id: number;
  message: string;
  violatedDirective: string;
  blockedURI: string;
  sourceFile: string;
};

export function CSPViolationReporter(): ReactElement {
  const [violations, setViolations] = useState<Violation[]>([]);

  useEffect(() => {
    window.addEventListener('securitypolicyviolation', onViolation);

    return () => {
      window.removeEventListener('securitypolicyviolation', onViolation);
    };
  }, []);

  function onViolation(event: SecurityPolicyViolationEvent) {
    const violation = {
      id: Date.now(),
      message: 'CSP violation detected',
      violatedDirective: event.violatedDirective,
      blockedURI: event.blockedURI || 'N/A',
      sourceFile: event.sourceFile || 'N/A'
    };
    setViolations((prev) => [...prev, violation]);
  }

  return (
    <div className="csp-violations">
      <h3>CSP Violations</h3>
      <ul>
        {violations.length > 0
          ? violations.map((v) => (
              <li key={v.id}>
                <p>{v.message}</p>
                <p>violatedDirective: {v.violatedDirective}</p>
                <p>blockedURI: {v.blockedURI}</p>
                <p>sourceFile: {v.sourceFile}</p>
              </li>
            ))
          : 'No CSP violations detected'}
      </ul>
    </div>
  );
}

// =============================================================================
// EXERCISE 8: Secure File Upload Component
// =============================================================================

/**
 * Create a secure file upload component.
 * Should validate file types, sizes, and prevent malicious uploads.
 *
 * Requirements:
 * - Accept allowedTypes and maxSize props
 * - Validate file type (check MIME type and extension)
 * - Validate file size
 * - Display error messages for invalid files
 * - Prevent execution of uploaded files
 * - Generate safe preview for images
 *
 * Security considerations:
 * - Check both MIME type and file extension
 * - Limit file size to prevent DoS
 * - Sanitize file names
 * - Don't trust client-side MIME types
 *
 * Example:
 * <SecureFileUpload
 *   allowedTypes={['image/jpeg', 'image/png']}
 *   maxSize={5 * 1024 * 1024}
 *   onUpload={handleUpload}
 * />
 */
export function SecureFileUpload({
  allowedTypes,
  maxSize,
  onUpload
}: {
  allowedTypes: string[];
  maxSize: number;
  onUpload: (file: File) => void;
}): ReactElement {
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;

    // Clear error state when a new file is selected
    setError('');

    if (!files || files.length === 0) {
      setError('No file selected');
      return;
    }

    const file = files[0];
    const isTypeCorrect = validateFileType(file, allowedTypes);
    const isSizeCorrect = file.size <= maxSize;

    if (isTypeCorrect && isSizeCorrect) {
      if (file.type.startsWith('image/')) {
        // Revoke previous preview URL to avoid memory leaks
        if (preview) {
          URL.revokeObjectURL(preview);
        }
        setPreview(URL.createObjectURL(file));
      }
      onUpload(file);
    } else {
      if (!isTypeCorrect) {
        setError('Invalid file type');
      } else if (!isSizeCorrect) {
        setError('File size exceeds the limit');
      }
    }
  }

  useEffect(() => {
    // Cleanup preview URL on component unmount
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <form role="form">
      <label htmlFor="upload">Upload file</label>
      <input name="upload" id="upload" type="file" onChange={onFileChange} />
      <button onClick={(e) => e.preventDefault()}>Upload</button>
      {error && <span aria-live="polite">{error}</span>}
      {preview && <img src={preview} alt="File preview" />}
    </form>
  );
}

/**
 * Validates file type by checking both MIME type and extension
 */
export function validateFileType(file: File, allowedTypes: string[]) {
  const checkType = allowedTypes.some((type) => type === file.type);

  const extension = (file.name.split('.').pop() || '').toLowerCase();
  const allowedExtensions = allowedTypes.map((type) => type.split('/').pop());

  if (checkType || allowedExtensions.includes(extension)) {
    return true;
  }

  return false;
}

/**
 * Sanitizes a filename for safe storage
 */
export function sanitizeFilename(filename: string) {
  return filename
    .replace(/(\.\.\/|\\)/g, '') // Remove path traversal
    .replace(/[^a-zA-Z0-9._-]/g, '') // Remove special characters
    .substring(0, 255); // Limit length
}

// =============================================================================
// EXERCISE 9: SQL Injection Prevention (Client-Side)
// =============================================================================

/**
 * Create a search component that safely handles user input for API queries.
 * Should prevent SQL injection attempts on the client side.
 *
 * Requirements:
 * - Accept searchQuery prop
 * - Validate and sanitize input
 * - Warn if SQL injection patterns detected
 * - Display sanitized query
 * - Provide feedback to user
 *
 * SQL injection patterns to detect:
 * - Single quotes (')
 * - SQL keywords: SELECT, DROP, INSERT, UPDATE, DELETE, UNION
 * - Comment syntax
 * - Semicolons in suspicious contexts
 *
 * Note: This is client-side validation only. Server-side validation
 * and parameterized queries are essential for real security.
 *
 * Expected behavior:
 * - Safe input: "hello world" -> allowed
 * - Dangerous input: "hello'; DROP TABLE users--" -> blocked with warning
 */
export function SafeSearchInput({
  onSearch
}: {
  onSearch: (query: string) => void;
}): ReactElement {
  const [query, setQuery] = useState('');
  const [warning, setWarning] = useState('');

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setWarning('');

    console.log(query);
    const isInvalid = detectSQLInjection(query);

    if (isInvalid) {
      setWarning('Warning: SQL injection detected');
    } else {
      onSearch(query);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="query">Query</label>
      <textarea
        name="query"
        id="query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit">Search</button>
      {warning && <span aria-live="polite">{warning}</span>}
    </form>
  );
}

/**
 * Detects potential SQL injection patterns
 */
export function detectSQLInjection(input: string) {
  // Normalize input to lowercase for case-insensitive matching
  const normalizedInput = input.toLowerCase();

  // List of SQL keywords to detect
  const sqlKeywords = [
    'select',
    'drop',
    'insert',
    'update',
    'delete',
    'union',
    'alter',
    'create',
    'replace'
  ];

  // Regex to detect SQL-like patterns
  const sqlPattern = new RegExp(
    `\\b(${sqlKeywords.join('|')})\\b.*(from|into|where|table|database)`,
    'i'
  );

  // Check for dangerous patterns
  const hasSQLKeywordInContext = sqlPattern.test(input);
  const hasQuotes = /['"`]/.test(input); // Single, double, or backticks
  const hasSemicolon = /;/.test(input);
  const hasCommentSyntax = /--|\/\*/.test(input); // SQL comments

  // Allow safe queries with common words
  const safePhrases = ['select a date', 'select an option'];
  const isSafePhrase = safePhrases.some((phrase) =>
    normalizedInput.includes(phrase)
  );

  // Return true if any pattern is detected, excluding safe phrases
  return (
    !isSafePhrase &&
    (hasSQLKeywordInContext || hasQuotes || hasSemicolon || hasCommentSyntax)
  );
}

// =============================================================================
// EXERCISE 10: Secure Local Storage Handler
// =============================================================================

/**
 * Create a component that safely stores and retrieves data from localStorage.
 * Should prevent XSS through stored data.
 *
 * Requirements:
 * - Provide functions to save and load data
 * - Sanitize data before storing
 * - Validate data when retrieving
 * - Handle storage errors gracefully
 * - Never store sensitive data without encryption
 *
 * Security considerations:
 * - localStorage is accessible to all scripts on the domain
 * - Data persists across sessions
 * - Can be exploited if XSS vulnerability exists
 * - Should not store passwords, tokens, or PII
 *
 * Safe to store:
 * - User preferences
 * - UI state
 * - Non-sensitive cached data
 *
 * Not safe to store:
 * - Passwords
 * - API tokens
 * - Credit card info
 * - Personal identification
 * Usage:
 * <SecureLocalStorage storageKey="test-key" initialValue="">
    {(value, setValue) => (
      <>
        <div>{value}</div>
        <button onClick={() => setValue('<script>alert("xss")</script>')}>
          Set Value
        </button>
      </>
    )}
  </SecureLocalStorage>
 */
type SecureLocalStorageProps = {
  value: string;
  setStoredValue: (newValue: string) => void;
  error: string;
};

export function SecureLocalStorage({
  storageKey,
  initialValue,
  children
}: {
  storageKey: string;
  initialValue: any;
  children: (props: SecureLocalStorageProps) => React.ReactNode;
}) {
  const [value, setValue] = useState(
    () => getStoredValue(storageKey) || initialValue
  );
  const [error, setError] = useState('');

  function getStoredValue(key: string) {
    const data = localStorage.getItem(key);

    try {
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      return null;
    }
  }

  function setStoredValue(newValue: string) {
    try {
      const sanitised =
        typeof newValue === 'string' ? DOMPurify.sanitize(newValue) : newValue;
      localStorage.setItem(storageKey, JSON.stringify(sanitised));
      setValue(sanitised);
    } catch (e) {
      setError('Failed to save data. Storage quota exceeded.');
    }
  }

  return children({ value, setStoredValue, error });
}
