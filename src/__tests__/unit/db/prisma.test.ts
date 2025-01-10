import { handleDatabaseError } from "@/lib/db/prisma";

describe('Database error handling tests', () => {
  it('should handle unique constraint violation (P2002)', () => {
    const error = new Error('Unique constraint failed')
    Object.assign(error, {
      code: 'P2002',
      meta: { target: ['email'] },
    })

    expect(() => handleDatabaseError(error)).toThrow('Unique constraint failed on: email');
  });

  it('should handle record not found error (P2025)', () => {
    const error = new Error('Record not found')
    Object.assign(error, { code: 'P2025' })

    expect(() => handleDatabaseError(error)).toThrow('Record not found')
  })

  it('should handle foreign key constraint error (P2003)', () => {
    const error = new Error('Foreign key constraint failed')
    Object.assign(error, { code: 'P2003' })

    expect(() => handleDatabaseError(error)).toThrow('Foreign key constraint failed')
  })

  it('should handle unknown database errors', () => {
    const error = new Error('Unknown error')
    Object.assign(error, { code: 'UNKNOWN' })

    expect(() => handleDatabaseError(error)).toThrow('An unexpected database error occurred')
  })
});