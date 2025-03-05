import Groups from "@/app/(root)/groups/page";
import { getUserGroups } from "@/lib/actions/group.actions";
import { doesuserExist } from "@/lib/db/users.db";
import { createGroupTestIds, groupsPageTestIds } from "@/utils/constants";
import { currentUser } from "@clerk/nextjs/server";
import { render, screen, waitFor } from "@testing-library/react";

/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

jest.mock('@clerk/nextjs/server', () => ({
  currentUser: jest.fn()
}));

jest.mock('@/lib/actions/group.actions', () => ({
  getUserGroups: jest.fn()
}));

jest.mock('@/lib/db/users.db', () => ({
  doesuserExist: jest.fn(),
  updateUserDB: jest.fn()
}));

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
  firstName: 'Juan',
  lastName: 'Cruz',
  username: 'JCruz',
}

const mockUserGroups = {
  success: true,
  groups: [
    {
      id: 'group_1',
      name: 'Africa 2025',
    },
    {
      id: 'group_2',
      name: 'Japan 2025',
    }
  ]
}

const renderGroupsPage = async () => {
  const Component = await Groups();
  render(Component)
}

beforeEach(() => {
  jest.clearAllMocks();
  
  // Setup default mock implementations
  (currentUser as jest.Mock).mockResolvedValue(mockUser);
  (getUserGroups as jest.Mock).mockResolvedValue(mockUserGroups);
  (doesuserExist as jest.Mock).mockResolvedValue(true);
});

describe("Groups page tests", () => {
  it('should display groups page without crashing', async () => {
    await renderGroupsPage();

    await waitFor(() => {
      expect(screen.getByTestId(groupsPageTestIds.groupsPage)).toBeInTheDocument();
    })
  });

  it('should display the groups of the user', async () => {
    await renderGroupsPage();

    const groupsDiv = screen.getAllByTestId(groupsPageTestIds.groupsDiv);
    expect(groupsDiv).toHaveLength(mockUserGroups.groups.length);

    mockUserGroups.groups.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  })

  it('should display the no groups message when user has no groups', async () => {
    (getUserGroups as jest.Mock).mockResolvedValue({
      success: true,
      groups: [],
    });

    await renderGroupsPage();

    const noGroupsDiv = screen.getByTestId(groupsPageTestIds.noGroupsDiv);
    expect(noGroupsDiv).toBeInTheDocument();

    expect(screen.getByText('No groups yet')).toBeInTheDocument();
  });

  it('should display the create group button', async () => {
    await renderGroupsPage();

    const createNewGroupButton = screen.getByTestId(createGroupTestIds.createGroupButton);
    expect(createNewGroupButton).toBeInTheDocument();
  });
})