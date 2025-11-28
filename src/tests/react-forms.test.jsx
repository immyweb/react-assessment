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

import React from 'react';
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
  DynamicFormGenerator,
  RepeatableFieldForm,
  ConditionalForm,
  MultiStepForm,
  FileUploadForm,
  MultiFileUploadForm,
  DragDropUploadForm,
  ReducerForm,
  UndoRedoForm,
  AutoSaveForm,
  useForm,
  useFieldValidation,
  FormWithCustomHook,
  useFileInput,
  AccessibleForm,
  KeyboardNavigationForm,
  LiveValidationForm,
  FocusTrapForm,
  isValidEmail,
  validatePassword,
  formatFileSize
} from '../exercises/react-forms';

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
      expect(screen.getByLabelText(/user/i)).toBeInTheDocument();
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

      expect(screen.getByText(/phone|format|pattern/i)).toBeInTheDocument();
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

  describe('SchemaValidationForm', () => {
    it('should validate all fields on submit', async () => {
      const user = userEvent.setup();
      render(<SchemaValidationForm onSubmit={vi.fn()} />);

      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(screen.getByTestId('error-email')).toBeInTheDocument();
      expect(screen.getByTestId('error-password')).toBeInTheDocument();
      expect(screen.getByTestId('error-confirmPassword')).toBeInTheDocument();
    });

    it('should show email format error', async () => {
      const user = userEvent.setup();
      render(<SchemaValidationForm onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/^email/i), 'invalid');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      const emailError = screen.getByTestId('error-email');
      expect(emailError.textContent).toMatch(/email|format|valid/i);
    });

    it('should show password mismatch error', async () => {
      const user = userEvent.setup();
      render(<SchemaValidationForm onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/^password/i), 'Password123');
      await user.type(screen.getByLabelText(/confirm/i), 'Different123');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      const confirmError = screen.getByTestId('error-confirmPassword');
      expect(confirmError.textContent).toMatch(/match/i);
    });

    it('should call onSubmit when form is valid', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<SchemaValidationForm onSubmit={onSubmit} />);

      await user.type(screen.getByLabelText(/^email/i), 'valid@email.com');
      await user.type(screen.getByLabelText(/^password/i), 'Password123');
      await user.type(screen.getByLabelText(/confirm/i), 'Password123');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(onSubmit).toHaveBeenCalled();
    });
  });
});

// =============================================================================
// EXERCISE 3 TESTS: Dynamic Form Generation
// =============================================================================

