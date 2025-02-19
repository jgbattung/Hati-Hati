import InviteWelcome from "@/components/invite/InviteWelcome";
import { inviteWelcomePageTestIds } from "@/utils/constants";
import { render, screen } from "@testing-library/react";

const mockInviteProps = {
  inviterName: "Juan Cruz",
  token: "12345",
  email: "juan@email.com",
}

const renderInviteWelcome = (props = mockInviteProps) => {
  render(<InviteWelcome {...props} />)
};

describe("Invite welcome tests", () => {
  it("should render without crashing", () => {
    renderInviteWelcome();

    const inviteWelcomePage = screen.getByTestId(inviteWelcomePageTestIds.inviteWelcomePage);
    expect(inviteWelcomePage).toBeInTheDocument();
  });

  it("should render with the provided props", () => {
    renderInviteWelcome();

    const inviterName = mockInviteProps.inviterName
    expect(screen.getByText(`${inviterName} has invited you to join their group in Hati-Hati. Hati-Hati helps you share and split expenses with friends easily.`))
    expect(screen.getByText(`Join ${inviterName} and start sharing expenses.`)).toBeInTheDocument();
  });

  it("should render a sign up button that links to the sign-up page", () => {
    renderInviteWelcome();

    const signUpButton = screen.getByTestId(inviteWelcomePageTestIds.signUpButtonLink);
    expect(signUpButton).toHaveAttribute('href', '/sign-up');
  });
});