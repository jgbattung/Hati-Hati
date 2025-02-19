import InviteError from "@/components/invite/InviteError"
import { INVITE_ERROR_MESSAGES, INVITE_ERRORS } from "@/lib/errors"
import { inviteErrorPageTestIds } from "@/utils/constants";
import { render, screen } from "@testing-library/react"

const mockInviteProps = {
  error: INVITE_ERRORS.INVALID_TOKEN as keyof typeof INVITE_ERRORS
}

const renderInviteError = (props = mockInviteProps) => {
  render(<InviteError {...props} />)
};

describe("Invite error tests", () => {
  it("should render without crashing", () => {
    renderInviteError();

    const inviteErrorPage = screen.getByTestId(inviteErrorPageTestIds.inviteErrorPage);
    expect(inviteErrorPage).toBeInTheDocument();
  });

  it("should display the correct error message based on error type", () => {
    renderInviteError();
    expect(screen.getByText(INVITE_ERROR_MESSAGES[mockInviteProps.error])).toBeInTheDocument();
  });

    it("should render a sign up button that links to the sign-up page", () => {
      renderInviteError();
  
      const signUpButton = screen.getByTestId(inviteErrorPageTestIds.signupButtonLink);
      expect(signUpButton).toHaveAttribute('href', '/sign-up');
    });
});