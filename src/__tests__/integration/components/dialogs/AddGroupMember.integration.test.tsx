import AddGroupMember from "@/components/dialogs/AddGroupMember";
import { getUserFriends } from "@/lib/actions/user.actions";
import { useLoadingStore } from "@/lib/store";
import { addContactTestIds, addGroupMemberTestIds, friendsSelectionListTestIds } from "@/utils/constants";
import { useUser } from "@clerk/nextjs";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

jest.mock("@/lib/actions/user.actions", () => ({
  getUserFriends: jest.fn(),
}));

jest.mock("@/lib/actions/group.actions", () => ({
  addMembersToGroup: jest.fn(),
}));

jest.mock("@/lib/store", () => ({
  useLoadingStore: jest.fn(),
}));

jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("@/components/forms/AddContact", () => {
  const MockAddContact = jest.fn(({ isOpen }) => 
    isOpen ? <div data-testid="add-contact-dialog">Mock AddContact Dialog</div> : null
  );
  return { __esModule: true, default: MockAddContact };
});

const mockUser = {
  id: 'user_123',
  firstName: 'Jose',
  lastName: 'Rizal',
  username: 'jrizal',
};

const mockFriends = [
  {
    friend: {
      id: "user_234",
      name: "Jose Rizal",
      username: "jrizal",
      image: "image-url"
    }
  },
  {
    friend: {
      id: "user_345",
      name: "Maria Clara",
      username: "mclara",
      image: "image-url2"
    }
  }
];

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
});

const renderAddGroupMember = () => {
  render(<AddGroupMember groupId="group_123" userId={mockUser.id} />)
};

describe("Add Group Member dialog tests", () => {
  it("should display the add group members button", () => {
    renderAddGroupMember();
    expect(screen.getByTestId(addGroupMemberTestIds.addGroupMemberButton)).toBeInTheDocument();
  });

  it("should render the dialog content when the button is clicked", async () => {
    const user = userEvent.setup();
    
    renderAddGroupMember();

    const addGroupMemberButton = screen.getByTestId(addGroupMemberTestIds.addGroupMemberButton);
    await user.click(addGroupMemberButton);

    expect(screen.getByTestId(addGroupMemberTestIds.addGroupMemberDialog)).toBeInTheDocument();
  });

  it("should render the loading div when the list is loading", async () => {
    mockUseLoadingStore.mockReturnValue({
      isLoading: true,
      setIsLoading: mockSetIsLoading,
    });

    const user = userEvent.setup();

    renderAddGroupMember();

    await user.click(screen.getByTestId(addGroupMemberTestIds.addGroupMemberButton));

    expect(screen.getByTestId(addGroupMemberTestIds.loadingDiv)).toBeInTheDocument();
  });

  it("should render the Friend Selection List component when user has friends", async () => {
    (getUserFriends as jest.Mock).mockResolvedValue(mockFriends);
  
    mockUseLoadingStore.mockReturnValue({
      isLoading: false,
      setIsLoading: mockSetIsLoading,
    });

    const user = userEvent.setup();

    renderAddGroupMember();

    await user.click(screen.getByTestId(addGroupMemberTestIds.addGroupMemberButton));

    await waitFor(() => {
      mockFriends.forEach((friendData) => {
        const friendName = friendData.friend.name;
        const friendUsername = (`@${friendData.friend.username}`);
        expect(screen.getByText(friendName)).toBeInTheDocument();
        expect(screen.getByText(friendUsername)).toBeInTheDocument();
      });

      expect(screen.getByTestId(friendsSelectionListTestIds.listDiv)).toBeInTheDocument();
    });
  });

  it ("should render the no friends div when user has no friends", async () => {
    (getUserFriends as jest.Mock).mockResolvedValue([]);

    mockUseLoadingStore.mockReturnValue({
      isLoading: false,
      setIsLoading: mockSetIsLoading,
    });

    const user = userEvent.setup();

    renderAddGroupMember();

    await user.click(screen.getByTestId(addGroupMemberTestIds.addGroupMemberButton));

    await waitFor(() => {
      expect(screen.getByTestId(addGroupMemberTestIds.noFriendsDiv)).toBeInTheDocument();
    })
  });

  it("should display the add a new friend button", async () => {
    const user = userEvent.setup();

    renderAddGroupMember();

    await user.click(screen.getByTestId(addGroupMemberTestIds.addGroupMemberButton));

    expect(screen.getByTestId(addGroupMemberTestIds.addNewFriend)).toBeInTheDocument();
  });

  it("should open the Add Contact dialog when add a new friend button is clicked", async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const AddContact = require("@/components/forms/AddContact").default;

    const user = userEvent.setup();

    renderAddGroupMember();

    await user.click(screen.getByTestId(addGroupMemberTestIds.addGroupMemberButton));

    expect(AddContact).not.toHaveBeenCalledWith(
      expect.objectContaining({ isOpen: true }),
      expect.anything(),
    )

    await user.click(screen.getByTestId(addGroupMemberTestIds.addNewFriend));

    expect(AddContact).toHaveBeenCalledWith(
      expect.objectContaining({
        isOpen: true,
        groupId: "group_123"
      }),
      expect.anything(),
    );

    expect(screen.getByTestId(addContactTestIds.addContactDialog)).toBeInTheDocument();
  });
});;