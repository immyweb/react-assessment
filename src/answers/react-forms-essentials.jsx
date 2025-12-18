/**
 * React Forms and Validation Exercises
 *
 * This file contains exercises covering React forms:
 * - Controlled form patterns
 * - Form validation strategies
 * - Accessibility in forms
 * - useFormStatus
 * - useActionState
 * - React Hook Form
 * - Zod validation
 *
 */

import { useState, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// =============================================================================
// EXERCISE 1: Controlled Form Patterns
// =============================================================================

/**
 * Create a simple controlled form with text inputs.
 * All inputs should be controlled (value bound to state).
 *
 * Requirements:
 * - Name input (text)
 * - Email input (email type)
 * - Message textarea
 * - Submit button
 * - All inputs controlled with state
 * - onSubmit callback receives form data: { name, email, message }
 * - Prevent default form submission
 * - Clear form after successful submission
 *
 * Accessibility:
 * - Proper labels for all inputs
 * - Associated with htmlFor/id
 */
export function ControlledForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(evt) {
    evt.preventDefault();
    const data = {
      name,
      email,
      message
    };
    onSubmit(data);
    setName('');
    setEmail('');
    setMessage('');
  }

  return (
    <form onSubmit={handleSubmit} role="form">
      <label htmlFor="name">Name:</label>
      <input
        id="name"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label htmlFor="email">Email:</label>
      <input
        id="email"
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label htmlFor="message">Message:</label>
      <textarea
        id="message"
        name="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button type="submit">Submit</button>
    </form>
  );
}

/**
 * Create a controlled form with multiple input types.
 * Demonstrates handling different input types in controlled manner.
 *
 * Requirements:
 * - Text input for username
 * - Email input
 * - Password input (type="password")
 * - Number input for age
 * - Select dropdown for country (US, UK, Canada, Other)
 * - Checkbox for "agree to terms"
 * - Radio buttons for role (user, admin)
 * - Submit button (disabled if terms not agreed)
 * - onSubmit receives all form data
 * - Clear form after submission
 *
 * Accessibility:
 * - All inputs have labels
 * - Fieldset/legend for radio group
 */
export function MultiInputForm({ onSubmit }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState(0);
  const [country, setCountry] = useState('US');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [role, setRole] = useState('user');

  function resetForm() {
    setUsername('');
    setEmail('');
    setPassword('');
    setAge(0);
    setCountry('US');
    setAgreeTerms(false);
    setRole('user');
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    const data = {
      username,
      email,
      password,
      age,
      country,
      role,
      agreed: agreeTerms
    };
    onSubmit(data);
    resetForm();
  }

  return (
    <form role="form" onSubmit={handleSubmit}>
      <label htmlFor="username">Username</label>
      <input
        id="username"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <label htmlFor="age">Age</label>
      <input
        id="age"
        name="age"
        type="number"
        value={age}
        onChange={(e) => setAge(Number(e.target.value))}
      />

      <label htmlFor="country">Country</label>
      <select
        id="country"
        name="country"
        value={country}
        onChange={(e) => setCountry(e.target.value)}>
        <option value="US">US</option>
        <option value="UK">UK</option>
        <option value="Canada">Canada</option>
        <option value="Other">Other</option>
      </select>

      <label htmlFor="terms">Agree to terms</label>
      <input
        id="terms"
        name="terms"
        type="checkbox"
        checked={agreeTerms}
        onChange={(e) => setAgreeTerms(e.target.checked)}
      />

      <fieldset>
        <legend>Choose role</legend>
        <label htmlFor="user">User</label>
        <input
          id="user"
          name="role"
          type="radio"
          value="user"
          checked={role === 'user'}
          onChange={(e) => setRole(e.target.value)}
        />

        <label htmlFor="admin">Admin</label>
        <input
          id="admin"
          name="role"
          type="radio"
          value="admin"
          checked={role === 'admin'}
          onChange={(e) => setRole(e.target.value)}
        />
      </fieldset>

      <button type="submit" disabled={!agreeTerms}>
        Submit
      </button>
    </form>
  );
}

/**
 * Create a controlled form with nested object state.
 * Demonstrates managing complex form state structure.
 *
 * Requirements:
 * - Form data structure: { personal: { firstName, lastName }, contact: { email, phone } }
 * - Four inputs: firstName, lastName, email, phone
 * - Update nested state properly
 * - Display current state as JSON (data-testid="form-state")
 * - Submit button
 * - onSubmit receives nested object
 *
 * State structure:
 * {
 *   personal: { firstName: '', lastName: '' },
 *   contact: { email: '', phone: '' }
 * }
 */
export function NestedStateForm({ onSubmit }) {
  const [person, setPerson] = useState({
    personal: { firstName: '', lastName: '' },
    contact: { email: '', phone: '' }
  });

  function handleSubmit(evt) {
    evt.preventDefault();
    onSubmit(person);
  }

  return (
    <>
      <div data-testid="form-state">{JSON.stringify(person)}</div>
      <form role="form" onSubmit={handleSubmit}>
        <label htmlFor="firstName">First name</label>
        <input
          id="firstName"
          name="firstName"
          value={person.personal.firstName}
          onChange={(e) =>
            setPerson({
              ...person,
              personal: { ...person.personal, firstName: e.target.value }
            })
          }
        />

        <label htmlFor="lastName">Last name</label>
        <input
          id="lastName"
          name="lastName"
          value={person.personal.lastName}
          onChange={(e) =>
            setPerson({
              ...person,
              personal: { ...person.personal, lastName: e.target.value }
            })
          }
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={person.contact.email}
          onChange={(e) =>
            setPerson({
              ...person,
              contact: { ...person.contact, email: e.target.value }
            })
          }
        />

        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          name="phone"
          value={person.contact.phone}
          onChange={(e) =>
            setPerson({
              ...person,
              contact: { ...person.contact, phone: e.target.value }
            })
          }
        />

        <button type="submit">Submit</button>
      </form>
    </>
  );
}

// =============================================================================
// EXERCISE 2: Form Validation Strategies
// =============================================================================

/**
 * Create a form with real-time validation.
 * Show validation errors as user types.
 *
 * Requirements:
 * - Email input with validation
 * - Password input with validation rules:
 *   * Min 8 characters
 *   * At least one uppercase letter
 *   * At least one number
 * - Show errors below each field (className "error")
 * - Validate on change (real-time)
 * - Submit button disabled if form invalid
 * - onSubmit only called if valid
 *
 * Error messages:
 * - Email: "Invalid email format"
 * - Password: "Password must be at least 8 characters", etc.
 */
