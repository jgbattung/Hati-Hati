import DeleteGroup from "@/components/alert-dialogs/DeleteGroup";
import { deleteGroupTestIds } from "@/utils/constants";
import { fireEvent, render, screen } from "@testing-library/react";

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: {
      id: 'test-user-id',
      firstName: 'Test User'
    }
  })
}));

const mockGroupInfo = {
  success: true,
  group: {
    id: 'group_123',
    name: 'Group A',
    currency: 'PHP',
  }
};

const renderDeleteGroup = () => {
    render(<DeleteGroup groupId={mockGroupInfo.group.id} />)
};

describe("Delete Group Alert Dialog tests", () => {
  it("should render the delete group button", () => {
    renderDeleteGroup();

    const deleteButton = screen.getByTestId(deleteGroupTestIds.deleteGroupButton);
    expect(deleteButton).toBeInTheDocument();
  });

  it("should render the alert dialog content when the button is clicked", () => {
    renderDeleteGroup();

    const deleteButton = screen.getByTestId(deleteGroupTestIds.deleteGroupButton);
    fireEvent.click(deleteButton);

    expect(screen.getByTestId(deleteGroupTestIds.deleteGroupDialog));
    expect(screen.getByTestId(deleteGroupTestIds.dialogTitle));
  });

  it("should render the form fields and buttons", () => {
    renderDeleteGroup();

    fireEvent.click(screen.getByTestId(deleteGroupTestIds.deleteGroupButton));

    expect(screen.getByTestId(deleteGroupTestIds.confirmDeleteButton));
    expect(screen.getByTestId(deleteGroupTestIds.cancelButton));
  });
});