/* eslint-disable @typescript-eslint/no-explicit-any */
import Friends from "@/app/(root)/friends/page"
import { getUserFriends } from "@/lib/actions/user.actions";
import { addContactTestIds, friendsPageTestIds } from "@/utils/constants"
import { currentUser } from "@clerk/nextjs/server";
import { render, screen, waitFor } from "@testing-library/react"

jest.mock('@clerk/nextjs/server', () => ({
  currentUser: jest.fn()
}));

jest.mock('@/lib/actions/user.actions', () => ({
  getUserFriends: jest.fn()
}))

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: {
      id: 'user_123',
      firstName: 'Juan'
    }
  })
}));

const mockUser = {
  id: 'user_123',
  firstName: 'Test',
}

const mockFriends = [
  {
    friend: {
      id: 'friend_1',
      username: 'MC',
      name: 'Maria Clara',
      image: 'https://example.com/image1.jpg',
    }
  },
  {
    friend: {
      id: 'friend_2',
      username: 'JR',
      name: 'Jose Rizal',
      image: 'https://example.com/image2.jpg',
    }
  }
];

const renderFriendsPage = async () => {
  const Component = await Friends();
  console.log(Component);
  render(Component)
}

beforeEach(() => {
  jest.clearAllMocks();
  
  // Setup default mock implementations
  (currentUser as jest.Mock).mockResolvedValue(mockUser);
  (getUserFriends as jest.Mock).mockResolvedValue(mockFriends);
});

describe("Friends page tests", () => {
  it('should render friends page without crashing', async () => {
    await renderFriendsPage();

    await waitFor(() => {
      expect(screen.getByTestId(friendsPageTestIds.friendsPage)).toBeInTheDocument();
    });
  });

  it('should display the Add more friends button', async () => {
    await renderFriendsPage();

    expect(screen.getByTestId(addContactTestIds.addNewFriendButton)).toBeInTheDocument();
  });

  it('should display the friends of the user', async () => {
    await renderFriendsPage();

    const friendDivs = screen.getAllByTestId(friendsPageTestIds.friendsDiv);
    expect(friendDivs).toHaveLength(mockFriends.length);

    mockFriends.forEach(({ friend }) => {
      expect(screen.getByText(friend.username)).toBeInTheDocument();
    });
  });
})