describe('Exercise 3: Dynamic Form Generation', () => {
  describe('DynamicFormGenerator', () => {
    const fields = [
      { name: 'username', label: 'Username', type: 'text', required: true },
      { name: 'age', label: 'Age', type: 'number', required: false },
      { name: 'bio', label: 'Bio', type: 'textarea', required: false },
      {
        name: 'country',
        label: 'Country',
        type: 'select',
        options: ['US', 'UK', 'Canada']
      }
    ];

    it('should render all fields from config', () => {
      render(<DynamicFormGenerator fields={fields} onSubmit={vi.fn()} />);

      expect(screen.getByLabelText('Username')).toBeInTheDocument();
      expect(screen.getByLabelText('Age')).toBeInTheDocument();
      expect(screen.getByLabelText('Bio')).toBeInTheDocument();
      expect(screen.getByLabelText('Country')).toBeInTheDocument();
    });

    it('should render correct input types', () => {
      render(<DynamicFormGenerator fields={fields} onSubmit={vi.fn()} />);

      expect(screen.getByLabelText('Username')).toHaveAttribute('type', 'text');
      expect(screen.getByLabelText('Age')).toHaveAttribute('type', 'number');
      expect(screen.getByLabelText('Bio').tagName).toBe('TEXTAREA');
      expect(screen.getByLabelText('Country').tagName).toBe('SELECT');
    });

    it('should handle form submission with dynamic data', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<DynamicFormGenerator fields={fields} onSubmit={onSubmit} />);

      await user.type(screen.getByLabelText('Username'), 'testuser');
      await user.type(screen.getByLabelText('Age'), '25');
      await user.selectOptions(screen.getByLabelText('Country'), 'UK');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          username: 'testuser',
          age: '25',
          country: 'UK'
        })
      );
    });

    it('should handle empty fields array', () => {
      render(<DynamicFormGenerator fields={[]} onSubmit={vi.fn()} />);
      expect(
        screen.getByRole('button', { name: /submit/i })
      ).toBeInTheDocument();
    });
  });

  describe('RepeatableFieldForm', () => {
    it('should render one entry initially', () => {
      render(<RepeatableFieldForm onSubmit={vi.fn()} />);
      expect(screen.getAllByTestId('experience-entry')).toHaveLength(1);
    });

    it('should have add button', () => {
      render(<RepeatableFieldForm onSubmit={vi.fn()} />);
      expect(
        screen.getByRole('button', { name: /add.*experience/i })
      ).toBeInTheDocument();
    });

    it('should add new entry when add button clicked', async () => {
      const user = userEvent.setup();
      render(<RepeatableFieldForm onSubmit={vi.fn()} />);

      await user.click(
        screen.getByRole('button', { name: /add.*experience/i })
      );
      expect(screen.getAllByTestId('experience-entry')).toHaveLength(2);
    });

    it('should have remove button for each entry', async () => {
      const user = userEvent.setup();
      render(<RepeatableFieldForm onSubmit={vi.fn()} />);

      await user.click(
        screen.getByRole('button', { name: /add.*experience/i })
      );
      const removeButtons = screen.getAllByRole('button', { name: /remove/i });
      expect(removeButtons.length).toBeGreaterThan(0);
    });

    it('should remove entry when remove button clicked', async () => {
      const user = userEvent.setup();
      render(<RepeatableFieldForm onSubmit={vi.fn()} />);

      await user.click(
        screen.getByRole('button', { name: /add.*experience/i })
      );
      await user.click(
        screen.getByRole('button', { name: /add.*experience/i })
      );

      expect(screen.getAllByTestId('experience-entry')).toHaveLength(3);

      const removeButtons = screen.getAllByRole('button', { name: /remove/i });
      await user.click(removeButtons[0]);

      expect(screen.getAllByTestId('experience-entry')).toHaveLength(2);
    });

    it('should submit array of experiences', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<RepeatableFieldForm onSubmit={onSubmit} />);

      const companyInputs = screen.getAllByLabelText(/company/i);
      await user.type(companyInputs[0], 'Acme Corp');

      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(onSubmit).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ company: 'Acme Corp' })
        ])
      );
    });
  });

  describe('ConditionalForm', () => {
    it('should render account type select', () => {
      render(<ConditionalForm onSubmit={vi.fn()} />);
      expect(screen.getByLabelText(/account.*type/i)).toBeInTheDocument();
    });

    it('should show date of birth for personal account', async () => {
      const user = userEvent.setup();
      render(<ConditionalForm onSubmit={vi.fn()} />);

      await user.selectOptions(
        screen.getByLabelText(/account.*type/i),
        'personal'
      );
      expect(screen.getByTestId('dateOfBirth')).toBeInTheDocument();
    });

    it('should show company fields for business account', async () => {
      const user = userEvent.setup();
      render(<ConditionalForm onSubmit={vi.fn()} />);

      await user.selectOptions(
        screen.getByLabelText(/account.*type/i),
        'business'
      );
      expect(screen.getByTestId('companyName')).toBeInTheDocument();
      expect(screen.getByTestId('taxId')).toBeInTheDocument();
    });

    it('should not show personal fields for business account', async () => {
      const user = userEvent.setup();
      render(<ConditionalForm onSubmit={vi.fn()} />);

      await user.selectOptions(
        screen.getByLabelText(/account.*type/i),
        'business'
      );
      expect(screen.queryByTestId('dateOfBirth')).not.toBeInTheDocument();
    });

    it('should submit only relevant fields', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<ConditionalForm onSubmit={onSubmit} />);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.selectOptions(
        screen.getByLabelText(/account.*type/i),
        'business'
      );
      await user.type(screen.getByTestId('companyName'), 'Acme Inc');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          accountType: 'business',
          companyName: 'Acme Inc'
        })
      );
    });
  });

  describe('MultiStepForm', () => {
    it('should show step 1 initially', () => {
      render(<MultiStepForm onSubmit={vi.fn()} />);
      expect(screen.getByTestId('current-step')).toHaveTextContent('1');
    });

    it('should render first and last name inputs on step 1', () => {
      render(<MultiStepForm onSubmit={vi.fn()} />);
      expect(screen.getByLabelText(/first.*name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last.*name/i)).toBeInTheDocument();
    });

    it('should have next and previous buttons', () => {
      render(<MultiStepForm onSubmit={vi.fn()} />);
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /previous/i })
      ).toBeInTheDocument();
    });

    it('should disable previous button on first step', () => {
      render(<MultiStepForm onSubmit={vi.fn()} />);
      expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
    });

    it('should advance to step 2 when next clicked', async () => {
      const user = userEvent.setup();
      render(<MultiStepForm onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/first.*name/i), 'John');
      await user.type(screen.getByLabelText(/last.*name/i), 'Doe');
      await user.click(screen.getByRole('button', { name: /next/i }));

      expect(screen.getByTestId('current-step')).toHaveTextContent('2');
    });

    it('should show email and phone on step 2', async () => {
      const user = userEvent.setup();
      render(<MultiStepForm onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/first.*name/i), 'John');
      await user.type(screen.getByLabelText(/last.*name/i), 'Doe');
      await user.click(screen.getByRole('button', { name: /next/i }));

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    });

    it('should show submit button on review step', async () => {
      const user = userEvent.setup();
      render(<MultiStepForm onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/first.*name/i), 'John');
      await user.type(screen.getByLabelText(/last.*name/i), 'Doe');
      await user.click(screen.getByRole('button', { name: /next/i }));

      await user.type(screen.getByLabelText(/email/i), 'john@test.com');
      await user.type(screen.getByLabelText(/phone/i), '1234567890');
      await user.click(screen.getByRole('button', { name: /next/i }));

      expect(
        screen.getByRole('button', { name: /submit/i })
      ).toBeInTheDocument();
    });

    it('should go back to previous step', async () => {
      const user = userEvent.setup();
      render(<MultiStepForm onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/first.*name/i), 'John');
      await user.click(screen.getByRole('button', { name: /next/i }));
      await user.click(screen.getByRole('button', { name: /previous/i }));

      expect(screen.getByTestId('current-step')).toHaveTextContent('1');
    });
  });
});

