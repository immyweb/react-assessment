/**
 * React Security Practices Tests
 *
 * Test suite for React security exercises covering:
 * - XSS prevention techniques
 * - Safe HTML rendering with sanitization
 * - CSRF protection in forms
 * - Secure data handling
 * - Input validation and sanitization
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, describe, it, vi, beforeEach } from 'vitest';

import {
  SafeUserProfile,
  SanitizedHTML,
  SafeLink,
  CSRFProtectedForm,
  SafeMarkdownRenderer,
  SecureDataAttributes,
  CSPViolationReporter,
  SecureFileUpload,
  SafeSearchInput,
  SecureLocalStorage,
  isSafeUrl,
  sanitizeAttribute,
  detectSQLInjection,
  validateFileType,
  sanitizeFilename,
} from '../exercises/react-security';

// =============================================================================
// EXERCISE 1 TESTS: XSS Prevention - Safe User Content Display
// =============================================================================

describe('Exercise 1: XSS Prevention', () => {
  describe('SafeUserProfile', () => {
    it('should display username and bio safely', () => {
      render(<SafeUserProfile username="John Doe" bio="Software Developer" />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Software Developer')).toBeInTheDocument();
    });

    it('should escape HTML tags in username', () => {
      const maliciousUsername = '<script>alert("xss")</script>John';
      const { container } = render(
        <SafeUserProfile username={maliciousUsername} bio="Test bio" />
      );
      
      // Should display as text, not execute script
      expect(container.querySelector('script')).toBeNull();
      expect(container.textContent).toContain('<script>');
    });

    it('should escape HTML entities in bio', () => {
      const maliciousBio = '<img src=x onerror=alert("xss")>';
      const { container } = render(
        <SafeUserProfile username="John" bio={maliciousBio} />
      );
      
      // Should not create an img element
      expect(container.querySelector('img')).toBeNull();
      expect(container.textContent).toContain('<img');
    });

    it('should handle special characters safely', () => {
      render(
        <SafeUserProfile 
          username={'<>&"\''} 
          bio={'Test with symbols: <>&"\''} 
        />
      );
      
      expect(screen.getByText("<>&\"'")).toBeInTheDocument();
      expect(screen.getByText(/Test with symbols/)).toBeInTheDocument();
    });

    it('should have correct structure', () => {
      const { container } = render(
        <SafeUserProfile username="John" bio="Developer" />
      );
      
      const profile = container.querySelector('.user-profile');
      expect(profile).toBeInTheDocument();
      expect(profile.querySelector('h2')).toBeInTheDocument();
      expect(profile.querySelector('p')).toBeInTheDocument();
    });
  });
});

// =============================================================================
// EXERCISE 2 TESTS: Safe HTML Rendering with Sanitization
// =============================================================================

describe('Exercise 2: Safe HTML Rendering', () => {
  describe('SanitizedHTML', () => {
    it('should render safe HTML content', () => {
      const safeHTML = '<p>Hello <strong>World</strong></p>';
      const { container } = render(<SanitizedHTML htmlContent={safeHTML} />);
      
      expect(container.querySelector('p')).toBeInTheDocument();
      expect(container.querySelector('strong')).toBeInTheDocument();
      expect(screen.getByText('World')).toBeInTheDocument();
    });

    it('should remove script tags', () => {
      const maliciousHTML = '<p>Safe</p><script>alert("xss")</script>';
      const { container } = render(<SanitizedHTML htmlContent={maliciousHTML} />);
      
      expect(container.querySelector('script')).toBeNull();
      expect(container.querySelector('p')).toBeInTheDocument();
    });

    it('should remove event handlers', () => {
      const maliciousHTML = '<img src="test.jpg" onerror="alert(\'xss\')" />';
      const { container } = render(<SanitizedHTML htmlContent={maliciousHTML} />);
      
      const img = container.querySelector('img');
      if (img) {
        expect(img.getAttribute('onerror')).toBeNull();
      }
    });

    it('should remove javascript: protocol', () => {
      const maliciousHTML = '<a href="javascript:alert(\'xss\')">Click</a>';
      const { container } = render(<SanitizedHTML htmlContent={maliciousHTML} />);
      
      const link = container.querySelector('a');
      if (link) {
        expect(link.getAttribute('href')).not.toContain('javascript:');
      }
    });

    it('should remove iframe tags', () => {
      const maliciousHTML = '<p>Safe</p><iframe src="evil.com"></iframe>';
      const { container } = render(<SanitizedHTML htmlContent={maliciousHTML} />);
      
      expect(container.querySelector('iframe')).toBeNull();
    });

    it('should allow safe formatting tags', () => {
      const safeHTML = '<p><em>Italic</em> <strong>Bold</strong> <u>Underline</u></p>';
      const { container } = render(<SanitizedHTML htmlContent={safeHTML} />);
      
      expect(container.querySelector('em')).toBeInTheDocument();
      expect(container.querySelector('strong')).toBeInTheDocument();
    });
  });
});

// =============================================================================
// EXERCISE 3 TESTS: Safe Link Rendering
// =============================================================================

describe('Exercise 3: Safe Link Rendering', () => {
  describe('SafeLink', () => {
    it('should render safe http URL as link', () => {
      render(<SafeLink url="http://example.com" text="Example" />);
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'http://example.com');
      expect(link).toHaveTextContent('Example');
    });

    it('should render safe https URL as link', () => {
      render(<SafeLink url="https://example.com" text="Example" />);
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://example.com');
    });

    it('should render mailto URL as link', () => {
      render(<SafeLink url="mailto:test@example.com" text="Email" />);
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'mailto:test@example.com');
    });

    it('should not render javascript: protocol as link', () => {
      render(<SafeLink url="javascript:alert('xss')" text="Click me" />);
      
      // Should not render as a link
      expect(screen.queryByRole('link')).toBeNull();
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should not render data: protocol as link', () => {
      render(<SafeLink url="data:text/html,<script>alert('xss')</script>" text="Click" />);
      
      expect(screen.queryByRole('link')).toBeNull();
    });

    it('should add rel="noopener noreferrer" for external links', () => {
      render(<SafeLink url="https://example.com" text="External" external={true} />);
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should handle invalid URLs gracefully', () => {
      render(<SafeLink url="not a url" text="Invalid" />);
      
      // Should render as text, not as link
      expect(screen.queryByRole('link')).toBeNull();
      expect(screen.getByText('Invalid')).toBeInTheDocument();
    });
  });

  describe('isSafeUrl', () => {
    it('should return true for http URLs', () => {
      expect(isSafeUrl('http://example.com')).toBe(true);
    });

    it('should return true for https URLs', () => {
      expect(isSafeUrl('https://example.com')).toBe(true);
    });

    it('should return true for mailto URLs', () => {
      expect(isSafeUrl('mailto:test@example.com')).toBe(true);
    });

    it('should return false for javascript: protocol', () => {
      expect(isSafeUrl('javascript:alert("xss")')).toBe(false);
    });

    it('should return false for data: protocol', () => {
      expect(isSafeUrl('data:text/html,<script>alert("xss")</script>')).toBe(false);
    });

    it('should return false for vbscript: protocol', () => {
      expect(isSafeUrl('vbscript:alert("xss")')).toBe(false);
    });
  });
});

// =============================================================================
// EXERCISE 4 TESTS: CSRF-Protected Form
// =============================================================================

describe('Exercise 4: CSRF Protection', () => {
  describe('CSRFProtectedForm', () => {
    const mockSubmit = vi.fn();
    const validToken = 'test-csrf-token-12345';

    beforeEach(() => {
      mockSubmit.mockClear();
    });

    it('should render form with hidden CSRF token', () => {
      const { container } = render(
        <CSRFProtectedForm csrfToken={validToken} onSubmit={mockSubmit} />
      );
      
      const hiddenInput = container.querySelector('input[type="hidden"]');
      expect(hiddenInput).toBeInTheDocument();
      expect(hiddenInput).toHaveAttribute('name', expect.stringMatching(/csrf/i));
      expect(hiddenInput).toHaveAttribute('value', validToken);
    });

    it('should render email and message fields', () => {
      render(<CSRFProtectedForm csrfToken={validToken} onSubmit={mockSubmit} />);
      
      expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /message/i })).toBeInTheDocument();
    });

    it('should submit form with CSRF token', async () => {
      render(<CSRFProtectedForm csrfToken={validToken} onSubmit={mockSubmit} />);
      
      const emailInput = screen.getByRole('textbox', { name: /email/i });
      const messageInput = screen.getByRole('textbox', { name: /message/i });
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(messageInput, 'Test message');
      await userEvent.click(submitButton);
      
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          message: 'Test message',
          csrf_token: validToken,
        })
      );
    });

    it('should prevent submission without CSRF token', async () => {
      render(<CSRFProtectedForm csrfToken="" onSubmit={mockSubmit} />);
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await userEvent.click(submitButton);
      
      expect(mockSubmit).not.toHaveBeenCalled();
      expect(screen.getByText(/csrf token/i)).toBeInTheDocument();
    });

    it('should have correct form attributes', () => {
      const { container } = render(
        <CSRFProtectedForm csrfToken={validToken} onSubmit={mockSubmit} />
      );
      
      const form = container.querySelector('form');
      expect(form).toHaveAttribute('method', 'post');
    });
  });
});

// =============================================================================
// EXERCISE 5 TESTS: Safe Markdown Renderer
// =============================================================================

describe('Exercise 5: Safe Markdown Rendering', () => {
  describe('SafeMarkdownRenderer', () => {
    it('should render basic markdown', () => {
      const markdown = '# Hello World\n\nThis is a paragraph.';
      const { container } = render(<SafeMarkdownRenderer markdown={markdown} />);
      
      expect(container.querySelector('h1')).toBeInTheDocument();
      expect(container.querySelector('p')).toBeInTheDocument();
    });

    it('should render markdown links safely', () => {
      const markdown = '[Safe Link](https://example.com)';
      render(<SafeMarkdownRenderer markdown={markdown} />);
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://example.com');
    });

    it('should sanitize javascript: links in markdown', () => {
      const markdown = '[Dangerous](javascript:alert("xss"))';
      const { container } = render(<SafeMarkdownRenderer markdown={markdown} />);
      
      const link = container.querySelector('a');
      if (link) {
        expect(link.getAttribute('href')).not.toContain('javascript:');
      }
    });

    it('should sanitize inline HTML in markdown', () => {
      const markdown = '# Hello\n\n<script>alert("xss")</script>';
      const { container } = render(<SafeMarkdownRenderer markdown={markdown} />);
      
      expect(container.querySelector('script')).toBeNull();
    });

    it('should allow safe HTML tags', () => {
      const markdown = '**Bold** and *italic*';
      const { container } = render(<SafeMarkdownRenderer markdown={markdown} />);
      
      expect(container.querySelector('strong')).toBeInTheDocument();
      expect(container.querySelector('em')).toBeInTheDocument();
    });

    it('should handle code blocks safely', () => {
      const markdown = '```javascript\nconst x = "<script>";\n```';
      const { container } = render(<SafeMarkdownRenderer markdown={markdown} />);
      
      const codeBlock = container.querySelector('pre');
      expect(codeBlock).toBeInTheDocument();
      // Should render code as text, not execute it
      expect(container.querySelector('script')).toBeNull();
    });
  });
});

// =============================================================================
// EXERCISE 6 TESTS: Secure Data Attribute Handler
// =============================================================================

describe('Exercise 6: Secure Data Attributes', () => {
  describe('SecureDataAttributes', () => {
    it('should apply safe data attributes', () => {
      const attrs = { userId: '123', role: 'admin' };
      const { container } = render(
        <SecureDataAttributes dataAttributes={attrs}>
          <span>Content</span>
        </SecureDataAttributes>
      );
      
      const element = container.firstChild;
      expect(element).toHaveAttribute('data-user-id', '123');
      expect(element).toHaveAttribute('data-role', 'admin');
    });

    it('should sanitize dangerous characters in attributes', () => {
      const attrs = { tooltip: '<script>alert("xss")</script>' };
      const { container } = render(
        <SecureDataAttributes dataAttributes={attrs}>
          <span>Content</span>
        </SecureDataAttributes>
      );
      
      const element = container.firstChild;
      const tooltipAttr = element.getAttribute('data-tooltip');
      expect(tooltipAttr).not.toContain('<script>');
      expect(tooltipAttr).not.toContain('>');
    });

    it('should render children correctly', () => {
      const attrs = { id: '1' };
      render(
        <SecureDataAttributes dataAttributes={attrs}>
          <span>Child Content</span>
        </SecureDataAttributes>
      );
      
      expect(screen.getByText('Child Content')).toBeInTheDocument();
    });
  });

  describe('sanitizeAttribute', () => {
    it('should remove angle brackets', () => {
      const result = sanitizeAttribute('<script>alert()</script>');
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
    });

    it('should remove quotes', () => {
      const result = sanitizeAttribute('"dangerous" \'value\'');
      expect(result).not.toContain('"');
      expect(result).not.toContain("'");
    });

    it('should allow safe characters', () => {
      const result = sanitizeAttribute('safe-value_123');
      expect(result).toBe('safe-value_123');
    });
  });
});

// =============================================================================
// EXERCISE 7 TESTS: Content Security Policy Reporter
// =============================================================================

describe('Exercise 7: CSP Violation Reporter', () => {
  describe('CSPViolationReporter', () => {
    it('should render violations container', () => {
      const { container } = render(<CSPViolationReporter />);
      expect(container.querySelector('.csp-violations')).toBeInTheDocument();
    });

    it('should display violation when CSP event is triggered', async () => {
      render(<CSPViolationReporter />);
      
      // Simulate CSP violation event
      const event = new Event('securitypolicyviolation');
      event.violatedDirective = 'script-src';
      event.blockedURI = 'inline';
      event.sourceFile = 'test.js';
      
      window.dispatchEvent(event);
      
      await waitFor(() => {
        expect(screen.getByText(/script-src/i)).toBeInTheDocument();
      });
    });

    it('should display multiple violations', async () => {
      render(<CSPViolationReporter />);
      
      // Trigger two violations
      const event1 = new Event('securitypolicyviolation');
      event1.violatedDirective = 'script-src';
      window.dispatchEvent(event1);
      
      const event2 = new Event('securitypolicyviolation');
      event2.violatedDirective = 'style-src';
      window.dispatchEvent(event2);
      
      await waitFor(() => {
        const violations = screen.getAllByRole('listitem');
        expect(violations.length).toBeGreaterThanOrEqual(2);
      });
    });
  });
});

// =============================================================================
// EXERCISE 8 TESTS: Secure File Upload
// =============================================================================

describe('Exercise 8: Secure File Upload', () => {
  describe('SecureFileUpload', () => {
    const mockUpload = vi.fn();
    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    beforeEach(() => {
      mockUpload.mockClear();
    });

    it('should accept valid file types', async () => {
      render(
        <SecureFileUpload
          allowedTypes={allowedTypes}
          maxSize={maxSize}
          onUpload={mockUpload}
        />
      );
      
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByRole('button', { name: /upload/i }).closest('div').querySelector('input[type="file"]');
      
      if (input) {
        await userEvent.upload(input, file);
        expect(mockUpload).toHaveBeenCalledWith(file);
      }
    });

    it('should reject invalid file types', async () => {
      render(
        <SecureFileUpload
          allowedTypes={allowedTypes}
          maxSize={maxSize}
          onUpload={mockUpload}
        />
      );
      
      const file = new File(['content'], 'test.exe', { type: 'application/exe' });
      const input = screen.getByRole('button', { name: /upload/i }).closest('div').querySelector('input[type="file"]');
      
      if (input) {
        await userEvent.upload(input, file);
        expect(screen.getByText(/file type/i)).toBeInTheDocument();
        expect(mockUpload).not.toHaveBeenCalled();
      }
    });

    it('should reject files exceeding max size', async () => {
      render(
        <SecureFileUpload
          allowedTypes={allowedTypes}
          maxSize={100} // 100 bytes
          onUpload={mockUpload}
        />
      );
      
      const largeContent = 'x'.repeat(200);
      const file = new File([largeContent], 'large.jpg', { type: 'image/jpeg' });
      const input = screen.getByRole('button', { name: /upload/i }).closest('div').querySelector('input[type="file"]');
      
      if (input) {
        await userEvent.upload(input, file);
        expect(screen.getByText(/size/i)).toBeInTheDocument();
        expect(mockUpload).not.toHaveBeenCalled();
      }
    });
  });

  describe('validateFileType', () => {
    const allowedTypes = ['image/jpeg', 'image/png'];

    it('should validate correct file type', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      expect(validateFileType(file, allowedTypes)).toBe(true);
    });

    it('should reject incorrect file type', () => {
      const file = new File([''], 'test.exe', { type: 'application/exe' });
      expect(validateFileType(file, allowedTypes)).toBe(false);
    });

    it('should check file extension', () => {
      // File with mismatched MIME type and extension
      const file = new File([''], 'test.php', { type: 'image/jpeg' });
      expect(validateFileType(file, allowedTypes)).toBe(false);
    });
  });

  describe('sanitizeFilename', () => {
    it('should remove path traversal attempts', () => {
      const result = sanitizeFilename('../../etc/passwd');
      expect(result).not.toContain('..');
      expect(result).not.toContain('/');
    });

    it('should remove special characters', () => {
      const result = sanitizeFilename('file<>:"|?*.txt');
      expect(result).not.toMatch(/[<>:"|?*]/);
    });

    it('should preserve safe characters', () => {
      const result = sanitizeFilename('my-file_123.txt');
      expect(result).toContain('my-file_123');
    });
  });
});

// =============================================================================
// EXERCISE 9 TESTS: SQL Injection Prevention
// =============================================================================

describe('Exercise 9: SQL Injection Prevention', () => {
  describe('SafeSearchInput', () => {
    const mockSearch = vi.fn();

    beforeEach(() => {
      mockSearch.mockClear();
    });

    it('should allow safe search queries', async () => {
      render(<SafeSearchInput onSearch={mockSearch} />);
      
      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button', { name: /search/i });
      
      await userEvent.type(input, 'hello world');
      await userEvent.click(button);
      
      expect(mockSearch).toHaveBeenCalledWith('hello world');
      expect(screen.queryByText(/warning/i)).not.toBeInTheDocument();
    });

    it('should detect SQL injection with quotes', async () => {
      render(<SafeSearchInput onSearch={mockSearch} />);
      
      const input = screen.getByRole('textbox');
      await userEvent.type(input, "'; DROP TABLE users--");
      
      expect(screen.getByText(/warning/i)).toBeInTheDocument();
    });

    it('should detect SQL keywords', async () => {
      render(<SafeSearchInput onSearch={mockSearch} />);
      
      const input = screen.getByRole('textbox');
      await userEvent.type(input, 'SELECT * FROM users');
      
      expect(screen.getByText(/warning/i)).toBeInTheDocument();
    });

    it('should allow safe queries with common words', async () => {
      render(<SafeSearchInput onSearch={mockSearch} />);
      
      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button', { name: /search/i });
      
      await userEvent.type(input, 'select your favorite');
      await userEvent.click(button);
      
      // Should allow "select" in normal context
      expect(mockSearch).toHaveBeenCalled();
    });
  });

  describe('detectSQLInjection', () => {
    it('should detect single quote attacks', () => {
      expect(detectSQLInjection("' OR '1'='1")).toBe(true);
    });

    it('should detect SQL keywords in suspicious context', () => {
      expect(detectSQLInjection("'; DROP TABLE users--")).toBe(true);
    });

    it('should detect UNION attacks', () => {
      expect(detectSQLInjection('UNION SELECT password FROM users')).toBe(true);
    });

    it('should detect comment syntax', () => {
      expect(detectSQLInjection('test--')).toBe(true);
      expect(detectSQLInjection('test/*comment*/')).toBe(true);
    });

    it('should allow safe input', () => {
      expect(detectSQLInjection('hello world')).toBe(false);
      expect(detectSQLInjection('user@example.com')).toBe(false);
    });
  });
});

