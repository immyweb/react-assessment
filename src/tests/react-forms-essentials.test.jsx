/**
 * React Forms and Validation Tests
 *
 * Test suite for React forms exercises covering:
 * - Controlled form patterns
 * - Form validation strategies
 * - Dynamic form generation
 * - File upload handling
 * - Form state management
 * - Custom form hooks
 * - Accessibility in forms
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest';

import {
  ControlledForm,
  MultiInputForm,
  NestedStateForm,
  RealtimeValidationForm,
  TouchedValidationForm,
  AsyncValidationForm,
  SchemaValidationForm,
  AccessibleForm,
  KeyboardNavigationForm,
  LiveValidationForm,
  FocusTrapForm,
  UseFormStatusButton,
  MultiActionFormStatus,
  FormStatusWithIndicator,
  FormStatusWithData,
  UseActionStateBasic,
  MultiStepActionState,
  FieldErrorsActionState,
  ReactHookFormBasic,
  ReactHookFormCustomValidation,
  ReactHookFormFieldArray,
  ReactHookFormControlled,
  ZodBasicValidation,
  ZodWithReactHookForm,
  ZodCustomRefinements,
  ZodTransforms,
  isValidEmail,
  validatePassword,
  formatFileSize
} from '../exercises/react-forms-essentials';

// =============================================================================
// EXERCISE 1 TESTS: Controlled Form Patterns
// =============================================================================

describe('Exercise 1: Controlled Form Patterns', () => {
  describe('ControlledForm', () => {
    it('should render name, email, and message inputs', () => {
      render(<ControlledForm onSubmit={vi.fn()} />);
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(<ControlledForm onSubmit={vi.fn()} />);
      expect(
        screen.getByRole('button', { name: /submit/i })
      ).toBeInTheDocument();
    });

    it('should update input values when typing', async () => {
      const user = userEvent.setup();
      render(<ControlledForm onSubmit={vi.fn()} />);

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, 'John Doe');
      expect(nameInput).toHaveValue('John Doe');
    });

    it('should call onSubmit with form data', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<ControlledForm onSubmit={onSubmit} />);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/message/i), 'Hello World');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Hello World'
        })
      );
    });

    it('should clear form after submission', async () => {
      const user = userEvent.setup();
      render(<ControlledForm onSubmit={vi.fn()} />);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);

      await user.type(nameInput, 'Test');
      await user.type(emailInput, 'test@test.com');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(nameInput).toHaveValue('');
      expect(emailInput).toHaveValue('');
    });

    it('should prevent default form submission', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      const { container } = render(<ControlledForm onSubmit={onSubmit} />);

      const form = container.querySelector('form');
      const submitEvent = new Event('submit', {
        bubbles: true,
        cancelable: true
      });
      const preventDefaultSpy = vi.spyOn(submitEvent, 'preventDefault');

      form?.dispatchEvent(submitEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('MultiInputForm', () => {
    it('should render all input types', () => {
      render(<MultiInputForm onSubmit={vi.fn()} />);

      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/age/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/agree/i)).toBeInTheDocument();
    });

    it('should render radio buttons for role', () => {
      render(<MultiInputForm onSubmit={vi.fn()} />);
      expect(screen.getAllByLabelText(/user/i)[1]).toBeInTheDocument();
      expect(screen.getByLabelText(/admin/i)).toBeInTheDocument();
    });

    it('should handle checkbox changes', async () => {
      const user = userEvent.setup();
      render(<MultiInputForm onSubmit={vi.fn()} />);

      const checkbox = screen.getByLabelText(/agree/i);
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    it('should handle select dropdown changes', async () => {
      const user = userEvent.setup();
      render(<MultiInputForm onSubmit={vi.fn()} />);

      const select = screen.getByLabelText(/country/i);
      await user.selectOptions(select, 'UK');
      expect(select).toHaveValue('UK');
    });

    it('should disable submit button when terms not agreed', () => {
      render(<MultiInputForm onSubmit={vi.fn()} />);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).toBeDisabled();
    });

    it('should enable submit button when terms agreed', async () => {
      const user = userEvent.setup();
      render(<MultiInputForm onSubmit={vi.fn()} />);

      await user.click(screen.getByLabelText(/agree/i));
      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).not.toBeDisabled();
    });

    it('should submit all form data with correct types', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<MultiInputForm onSubmit={onSubmit} />);

      await user.type(screen.getByLabelText(/username/i), 'testuser');
      await user.type(screen.getByLabelText(/email/i), 'test@test.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.type(screen.getByLabelText(/age/i), '25');
      await user.selectOptions(screen.getByLabelText(/country/i), 'Canada');
      await user.click(screen.getByLabelText(/agree/i));
      await user.click(screen.getByLabelText(/admin/i));
      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          username: 'testuser',
          email: 'test@test.com',
          password: 'password123',
          age: 25,
          country: 'Canada',
          role: 'admin',
          agreed: true
        })
      );
    });
  });

  describe('NestedStateForm', () => {
    it('should render all inputs', () => {
      render(<NestedStateForm onSubmit={vi.fn()} />);
      expect(screen.getByLabelText(/first.*name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last.*name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    });

    it('should display current state as JSON', () => {
      render(<NestedStateForm onSubmit={vi.fn()} />);
      expect(screen.getByTestId('form-state')).toBeInTheDocument();
    });

    it('should update nested state correctly', async () => {
      const user = userEvent.setup();
      render(<NestedStateForm onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/first.*name/i), 'John');
      await user.type(screen.getByLabelText(/last.*name/i), 'Doe');

      const stateDisplay = screen.getByTestId('form-state');
      expect(stateDisplay.textContent).toContain('John');
      expect(stateDisplay.textContent).toContain('Doe');
    });

    it('should submit nested object structure', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<NestedStateForm onSubmit={onSubmit} />);

      await user.type(screen.getByLabelText(/first.*name/i), 'John');
      await user.type(screen.getByLabelText(/last.*name/i), 'Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@test.com');
      await user.type(screen.getByLabelText(/phone/i), '1234567890');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(onSubmit).toHaveBeenCalledWith({
        personal: { firstName: 'John', lastName: 'Doe' },
        contact: { email: 'john@test.com', phone: '1234567890' }
      });
    });
  });
});

// =============================================================================
// EXERCISE 2 TESTS: Form Validation Strategies
// =============================================================================

describe('Exercise 2: Form Validation Strategies', () => {
  describe('RealtimeValidationForm', () => {
    it('should show email validation error for invalid email', async () => {
      const user = userEvent.setup();
      render(<RealtimeValidationForm onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/email/i), 'invalid');
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });

    it('should show password length error', async () => {
      const user = userEvent.setup();
      render(<RealtimeValidationForm onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/password/i), 'short');
      expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
    });

    it('should show password uppercase error', async () => {
      const user = userEvent.setup();
      render(<RealtimeValidationForm onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/password/i), 'lowercase123');
      expect(screen.getByText(/uppercase/i)).toBeInTheDocument();
    });

    it('should show password number error', async () => {
      const user = userEvent.setup();
      render(<RealtimeValidationForm onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/password/i), 'NoNumbers');
      expect(screen.getByText(/number/i)).toBeInTheDocument();
    });

    it('should disable submit when form invalid', async () => {
      const user = userEvent.setup();
      render(<RealtimeValidationForm onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/email/i), 'invalid');
      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).toBeDisabled();
    });

    it('should enable submit when form valid', async () => {
      const user = userEvent.setup();
      render(<RealtimeValidationForm onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/email/i), 'valid@email.com');
      await user.type(screen.getByLabelText(/password/i), 'ValidPass123');

      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).not.toBeDisabled();
    });

    it('should have error className on error messages', async () => {
      const user = userEvent.setup();
      render(<RealtimeValidationForm onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/email/i), 'invalid');
      const errorElement = screen.getByText(/invalid email/i);
      expect(errorElement).toHaveClass('error');
    });
  });

  describe('TouchedValidationForm', () => {
    it('should not show errors initially', () => {
      render(<TouchedValidationForm onSubmit={vi.fn()} />);
      expect(screen.queryByText(/required/i)).not.toBeInTheDocument();
    });

    it('should show error only after field is touched (blurred)', async () => {
      const user = userEvent.setup();
      render(<TouchedValidationForm onSubmit={vi.fn()} />);

      const nameInput = screen.getByLabelText(/name/i);
      await user.click(nameInput);
      await user.tab(); // Blur the field

      expect(screen.getByText(/required|min.*2/i)).toBeInTheDocument();
    });

    it('should validate phone format if provided', async () => {
      const user = userEvent.setup();
      render(<TouchedValidationForm onSubmit={vi.fn()} />);

      const phoneInput = screen.getByLabelText(/phone/i);
      await user.type(phoneInput, 'invalid');
      await user.tab();

      expect(
        screen.getAllByText(/phone|format|pattern/i)[1]
      ).toBeInTheDocument();
    });

    it('should not validate optional empty fields', async () => {
      const user = userEvent.setup();
      render(<TouchedValidationForm onSubmit={vi.fn()} />);

      const phoneInput = screen.getByLabelText(/phone/i);
      await user.click(phoneInput);
      await user.tab();

      // Should not show error for empty optional field
      const errors = screen
        .queryAllByText(/phone/i)
        .filter((el) => el.classList.contains('error'));
      expect(errors.length).toBe(0);
    });

    it('should validate all fields on submit', async () => {
      const user = userEvent.setup();
      render(<TouchedValidationForm onSubmit={vi.fn()} />);

      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Should show errors for required fields even if not touched
      expect(screen.getByText(/name.*required|min.*2/i)).toBeInTheDocument();
      expect(screen.getByText(/email.*required|invalid/i)).toBeInTheDocument();
    });
  });

  describe('AsyncValidationForm', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should show checking status during validation', async () => {
      const user = userEvent.setup({ delay: null });
      render(<AsyncValidationForm onSubmit={vi.fn()} />);

      const usernameInput = screen.getByLabelText(/username/i);
      await user.type(usernameInput, 'testuser');
      await user.tab();

      expect(screen.getByTestId('validation-status')).toHaveTextContent(
        /checking/i
      );
    });

    it('should show username available for valid username', async () => {
      const user = userEvent.setup({ delay: null });
      render(<AsyncValidationForm onSubmit={vi.fn()} />);

      const usernameInput = screen.getByLabelText(/username/i);
      await user.type(usernameInput, 'validuser');
      await user.tab();

      vi.advanceTimersByTime(500);

      await waitFor(() => {
        expect(screen.getByTestId('validation-status')).toHaveTextContent(
          /available/i
        );
      });
    });

    it('should show username taken for reserved usernames', async () => {
      const user = userEvent.setup({ delay: null });
      render(<AsyncValidationForm onSubmit={vi.fn()} />);

      const usernameInput = screen.getByLabelText(/username/i);
      await user.type(usernameInput, 'admin');
      await user.tab();

      vi.advanceTimersByTime(500);

      await waitFor(() => {
        expect(screen.getByTestId('validation-status')).toHaveTextContent(
          /taken/i
        );
      });
    });

    it('should disable submit while checking', async () => {
      const user = userEvent.setup({ delay: null });
      render(<AsyncValidationForm onSubmit={vi.fn()} />);

      const usernameInput = screen.getByLabelText(/username/i);
      await user.type(usernameInput, 'testuser');
      await user.tab();

      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).toBeDisabled();
    });

    it('should disable submit if username taken', async () => {
      const user = userEvent.setup({ delay: null });
      render(<AsyncValidationForm onSubmit={vi.fn()} />);

      const usernameInput = screen.getByLabelText(/username/i);
      await user.type(usernameInput, 'user');
      await user.tab();

      vi.advanceTimersByTime(500);

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /submit/i });
        expect(submitButton).toBeDisabled();
      });
    });
  });
});

// =============================================================================
// EXERCISE 3 TESTS: Accessibility in Forms
// =============================================================================

describe('Exercise 3: Accessibility in Forms', () => {
  describe('AccessibleForm', () => {
    it('should have labels associated with inputs', () => {
      render(<AccessibleForm onSubmit={vi.fn()} />);

      const firstNameInput = screen.getByLabelText(/first.*name/i);
      expect(firstNameInput).toBeInTheDocument();
      expect(firstNameInput.id).toBeTruthy();
    });

    it('should mark required fields with aria-required', () => {
      render(<AccessibleForm onSubmit={vi.fn()} />);

      const firstNameInput = screen.getByLabelText(/first.*name/i);
      expect(firstNameInput).toHaveAttribute('aria-required', 'true');
    });

    it('should have error messages with role alert', async () => {
      const user = userEvent.setup();
      render(<AccessibleForm onSubmit={vi.fn()} />);

      await user.click(screen.getByRole('button', { name: /submit/i }));

      const alerts = screen.getAllByRole('alert');
      expect(alerts.length).toBeGreaterThan(0);
    });

    it('should associate errors with aria-describedby', async () => {
      const user = userEvent.setup();
      render(<AccessibleForm onSubmit={vi.fn()} />);

      await user.click(screen.getByRole('button', { name: /submit/i }));

      const firstNameInput = screen.getByLabelText(/first.*name/i);
      const describedBy = firstNameInput.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();
    });

    it('should use fieldset and legend for grouped inputs', () => {
      render(<AccessibleForm onSubmit={vi.fn()} />);
      const fieldsets = screen.getAllByRole('group');
      expect(fieldsets.length).toBeGreaterThan(0);
    });

    it('should show aria-busy on submit button while submitting', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );
      render(<AccessibleForm onSubmit={onSubmit} />);

      await user.type(screen.getByLabelText(/first.*name/i), 'John');
      await user.type(screen.getByLabelText(/email/i), 'john@test.com');

      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      expect(submitButton).toHaveAttribute('aria-busy', 'true');
    });
  });

  describe('KeyboardNavigationForm', () => {
    it('should show keyboard shortcuts hint', () => {
      render(<KeyboardNavigationForm onSubmit={vi.fn()} />);
      expect(screen.getByTestId('shortcuts-hint')).toBeInTheDocument();
    });

    it('should submit on Enter key', async () => {
      const onSubmit = vi.fn();
      render(<KeyboardNavigationForm onSubmit={onSubmit} />);

      const titleInput = screen.getByLabelText(/title/i);
      fireEvent.keyDown(titleInput, { key: 'Enter', code: 'Enter' });

      // Form should attempt to submit
      expect(onSubmit).toHaveBeenCalled();
    });

    it('should clear on Escape key', async () => {
      const user = userEvent.setup();
      render(<KeyboardNavigationForm onSubmit={vi.fn()} />);

      const titleInput = screen.getByLabelText(/title/i);
      await user.type(titleInput, 'Test');

      fireEvent.keyDown(titleInput, { key: 'Escape', code: 'Escape' });

      expect(titleInput).toHaveValue('');
    });

    it('should save draft on Ctrl+S / Cmd+S', () => {
      render(<KeyboardNavigationForm onSubmit={vi.fn()} />);

      const titleInput = screen.getByLabelText(/title/i);
      fireEvent.keyDown(titleInput, { key: 's', ctrlKey: true });

      // Should save to localStorage
      const saved = localStorage.getItem('form-draft');
      expect(saved).toBeTruthy();
    });
  });

  describe('LiveValidationForm', () => {
    it('should have live region for announcements', () => {
      render(<LiveValidationForm onSubmit={vi.fn()} />);
      const liveRegion = screen.getByTestId('live-region');
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    });

    it('should announce validation errors', async () => {
      const user = userEvent.setup();
      render(<LiveValidationForm onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/email/i), 'invalid');
      await user.tab();

      await waitFor(() => {
        const liveRegion = screen.getByTestId('live-region');
        expect(liveRegion.textContent).toMatch(/invalid|error/i);
      });
    });

    it('should announce successful validation', async () => {
      const user = userEvent.setup();
      render(<LiveValidationForm onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/email/i), 'valid@email.com');
      await user.tab();

      await waitFor(() => {
        const liveRegion = screen.getByTestId('live-region');
        expect(liveRegion.textContent).toMatch(/valid/i);
      });
    });
  });

  describe('FocusTrapForm', () => {
    it('should have dialog role when open', () => {
      render(
        <FocusTrapForm isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} />
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should have aria-modal attribute', () => {
      render(
        <FocusTrapForm isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} />
      );
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    it('should not render when closed', () => {
      render(
        <FocusTrapForm isOpen={false} onClose={vi.fn()} onSubmit={vi.fn()} />
      );
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should have close and submit buttons', () => {
      render(
        <FocusTrapForm isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} />
      );
      expect(
        screen.getByRole('button', { name: /close/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /submit/i })
      ).toBeInTheDocument();
    });

    it('should close on Escape key', () => {
      const onClose = vi.fn();
      render(
        <FocusTrapForm isOpen={true} onClose={onClose} onSubmit={vi.fn()} />
      );

      const dialog = screen.getByRole('dialog');
      fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' });

      expect(onClose).toHaveBeenCalled();
    });
  });
});

// =============================================================================
// EXERCISE 4 TESTS: useFormStatus
// =============================================================================

describe('Exercise 4: useFormStatus', () => {
  describe('UseFormStatusButton', () => {
    it('should render form with submit button', () => {
      render(<UseFormStatusButton />);
      expect(
        screen.getByRole('button', { name: /submit/i })
      ).toBeInTheDocument();
    });

    it('should show "Submitting..." when pending', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
      render(
        <form action={onSubmit}>
          <UseFormStatusButton />
        </form>
      );

      const button = screen.getByRole('button');
      await user.click(button);

      expect(screen.getByTestId('button-text')).toHaveTextContent(
        /submitting/i
      );
    });

    it('should disable button when pending', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
      render(
        <form action={onSubmit}>
          <UseFormStatusButton />
        </form>
      );

      const button = screen.getByRole('button');
      await user.click(button);

      expect(button).toBeDisabled();
    });

    it('should return to "Submit" after completion', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(
        <form action={onSubmit}>
          <UseFormStatusButton />
        </form>
      );

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByTestId('button-text')).toHaveTextContent(
          /^submit$/i
        );
      });
    });
  });

  describe('MultiActionFormStatus', () => {
    it('should render form with title and content inputs', () => {
      render(
        <MultiActionFormStatus onSaveDraft={vi.fn()} onPublish={vi.fn()} />
      );
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
    });

    it('should render save draft and publish buttons', () => {
      render(
        <MultiActionFormStatus onSaveDraft={vi.fn()} onPublish={vi.fn()} />
      );
      expect(screen.getByTestId('save-button')).toBeInTheDocument();
      expect(screen.getByTestId('publish-button')).toBeInTheDocument();
    });

    it('should show "Saving..." when save draft is clicked', async () => {
      const user = userEvent.setup();
      const onSaveDraft = vi.fn(
        (data) => new Promise((resolve) => setTimeout(() => resolve(data), 100))
      );
      render(
        <MultiActionFormStatus onSaveDraft={onSaveDraft} onPublish={vi.fn()} />
      );
      await user.type(screen.getByLabelText(/title/i), 'Example title');
      await user.type(screen.getByLabelText(/content/i), 'Example content');
      const saveButton = screen.getByTestId('save-button');
      await user.click(saveButton);

      expect(saveButton).toHaveTextContent(/saving/i);
    });

    it('should show "Publishing..." when publish is clicked', async () => {
      const user = userEvent.setup();
      const onPublish = vi.fn(
        (data) => new Promise((resolve) => setTimeout(() => resolve(data), 100))
      );
      render(
        <MultiActionFormStatus onSaveDraft={vi.fn()} onPublish={onPublish} />
      );

      await user.type(screen.getByLabelText(/title/i), 'Example title');
      await user.type(screen.getByLabelText(/content/i), 'Example content');
      const publishButton = screen.getByTestId('publish-button');
      await user.click(publishButton);

      expect(publishButton).toHaveTextContent(/publishing/i);
    });

    it('should disable both buttons when any action is pending', async () => {
      const user = userEvent.setup();
      const onSaveDraft = vi.fn(
        (data) => new Promise((resolve) => setTimeout(() => resolve(data), 100))
      );
      render(
        <MultiActionFormStatus onSaveDraft={onSaveDraft} onPublish={vi.fn()} />
      );

      await user.type(screen.getByLabelText(/title/i), 'Example title');
      await user.type(screen.getByLabelText(/content/i), 'Example content');
      const saveButton = screen.getByTestId('save-button');
      const publishButton = screen.getByTestId('publish-button');

      await user.click(saveButton);

      expect(saveButton).toBeDisabled();
      expect(publishButton).toBeDisabled();
    });
  });

  describe('FormStatusWithIndicator', () => {
    it('should render form with email and message inputs', () => {
      render(<FormStatusWithIndicator onSubmit={vi.fn()} />);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    });

    it('should not show loading indicator initially', () => {
      render(<FormStatusWithIndicator onSubmit={vi.fn()} />);
      const indicator = screen.queryByTestId('loading-indicator');
      expect(indicator).not.toBeInTheDocument();
    });

    it('should show loading indicator when form is pending', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn(
        () => new Promise((resolve) => setTimeout(resolve, 2000))
      );
      render(<FormStatusWithIndicator onSubmit={onSubmit} />);

      await user.type(screen.getByLabelText(/email/i), 'test@test.com');
      await user.type(screen.getByLabelText(/message/i), 'Example message');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(screen.getByTestId('loading-indicator')).toHaveTextContent(
        /processing/i
      );
    });

    it('should hide loading indicator after completion', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn(
        () => new Promise((resolve) => setTimeout(resolve, 500))
      );
      render(<FormStatusWithIndicator onSubmit={onSubmit} />);

      await user.type(screen.getByLabelText(/email/i), 'test@test.com');
      await user.type(screen.getByLabelText(/message/i), 'Example message');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(
        () => {
          expect(
            screen.queryByTestId('loading-indicator')
          ).not.toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });
  });

  describe('FormStatusWithData', () => {
    it('should render form with name, email, and phone inputs', () => {
      render(<FormStatusWithData onSubmit={vi.fn()} />);
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    });

    it('should not show status initially', () => {
      render(<FormStatusWithData onSubmit={vi.fn()} />);
      expect(screen.queryByTestId('form-status')).not.toBeInTheDocument();
    });

    it('should show submitted data while pending', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
      render(<FormStatusWithData onSubmit={onSubmit} />);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/phone/i), '1234567890');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      const status = screen.getByTestId('form-status');
      expect(status).toHaveTextContent(/submitting/i);
      expect(status).toHaveTextContent(/john doe/i);
      expect(status).toHaveTextContent(/john@example.com/i);
      expect(status).toHaveTextContent(/1234567890/i);
    });

    it('should clear status after submission completes', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<FormStatusWithData onSubmit={onSubmit} />);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.queryByTestId('form-status')).not.toBeInTheDocument();
      });
    });
  });
});

// =============================================================================
// EXERCISE 5 TESTS: useActionState
// =============================================================================

describe('Exercise 5: useActionState', () => {
  describe('UseActionStateBasic', () => {
    it('should render username and email inputs', () => {
      render(<UseActionStateBasic />);
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('should show success message on valid submission', async () => {
      const user = userEvent.setup();
      render(<UseActionStateBasic />);

      await user.type(screen.getByLabelText(/username/i), 'testuser');
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByTestId('success-message')).toBeInTheDocument();
      });
    });

    it('should show error for short username', async () => {
      const user = userEvent.setup();
      render(<UseActionStateBasic />);

      await user.type(screen.getByLabelText(/username/i), 'ab');
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent(
          /username/i
        );
      });
    });

    it('should show error for invalid email', async () => {
      const user = userEvent.setup();
      render(<UseActionStateBasic />);

      await user.type(screen.getByLabelText(/username/i), 'testuser');
      await user.type(screen.getByLabelText(/email/i), 'invalid-email');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent(/email/i);
      });
    });
  });

  describe('MultiStepActionState', () => {
    it('should start at step 1', () => {
      render(<MultiStepActionState onSubmit={vi.fn()} />);
      expect(screen.getByTestId('current-step')).toHaveTextContent('1');
    });

    it('should render step 1 fields', () => {
      render(<MultiStepActionState onSubmit={vi.fn()} />);
      expect(screen.getByLabelText(/first.*name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last.*name/i)).toBeInTheDocument();
    });

    it('should advance to step 2 with valid data', async () => {
      const user = userEvent.setup();
      render(<MultiStepActionState onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/first.*name/i), 'John');
      await user.type(screen.getByLabelText(/last.*name/i), 'Doe');
      await user.click(screen.getByRole('button', { name: /next/i }));

      await waitFor(() => {
        expect(screen.getByTestId('current-step')).toHaveTextContent('2');
      });
    });

    it('should show error if step 1 validation fails', async () => {
      const user = userEvent.setup();
      render(<MultiStepActionState onSubmit={vi.fn()} />);

      await user.click(screen.getByRole('button', { name: /next/i }));

      expect(screen.queryByTestId('current-step')).toHaveTextContent('1');
    });

    it('should go back from step 2 to step 1', async () => {
      const user = userEvent.setup();
      render(<MultiStepActionState onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/first.*name/i), 'John');
      await user.type(screen.getByLabelText(/last.*name/i), 'Doe');
      await user.click(screen.getByRole('button', { name: /next/i }));

      await waitFor(() => {
        expect(screen.getByTestId('current-step')).toHaveTextContent('2');
      });

      await user.click(screen.getByRole('button', { name: /back/i }));

      await waitFor(() => {
        expect(screen.getByTestId('current-step')).toHaveTextContent('1');
      });
    });

    it('should show review page at step 3', async () => {
      const user = userEvent.setup();
      render(<MultiStepActionState onSubmit={vi.fn()} />);

      // Step 1
      await user.type(screen.getByLabelText(/first.*name/i), 'John');
      await user.type(screen.getByLabelText(/last.*name/i), 'Doe');
      await user.click(screen.getByRole('button', { name: /next/i }));

      await waitFor(() => {
        expect(screen.getByTestId('current-step')).toHaveTextContent('2');
      });

      // Step 2
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/phone/i), '1234567890');
      await user.click(screen.getByRole('button', { name: /next/i }));

      await waitFor(() => {
        expect(screen.getByTestId('current-step')).toHaveTextContent('3');
      });
    });

    it('should call onSubmit with all data from review page', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<MultiStepActionState onSubmit={onSubmit} />);

      // Complete all steps
      await user.type(screen.getByLabelText(/first.*name/i), 'John');
      await user.type(screen.getByLabelText(/last.*name/i), 'Doe');
      await user.click(screen.getByRole('button', { name: /next/i }));

      await waitFor(() => screen.getByLabelText(/email/i));

      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/phone/i), '1234567890');
      await user.click(screen.getByRole('button', { name: /next/i }));

      await waitFor(() => screen.getByRole('button', { name: /submit/i }));

      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '1234567890'
        })
      );
    });
  });

  describe('FieldErrorsActionState', () => {
    it('should render all registration fields', () => {
      render(<FieldErrorsActionState onSubmit={vi.fn()} />);
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm.*password/i)).toBeInTheDocument();
    });

    it('should not show errors initially', () => {
      render(<FieldErrorsActionState onSubmit={vi.fn()} />);
      expect(screen.queryByTestId(/error-/)).not.toBeInTheDocument();
    });

    it('should show username error for short username', async () => {
      const user = userEvent.setup();
      render(<FieldErrorsActionState onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/username/i), 'ab');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByTestId('error-username')).toBeInTheDocument();
      });
    });

    it('should show email error for invalid email', async () => {
      const user = userEvent.setup();
      render(<FieldErrorsActionState onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/username/i), 'validuser');
      await user.type(screen.getByLabelText(/^email/i), 'invalid');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByTestId('error-email')).toBeInTheDocument();
      });
    });

    it('should show password error for weak password', async () => {
      const user = userEvent.setup();
      render(<FieldErrorsActionState onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/username/i), 'validuser');
      await user.type(screen.getByLabelText(/^email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/^password/i), 'weak');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByTestId('error-password')).toBeInTheDocument();
      });
    });

    it('should show error when passwords do not match', async () => {
      const user = userEvent.setup();
      render(<FieldErrorsActionState onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/username/i), 'validuser');
      await user.type(screen.getByLabelText(/^email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/^password/i), 'ValidPass123');
      await user.type(
        screen.getByLabelText(/confirm.*password/i),
        'DifferentPass123'
      );
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByTestId('error-confirmpassword')).toBeInTheDocument();
      });
    });

    it.skip('should clear errors on successful submission', async () => {
      const user = userEvent.setup();
      render(<FieldErrorsActionState onSubmit={vi.fn()} />);

      // First submit with errors
      await user.click(screen.getByRole('button', { name: /submit/i }));
      await waitFor(() => {
        expect(screen.queryByTestId(/error-/)).toBeInTheDocument();
      });

      // Then submit with valid data
      await user.type(screen.getByLabelText(/username/i), 'validuser123');
      await user.type(screen.getByLabelText(/^email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/^password/i), 'ValidPass123');
      await user.type(
        screen.getByLabelText(/confirm.*password/i),
        'ValidPass123'
      );
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.queryByTestId(/error-/)).not.toBeInTheDocument();
      });
    });
  });
});

// =============================================================================
// EXERCISE 6 TESTS: React Hook Form
// =============================================================================

describe('Exercise 6: React Hook Form', () => {
  describe('ReactHookFormBasic', () => {
    it('should render name, email, and age inputs', () => {
      render(<ReactHookFormBasic onSubmit={vi.fn()} />);
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/age/i)).toBeInTheDocument();
    });

    it('should show error for required name field', async () => {
      const user = userEvent.setup();
      render(<ReactHookFormBasic onSubmit={vi.fn()} />);

      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/name.*required/i)).toBeInTheDocument();
      });
    });

    it('should show error for name too short', async () => {
      const user = userEvent.setup();
      render(<ReactHookFormBasic onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/name/i), 'A');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/min.*2|at least 2/i)).toBeInTheDocument();
      });
    });

    it('should show error for invalid email pattern', async () => {
      const user = userEvent.setup();
      render(<ReactHookFormBasic onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/email/i), 'invalid-email');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid|pattern|email/i)).toBeInTheDocument();
      });
    });

    it('should show error for age below minimum', async () => {
      const user = userEvent.setup();
      render(<ReactHookFormBasic onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/age/i), '17');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/18|minimum/i)).toBeInTheDocument();
      });
    });

    it('should show error for age above maximum', async () => {
      const user = userEvent.setup();
      render(<ReactHookFormBasic onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/age/i), '101');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/100|maximum/i)).toBeInTheDocument();
      });
    });

    it('should submit with valid data', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<ReactHookFormBasic onSubmit={onSubmit} />);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/age/i), '25');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'John Doe',
            email: 'john@example.com',
            age: '25'
          })
        );
      });
    });
  });

  describe('ReactHookFormCustomValidation', () => {
    it('should render username, password, and confirmPassword inputs', () => {
      render(<ReactHookFormCustomValidation onSubmit={vi.fn()} />);
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm.*password/i)).toBeInTheDocument();
    });

    it('should show error for taken username', async () => {
      const user = userEvent.setup();
      render(<ReactHookFormCustomValidation onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/username/i), 'admin');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(
        () => {
          expect(screen.getByText(/taken|unavailable/i)).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it.skip('should show validating state while checking username', async () => {
      const user = userEvent.setup();
      render(<ReactHookFormCustomValidation onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/username/i), 'validuser');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
    });

    it('should show error for weak password', async () => {
      const user = userEvent.setup();
      render(<ReactHookFormCustomValidation onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/username/i), 'validuser');
      await user.type(screen.getByLabelText(/^password/i), 'weak');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/strong|strength|weak/i)).toBeInTheDocument();
      });
    });

    it('should show error when passwords do not match', async () => {
      const user = userEvent.setup();
      render(<ReactHookFormCustomValidation onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/username/i), 'validuser');
      await user.type(screen.getByLabelText(/^password/i), 'ValidPass123');
      await user.type(
        screen.getByLabelText(/confirm.*password/i),
        'Different123'
      );
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/match|same/i)).toBeInTheDocument();
      });
    });

    it('should show success message on valid submission', async () => {
      const user = userEvent.setup();
      render(<ReactHookFormCustomValidation onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/username/i), 'validuser');
      await user.type(screen.getByLabelText(/^password/i), 'ValidPass123!');
      await user.type(
        screen.getByLabelText(/confirm.*password/i),
        'ValidPass123!'
      );
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(
        () => {
          expect(screen.getByTestId('success')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });

  describe('ReactHookFormFieldArray', () => {
    it('should render name and email inputs', () => {
      render(<ReactHookFormFieldArray onSubmit={vi.fn()} />);
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('should render phone list', () => {
      render(<ReactHookFormFieldArray onSubmit={vi.fn()} />);
      expect(screen.getByTestId('phone-list')).toBeInTheDocument();
    });

    it('should start with one phone field', () => {
      render(<ReactHookFormFieldArray onSubmit={vi.fn()} />);
      expect(screen.getByTestId('phone-0')).toBeInTheDocument();
    });

    it('should add phone field when add button clicked', async () => {
      const user = userEvent.setup();
      render(<ReactHookFormFieldArray onSubmit={vi.fn()} />);

      const initialPhones = screen.getAllByLabelText(/number/i);
      const addButton = screen.getByTestId('add-phone');

      await user.click(addButton);

      const updatedPhones = screen.getAllByLabelText(/number/i);
      expect(updatedPhones.length).toBe(initialPhones.length + 1);
    });

    it('should remove phone field when remove button clicked', async () => {
      const user = userEvent.setup();
      render(<ReactHookFormFieldArray onSubmit={vi.fn()} />);

      // Add a phone first
      await user.click(screen.getByTestId('add-phone'));

      const phonesBeforeRemove = screen.getAllByLabelText(/number/i);
      const removeButton = screen.getByTestId('remove-phone-0');

      await user.click(removeButton);

      const phonesAfterRemove = screen.getAllByLabelText(/number/i);
      expect(phonesAfterRemove.length).toBe(phonesBeforeRemove.length - 1);
    });

    it('should validate at least one phone required', async () => {
      const user = userEvent.setup();
      render(<ReactHookFormFieldArray onSubmit={vi.fn()} />);

      // Remove the default phone
      const removeButton = screen.getByTestId('remove-phone-0');
      await user.click(removeButton);

      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/at least.*phone|phone required/i)
        ).toBeInTheDocument();
      });
    });

    it('should validate phone number format', async () => {
      const user = userEvent.setup();
      render(<ReactHookFormFieldArray onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/number/i), 'invalid');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/pattern|format|invalid/i)).toBeInTheDocument();
      });
    });
  });

  describe('ReactHookFormControlled', () => {
    it('should render title and description inputs', () => {
      render(<ReactHookFormControlled onSubmit={vi.fn()} />);
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    });

    it('should render category select', () => {
      render(<ReactHookFormControlled onSubmit={vi.fn()} />);
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    });

    it('should render tags input', () => {
      render(<ReactHookFormControlled onSubmit={vi.fn()} />);
      expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
    });

    it('should show character count for description', () => {
      render(<ReactHookFormControlled onSubmit={vi.fn()} />);
      expect(screen.getByTestId('char-count')).toBeInTheDocument();
    });

    it('should update character count as user types', async () => {
      const user = userEvent.setup();
      render(<ReactHookFormControlled onSubmit={vi.fn()} />);

      const description = screen.getByLabelText(/description/i);
      await user.type(description, 'Test description');

      const charCount = screen.getByTestId('char-count');
      expect(charCount.textContent).toMatch(/16|184/); // 16 used or 184 remaining
    });

    it('should disable submit if description exceeds 200 chars', async () => {
      const user = userEvent.setup();
      render(<ReactHookFormControlled onSubmit={vi.fn()} />);

      const longText = 'a'.repeat(201);
      await user.type(screen.getByLabelText(/description/i), longText);

      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).toBeDisabled();
    });

    it('should handle category selection', async () => {
      const user = userEvent.setup();
      render(<ReactHookFormControlled onSubmit={vi.fn()} />);

      const category = screen.getByLabelText(/category/i);
      await user.selectOptions(category, 'design');

      expect(category).toHaveValue('design');
    });
  });
});

// =============================================================================
// EXERCISE 7 TESTS: Zod Validation
// =============================================================================

describe('Exercise 7: Zod Validation', () => {
  describe('ZodBasicValidation', () => {
    it('should render all registration fields', () => {
      render(<ZodBasicValidation onSubmit={vi.fn()} />);
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/age/i)).toBeInTheDocument();
    });

    it('should show error for short username', async () => {
      const user = userEvent.setup();
      render(<ZodBasicValidation onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/username/i), 'ab');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByTestId('error-username')).toBeInTheDocument();
      });
    });

    it('should show error for long username', async () => {
      const user = userEvent.setup();
      render(<ZodBasicValidation onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/username/i), 'a'.repeat(21));
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByTestId('error-username')).toBeInTheDocument();
      });
    });

    it('should show error for non-alphanumeric username', async () => {
      const user = userEvent.setup();
      render(<ZodBasicValidation onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/username/i), 'user@123');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByTestId('error-username')).toBeInTheDocument();
      });
    });

    it('should show error for invalid email', async () => {
      const user = userEvent.setup();
      render(<ZodBasicValidation onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/email/i), 'invalid-email');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByTestId('error-email')).toBeInTheDocument();
      });
    });

    it('should show error for weak password', async () => {
      const user = userEvent.setup();
      render(<ZodBasicValidation onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/password/i), 'weak');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByTestId('error-password')).toBeInTheDocument();
      });
    });

    it('should show error for age below minimum', async () => {
      const user = userEvent.setup();
      render(<ZodBasicValidation onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/age/i), '17');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByTestId('error-age')).toBeInTheDocument();
      });
    });

    it('should submit with valid data', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<ZodBasicValidation onSubmit={onSubmit} />);

      await user.type(screen.getByLabelText(/username/i), 'validuser123');
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'ValidPass123!');
      await user.type(screen.getByLabelText(/age/i), '25');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled();
      });
    });
  });

  describe('ZodWithReactHookForm', () => {
    it('should render name, email, website, and bio fields', () => {
      render(<ZodWithReactHookForm onSubmit={vi.fn()} />);
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/website/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/bio/i)).toBeInTheDocument();
    });

    it('should show remaining characters for bio', () => {
      render(<ZodWithReactHookForm onSubmit={vi.fn()} />);
      expect(screen.getByTestId('bio-remaining')).toBeInTheDocument();
    });

    it('should update remaining characters as user types bio', async () => {
      const user = userEvent.setup();
      render(<ZodWithReactHookForm onSubmit={vi.fn()} />);

      const bio = screen.getByLabelText(/bio/i);
      await user.type(bio, 'Test bio content');

      const remaining = screen.getByTestId('bio-remaining');
      expect(remaining.textContent).toMatch(/484|16/); // 484 remaining or 16 used
    });

    it('should validate required name field', async () => {
      const user = userEvent.setup();
      render(<ZodWithReactHookForm onSubmit={vi.fn()} />);

      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/name.*required/i)).toBeInTheDocument();
      });
    });

    it('should validate email format', async () => {
      const user = userEvent.setup();
      render(<ZodWithReactHookForm onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/email/i), 'invalid-email');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/email.*invalid|valid email/i)
        ).toBeInTheDocument();
      });
    });

    it('should validate website URL if provided', async () => {
      const user = userEvent.setup();
      render(<ZodWithReactHookForm onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/website/i), 'not-a-url');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/url|website.*invalid/i)).toBeInTheDocument();
      });
    });

    it('should validate bio max length', async () => {
      const user = userEvent.setup();
      render(<ZodWithReactHookForm onSubmit={vi.fn()} />);

      const longBio = 'a'.repeat(501);
      await user.type(screen.getByLabelText(/bio/i), longBio);
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/500|max.*500/i)).toBeInTheDocument();
      });
    });

    it('should allow optional fields to be empty', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<ZodWithReactHookForm onSubmit={onSubmit} />);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled();
      });
    });
  });

  describe('ZodCustomRefinements', () => {
    it('should render password, confirmPassword, birthDate, and agreeTerms', () => {
      render(<ZodCustomRefinements onSubmit={vi.fn()} />);
      expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm.*password/i)).toBeInTheDocument();
      expect(
        screen.getByLabelText(/birth.*date|date.*birth/i)
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/agree.*terms|terms/i)).toBeInTheDocument();
    });

    it('should show error for weak password', async () => {
      const user = userEvent.setup();
      render(<ZodCustomRefinements onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/^password/i), 'weak');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByTestId('error-password')).toBeInTheDocument();
      });
    });

    it('should show error when passwords do not match', async () => {
      const user = userEvent.setup();
      render(<ZodCustomRefinements onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/^password/i), 'ValidPass123!');
      await user.type(
        screen.getByLabelText(/confirm.*password/i),
        'Different123!'
      );
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByTestId('error-confirmpassword')).toBeInTheDocument();
      });
    });

    it('should show error for age under 18', async () => {
      const user = userEvent.setup();
      render(<ZodCustomRefinements onSubmit={vi.fn()} />);

      // Calculate date for 17 years ago
      const date = new Date();
      date.setFullYear(date.getFullYear() - 17);
      const dateString = date.toISOString().split('T')[0];

      await user.type(
        screen.getByLabelText(/birth.*date|date.*birth/i),
        dateString
      );
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByTestId('error-birthdate')).toBeInTheDocument();
      });
    });

    it('should show error if terms not agreed', async () => {
      const user = userEvent.setup();
      render(<ZodCustomRefinements onSubmit={vi.fn()} />);

      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByTestId('error-agreeterms')).toBeInTheDocument();
      });
    });

    it('should submit with valid data', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<ZodCustomRefinements onSubmit={onSubmit} />);

      // Calculate date for 25 years ago
      const date = new Date();
      date.setFullYear(date.getFullYear() - 25);
      const dateString = date.toISOString().split('T')[0];

      await user.type(screen.getByLabelText(/^password/i), 'ValidPass123!');
      await user.type(
        screen.getByLabelText(/confirm.*password/i),
        'ValidPass123!'
      );
      await user.type(
        screen.getByLabelText(/birth.*date|date.*birth/i),
        dateString
      );
      await user.click(screen.getByLabelText(/agree.*terms|terms/i));
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled();
      });
    });
  });

  describe('ZodTransforms', () => {
    it('should render email, phone, price, and tags fields', () => {
      render(<ZodTransforms onSubmit={vi.fn()} />);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
    });

    it('should display transformed data', () => {
      render(<ZodTransforms onSubmit={vi.fn()} />);
      expect(screen.getByTestId('transformed-data')).toBeInTheDocument();
    });

    it('should transform email to lowercase', async () => {
      const user = userEvent.setup();
      render(<ZodTransforms onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/email/i), 'TEST@EXAMPLE.COM');
      await user.type(screen.getByLabelText(/phone/i), '1234567890');
      await user.type(screen.getByLabelText(/price/i), '99.99');
      await user.type(screen.getByLabelText(/tags/i), 'tag1,tag2');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        const transformed = screen.getByTestId('transformed-data');
        expect(transformed.textContent).toContain('test@example.com');
      });
    });

    it('should remove non-numeric characters from phone', async () => {
      const user = userEvent.setup();
      render(<ZodTransforms onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/phone/i), '(123) 456-7890');
      await user.type(screen.getByLabelText(/price/i), '99.99');
      await user.type(screen.getByLabelText(/tags/i), 'tag1');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        const transformed = screen.getByTestId('transformed-data');
        expect(transformed.textContent).toMatch(/1234567890/);
      });
    });

    it('should parse price to number', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<ZodTransforms onSubmit={onSubmit} />);

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/phone/i), '1234567890');
      await user.type(screen.getByLabelText(/price/i), '99.99');
      await user.type(screen.getByLabelText(/tags/i), 'tag1');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            price: expect.any(Number)
          })
        );
      });
    });

    it('should transform comma-separated tags to array', async () => {
      const user = userEvent.setup();
      render(<ZodTransforms onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/phone/i), '1234567890');
      await user.type(screen.getByLabelText(/price/i), '99.99');

      await user.type(
        screen.getByLabelText(/tags/i),
        'react, javascript, typescript'
      );
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        const transformed = screen.getByTestId('transformed-data');
        expect(transformed.textContent).toMatch(
          /\["react","javascript","typescript"\]|\[react,javascript,typescript\]/
        );
      });
    });

    it('should trim whitespace from tags', async () => {
      const user = userEvent.setup();
      render(<ZodTransforms onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/phone/i), '1234567890');
      await user.type(screen.getByLabelText(/price/i), '99.99');
      await user.type(screen.getByLabelText(/tags/i), ' tag1 , tag2 , tag3 ');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        const transformed = screen.getByTestId('transformed-data');
        const content = transformed.textContent;
        expect(content).not.toContain(' tag1 ');
        expect(content).toMatch(/tag1/);
      });
    });
  });
});
