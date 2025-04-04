import GroupMembers from "@/components/shared/GroupMembers";
import { groupMemberTestIds } from "@/utils/constants";
import { render, screen } from "@testing-library/react";

const mockUsers = [
  {
    id: 'id_123',
    status: 'ACTIVE',
    user: {
      id: 'user_123',
      username: 'jrizal',
      name: 'Jose Rizal',
      image: 'image_link_rizal',
      email: 'jrizal@email.com'
    }
  },
  {
    id: 'id_456',
    status: 'ACTIVE',
    user: {
      id: 'user_456',
      username: 'abonifacio',
      name: 'Andres Bonifacio',
      image: 'image_link_bonifacio',
      email: 'abonifacio@email.com'
    }
  },
  {
    id: 'id_789',
    status: 'ACTIVE',
    user: {
      id: 'user_789',
      username: 'maquino',
      name: 'Melchora Aquino',
      image: null,
      email: 'maquino@email.com'
    }
  },
  {
    id: 'id_101',
    status: 'LEFT',
    user: {
      id: 'user_101',
      username: 'adagrohot',
      name: 'Apolinario Mabini',
      image: 'image_link_mabini',
      email: 'amabini@email.com'
    }
  }
];

const renderGroupMember = () => {
  render(<GroupMembers users={mockUsers} />)
}

describe("GroupMember tests", () => {
  it("should render GroupMember without crashing", () => {
    renderGroupMember();

    expect(screen.getByTestId(groupMemberTestIds.groupMembersDiv)).toBeInTheDocument();
  });

  it("should display the the correct details of active group members", () => {
    const activeUsers = mockUsers.filter(user => user.status === 'ACTIVE');

    renderGroupMember();

    activeUsers.forEach((user) => {
      expect(screen.queryAllByTestId(groupMemberTestIds.memberDiv)).toHaveLength(activeUsers.length);
      expect(screen.getByText(user.user.name)).toBeInTheDocument();
      expect(screen.getByText(`(${user.user.username})`)).toBeInTheDocument();
      expect(screen.getByText(user.user.email)).toBeInTheDocument();
    })
  });
});