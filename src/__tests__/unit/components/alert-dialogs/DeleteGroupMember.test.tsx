import DeleteGroupMember from "@/components/alert-dialogs/DeleteGroupMember";
import { deleteGroupMemberTestIds } from "@/utils/constants";
import { useUser } from "@clerk/nextjs";
import { fireEvent, render, screen } from "@testing-library/react";

jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn()
  })),
}));

const mockUser = {
  id: 'user_999',
  firstName: 'Joe',
  lastName: 'Rizz',
  username: 'jrizz',
};

const mockMember = {
  groupId: 'group_123',
  user: {
    id: 'user_123'
  }
};

beforeEach(() => {
  jest.clearAllMocks();

  (useUser as jest.Mock).mockReturnValue({ user: mockUser });
});

const renderDeleteGroupMember = () => (
  render(<DeleteGroupMember groupId={mockMember.groupId} memberId={mockMember.user.id} />)
);

describe("Delete group member dialog tests", () => {
  it("should render the delete group button", () => {
    renderDeleteGroupMember();

    expect(screen.getByTestId(deleteGroupMemberTestIds.deleteMemberButton));
  });

  it("should render the dialog when the button is clicked", () => {
    renderDeleteGroupMember();

    const deleteButton = screen.getByTestId(deleteGroupMemberTestIds.deleteMemberButton);

    fireEvent.click(deleteButton);

    expect(screen.getByTestId(deleteGroupMemberTestIds.deleteMemberDialog));
    expect(screen.getByTestId(deleteGroupMemberTestIds.dialogTitle));
  });

  it("should render the buttons", () => {
    renderDeleteGroupMember();

    const deleteButton = screen.getByTestId(deleteGroupMemberTestIds.deleteMemberButton);

    fireEvent.click(deleteButton);

    expect(screen.getByTestId(deleteGroupMemberTestIds.confirmButton));
    expect(screen.getByTestId(deleteGroupMemberTestIds.cancelButton));
  });
});