export function RealtimeValidationForm({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [passwordError, setPasswordError] = useState([]);

  function handleSubmit(evt) {
    evt.preventDefault();
    if (emailValid && passwordError.length === 0) {
      const data = {
        email,
        password
      };
      onSubmit(data);
    }
  }

  function handleEmail(text) {
    setEmail(text);
    setEmailValid(isValidEmail(text));
  }

  function handlePassword(text) {
    setPassword(text);
    setPasswordError(validatePassword(text));
  }

  return (
    <form role="form" onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        value={email}
        onChange={(e) => handleEmail(e.target.value)}
        aria-describedby="email-error"
      />
      {!emailValid && (
        <span id="email-error" className="error" role="alert">
          Invalid email format
        </span>
      )}

      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        value={password}
        onChange={(e) => handlePassword(e.target.value)}
        aria-describedby="password-error"
      />
      {passwordError.length > 0 && (
        <div id="password-error" role="alert">
          {passwordError.map((error, i) => (
            <span className="error" key={`key-${i}`}>
              {error}
            </span>
          ))}
        </div>
      )}

      <button type="submit" disabled={!emailValid || passwordError.length > 0}>
        Submit
      </button>
    </form>
  );
}

/**
 * Create a form with validation on blur (touched fields).
 * Only show errors for fields that have been touched.
 *
 * Requirements:
 * - Name input (required, min 2 characters)
 * - Email input (required, valid format)
 * - Phone input (optional, but if filled must match pattern)
 * - Track touched state for each field
 * - Show errors only for touched fields
 * - Validate on blur
 * - Submit validates all and shows all errors
 * - Error messages have className "error"
 *
 * Phone pattern: XXX-XXX-XXXX or (XXX) XXX-XXXX
 */
export function TouchedValidationForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [nameTouched, setNameTouched] = useState(false);
  const [nameValid, setNameValid] = useState(true);

  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailValid, setEmailValid] = useState(true);

  const [phone, setPhone] = useState('');
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [phoneValid, setPhoneValid] = useState(true);

  function validatePhoneNumber(phone) {
    return /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(phone);
  }

  function validateName(name) {
    return name.length > 2;
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    setNameValid(validateName(name));
    setEmailValid(isValidEmail(email));
    if (phone.length > 0) {
      setPhoneValid(validatePhoneNumber(phone));
    }

    if (nameValid && emailValid && phoneValid) {
      onSubmit({ name, email, phone });
    }
  }

  function handleName(text) {
    setNameTouched(true);
    setNameValid(validateName(text));
  }

  function handleEmail(text) {
    setEmailTouched(true);
    setEmailValid(isValidEmail(text));
  }

  function handlePhone(text) {
    setPhoneTouched(true);
    if (text.length > 0) {
      setPhoneValid(validatePhoneNumber(text));
    }
  }

  return (
    <form role="form" onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input
        name="name"
        id="name"
        value={name}
        aria-describedby="name-error"
        onBlur={(e) => handleName(e.target.value)}
        onChange={(e) => setName(e.target.value)}
      />
      {!nameValid && (
        <span id="name-error" className="error" role="alert">
          Name required. Must be at least 2 characters.
        </span>
      )}

      <label htmlFor="email">Email</label>
      <input
        name="email"
        id="email"
        type="email"
        value={email}
        aria-describedby="email-error"
        onBlur={(e) => handleEmail(e.target.value)}
        onChange={(e) => setEmail(e.target.value)}
      />
      {!emailValid && (
        <span id="email-error" className="error" role="alert">
          Email required
        </span>
      )}

      <label htmlFor="phone">Phone</label>
      <input
        name="phone"
        id="phone"
        type="tel"
        value={phone}
        aria-describedby="phone-error"
        onBlur={(e) => handlePhone(e.target.value)}
        onChange={(e) => setPhone(e.target.value)}
      />
      {!phoneValid && (
        <span id="phone-error" className="error" role="alert">
          Invalid phone format
        </span>
      )}

      <button type="submit">Submit</button>
    </form>
  );
}

/**
 * Create a form with async validation.
 * Simulate checking if username is available.
 *
 * Requirements:
 * - Username input
 * - Check availability on blur (simulate 500ms API call)
 * - Show "Checking..." while validating
 * - Show "Username taken" or "Username available"
 * - Submit disabled while checking or if taken
 * - Available usernames: Any except "admin", "user", "test"
 * - Use data-testid="validation-status" for status message
 *
 * States: idle, checking, available, taken
 */
export function AsyncValidationForm({ onSubmit }) {
  // TODO: Implement async validation
  // Hint: Use setTimeout to simulate API call, useEffect for cleanup
}

// =============================================================================
// EXERCISE 3: Accessibility in Forms
// =============================================================================

/**
 * Create a fully accessible form.
 * Demonstrates all accessibility best practices.
 *
 * Requirements:
 * - All inputs have associated labels (htmlFor/id)
 * - Required fields marked with aria-required
 * - Error messages associated with aria-describedby
 * - Error messages have role="alert" for screen readers
 * - Fieldset and legend for grouped inputs
 * - Submit button shows loading state with aria-busy
 * - Focus management (focus first error on submit)
 *
 * Fields: firstName, lastName, email, subscribe (checkbox), role (radio)
 * Validation: firstName and email required
 */
