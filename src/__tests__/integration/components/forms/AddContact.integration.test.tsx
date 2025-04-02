import { useUser } from '@clerk/nextjs'
import { addFriend } from '@/lib/actions/user.actions'
import { render, screen, waitFor } from '@testing-library/react';
import AddContact from '@/components/forms/AddContact';
import userEvent from '@testing-library/user-event';
import { addContactTestIds } from '@/utils/constants';
import { addMembersToGroup } from '@/lib/actions/group.actions';

// Mock the clerk hook
jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn()
}))

// Mock the addFriend action
jest.mock('@/lib/actions/user.actions', () => ({
  addFriend: jest.fn()
}));

jest.mock('@/lib/actions/group.actions', () => ({
  addMembersToGroup: jest.fn()
}));

jest.mock('@/lib/store', () => ({
  useLoadingStore: () => ({
    isLoading: false,
    setIsLoading: jest.fn()
  })
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

const mockGroupId = 'group_123';

const mockExistingUser = {
  success: true,
  isExistingUser: true,
  user: {
    id: 'user_098',
    name: 'Juan Cruz',
    email: 'jaun@example.com',
  }
};

const mockGroupResult = {
  success: true,
  addedCount: 1,
  skippedCount: 0,
};

const renderAddContact = (props = {}) => {
  render(<AddContact {...props} />);
}

describe("Add Contact success scenarios tests", () => {
  it('should pass groupId to addFriend when adding a new user', async () => {
    const mockInvitation = {
      success: true,
      isExistingUser: false,
      invitation: {
        email: 'new@email.com',
        name: 'New User',
        token: 'abc_123',
      }
    };
    (addFriend as jest.Mock).mockResolvedValue(mockInvitation);

    const user = userEvent.setup();

    renderAddContact({ isOpen: true, groupId: mockGroupId });

    const emailField = screen.getByLabelText('Email');
    await user.type(emailField, 'new@email.com');

    await user.click(screen.getByTestId(addContactTestIds.submitButton));

    expect(addFriend).toHaveBeenCalledWith({
      email: 'new@email.com',
      currentUserId: mockUser.id,
      currentUserName: mockUser.firstName,
      groupId: mockGroupId,
    });
  });

  it('should call addMembersToGroup when adding an existing user with groupId', async () => {
    (addFriend as jest.Mock).mockResolvedValue(mockExistingUser);
    (addMembersToGroup as jest.Mock).mockResolvedValue(mockGroupResult);

    const user = userEvent.setup();

    renderAddContact({ isOpen: true, groupId: mockGroupId });

    const emailField = screen.getByLabelText('Email');
    await user.type(emailField, 'juan@example.com');

    await userEvent.click(screen.getByTestId(addContactTestIds.submitButton));

    await waitFor(() => {
      expect(addMembersToGroup).toHaveBeenCalledWith({
        groupId: mockGroupId,
        memberIds: ['user_098'],
        currentUserId: mockUser.id,
      });
    });
  });

  it('should show enhanced success message when user is also added to the group', async () => {
    const user = userEvent.setup();
    
    renderAddContact({ isOpen: true, groupId: mockGroupId });

    const emailField = screen.getByLabelText('Email');
    await user.type(emailField, 'juan@example.com');

    await user.click(screen.getByTestId(addContactTestIds.submitButton));

    await waitFor(() => {
      expect(screen.getByTestId(addContactTestIds.successDialog)).toBeInTheDocument();
      expect(screen.getByText(/Juan Cruz has been added to your friends list/)).toBeInTheDocument();
      expect(screen.getByText(/They have also been added to the group/)).toBeInTheDocument();
    });
  });

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

    const emailField = screen.getByLabelText('Email');

    // Fill up the form
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

    const emailField = screen.getByLabelText('Email');

    // Fill up the form
    await user.type(emailField, 'new@example.com');

    // Submit the form
    await user.click(screen.getByTestId(addContactTestIds.submitButton));

    // Verify success message
    await waitFor(() => {
      expect(screen.getByTestId(addContactTestIds.successDialog)).toBeInTheDocument();
      expect(screen.getByText('Invitation email has been sent. They will automatically be added to your friends list when they sign up.')).toBeInTheDocument();
    });

    // Verify if addFriend was called with the correct parameters
    expect(addFriend).toHaveBeenCalledWith({
      email: 'new@example.com',
      currentUserId: mockUser.id,
      currentUserName: mockUser.firstName,
    });
  });
});

describe("Add Contact error scenarios tests", () => {
  it('should show correct error message when adding an existing friend', async () => {
    const mockAlreadyFriends = {
      error: 'ALREADY_FRIENDS',
      success: false,
    };
    (addFriend as jest.Mock).mockResolvedValue(mockAlreadyFriends);

    const user = userEvent.setup();
    renderAddContact();

    // Click the add new friend button
    await user.click(screen.getByTestId(addContactTestIds.addNewFriendButton));

    const emailField = screen.getByLabelText('Email');

    // Fill up the form
    await user.type(emailField, 'existing@example.com');

    // Submit the form
    await user.click(screen.getByTestId(addContactTestIds.submitButton));

    await waitFor(() => {
      expect(screen.getByTestId(addContactTestIds.errorDialog)).toBeInTheDocument();
      expect(screen.getByText('This user is already on your friends list.')).toBeInTheDocument();
    });
  });

  it('should show correct error message when there is already a pending invitation', async () => {
    const mockPendingInvitation = {
      error: 'PENDING_INVITATION',
      success: false,
    };
    (addFriend as jest.Mock).mockResolvedValue(mockPendingInvitation);

    const user = userEvent.setup();
    renderAddContact();

    // Click the add new friend button
    await user.click(screen.getByTestId(addContactTestIds.addNewFriendButton));

    const emailField = screen.getByLabelText('Email');

    // Fill up the form
    await user.type(emailField, 'pending@example.com');

    // Submit the form
    await user.click(screen.getByTestId(addContactTestIds.submitButton));

    await waitFor(() => {
      expect(screen.getByTestId(addContactTestIds.errorDialog)).toBeInTheDocument();
      expect(screen.getByText('You have already sent an invitation to this user.'))
    });
  });

  it('should show correct error message when email sending fails', async () => {
    const mockEmailFailed = {
      error: 'EMAIL_SEND_FAILED',
      success: false
    };
    (addFriend as jest.Mock).mockResolvedValue(mockEmailFailed);

    const user = userEvent.setup();
    renderAddContact();

    // Click the add new friend button
    await user.click(screen.getByTestId(addContactTestIds.addNewFriendButton));

    const emailField = screen.getByLabelText('Email');

    // Fill up the form
    await user.type(emailField, 'new@example.com');

    // Submit the form
    await user.click(screen.getByTestId(addContactTestIds.submitButton));

    await waitFor(() => {
      expect(screen.getByTestId(addContactTestIds.errorDialog)).toBeInTheDocument();
      expect(screen.getByText('Failed to send invitation email. Please try again.')).toBeInTheDocument();
    });
  });

  it('should show general error message for unexpected errors', async () => {
    const mockGeneralError = {
      error: 'GENERAL_ERROR',
      success: false
    };
    (addFriend as jest.Mock).mockResolvedValue(mockGeneralError);

    const user = userEvent.setup();
    renderAddContact();

    await user.click(screen.getByTestId(addContactTestIds.addNewFriendButton));
    
    const emailField = screen.getByLabelText('Email');

    await user.type(emailField, 'test@example.com');

    await user.click(screen.getByTestId(addContactTestIds.submitButton));

    await waitFor(() => {
      expect(screen.getByTestId(addContactTestIds.errorDialog)).toBeInTheDocument();
      expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument();
    });
  });
});