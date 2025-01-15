/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { updateUserDB } from "../db/users.db";

interface userDataParams {
  id: string,
  email: string,
  name?: string | null,
  image?: string | null,
}

export async function updateUser(userData: userDataParams) {
  try {
    return await updateUserDB(userData)
  } catch (error: any) {
    throw new Error(`Failed to save user: ${error.message}`);
  }
}