// =============================================================================
// EXERCISE 10 TESTS: Secure Local Storage
// =============================================================================

describe('Exercise 10: Secure Local Storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('SecureLocalStorage', () => {
    it('should initialize with initial value', () => {
      const { container } = render(
        <SecureLocalStorage storageKey="test" initialValue="initial">
          {(value) => <div>{value}</div>}
        </SecureLocalStorage>
      );
      
      expect(container.textContent).toContain('initial');
    });

    it('should load value from localStorage', () => {
      localStorage.setItem('test-key', JSON.stringify('stored-value'));
      
      const { container } = render(
        <SecureLocalStorage storageKey="test-key" initialValue="">
          {(value) => <div>{value}</div>}
        </SecureLocalStorage>
      );
      
      expect(container.textContent).toContain('stored-value');
    });

    it('should handle corrupt localStorage data', () => {
      localStorage.setItem('test-key', 'invalid-json{');
      
      render(
        <SecureLocalStorage storageKey="test-key" initialValue="fallback">
          {(value) => <div>{value}</div>}
        </SecureLocalStorage>
      );
      
      // Should show error or use fallback
      expect(screen.getByText(/fallback|error/i)).toBeInTheDocument();
    });

    it('should sanitize data before storing', async () => {
      render(
        <SecureLocalStorage storageKey="test-key" initialValue="">
          {(value, setValue) => (
            <>
              <div>{value}</div>
              <button onClick={() => setValue('<script>alert("xss")</script>')}>
                Set Value
              </button>
            </>
          )}
        </SecureLocalStorage>
      );
      
      const button = screen.getByRole('button');
      await userEvent.click(button);
      
      const stored = localStorage.getItem('test-key');
      expect(stored).not.toContain('<script>');
    });

    it('should handle storage quota errors', async () => {
      // Mock localStorage to throw quota error
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      setItemSpy.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      
      render(
        <SecureLocalStorage storageKey="test" initialValue="">
          {(value, setValue) => (
            <button onClick={() => setValue('data')}>Save</button>
          )}
        </SecureLocalStorage>
      );
      
      const button = screen.getByRole('button');
      await userEvent.click(button);
      
      expect(screen.getByText(/storage/i)).toBeInTheDocument();
      
      setItemSpy.mockRestore();
    });
  });
});

