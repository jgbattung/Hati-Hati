import CreateGroup from "@/components/forms/CreateGroup";
import { createGroupTestIds } from "@/utils/constants";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: {
      id: 'test-user-id',
      username: 'jgb',
      fullName: 'Jireh Battung',
    }
  })
}));

const renderCreateGroup = () => {
  render(<CreateGroup />)
};

describe("Create Group Dialog tests", () => {
  it('should render the create a new group button', () => {
    renderCreateGroup();
    expect(screen.getByTestId(createGroupTestIds.createGroupButton));
  });

  it('should render dialog content when button is clicked', () => {
    renderCreateGroup();

    // Click the button
    const createGroupButton = screen.getByTestId(createGroupTestIds.createGroupButton);
    fireEvent.click(createGroupButton);

    // Check if Dialog content is rendered
    expect(screen.getByTestId(createGroupTestIds.createGroupDialog));
    expect(screen.getByTestId(createGroupTestIds.dialogTitle));
    expect(screen.getByTestId(createGroupTestIds.dialogDescription));
  });

  it('should render the form fields and buttons', () => {
    renderCreateGroup();

    fireEvent.click(screen.getByTestId(createGroupTestIds.createGroupButton));

    // Check the form fields
    expect(screen.getByLabelText('Group Name')).toBeInTheDocument();

    // Check buttons
    expect(screen.getByTestId(createGroupTestIds.submitButton)).toBeInTheDocument();
    expect(screen.getByTestId(createGroupTestIds.cancelButton));
  });

  it('should show error when Group Name field is blank', async () => {
    const user = userEvent.setup()
    renderCreateGroup();

    fireEvent.click(screen.getByTestId(createGroupTestIds.createGroupButton));

    const submitButton = screen.getByTestId(createGroupTestIds.submitButton);
    await user.click(submitButton);

    const groupNameError = screen.getByTestId(createGroupTestIds.groupNameMessage);
    expect(groupNameError).toHaveTextContent('Group name is required.');
  });
});

describe("Form action tests", () => {
  it('should reset form and close dialog when Cancel is clicked', async () => {
    const user = userEvent.setup();
    renderCreateGroup();

    await user.click(screen.getByTestId(createGroupTestIds.createGroupButton));

    const groupNameField = screen.getByLabelText('Group Name');

    await user.type(groupNameField, 'Group A');

    const cancelButton = screen.getByTestId(createGroupTestIds.cancelButton);
    await user.click(cancelButton);

    expect(screen.queryByTestId(createGroupTestIds.createGroupDialog)).not.toBeInTheDocument();

    await user.click(screen.getByTestId(createGroupTestIds.createGroupButton));

    const newGroupNameField = screen.getByLabelText('Group Name');

    expect(newGroupNameField).toHaveValue('');
  });
})