export function AccessibleForm({ onSubmit }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [role, setRole] = useState('user');

  const [firstNameError, setFirstNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const firstNameRef = useRef(null);
  const emailRef = useRef(null);

  function isValidField(value) {
    return value.length > 0;
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    setIsPending(true);

    const firstNameIsValid = isValidField(firstName);
    const emailIsValid = isValidField(email);

    setFirstNameError(!firstNameIsValid);
    setEmailError(!emailIsValid);

    if (!firstNameIsValid) {
      firstNameRef.current.focus();
    } else if (!emailIsValid) {
      emailRef.current.focus();
    }

    if (!firstNameError && !emailError) {
      const data = { firstName, lastName, email, subscribed, role };
      onSubmit(data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    setIsPending(false);
  }

  return (
    <form role="form" onSubmit={handleSubmit}>
      <label htmlFor="firstName">First name</label>
      <input
        id="firstName"
        name="firstName"
        value={firstName}
        ref={firstNameRef}
        aria-required="true"
        aria-describedby="firstname-error"
        onChange={(e) => setFirstName(e.target.value)}
      />
      {firstNameError && (
        <span id="firstname-error" className="error" role="alert">
          First name is required
        </span>
      )}

      <label htmlFor="lastName">Last name</label>
      <input
        id="lastName"
        name="lastName"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />

      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        value={email}
        ref={emailRef}
        aria-required="true"
        aria-describedby="email-error"
        onChange={(e) => setEmail(e.target.value)}
      />
      {emailError && (
        <span id="email-error" className="error" role="alert">
          Email is required
        </span>
      )}

      <label htmlFor="subscribe">Subscribe</label>
      <input
        type="checkbox"
        id="subscribe"
        name="subscribe"
        checked={subscribed}
        onChange={(e) => setSubscribed(!subscribed)}
      />

      <fieldset>
        <legend>Role</legend>

        <label htmlFor="user">User</label>
        <input
          type="radio"
          id="user"
          name="role"
          value="user"
          checked={role === 'user'}
          onChange={(e) => setRole('user')}
        />

        <label htmlFor="admin">Admin</label>
        <input
          type="radio"
          id="admin"
          name="role"
          value="admin"
          checked={role === 'admin'}
          onChange={(e) => setRole('admin')}
        />
      </fieldset>

      <button type="submit" aria-busy={isPending}>
        {isPending ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}

/**
 * Create a form with keyboard navigation support.
 * Enhanced keyboard interaction.
 *
 * Requirements:
 * - Standard tab navigation works
 * - Enter key submits form (from any input)
 * - Escape key clears form
 * - Keyboard shortcut: Ctrl/Cmd + S saves draft
 * - Show keyboard shortcuts hint (data-testid="shortcuts-hint")
 * - Inputs: title, description
 * - Save draft to localStorage
 *
 * Prevent default behavior for shortcuts
 */
export function KeyboardNavigationForm({ onSubmit }) {
  // TODO: Implement keyboard navigation
  // Hint: Use onKeyDown handlers, check key codes
}

/**
 * Create a form with live validation announcements.
 * Screen reader announces validation status.
 *
 * Requirements:
 * - Email and password inputs
 * - Live region for announcements (aria-live="polite")
 * - Announce validation errors to screen readers
 * - Announce successful validation
 * - Visual error messages below fields
 * - Live region has data-testid="live-region"
 *
 * Announcements:
 * - "Email is invalid" / "Email is valid"
 * - "Password is too short" / "Password is valid"
 */
export function LiveValidationForm({ onSubmit }) {
  // TODO: Implement live validation announcements
  // Hint: Use aria-live region that updates with validation messages
}

/**
 * Create a form with focus trap for modal.
 * Trap focus within form while modal is open.
 *
 * Requirements:
 * - Modal overlay with form
 * - isOpen prop controls visibility
 * - Focus trapped within modal when open
 * - Focus first input on modal open
 * - Tab cycles through form elements only
 * - Shift+Tab cycles backward
 * - Escape closes modal
 * - Return focus to trigger element on close
 * - Close button and submit button
 *
 * Modal should have role="dialog" and aria-modal="true"
 */
export function FocusTrapForm({ isOpen, onClose, onSubmit }) {
  // TODO: Implement focus trap
  // Hint: Use refs to track focusable elements, manage focus on tab
}

// =============================================================================
// EXERCISE 4: useFormStatus
// =============================================================================

/**
 * Create a submit button that uses useFormStatus.
 * Demonstrates pending state from form submission.
 *
 * Requirements:
 * - Create SubmitButton component that uses useFormStatus
 * - Show "Submitting..." when pending is true
 * - Show "Submit" when not pending
 * - Disable button when pending
 * - Button should have type="submit"
 * - Form should have an action that simulates async submission
 * - Button text data-testid="button-text"
 *
 * Note: useFormStatus must be called in a component that is a child
 * of a form with an action prop.
 */
export function UseFormStatusButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} data-testid="button-text">
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}

/**
 * Create a form with multiple submit buttons using useFormStatus.
 * Different buttons trigger different actions.
 *
 * Requirements:
 * - Form with title and content inputs
 * - Two submit buttons: "Save Draft" and "Publish"
 * - Use useFormStatus to show which action is pending
 * - Buttons show: "Saving..." or "Publishing..." when pending
 * - Use formAction prop on buttons for different actions
 * - Disable both buttons while any action is pending
 * - Create separate action functions: saveDraft and publish
 * - Actions should take FormData and return result after 1s delay
 *
 * Button data-testids: "save-button", "publish-button"
 */
export function MultiActionFormStatus({ onSaveDraft, onPublish }) {
  async function saveDraftAction(formData) {
    const data = Object.fromEntries(formData);
    const response = await onSaveDraft(data);
    return response;
  }

  async function publishAction(formData) {
    const data = Object.fromEntries(formData);
    const response = await onPublish(data);
    return response;
  }

  return (
    <form>
      <label htmlFor="titleInput">Title</label>
      <input id="titleInput" name="titleInput" />

      <label htmlFor="contentInput">Content</label>
      <input id="contentInput" name="contentInput" />

      <MultiActionButton
        action={saveDraftAction}
        testId="save-button"
        text="Save Draft"
        textPending="Saving"
      />
      <MultiActionButton
        action={publishAction}
        testId="publish-button"
        text="Publish"
        textPending="Publishing"
      />
    </form>
  );
}

function MultiActionButton({ action, testId, text, textPending }) {
  const { pending } = useFormStatus();

  return (
    <button data-testid={testId} disabled={pending} formAction={action}>
      {pending ? textPending : text}
    </button>
  );
}

/**
 * Create a form with a loading indicator using useFormStatus.
 * Show a progress indicator separate from the submit button.
 *
 * Requirements:
 * - Form with email and message inputs
 * - Submit button
 * - Separate LoadingIndicator component using useFormStatus
 * - LoadingIndicator shows "Processing form..." when pending
 * - LoadingIndicator has data-testid="loading-indicator"
 * - LoadingIndicator should only show when form is pending
 * - Form submission simulates 2s delay
 *
 * LoadingIndicator should be a sibling of form fields, not the button
 */
export function FormStatusWithIndicator({ onSubmit }) {
  async function submitAction(formData) {
    const data = Object.fromEntries(formData);
    await onSubmit(data);
  }

  return (
    <form role="form" action={submitAction}>
      <label htmlFor="emailInput">Email</label>
      <input name="emailInput" id="emailInput" type="email" />

      <label htmlFor="messageInput">Message</label>
      <input name="messageInput" id="messageInput" />

      <button type="submit">Submit</button>
      <LoadingIndicator />
    </form>
  );
}

function LoadingIndicator() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <div data-testid="loading-indicator">Processing form...</div>
      ) : (
        <div></div>
      )}
    </>
  );
}