// =============================================================================
// INTEGRATION TESTS
// =============================================================================

describe('Security Integration Tests', () => {
  it('should handle multiple security measures together', async () => {
    const TestComponent = () => {
      const [content, setContent] = useState('');
      
      return (
        <div>
          <SafeSearchInput onSearch={setContent} />
          {content && <SafeUserProfile username={content} bio="Test" />}
        </div>
      );
    };
    
    render(<TestComponent />);
    
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });
    
    // Try malicious input
    await userEvent.type(input, '<script>alert("xss")</script>');
    await userEvent.click(button);
    
    // Should not execute script
    const { container } = render(<TestComponent />);
    expect(container.querySelector('script')).toBeNull();
  });

  it('should validate and sanitize form submission', async () => {
    const mockSubmit = vi.fn();
    
    render(
      <CSRFProtectedForm 
        csrfToken="valid-token" 
        onSubmit={mockSubmit}
      />
    );
    
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const messageInput = screen.getByRole('textbox', { name: /message/i });
    const button = screen.getByRole('button', { name: /submit/i });
    
    await userEvent.type(emailInput, '<script>alert("xss")</script>@test.com');
    await userEvent.type(messageInput, 'Test message');
    await userEvent.click(button);
    
    // Should submit but with sanitized data
    expect(mockSubmit).toHaveBeenCalled();
    const submittedData = mockSubmit.mock.calls[0][0];
    expect(submittedData.email).not.toContain('<script>');
  });
});
