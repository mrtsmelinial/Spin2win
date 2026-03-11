import { create } from 'zustand'

const useTimeStore = create(set => ({
	currentTime: Date.now(),
	tick: () => set({ currentTime: Date.now() }),
}))

export const { tick } = useTimeStore.getState()
