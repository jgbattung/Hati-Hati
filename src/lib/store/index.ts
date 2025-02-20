import { create } from 'zustand'

type LoadingState = {
  isLoading: boolean,
}

type LoadingAction = {
  setIsLoading: (isLoading: boolean) => void;
}

const useLoadingStore = create<LoadingState & LoadingAction>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set(() => ({ isLoading })),
}));

export { useLoadingStore }