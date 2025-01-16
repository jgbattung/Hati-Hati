import { prisma } from "@/lib/db/prisma";
import { doesuserExist, updateUserDB } from "@/lib/db/users.db";

jest.mock("@/lib/db/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
  },
  handleDatabaseError: jest.fn(),
}));

describe("User database operations tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  it('should return true if the user exists', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: "123", email: "test@example.com" });

    const result = await doesuserExist("123");

    expect(result).toBe(true);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: "123" }
    });
  })

  it('should return false if the user does not exist', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await doesuserExist("123");
    expect(result).toBe(false)
  });

  it('should create/update the user in the DB', async () => {
    const mockUserData = {
      id: 'test_user_id',
      email: 'test@example.com',
      name: 'Test User',
      image: 'https://example.com/image.jpg'
    };
  
    (prisma.user.upsert as jest.Mock).mockResolvedValue({
      ...mockUserData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await updateUserDB(mockUserData);

    expect(prisma.user.upsert).toHaveBeenCalledWith({
      where: { id: mockUserData.id },
      create: mockUserData,
      update: mockUserData,
    });

    expect(result).toMatchObject(mockUserData);
  });
});