/**
 * Create a form that shows which field was submitted with useFormStatus.
 * Access FormData from useFormStatus.
 *
 * Requirements:
 * - Form with name, email, and phone inputs
 * - Submit button
 * - Status display component using useFormStatus
 * - Status shows submitted field values while pending
 * - Status has data-testid="form-status"
 * - Display format: "Submitting: {name}, {email}, {phone}"
 * - Only show status when pending
 * - Clear status after submission completes
 */
export function FormStatusWithData({ onSubmit }) {
  async function submitAction(formDate) {
    const data = Object.fromEntries(formDate);
    await onSubmit(data);
  }

  return (
    <form role="form" action={submitAction}>
      <label htmlFor="nameInput">Name</label>
      <input id="nameInput" name="nameInput" />

      <label htmlFor="emailInput">Email</label>
      <input id="emailInput" name="emailInput" type="email" />

      <label htmlFor="phoneInput">Phone</label>
      <input id="phoneInput" name="phoneInput" type="tel" />

      <button type="submit">Submit</button>
      <StatusIndicator />
    </form>
  );
}

function StatusIndicator() {
  const { pending, data } = useFormStatus();

  return (
    <>
      {pending ? (
        <div data-testid="form-status">{`Submitting: ${data.get(
          'nameInput'
        )}, ${data.get('emailInput')}, ${data.get('phoneInput')}`}</div>
      ) : (
        <div></div>
      )}
    </>
  );
}

// =============================================================================
// EXERCISE 5: useActionState
// =============================================================================

/**
 * Create a form using useActionState for state management.
 * Basic useActionState implementation.
 *
 * Requirements:
 * - Form with username and email inputs
 * - Use useActionState to manage form state and submission
 * - Action function validates inputs and returns state
 * - Show success message when submission succeeds
 * - Show error message when validation fails
 * - Validation: username min 3 chars, email valid format
 * - Success state shows data-testid="success-message"
 * - Error state shows data-testid="error-message"
 * - Form action receives previous state and FormData
 *
 * State structure: { success: boolean, message: string, errors?: object }
 */
export function UseActionStateBasic() {
  const [formState, formAction] = useActionState(validateData, {});

  function validateData(prevState, formData) {
    const isNameValid =
      formData.get('usernameInput').length >= 3 ? true : false;
    const isEmailValid = isValidEmail(formData.get('emailInput'));

    if (isNameValid && isEmailValid) {
      return {
        success: true,
        message: 'Submission succeeded'
      };
    } else if (!isNameValid && isEmailValid) {
      return {
        success: false,
        message: 'Username is invalid'
      };
    } else if (!isNameValid && !isEmailValid) {
      return {
        success: false,
        message: 'Email is invalid'
      };
    } else {
      return {
        success: false,
        message: 'Username and email is invalid'
      };
    }
  }

  return (
    <form role="form" action={formAction}>
      <label htmlFor="usernameInput">Username</label>
      <input id="usernameInput" name="usernameInput" />

      <label htmlFor="emailInput">Email</label>
      <input id="emailInput" name="emailInput" />

      <button type="submit">Submit</button>

      {formState.success && (
        <div data-testid="success-message">{formState.message}</div>
      )}

      {formState.success === false && (
        <div data-testid="error-message">{formState.message}</div>
      )}
    </form>
  );
}

/**
 * Create a multi-step form using useActionState.
 * Manage wizard-style form progression.
 *
 * Requirements:
 * - Three steps: Personal Info, Contact Info, Review
 * - Step 1: firstName, lastName (both required)
 * - Step 2: email, phone (email required)
 * - Step 3: Review all data with Edit and Submit buttons
 * - Use useActionState to manage current step and data
 * - Next button advances to next step if valid
 * - Back button returns to previous step
 * - Show current step number: data-testid="current-step"
 * - Validate each step before advancing
 * - Final submit calls onSubmit prop with all data
 *
 * State structure: { step: number, data: object, errors: object }
 */
export function MultiStepActionState({ onSubmit }) {
  const [formState, formAction] = useActionState(handleFormSteps, {
    step: 1,
    data: {},
    errors: {}
  });

  function validateText(text) {
    return text && text.length >= 3;
  }

  function handleFormSteps(prevState, formData) {
    const data = Object.fromEntries(formData);
    const errors = {};

    if (data.action === 'next') {
      if (prevState.step === 1) {
        if (!validateText(data.firstnameInput)) {
          errors.firstnameInput =
            'First name is required and must be at least 3 characters.';
        }
        if (!validateText(data.lastnameInput)) {
          errors.lastnameInput =
            'Last name is required and must be at least 3 characters.';
        }

        if (Object.keys(errors).length > 0) {
          return { ...prevState, errors };
        }

        return {
          step: 2,
          data: {
            ...prevState.data,
            firstName: data.firstnameInput,
            lastName: data.lastnameInput
          },
          errors: {}
        };
      }

      if (prevState.step === 2) {
        if (!isValidEmail(data.emailInput)) {
          errors.emailInput = 'A valid email is required.';
        }

        if (Object.keys(errors).length > 0) {
          return { ...prevState, errors };
        }

        return {
          step: 3,
          data: {
            ...prevState.data,
            email: data.emailInput,
            phone: data.phoneInput
          },
          errors: {}
        };
      }
    }

    if (data.action === 'back') {
      return {
        ...prevState,
        step: prevState.step - 1
      };
    }

    if (data.action === 'edit') {
      return {
        ...prevState,
        step: 2
      };
    }

    if (data.action === 'submit') {
      if (!validateText(prevState.data.firstName)) {
        errors.firstName =
          'First name is required and must be at least 3 characters.';
      }
      if (!validateText(prevState.data.lastName)) {
        errors.lastName =
          'Last name is required and must be at least 3 characters.';
      }
      if (!isValidEmail(prevState.data.email)) {
        errors.email = 'A valid email is required.';
      }

      if (Object.keys(errors).length > 0) {
        return { ...prevState, errors };
      }

      onSubmit(prevState.data);
      return prevState;
    }

    return prevState;
  }

  return (
    <form role="form" action={formAction}>
      {formState.step === 1 && (
        <fieldset data-testid="current-step">
          <legend>Step 1</legend>

          <label htmlFor="firstnameInput">First name</label>
          <input
            id="firstnameInput"
            name="firstnameInput"
            aria-required="true"
            aria-describedby="error-firstnameInput"
          />
          {formState.errors.firstnameInput && (
            <span id="error-firstnameInput" role="alert">
              {formState.errors.firstnameInput}
            </span>
          )}

          <label htmlFor="lastnameInput">Last name</label>
          <input
            id="lastnameInput"
            name="lastnameInput"
            aria-required="true"
            aria-describedby="error-lastnameInput"
          />
          {formState.errors.lastnameInput && (
            <span id="error-lastnameInput" role="alert">
              {formState.errors.lastnameInput}
            </span>
          )}

          <button name="action" value="next">
            Next
          </button>
        </fieldset>
      )}

      {formState.step === 2 && (
        <fieldset data-testid="current-step">
          <legend>Step 2</legend>

          <label htmlFor="emailInput">Email</label>
          <input
            id="emailInput"
            name="emailInput"
            aria-required="true"
            aria-describedby="error-emailInput"
          />
          {formState.errors.emailInput && (
            <span id="error-emailInput" role="alert">
              {formState.errors.emailInput}
            </span>
          )}

          <label htmlFor="phoneInput">Phone</label>
          <input id="phoneInput" name="phoneInput" />

          <button name="action" value="next">
            Next
          </button>
          <button name="action" value="back">
            Back
          </button>
        </fieldset>
      )}

      {formState.step === 3 && (
        <fieldset data-testid="current-step">
          <legend>Step 3</legend>

          <p>First Name: {formState.data.firstName}</p>
          <p>Last Name: {formState.data.lastName}</p>
          <p>Email: {formState.data.email}</p>
          <p>Phone: {formState.data.phone}</p>

          <button name="action" value="edit">
            Edit
          </button>

          <button name="action" value="submit">
            Submit
          </button>
        </fieldset>
      )}
    </form>
  );
}

