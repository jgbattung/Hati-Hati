import InvitePage from "@/app/(invite)/accept/[token]/page";
import { validateInviteToken } from "@/lib/actions/user.actions";
import { INVITE_ERROR_MESSAGES, INVITE_ERRORS } from "@/lib/errors";
import { inviteErrorPageTestIds, inviteWelcomePageTestIds } from "@/utils/constants";
import { currentUser } from "@clerk/nextjs/server";
import { render, screen } from "@testing-library/react";
import { redirect } from "next/navigation";

// Mock dependencies 
jest.mock('@clerk/nextjs/server', () => ({
  currentUser: jest.fn()
}));

jest.mock('@/lib/actions/user.actions', () => ({
  validateInviteToken: jest.fn()
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn()
}));

const mockUser = {
  id: 'user_123',
  firstName: 'Test',
}

const mockValidInvitation = {
  success: true,
  invitation: {
    email: 'juan@example.com',
    displayName: 'Juan Cruz',
    invitedBy: 'Maria Clara'
  }
};

const renderInvitePage = async (token: string = '12345') => {
  const Component = await InvitePage({ params: { token } });
  render(Component);
}

beforeEach(() => {
  jest.clearAllMocks();
  (validateInviteToken as jest.Mock).mockResolvedValue(mockValidInvitation);
});

describe("Invite page tests", () => {
  it("should redirect to groups if user is logged in", async () => {
    (currentUser as jest.Mock).mockResolvedValue(mockUser);

    await renderInvitePage();

    expect(redirect).toHaveBeenCalledWith('/groups');
  });

  it("should render welcome page for valid token", async () => {
    // No logged in user
    (currentUser as jest.Mock).mockResolvedValue(null);

    (validateInviteToken as jest.Mock).mockResolvedValue(mockValidInvitation);

    await renderInvitePage('12345');

    const inviteWelcomePage = screen.getByTestId(inviteWelcomePageTestIds.inviteWelcomePage);
    expect(inviteWelcomePage).toBeInTheDocument();

    expect(validateInviteToken).toHaveBeenCalledWith('12345');
  });

  it("should render error page for invalid token", async () => {
    // No logged in user
    (currentUser as jest.Mock).mockResolvedValue(null);

    const mockInvalidToken = {
      error: INVITE_ERRORS.INVALID_TOKEN,
    };
    (validateInviteToken as jest.Mock).mockResolvedValue(mockInvalidToken);

    await renderInvitePage('invalid-token');

    expect(screen.getByTestId(inviteErrorPageTestIds.inviteErrorPage));
    expect(screen.getByText(INVITE_ERROR_MESSAGES.INVALID_TOKEN)).toBeInTheDocument();
  });
});
