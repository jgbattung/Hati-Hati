import Group from "@/app/(root)/groups/[id]/page";
import { getGroupById } from "@/lib/actions/group.actions";
import { GROUP_ERROR_MESSAGES, GROUP_ERRORS } from "@/lib/errors";
import { groupPageTestIds } from "@/utils/constants";
import { currentUser } from "@clerk/nextjs/server";
import { render, screen, waitFor } from "@testing-library/react";

/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@clerk/nextjs/server', () => ({
  currentUser: jest.fn()
}));

jest.mock('@/lib/actions/group.actions', () => ({
  getGroupById: jest.fn()
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}))

const mockUser = {
  id: 'user_123',
  firstName: 'Juan',
  lastName: 'Cruz',
  username: 'JCruz',
}

const mockGroupInfo = {
  success: true,
  group: {
    id: 'group_123',
    name: 'Group A',
    currency: 'PHP',
  }
};

const renderGroupPage = async () => {
  const Component = await Group({ params: { id: 'group_123' } });
  render(Component);
};
 
beforeEach(() => {
  jest.clearAllMocks();

  (currentUser as jest.Mock).mockResolvedValue(mockUser);
  (getGroupById as jest.Mock).mockResolvedValue(mockGroupInfo);
});

describe("Group page tests", () => {
  it('should render group page without crashing', async () => {
    await renderGroupPage();

    await waitFor(() => {
      expect(screen.getByTestId(groupPageTestIds.groupPage));
    });
  });

  it('should display the correct group details', async () => {
    await renderGroupPage();

    const groupInfoDiv = screen.getByTestId(groupPageTestIds.groupInfoDiv);
    expect(groupInfoDiv).toBeInTheDocument();

    expect(screen.getByTestId(groupPageTestIds.groupPageImage)).toBeInTheDocument();
    expect(screen.getByText(mockGroupInfo.group.name)).toBeInTheDocument();
  });
});

describe("Group page error handling tests", () => {
  const erroCases = Object.keys(GROUP_ERRORS).map(errorKey => ({
    errorKey,
    errorCode: GROUP_ERRORS[errorKey as keyof typeof GROUP_ERRORS],
    errorMessage: GROUP_ERROR_MESSAGES[GROUP_ERRORS[errorKey as keyof typeof GROUP_ERRORS]],
  }));

  it.each(erroCases)('should display the correct error message for $errorKey', async ({ errorCode, errorMessage }) => {
    (getGroupById as jest.Mock).mockResolvedValue({
      success: false,
      error: errorCode
    });

    await renderGroupPage()

    const errorDiv = screen.getByTestId(groupPageTestIds.groupPageError);
    expect(errorDiv).toBeInTheDocument();

    const errorText = screen.getByText(errorMessage);
    expect(errorText).toBeInTheDocument();
  });
});