import UpdateGroupName from "@/components/forms/UpdateGroupName";
import { updateGroupNameTestIds } from "@/utils/constants";
import { fireEvent, render, screen } from "@testing-library/react";

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: {
      id: 'test-user-id',
      username: 'jgb',
      fullName: 'Jireh Battung',
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

const renderUpdateGroupName = () => {
  render(<UpdateGroupName groupId={mockGroupInfo.group.id} currentName={mockGroupInfo.group.name} />)
};

describe("Create Update Group Dialog tests", () => {
  it("should render the the pencil icon button", () => {
    renderUpdateGroupName();

    const updateButton = screen.getByTestId(updateGroupNameTestIds.updateGroupButton);
    expect(updateButton).toBeInTheDocument();
  });

  it("should render the dialog content when button is clicked", () => {
    renderUpdateGroupName();

    const updateButton = screen.getByTestId(updateGroupNameTestIds.updateGroupButton);
    fireEvent.click(updateButton);

    // Check if Dialog is rendered
    expect(screen.getByTestId(updateGroupNameTestIds.updateGroupDialog));
    expect(screen.getByTestId(updateGroupNameTestIds.dialogTitle));
  });

  it("should render the form fields and buttons", () => {
    renderUpdateGroupName();

    fireEvent.click(screen.getByTestId(updateGroupNameTestIds.updateGroupButton))
    
    expect(screen.getByLabelText('Group Name')).toBeInTheDocument();

    // Check buttons
    expect(screen.getByTestId(updateGroupNameTestIds.confirmButton));
    expect(screen.getByTestId(updateGroupNameTestIds.cancelButton));
  });
});