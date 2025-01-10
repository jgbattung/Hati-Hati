import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error']
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export type PrismaError = Error & {
  code?: string;
  meta?: { target?: string[] };
}

export function handleDatabaseError (error: unknown): never {
  const prismaError = error as PrismaError;

  switch (prismaError.code) {
    case 'P2002':
      throw new Error(`Unique constraint failed on: ${prismaError.meta?.target?.join(', ')}`)
    case 'P2025':
      throw new Error('Record not found')
    case 'P2003':
      throw new Error('Foreign key constraint failed')
    default:
      console.error('Database error:', prismaError)
      throw new Error('An unexpected database error occurred')
  }
};