// =============================================================================
// EXERCISE 4 TESTS: File Upload Handling
// =============================================================================

describe('Exercise 4: File Upload Handling', () => {
  describe('FileUploadForm', () => {
    it('should render file input', () => {
      render(<FileUploadForm onSubmit={vi.fn()} />);
      const input = screen.getByLabelText(/file|upload|image/i);
      expect(input).toHaveAttribute('type', 'file');
    });

    it('should accept only images', () => {
      render(<FileUploadForm onSubmit={vi.fn()} />);
      const input = screen.getByLabelText(/file|upload|image/i);
      const accept = input.getAttribute('accept');
      expect(accept).toMatch(/\.jpg|\.png|\.gif|image/i);
    });

    it('should display file name when file selected', async () => {
      const user = userEvent.setup();
      render(<FileUploadForm onSubmit={vi.fn()} />);

      const file = new File(['hello'], 'hello.png', { type: 'image/png' });
      const input = screen.getByLabelText(/file|upload|image/i);

      await user.upload(input, file);

      expect(screen.getByTestId('file-name')).toHaveTextContent('hello.png');
    });

    it('should show file preview', async () => {
      const user = userEvent.setup();
      render(<FileUploadForm onSubmit={vi.fn()} />);

      const file = new File(['hello'], 'hello.png', { type: 'image/png' });
      const input = screen.getByLabelText(/file|upload|image/i);

      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByTestId('file-preview')).toBeInTheDocument();
      });
    });

    it('should have clear button', async () => {
      const user = userEvent.setup();
      render(<FileUploadForm onSubmit={vi.fn()} />);

      const file = new File(['hello'], 'hello.png', { type: 'image/png' });
      await user.upload(screen.getByLabelText(/file|upload|image/i), file);

      expect(
        screen.getByRole('button', { name: /clear/i })
      ).toBeInTheDocument();
    });

    it('should clear file when clear button clicked', async () => {
      const user = userEvent.setup();
      render(<FileUploadForm onSubmit={vi.fn()} />);

      const file = new File(['hello'], 'hello.png', { type: 'image/png' });
      await user.upload(screen.getByLabelText(/file|upload|image/i), file);
      await user.click(screen.getByRole('button', { name: /clear/i }));

      expect(screen.queryByTestId('file-name')).not.toBeInTheDocument();
    });
  });

  describe('MultiFileUploadForm', () => {
    it('should render file input with multiple attribute', () => {
      render(<MultiFileUploadForm onSubmit={vi.fn()} />);
      const input = screen.getByLabelText(/file|upload/i);
      expect(input).toHaveAttribute('multiple');
    });

    it('should accept only images', () => {
      render(<MultiFileUploadForm onSubmit={vi.fn()} />);
      const input = screen.getByLabelText(/file|upload/i);
      expect(input.getAttribute('accept')).toMatch(/image/i);
    });

    it('should display list of selected files', async () => {
      const user = userEvent.setup();
      render(<MultiFileUploadForm onSubmit={vi.fn()} />);

      const files = [
        new File(['file1'], 'file1.png', { type: 'image/png' }),
        new File(['file2'], 'file2.jpg', { type: 'image/jpeg' })
      ];

      const input = screen.getByLabelText(/file|upload/i);
      await user.upload(input, files);

      expect(screen.getAllByTestId('file-item')).toHaveLength(2);
    });

    it('should show error for files exceeding size limit', async () => {
      const user = userEvent.setup();
      render(<MultiFileUploadForm onSubmit={vi.fn()} />);

      // Create file larger than 2MB
      const largeFile = new File(['x'.repeat(3000000)], 'large.png', {
        type: 'image/png'
      });

      const input = screen.getByLabelText(/file|upload/i);
      await user.upload(input, largeFile);

      expect(screen.getByTestId('upload-error')).toBeInTheDocument();
    });

    it('should allow removing individual files', async () => {
      const user = userEvent.setup();
      render(<MultiFileUploadForm onSubmit={vi.fn()} />);

      const files = [
        new File(['file1'], 'file1.png', { type: 'image/png' }),
        new File(['file2'], 'file2.png', { type: 'image/png' })
      ];

      await user.upload(screen.getByLabelText(/file|upload/i), files);

      const removeButtons = screen.getAllByRole('button', { name: /remove/i });
      await user.click(removeButtons[0]);

      expect(screen.getAllByTestId('file-item')).toHaveLength(1);
    });
  });

  describe('DragDropUploadForm', () => {
    it('should render drop zone', () => {
      render(<DragDropUploadForm onSubmit={vi.fn()} />);
      expect(screen.getByText(/drop.*here|click.*upload/i)).toBeInTheDocument();
    });

    it('should accept only PDF files', () => {
      const { container } = render(<DragDropUploadForm onSubmit={vi.fn()} />);
      const input = container.querySelector('input[type="file"]');
      expect(input?.getAttribute('accept')).toMatch(/\.pdf|application\/pdf/i);
    });

    it('should add drag-over class on drag over', () => {
      const { container } = render(<DragDropUploadForm onSubmit={vi.fn()} />);
      const dropZone = container.querySelector('[class*="drop"]');

      fireEvent.dragOver(dropZone);
      expect(dropZone).toHaveClass('drag-over');
    });

    it('should remove drag-over class on drag leave', () => {
      const { container } = render(<DragDropUploadForm onSubmit={vi.fn()} />);
      const dropZone = container.querySelector('[class*="drop"]');

      fireEvent.dragOver(dropZone);
      fireEvent.dragLeave(dropZone);

      expect(dropZone).not.toHaveClass('drag-over');
    });

    it('should handle file drop', () => {
      const { container } = render(<DragDropUploadForm onSubmit={vi.fn()} />);
      const dropZone = container.querySelector('[class*="drop"]');

      const file = new File(['content'], 'test.pdf', {
        type: 'application/pdf'
      });
      const dataTransfer = { files: [file] };

      fireEvent.drop(dropZone, { dataTransfer });

      expect(screen.getByText(/test\.pdf/i)).toBeInTheDocument();
    });
  });
});

