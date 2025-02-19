import InvitationHandler from '@/components/invite/InvitationHandler';
import { acceptInvitation } from '@/lib/actions/user.actions';
import { INVITATION_ERRORS } from '@/lib/errors';
import { useUser } from '@clerk/nextjs';
import { render, waitFor } from '@testing-library/react';

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn()
}));

// Mock server action
jest.mock('@/lib/actions/user.actions', () => ({
  acceptInvitation: jest.fn()
}));

// Mock user data
const mockUser = {
  id: 'user_123',
  firstName: 'Juan',
  lastName: 'Cruz'
};

// Mock invite data
const mockInviteData = {
  token: '12345',
  email: 'juan@example.com',
  inviterName: 'Maria Clara'
};

const renderInvitationHandler = () => {
  render(<InvitationHandler />)
}

describe("Invitation Handler tests", () => {
  let mockSessionStorage: { [key: string]: string };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock Clerk user
    (useUser as jest.Mock).mockReturnValue({ user: mockUser });

    // Mock sessionStorage
    mockSessionStorage = {};
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: jest.fn(key => mockSessionStorage[key] || null),
        setItem: jest.fn((key, value) => {
          mockSessionStorage[key] = value;
        }),
        removeItem: jest.fn(key => {
          delete mockSessionStorage[key];
        }),
      },
      writable: true
    });
  });

  it("should not call acceptInvitation if no invite data in sessionStorage", async () => {
    renderInvitationHandler();

    await waitFor(() => {
      expect(acceptInvitation).not.toHaveBeenCalled();
    });
  });

  it("should process invitation successfully and clear sessionStorage", async () => {
    mockSessionStorage['inviteData'] = JSON.stringify(mockInviteData);

    (acceptInvitation as jest.Mock).mockResolvedValue({ success: true });

    renderInvitationHandler();

    await waitFor(() => {
      expect(acceptInvitation).toHaveBeenCalledWith({
        id: mockUser.id,
        name: `${mockUser.firstName} ${mockUser.lastName}`,
        inviteToken: mockInviteData.token
      });
    });

    expect(window.sessionStorage.getItem('inviteData')).toBeNull();
  });

  it("should handle errors", async () => {
    mockSessionStorage['inviteData'] = JSON.stringify(mockInviteData);

    (acceptInvitation as jest.Mock).mockResolvedValue({
      success: false,
      error: INVITATION_ERRORS.INVALID_OR_EXPIRED,
    });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    renderInvitationHandler();

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();

      expect(window.sessionStorage.getItem('inviteData')).toBeTruthy();
    });

    consoleSpy.mockRestore();
  });
});