/**
 * Create a form with field-level errors using useActionState.
 * Display validation errors for each field.
 *
 * Requirements:
 * - Registration form: username, email, password, confirmPassword
 * - Use useActionState to manage form state and errors
 * - Validation rules:
 *   * username: required, min 3 chars, alphanumeric only
 *   * email: required, valid email format
 *   * password: required, min 8 chars, must contain uppercase and number
 *   * confirmPassword: must match password
 * - Show field-specific errors below each input
 * - Errors have data-testid="error-{fieldname}"
 * - Only show errors after submission attempt
 * - Clear errors on successful submission
 *
 * State structure: { errors: { username?, email?, password?, confirmPassword? }, success: boolean }
 */
export function FieldErrorsActionState({ onSubmit }) {
  const [formState, formAction] = useActionState(validateData, {
    errors: {},
    success: false
  });

  function validateUsername(text) {
    return text && text.length >= 3 && isAlphaNumeric(text);
  }

  function validateData(prevState, formData) {
    const data = Object.fromEntries(formData);

    const isUsernameValid = validateUsername(data.username);
    const isEmailValid = isValidEmail(data.email);
    const isPasswordValid = validatePassword(data.password);
    const isPasswordSame = data.password === data.confirmPassword;

    const errors = {};

    if (!isUsernameValid) {
      errors.username = 'Username is not valid. Min 3 chars, alphanumeric only';
    }

    if (!isEmailValid) {
      errors.email = 'Email is not valid format';
    }

    if (isPasswordValid.length > 0) {
      errors.password =
        'Password is not valid. Min 8 chars, must contain uppercase and number';
    }

    if (!isPasswordSame) {
      errors.confirmPassword = 'Must match password';
    }

    if (Object.keys(errors).length > 0) {
      return { errors, success: false };
    }

    return {
      errors: {},
      success: true
    };
  }

  return (
    <form role="form" action={formAction}>
      <label htmlFor="username">Username</label>
      <input
        name="username"
        id="username"
        aria-required="true"
        aria-describedby="error-username"
      />
      {formState.errors.username && (
        <span id="error-username" role="alert" data-testid="error-username">
          {formState.errors.username}
        </span>
      )}

      <label htmlFor="email">Email</label>
      <input
        name="email"
        id="email"
        aria-required="true"
        aria-describedby="error-email"
      />
      {formState.errors.email && (
        <span id="error-email" role="alert" data-testid="error-email">
          {formState.errors.email}
        </span>
      )}

      <label htmlFor="password">Password</label>
      <input
        name="password"
        id="password"
        aria-required="true"
        aria-describedby="error-password"
      />
      {formState.errors.password && (
        <span id="error-password" role="alert" data-testid="error-password">
          {formState.errors.password}
        </span>
      )}

      <label htmlFor="confirmPassword">Confirm password</label>
      <input
        name="confirmPassword"
        id="confirmPassword"
        aria-required="true"
        aria-describedby="error-confirmPassword"
      />
      {formState.errors.confirmPassword && (
        <span
          id="error-confirmPassword"
          role="alert"
          data-testid="error-confirmpassword">
          {formState.errors.confirmPassword}
        </span>
      )}

      <button type="submit">Submit</button>
    </form>
  );
}

// =============================================================================
// EXERCISE 6: React Hook Form
// =============================================================================

/**
 * Create a basic form using React Hook Form.
 * Introduction to react-hook-form library.
 *
 * Requirements:
 * - Install and import: useForm from 'react-hook-form'
 * - Form fields: name, email, age (number)
 * - Use register() to register inputs
 * - Use handleSubmit() wrapper for form submission
 * - Show validation errors from formState.errors
 * - Validation rules:
 *   * name: required, minLength: 2
 *   * email: required, pattern: email regex
 *   * age: required, min: 18, max: 100
 * - Error messages have className "error"
 * - Submit calls onSubmit prop with data
 *
 * Example: <input {...register("name", { required: true })} />
 */
