import FriendSelectionList from "@/components/shared/FriendSelectionList";
import { friendsSelectionListTestIds } from "@/utils/constants";
import { useUser } from "@clerk/nextjs";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';

jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn()
}))

beforeEach(() => {
  // Reset all mocks
  jest.clearAllMocks();
  
  // Mock clerk user
  (useUser as jest.Mock).mockReturnValue({ user: mockUser })
});

const mockUser = {
  id: 'user_123',
  firstName: 'Juan',
  lastName: 'Cruz',
  username: 'jcruz',
}

const mockFriends = [
  {
    id: 'user_234',
    name: 'Jose Rizal',
    username: 'jrizal',
    image: 'image-url',
  },
  {
    id: 'user_345',
    name: 'Maria Clara',
    username: 'mclara',
    image: 'image-url2'
  },
  {
    id: 'user_456',
    name: 'Jireh Battung',
    username: 'jbats',
    image: 'image-url3',
  }
]

const renderFriendSelectionList = () => {
  render(<FriendSelectionList friends={mockFriends} groupId='group_123' />);
};

describe("Friend Selection List tests", () => {
  it("should render the list without crashing", () => {
    renderFriendSelectionList();
    expect(screen.getByTestId(friendsSelectionListTestIds.listDiv)).toBeInTheDocument();
  });

  it("should render a div for each friend of the user", () => {
    renderFriendSelectionList();

    const friendDivs = screen.getAllByTestId(friendsSelectionListTestIds.friendDiv);
    expect(friendDivs).toHaveLength(mockFriends.length);
  });

  it("shoulder correctly render the details of each friend", () => {
    renderFriendSelectionList();

    mockFriends.forEach(friend => {
      const friendName = screen.getByText(friend.name);
      expect(friendName).toBeInTheDocument();
 
      const friendusername = screen.getByText(`@${friend.username}`);
      expect(friendusername).toBeInTheDocument();

      const avatarImage = screen.getAllByTestId(friendsSelectionListTestIds.friendAvatar);
      expect(avatarImage).toBeTruthy();
    })
  });
  
  it("should render the selected div when a selection is made", async () => {
    const user = userEvent.setup();

    renderFriendSelectionList();

    expect(screen.queryByTestId(friendsSelectionListTestIds.selectedListDiv)).not.toBeInTheDocument();

    // select first friend on the list
    const friendDivs = screen.getAllByTestId(friendsSelectionListTestIds.friendDiv);
    await user.click(friendDivs[0]);

    // check if the selected div is rendered
    expect(screen.getByTestId(friendsSelectionListTestIds.selectedListDiv)).toBeInTheDocument();

    const selectedDivs = screen.getAllByTestId(friendsSelectionListTestIds.selectedDiv);
    expect(selectedDivs).toHaveLength(1);

    // select last friend on the list
    await user.click(friendDivs[2]);

    const updatedSelectedDivs = screen.getAllByTestId(friendsSelectionListTestIds.selectedDiv);
    expect(updatedSelectedDivs).toHaveLength(2);

    // check if names are correct
    const firstFriendName = mockFriends[0].name.split(' ')[0];
    const lastFriendName = mockFriends[mockFriends.length - 1].name.split(' ')[0];
    expect(screen.getByText(firstFriendName)).toBeInTheDocument();
    expect(screen.getByText(lastFriendName)).toBeInTheDocument();
  });

  it("should render the add to group button when there is a selection", async () => {
    const user = userEvent.setup();

    renderFriendSelectionList();

    expect(screen.queryByTestId(friendsSelectionListTestIds.addButton)).not.toBeInTheDocument();

    const friendDivs = screen.getAllByTestId(friendsSelectionListTestIds.friendDiv);
    await user.click(friendDivs[0]);

    const addButton = screen.getByTestId(friendsSelectionListTestIds.addButton);
    expect(addButton).toBeInTheDocument();
  });
});