// =============================================================================
// EXERCISE 5 TESTS: Form State Management
// =============================================================================

describe('Exercise 5: Form State Management', () => {
  describe('ReducerForm', () => {
    it('should render form inputs', () => {
      render(<ReducerForm onSubmit={vi.fn()} />);
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('should update state on input change', async () => {
      const user = userEvent.setup();
      render(<ReducerForm onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/username/i), 'testuser');
      expect(screen.getByLabelText(/username/i)).toHaveValue('testuser');
    });

    it('should disable submit while submitting', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );
      render(<ReducerForm onSubmit={onSubmit} />);

      await user.type(screen.getByLabelText(/username/i), 'test');
      await user.type(screen.getByLabelText(/email/i), 'test@test.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');

      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();
    });

    it('should show validation errors', async () => {
      const user = userEvent.setup();
      render(<ReducerForm onSubmit={vi.fn()} />);

      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Should show validation errors
      const errors = screen.queryAllByText(/required|invalid/i);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('UndoRedoForm', () => {
    it('should render undo and redo buttons', () => {
      render(<UndoRedoForm onSubmit={vi.fn()} />);
      expect(screen.getByRole('button', { name: /undo/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /redo/i })).toBeInTheDocument();
    });

    it('should disable undo initially', () => {
      render(<UndoRedoForm onSubmit={vi.fn()} />);
      expect(screen.getByRole('button', { name: /undo/i })).toBeDisabled();
    });

    it('should enable undo after input change', async () => {
      const user = userEvent.setup();
      render(<UndoRedoForm onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/title/i), 'Test');

      expect(screen.getByRole('button', { name: /undo/i })).not.toBeDisabled();
    });

    it('should undo changes', async () => {
      const user = userEvent.setup();
      render(<UndoRedoForm onSubmit={vi.fn()} />);

      const titleInput = screen.getByLabelText(/title/i);
      await user.type(titleInput, 'Test');
      await user.click(screen.getByRole('button', { name: /undo/i }));

      expect(titleInput).toHaveValue('');
    });

    it('should redo changes', async () => {
      const user = userEvent.setup();
      render(<UndoRedoForm onSubmit={vi.fn()} />);

      const titleInput = screen.getByLabelText(/title/i);
      await user.type(titleInput, 'Test');
      await user.click(screen.getByRole('button', { name: /undo/i }));
      await user.click(screen.getByRole('button', { name: /redo/i }));

      expect(titleInput).toHaveValue('Test');
    });

    it('should show history position', () => {
      render(<UndoRedoForm onSubmit={vi.fn()} />);
      expect(screen.getByTestId('history-position')).toBeInTheDocument();
    });
  });

  describe('AutoSaveForm', () => {
    beforeEach(() => {
      localStorage.clear();
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should render title and content inputs', () => {
      render(<AutoSaveForm onSubmit={vi.fn()} />);
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
    });

    it('should show save status', () => {
      render(<AutoSaveForm onSubmit={vi.fn()} />);
      expect(screen.getByTestId('save-status')).toBeInTheDocument();
    });

    it('should auto-save to localStorage', async () => {
      const user = userEvent.setup({ delay: null });
      render(<AutoSaveForm onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/title/i), 'Test Title');

      vi.advanceTimersByTime(2000);

      await waitFor(() => {
        const saved = localStorage.getItem('form-draft');
        expect(saved).toBeTruthy();
        expect(JSON.parse(saved).title).toBe('Test Title');
      });
    });

    it('should load draft from localStorage on mount', () => {
      localStorage.setItem(
        'form-draft',
        JSON.stringify({ title: 'Saved Title', content: 'Saved Content' })
      );

      render(<AutoSaveForm onSubmit={vi.fn()} />);

      expect(screen.getByLabelText(/title/i)).toHaveValue('Saved Title');
      expect(screen.getByLabelText(/content/i)).toHaveValue('Saved Content');
    });

    it('should have clear draft button', () => {
      render(<AutoSaveForm onSubmit={vi.fn()} />);
      expect(
        screen.getByRole('button', { name: /clear.*draft/i })
      ).toBeInTheDocument();
    });

    it('should clear draft from localStorage', async () => {
      const user = userEvent.setup();
      localStorage.setItem('form-draft', JSON.stringify({ title: 'Test' }));

      render(<AutoSaveForm onSubmit={vi.fn()} />);
      await user.click(screen.getByRole('button', { name: /clear.*draft/i }));

      expect(localStorage.getItem('form-draft')).toBeNull();
    });
  });
});

// =============================================================================
// EXERCISE 6 TESTS: Custom Form Hooks
// =============================================================================

describe('Exercise 6: Custom Form Hooks', () => {
  describe('useForm hook', () => {
    function TestComponent() {
      const form = useForm({
        initialValues: { name: '', email: '' },
        validate: (values) => {
          const errors = {};
          if (!values.name) errors.name = 'Name required';
          if (!values.email) errors.email = 'Email required';
          return errors;
        },
        onSubmit: vi.fn()
      });

      return (
        <form onSubmit={form.handleSubmit}>
          <input
            name="name"
            value={form.values.name}
            onChange={form.handleChange}
          />
          <input
            name="email"
            value={form.values.email}
            onChange={form.handleChange}
          />
          {form.errors.name && <span>{form.errors.name}</span>}
          <button type="submit">Submit</button>
          <button type="button" onClick={form.resetForm}>
            Reset
          </button>
        </form>
      );
    }

    it('should initialize with initial values', () => {
      render(<TestComponent />);
      expect(screen.getByRole('textbox', { name: '' })).toHaveValue('');
    });

    it('should handle input changes', async () => {
      const user = userEvent.setup();
      render(<TestComponent />);

      const inputs = screen.getAllByRole('textbox');
      await user.type(inputs[0], 'John');

      expect(inputs[0]).toHaveValue('John');
    });

    it('should validate on submit', async () => {
      const user = userEvent.setup();
      render(<TestComponent />);

      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(screen.getByText('Name required')).toBeInTheDocument();
    });

    it('should reset form', async () => {
      const user = userEvent.setup();
      render(<TestComponent />);

      const inputs = screen.getAllByRole('textbox');
      await user.type(inputs[0], 'John');
      await user.click(screen.getByRole('button', { name: /reset/i }));

      expect(inputs[0]).toHaveValue('');
    });
  });

  describe('FormWithCustomHook', () => {
    it('should render form with custom hook', () => {
      render(<FormWithCustomHook onSubmit={vi.fn()} />);
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/age/i)).toBeInTheDocument();
    });

    it('should validate using custom hook', async () => {
      const user = userEvent.setup();
      render(<FormWithCustomHook onSubmit={vi.fn()} />);

      await user.click(screen.getByRole('button', { name: /submit/i }));

      const errors = screen.queryAllByText(/required|invalid|min/i);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should reset form using custom hook', async () => {
      const user = userEvent.setup();
      render(<FormWithCustomHook onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/name/i), 'Test');
      await user.click(screen.getByRole('button', { name: /reset/i }));

      expect(screen.getByLabelText(/name/i)).toHaveValue('');
    });
  });
});

// =============================================================================
// EXERCISE 7 TESTS: Accessibility in Forms
// =============================================================================

describe('Exercise 7: Accessibility in Forms', () => {
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
// HELPER FUNCTIONS TESTS
// =============================================================================

describe('Helper Functions', () => {
  describe('isValidEmail', () => {
    it('should validate correct email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should return errors for short password', () => {
      const errors = validatePassword('short');
      expect(errors).toContain('Password must be at least 8 characters');
    });

    it('should return errors for password without uppercase', () => {
      const errors = validatePassword('lowercase123');
      expect(errors.some((e) => e.includes('uppercase'))).toBe(true);
    });

    it('should return errors for password without number', () => {
      const errors = validatePassword('NoNumbers');
      expect(errors.some((e) => e.includes('number'))).toBe(true);
    });

    it('should return empty array for valid password', () => {
      const errors = validatePassword('ValidPass123');
      expect(errors).toHaveLength(0);
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes', () => {
      expect(formatFileSize(500)).toBe('500 Bytes');
    });

    it('should format kilobytes', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
    });

    it('should format megabytes', () => {
      expect(formatFileSize(1048576)).toBe('1 MB');
    });

    it('should handle zero', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
    });
  });
});