export function ReactHookFormBasic({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  function onSubmitForm(data) {
    onSubmit(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <label htmlFor="name">Name</label>
      <input
        id="name"
        aria-invalid={errors.name ? 'true' : 'false'}
        {...register('name', { required: true, minLength: 2 })}
      />
      {errors.name?.type === 'required' && (
        <span role="alert">Name is required</span>
      )}
      {errors.name?.type === 'minLength' && (
        <span role="alert">Name must be at least 2 characters</span>
      )}

      <label htmlFor="email">Email</label>
      <input
        id="email"
        {...register('email', {
          required: true,
          pattern:
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        })}
      />
      {errors.email?.type === 'required' && (
        <span role="alert">Email is required</span>
      )}

      <label htmlFor="age">Age</label>
      <input
        id="age"
        type="number"
        {...register('age', { required: true, min: 18, max: 100 })}
      />
      {errors.age?.type === 'required' && (
        <span role="alert">Age is required</span>
      )}
      {errors.age?.type === 'min' && (
        <span role="alert">Age must be at least 18</span>
      )}
      {errors.age?.type === 'max' && (
        <span role="alert">Age must be less than 100</span>
      )}

      <input type="submit" />
    </form>
  );
}

/**
 * Create a form with custom validation using React Hook Form.
 * Use custom validation functions.
 *
 * Requirements:
 * - Form fields: username, password, confirmPassword
 * - Use register with custom validate functions
 * - Username validation: async check if available (not "admin", "user", "test")
 * - Password validation: custom function checking strength
 * - ConfirmPassword validation: must match password (use watch())
 * - Show validation errors with specific messages
 * - Disable submit while validating (use formState.isValidating)
 * - Success message on valid submission: data-testid="success"
 *
 * Custom validate syntax: validate: { ruleName: (value) => true | "error message" }
 */
export function ReactHookFormCustomValidation({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValidating, isValid, isSubmitted },
    watch
  } = useForm({ mode: 'onChange' });

  const watchPassword = watch('password');

  async function checkAvailability(text) {
    if (text === 'admin' || text === 'user' || text === 'test') {
      return false;
    } else {
      return true;
    }
  }

  function onSubmitForm(data) {
    if (isValid) {
      onSubmit(data);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <label htmlFor="username">Username</label>
      <input
        id="username"
        {...register('username', {
          validate: async (value) => {
            const isAvailable = await checkAvailability(value);
            return isAvailable || 'This username is unavailable';
          }
        })}
      />
      {errors.username?.message && (
        <span role="alert">{errors.username?.message}</span>
      )}

      <label htmlFor="password">Password</label>
      <input
        id="password"
        {...register('password', {
          validate: (value) => {
            const checkPassword = validatePassword(value);
            if (checkPassword.length > 0) {
              return 'Password is weak';
            } else {
              return true;
            }
          }
        })}
      />
      {errors.password?.message && (
        <span role="alert">{errors.password?.message}</span>
      )}

      <label htmlFor="confirmPassword">Confirm Password</label>
      <input
        id="confirmPassword"
        {...register('confirmPassword', {
          validate: (value) => {
            return value === watchPassword || 'Passwords must match';
          }
        })}
      />
      {errors.confirmPassword?.message && (
        <span role="alert">{errors.confirmPassword?.message}</span>
      )}

      <input type="submit" disabled={isValidating} />

      {isSubmitted && isValid && (
        <div data-testid="success">
          Your info has been successfully submitted
        </div>
      )}
    </form>
  );
}

/**
 * Create a dynamic form array using React Hook Form.
 * Add/remove form fields dynamically.
 *
 * Requirements:
 * - Form for user with multiple phone numbers
 * - Fields: name, email, phones array
 * - Each phone has: type (mobile/home/work), number
 * - Use useFieldArray hook for phones
 * - Add phone button: data-testid="add-phone"
 * - Remove phone button for each: data-testid="remove-phone-{index}"
 * - Validate: name required, email required, at least 1 phone
 * - Phone number validation: required, matches pattern
 * - Phone list has data-testid="phone-list"
 *
 * Default: Start with 1 empty phone field
 */
export function ReactHookFormFieldArray({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    control
  } = useForm({
    defaultValues: {
      phones: [{}]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'phones' });

  function onSubmitForm(data) {
    if (isValid) {
      onSubmit(data);
    }
  }

  return (
    <form role="form" onSubmit={handleSubmit(onSubmitForm)}>
      <label htmlFor="name">Name</label>
      <input id="name" {...register('name', { required: true })} />

      <label htmlFor="email">Email</label>
      <input id="email" {...register('email', { required: true })} />

      <ul data-testid="phone-list">
        {fields.map((item, index) => (
          <li key={`phone-${index}`} data-testid={`phone-${index}`}>
            <label htmlFor={`phone-${index}`}>{`Phone ${index} number`}</label>
            <input
              id={`phone-${index}`}
              {...register(`phones.${index}.number`, {
                required: {
                  value: true,
                  message: 'Please enter your phone number'
                },
                pattern: {
                  value:
                    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$$/,
                  message: 'Phone number is invalid'
                }
              })}
            />
            {errors.phones?.map((phone, i) => {
              return (
                <span role="alert" key={`error-${i}`}>
                  {phone.number.message}
                </span>
              );
            })}
            <button
              type="button"
              data-testid={`remove-phone-${index}`}
              onClick={() => remove(index)}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      <button type="button" data-testid="add-phone" onClick={() => append()}>
        Add phone
      </button>

      <input type="submit" />

      {!isValid && <span role="alert">Phone required</span>}
    </form>
  );
}

/**
 * Create a form with React Hook Form and controlled components.
 * Integration with controlled inputs.
 *
 * Requirements:
 * - Form fields: title, description, category (select), tags (multi-input)
 * - Use Controller for controlled components
 * - Category select with options: tech, design, business
 * - Tags: custom TagInput component (controlled)
 * - Title and description use standard register
 * - All fields required
 * - Show character count for description (max 200)
 * - Character count: data-testid="char-count"
 * - Submit disabled if description > 200 chars
 *
 * TagInput props: value, onChange (array of strings)
 */
export function ReactHookFormControlled({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValidating, isValid, isSubmitted },
    control,
    watch
  } = useForm();

  const watchDescription = watch('description');

  function onSubmitForm(data) {
    if (isValid) {
      onSubmit(data);
    }
  }

  return (
    <form role="form" onSubmit={handleSubmit(onSubmitForm)}>
      <label htmlFor="title">Title</label>
      <input
        id="title"
        {...register('title', { required: true })}
        aria-invalid={errors.title ? 'true' : 'false'}
      />
      {errors.title?.message && (
        <span role="alert">{errors.title?.message}</span>
      )}

      <label htmlFor="description">Description</label>
      <input
        id="description"
        {...register('description', { required: true })}
        aria-invalid={errors.description ? 'true' : 'false'}
      />
      <p data-testid="char-count">
        Character count: {watchDescription?.length}
      </p>
      {errors.description?.message && (
        <span role="alert">{errors.description?.message}</span>
      )}

      <label htmlFor="category">Category</label>
      <Controller
        name="category"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <select {...field} id="category">
            <option value="tech">Tech</option>
            <option value="design">Design</option>
            <option value="business">Business</option>
          </select>
        )}
        aria-invalid={errors.category ? 'true' : 'false'}
      />
      {errors.category?.message && (
        <span role="alert">{errors.category?.message}</span>
      )}

      <label htmlFor="tags">Tags</label>
      <Controller
        name="tags"
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <TagInput value={value} onChange={onChange} id={'tags'} />
        )}
        aria-invalid={errors.tags ? 'true' : 'false'}
      />
      {errors.tags?.message && <span role="alert">{errors.tags?.message}</span>}

      <input type="submit" disabled={watchDescription?.length > 200} />
    </form>
  );
}

function TagInput({ value = [], onChange, id }) {
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = (event) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      event.preventDefault();
      if (!value.includes(inputValue.trim())) {
        onChange([...value, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div>
      <div>
        {value.map((tag, index) => (
          <div key={index}>
            <span>{tag}</span>
            <button type="button" onClick={() => handleRemoveTag(tag)}>
              &times;
            </button>
          </div>
        ))}
      </div>
      <input
        name={id}
        id={id}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleAddTag}
        placeholder="Type and press Enter"
      />
    </div>
  );
}

// =============================================================================
// EXERCISE 7: Zod validation
// =============================================================================

/**
 * Create a form with Zod schema validation.
 * Introduction to Zod validation library.
 *
 * Requirements:
 * - Install and import: z from 'zod'
 * - Define Zod schema for user registration
 * - Fields: username, email, password, age
 * - Schema validation rules:
 *   * username: string, min 3, max 20, alphanumeric
 *   * email: valid email format
 *   * password: min 8 chars, contains uppercase, number, special char
 *   * age: number, min 18, max 120
 * - Validate form data with schema.parse()
 * - Display validation errors
 * - Errors have data-testid="error-{fieldname}"
 * - Submit only if validation passes
 *
 * Example schema: z.object({ name: z.string().min(2) })
 */
const basicSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Too short' })
    .max(20, { message: 'Too long' })
    .refine((username) => /^\w+$/.test(username)),
  email: z.email(),
  password: z
    .string()
    .min(8, { message: 'Too short' })
    .refine((password) => /[A-Z]/.test(password))
    .refine((password) => /[0-9]/.test(password))
    .refine((password) => /[!@#$%^&*]/.test(password)),
  age: z.coerce
    .number()
    .gte(18, { message: 'Age must be at least 18' })
    .lte(120, { message: 'Age must be at less than 120' })
});

export function ZodBasicValidation({ onSubmit }) {
  const [errors, setErrors] = useState({});

  function handleSubmit(formData) {
    const data = Object.fromEntries(formData);

    const validation = basicSchema.safeParse(data);

    if (!validation.success) {
      const flattened = z.flattenError(validation.error);
      setErrors(flattened.fieldErrors);
    }

    if (validation.success) {
      onSubmit(data);
    }
  }

  return (
    <form role="form" action={handleSubmit}>
      <label htmlFor="username">Username</label>
      <input id="username" name="username" />
      {errors.username && (
        <span role="error" data-testid="error-username">
          {errors.username?.join('. ')}
        </span>
      )}

      <label htmlFor="email">Email</label>
      <input id="email" name="email" />
      {errors.email && (
        <span role="error" data-testid="error-email">
          {errors.email?.join('. ')}
        </span>
      )}

      <label htmlFor="password">Password</label>
      <input id="password" name="password" />
      {errors.password && (
        <span role="error" data-testid="error-password">
          {errors.password?.join('. ')}
        </span>
      )}

      <label htmlFor="age">Age</label>
      <input id="age" name="age" />
      {errors.age && (
        <span role="error" data-testid="error-age">
          {errors.age?.join('. ')}
        </span>
      )}

      <button type="submit">Submit</button>
    </form>
  );
}

/**
 * Create a form with Zod and React Hook Form integration.
 * Use zodResolver for seamless integration.
 *
 * Requirements:
 * - Install: @hookform/resolvers
 * - Import: zodResolver from '@hookform/resolvers/zod'
 * - Form fields: name, email, website, bio
 * - Zod schema validation:
 *   * name: required, min 2 chars
 *   * email: valid email
 *   * website: optional, but if provided must be valid URL
 *   * bio: optional, max 500 chars
 * - Use zodResolver in useForm
 * - Display validation errors from formState.errors
 * - Show remaining characters for bio: data-testid="bio-remaining"
 * - Submit button disabled during validation
 *
 * Integration: useForm({ resolver: zodResolver(schema) })
 */
const hookFormSchema = z.object({
  name: z.string().min(3, { message: 'Name required' }),
  email: z.email(),
  website: z.string().url().optional().or(z.literal('')),
  bio: z
    .string()
    .max(500, { message: 'Must be under 500 characters' })
    .optional()
});

export function ZodWithReactHookForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValidating },
    watch
  } = useForm({ resolver: zodResolver(hookFormSchema) });

  const watchBio = watch('bio');

  function onSubmitForm(data) {
    onSubmit(data);
  }

  return (
    <form role="form" onSubmit={handleSubmit(onSubmitForm)}>
      <label htmlFor="name">Name</label>
      <input id="name" {...register('name')} />
      {errors.name?.message && <span role="alert">{errors.name?.message}</span>}

      <label htmlFor="email">Email</label>
      <input id="email" {...register('email')} />
      {errors.email?.message && (
        <span role="alert">{errors.email?.message}</span>
      )}

      <label htmlFor="website">Website</label>
      <input id="website" {...register('website')} />
      {errors.website?.message && (
        <span role="alert">{errors.website?.message}</span>
      )}

      <label htmlFor="bio">Bio</label>
      <input id="bio" {...register('bio')} />
      <p data-testid="bio-remaining">
        Remaining characters: {500 - watchBio?.length}
      </p>
      {errors.bio?.message && <span role="alert">{errors.bio?.message}</span>}

      <button type="submit" disabled={isValidating}>
        Submit
      </button>
    </form>
  );
}

