import DeleteGroupMember from "@/components/alert-dialogs/DeleteGroupMember";
import { removeGroupMember } from "@/lib/actions/group.actions";
import { useLoadingStore } from "@/lib/store";
import { deleteGroupMemberTestIds } from "@/utils/constants";
import { useUser } from "@clerk/nextjs";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn()
  })),
}));

jest.mock("@/lib/actions/group.actions", () => ({
  removeGroupMember: jest.fn(),
}));

jest.mock("@/lib/store", () => ({
  useLoadingStore: jest.fn(),
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

const mockSetIsLoading = jest.fn();
const mockUseLoadingStore = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  (useUser as jest.Mock).mockReturnValue({ user: mockUser });

  mockUseLoadingStore.mockReturnValue({
    isLoading: false,
    setIsLoading: mockSetIsLoading,
  });

  (useLoadingStore as unknown as jest.Mock).mockImplementation(mockUseLoadingStore);

  (removeGroupMember as jest.Mock).mockResolvedValue({
    success: true,
  });
});

const renderDeleteGroupMember = () => (
  render(<DeleteGroupMember groupId={mockMember.groupId} memberId={mockMember.user.id} />)
);

describe("Delete group member tests", () => {
  it("should call removeGroupMember with the correct parameters", async () => {
    renderDeleteGroupMember();

    fireEvent.click(screen.getByTestId(deleteGroupMemberTestIds.deleteMemberButton));
    fireEvent.click(screen.getByTestId(deleteGroupMemberTestIds.confirmButton));

    expect(mockSetIsLoading).toHaveBeenCalledWith(true);

    await waitFor(() => {
      expect(removeGroupMember).toHaveBeenCalledWith({
        groupId: mockMember.groupId,
        memberId: mockMember.user.id,
        currentUserId: mockUser.id,
      });
    });
  });

  it("should close the dialog afer deletion", async () => {
    renderDeleteGroupMember();

    fireEvent.click(screen.getByTestId(deleteGroupMemberTestIds.deleteMemberButton));

    expect(screen.getByTestId(deleteGroupMemberTestIds.deleteMemberDialog)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId(deleteGroupMemberTestIds.confirmButton));

    await waitFor(() => {
      expect(screen.queryByTestId(deleteGroupMemberTestIds.deleteMemberDialog)).not.toBeInTheDocument();
    });
  });
})