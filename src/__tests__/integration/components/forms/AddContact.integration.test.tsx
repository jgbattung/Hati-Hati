import { useUser } from '@clerk/nextjs'
import { addFriend } from '@/lib/actions/user.actions'
import { render, screen, waitFor } from '@testing-library/react';
import AddContact from '@/components/forms/AddContact';
import userEvent from '@testing-library/user-event';
import { addContactTestIds } from '@/utils/constants';

// Mock the clerk hook
jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn()
}))

// Mock the addFriend action
jest.mock('@/lib/actions/user.actions', () => ({
  addFriend: jest.fn()
}));

beforeEach(() => {
  // Reset all mocks
  jest.clearAllMocks();
  
  // Mock clerk user
  (useUser as jest.Mock).mockReturnValue({ user: mockUser })
})

// Mock user data
const mockUser = {
  id: 'user_123',
  firstName: 'Test',
}

const renderAddContact = () => {
  render(<AddContact />);
} 

describe("Add Contact success scenarios tests", () => {
  it('should show the correct success message when adding an existing user', async () => {
    const mockExistingUser = {
      success: true,
      isExistingUser: true,
      user: {
        name: 'Juan Cruz',
        email: 'juan@example.com'
      }
    };

    (addFriend as jest.Mock).mockResolvedValue(mockExistingUser);

    const user = userEvent.setup();

    renderAddContact();

    // Click the add new friend button
    await user.click(screen.getByTestId(addContactTestIds.addNewFriendButton));

    const nameField = screen.getByLabelText('Name');
    const emailField = screen.getByLabelText('Email');

    // Fill up the form
    await user.type(nameField, 'Juan Cruz');
    await user.type(emailField, 'juan@example.com');

    // Submit the form
    await user.click(screen.getByTestId(addContactTestIds.submitButton));

    // Verify the success message
    await waitFor(() => {
      expect(screen.getByTestId(addContactTestIds.successDialog)).toBeInTheDocument();
      expect(screen.getByText('Juan Cruz has been added to your friends list.')).toBeInTheDocument();
    });

    // Verify if addFriend was called with the correct parameters
    expect(addFriend).toHaveBeenCalledWith({
      email: 'juan@example.com',
      name: 'Juan Cruz',
      currentUserId: mockUser.id,
      currentUserName: mockUser.firstName,
    });
  });

  it('should show correct success message when inviting a new user', async () => {
    const mockUserInvite = {
      success: true,
      isExistingUser: false,
      invitation: {
        email: 'new@example.com',
        name: 'New User',
        token: 'mock-token',
      }
    };
    (addFriend as jest.Mock).mockResolvedValue(mockUserInvite);

    const user = userEvent.setup();

    renderAddContact();

    // Click the add new friend button
    await user.click(screen.getByTestId(addContactTestIds.addNewFriendButton));

    const nameField = screen.getByLabelText('Name');
    const emailField = screen.getByLabelText('Email');

    // Fill up the form
    await user.type(nameField, 'New User');
    await user.type(emailField, 'new@example.com');

    // Submit the form
    await user.click(screen.getByTestId(addContactTestIds.submitButton));

    // Verify success message
    await waitFor(() => {
      expect(screen.getByTestId(addContactTestIds.successDialog)).toBeInTheDocument();
      expect(screen.getByText('Invitation email has been sent to New User. They will automatically be added to your friends list when they sign up.')).toBeInTheDocument();
    });

    // Verify if addFriend was called with the correct parameters
    expect(addFriend).toHaveBeenCalledWith({
      email: 'new@example.com',
      name: 'New User',
      currentUserId: mockUser.id,
      currentUserName: mockUser.firstName,
    });
  })
});