/**
 * Create a form with Zod custom refinements.
 * Advanced Zod validation patterns.
 *
 * Requirements:
 * - Form fields: password, confirmPassword, birthDate, agreeToTerms
 * - Zod schema with custom refinements:
 *   * password: min 8 chars, custom refine for strength (uppercase, number, special)
 *   * confirmPassword: must match password (use refine with path)
 *   * birthDate: must be at least 18 years ago (use refine)
 *   * agreeTerms: must be true (custom error message)
 * - Display custom error messages
 * - Use .refine() and .superRefine() methods
 * - Errors have data-testid="error-{fieldname}"
 * - Show specific error messages for each validation failure
 *
 * Refine syntax: .refine((data) => condition, { message, path })
 */
const customRefinedSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password is too short' })
      .refine((password) => /[A-Z]/.test(password), {
        message: 'Password must contain uppercase characters'
      })
      .refine((password) => /[0-9]/.test(password), {
        message: 'Password must contain numbers'
      })
      .refine((password) => /[!@#$%^&*]/.test(password), {
        message: 'Password must contain special characters'
      }),
    confirmPassword: z.string(),
    birthDate: z.string().refine(
      (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        const age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        const dayDiff = today.getDate() - birth.getDate();
        return (
          age > 18 ||
          (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)))
        );
      },
      { message: 'Must be at least 18 years old' }
    ),
    agreeToTerms: z.coerce.boolean().refine((value) => value === true, {
      message: 'You must agree to the terms and conditions'
    })
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        message: 'Passwords must match'
      });
    }
  });

