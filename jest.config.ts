import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({
  dir: './',
})

const config: Config = {
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: [
    '<rootDir>/src/__tests__/**/*.test.{js,jsx,ts,tsx}'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@clerk/clerk-react|@clerk/shared|@clerk/types|@clerk/backend|@clerk/nextjs)/)'
  ],
}

export default createJestConfig(config)