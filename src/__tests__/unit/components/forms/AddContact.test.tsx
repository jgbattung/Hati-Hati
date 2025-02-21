import AddContact from "@/components/forms/AddContact";
import { addContactTestIds } from "@/utils/constants";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: {
      id: 'test-user-id',
      firstName: 'Test User'
    }
  })
}));

const renderAddContact = () => {
  render(<AddContact />)
};

describe("Add Contacts Dialog tests", () => {
  it('should render the add new friend button', () => {
    renderAddContact();
    expect(screen.getByTestId(addContactTestIds.addNewFriendButton)).toBeInTheDocument();
  });

  it('should render dialog content when trigger is clicked', () => {
    renderAddContact();

    // Click the trigger button
    const addFriendButton = screen.getByTestId(addContactTestIds.addNewFriendButton);
    fireEvent.click(addFriendButton);

    // Check if Dialog content is rendered
    expect(screen.getByTestId(addContactTestIds.addContactDialog)).toBeInTheDocument()
    expect(screen.getByTestId(addContactTestIds.dialogTitle)).toHaveTextContent('Add a new contact')
    expect(screen.getByTestId(addContactTestIds.dialogDescription)).toHaveTextContent('Add a new contact to Hati-Hati to add them to your groups.')
  });

  it('should render the form fields and buttons', () => {
    renderAddContact();

    fireEvent.click(screen.getByTestId(addContactTestIds.addNewFriendButton));

    // Check form fields
    expect(screen.getByLabelText('Email')).toBeInTheDocument();

    // Check buttons
    expect(screen.getByTestId(addContactTestIds.submitButton)).toBeInTheDocument();
    expect(screen.getByTestId(addContactTestIds.cancelButton)).toBeInTheDocument();
  });

  describe("Form validation tests", () => {
    it('should show validation errors when submitting empty form', async () => {
      renderAddContact();

      fireEvent.click(screen.getByTestId(addContactTestIds.addNewFriendButton));

      const submitButton = screen.getByTestId(addContactTestIds.submitButton);

      fireEvent.click(submitButton);

      const emailError = await screen.findByTestId(addContactTestIds.emailMessage);
    
      expect(emailError).toBeInTheDocument();
      expect(emailError).toHaveTextContent("Email is required.");
    });

    it('should show error for invalid email format', async () => {
      const user = userEvent.setup()
      renderAddContact();

      fireEvent.click(screen.getByTestId(addContactTestIds.addNewFriendButton));

      const emailField = screen.getByLabelText('Email');

      // Populate fields
      await user.type(emailField, 'invalid');

      const submitButton = screen.getByTestId(addContactTestIds.submitButton);
      await user.click(submitButton);

      const emailError = await screen.getByTestId(addContactTestIds.emailMessage);
      expect(emailError).toHaveTextContent('Please enter a valid email address')
    });
  });

  describe("Form action tests", () => {
    it('should reset form and close dialog when Cancel is clicked', async () => {
      const user = userEvent.setup()
      renderAddContact();

      await user.click(screen.getByTestId(addContactTestIds.addNewFriendButton));

      const emailField = screen.getByLabelText('Email');

      // Populate fields
      await user.type(emailField, 'test@email.com');

      // Click cancel
      const cancelButton = screen.getByTestId(addContactTestIds.cancelButton);
      await user.click(cancelButton);

      expect(screen.queryByTestId(addContactTestIds.addContactDialog)).not.toBeInTheDocument();

      // Open the Dialog again
      await user.click(screen.getByTestId(addContactTestIds.addNewFriendButton));

      const newEmailField = screen.getByLabelText('Email');

      // Check if the fields are empty
      expect(newEmailField).toHaveValue('');
    });
  });
});