import { handleDatabaseError, prisma } from "../db/prisma";

interface ICreateUserData {
  id: string,
  email: string,
  name?: string | null,
  image?: NamedCurve,
}

export async function createOrUpdateUserDB (userData: ICreateUserData) {
  try {
    return await prisma.user.upsert({
      where: { id: userData.id },
      create: userData,
      update: userData
    })
  } catch (error) {
    handleDatabaseError(error);
  }
}