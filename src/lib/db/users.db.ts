import { handleDatabaseError, prisma } from "../db/prisma";

interface ICreateUserData {
  id: string,
  email: string,
  name?: string | null,
  image?: string | null,
}

export async function doesuserExist(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id }
    })
    return !!user
  } catch (error) {
    handleDatabaseError(error)
  }
}

export async function updateUserDB (userData: ICreateUserData) {
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