export function ZodCustomRefinements({ onSubmit }) {
  const [errors, setErrors] = useState({});

  function handleSubmit(formData) {
    const data = Object.fromEntries(formData);
    const validation = customRefinedSchema.safeParse(data);

    if (!validation.success) {
      const flattened = z.flattenError(validation.error);
      setErrors(flattened.fieldErrors);
    }

    if (validation.success) {
      onSubmit(data);
    }
  }

  return (
    <form role="form" action={handleSubmit}>
      <label htmlFor="password">Password</label>
      <input id="password" name="password" />
      {errors.password && (
        <span role="error" data-testid="error-password">
          {errors.password?.join('. ')}
        </span>
      )}

      <label htmlFor="confirmPassword">Confirm password</label>
      <input id="confirmPassword" name="confirmPassword" />
      {errors.confirmPassword && (
        <span role="error" data-testid="error-confirmpassword">
          {errors.confirmPassword?.join('. ')}
        </span>
      )}

      <label htmlFor="birthDate">Birth date</label>
      <input id="birthDate" name="birthDate" type="date" />
      {errors.birthDate && (
        <span role="error" data-testid="error-birthdate">
          {errors.birthDate?.join('. ')}
        </span>
      )}

      <label htmlFor="agreeToTerms">Agree to terms</label>
      <input id="agreeToTerms" name="agreeToTerms" type="checkbox" />
      {errors.agreeToTerms && (
        <span role="error" data-testid="error-agreeterms">
          {errors.agreeToTerms?.join('. ')}
        </span>
      )}

      <button type="submit">Submit</button>
    </form>
  );
}

/**
 * Create a form with Zod transforms and preprocessing.
 * Data transformation with Zod.
 *
 * Requirements:
 * - Form fields: email, phone, price, tags (comma-separated string)
 * - Zod schema with transforms:
 *   * email: trim and lowercase before validation
 *   * phone: remove all non-numeric characters, then validate length
 *   * price: parse string to number, validate positive
 *   * tags: transform comma-separated string to array, trim each
 * - Display transformed values after validation: data-testid="transformed-data"
 * - Show original vs transformed side-by-side
 * - Submit transformed data
 *
 * Transform syntax: z.string().transform((val) => val.trim().toLowerCase())
 * Preprocess syntax: z.preprocess((val) => transform(val), z.string())
 */
const transformSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  phone: z.preprocess((val) => {
    if (typeof val !== 'string') return val;
    return val
      .split('')
      .filter((char) => /[0-9]/.test(char))
      .join('');
  }, z.string().length(10, { message: 'Phone must be exactly 10 digits' })),
  price: z.preprocess((val) => {
    if (typeof val === 'string') {
      return Number.parseFloat(val);
    }
    return val;
  }, z.number().positive({ message: 'Price must be positive' })),
  tags: z.string().transform((val) => {
    return val
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  })
});

export function ZodTransforms({ onSubmit }) {
  const [fields, setFields] = useState([]);
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({});
  const [transformedData, setTransformedData] = useState({});

  function handleSubmit(formData) {
    const data = Object.fromEntries(formData);
    const validation = transformSchema.safeParse(data);
    setData(data);
    setTransformedData(validation.data);

    if (!validation.success) {
      const flattened = z.flattenError(validation.error);
      setErrors(flattened.fieldErrors);
    }

    if (validation.success) {
      onSubmit(validation.data);
    }
  }

  return (
    <form role="form" action={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input id="email" name="email" />
      {errors.email && (
        <span role="error" data-testid="error-email">
          {errors.email?.join('. ')}
        </span>
      )}

      <label htmlFor="phone">Phone</label>
      <input id="phone" name="phone" />
      {errors.phone && (
        <span role="error" data-testid="error-phone">
          {errors.phone?.join('. ')}
        </span>
      )}

      <label htmlFor="price">Price</label>
      <input id="price" name="price" />
      {errors.price && (
        <span role="error" data-testid="error-price">
          {errors.price?.join('. ')}
        </span>
      )}

      <label htmlFor="tags">Tags</label>
      <TagInput value={fields} onChange={setFields} id={'tags'} />

      <button type="submit">Submit</button>

      <div data-testid="untransformed-data">{JSON.stringify(data)}</div>
      <div data-testid="transformed-data">
        {JSON.stringify(transformedData)}
      </div>
    </form>
  );
}

// =============================================================================
// Helper Functions (DO NOT MODIFY - Used by tests)
// =============================================================================

/**
 * Validate email format.
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate password strength.
 */
export function validatePassword(password) {
  const errors = [];
  if (password.length < 8)
    errors.push('Password must be at least 8 characters');
  if (!/[A-Z]/.test(password))
    errors.push('Password must contain uppercase letter');
  if (!/[0-9]/.test(password)) errors.push('Password must contain number');
  return errors;
}

/**
 * Format file size for display.
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Check string is alphanumeric
 */
function isAlphaNumeric(str) {
  return str
    .split('')
    .every(
      (char) =>
        (char >= 'A' && char <= 'Z') ||
        (char >= 'a' && char <= 'z') ||
        (char >= '0' && char <= '9')
    );
}
