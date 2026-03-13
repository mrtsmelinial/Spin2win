import { create } from 'zustand'

export const useMenuStore = create(set => ({
	isOpen: false,
	activeIndex: 0,
	open: () => set({ isOpen: true }),
	close: () => set({ isOpen: false }),
	setActiveIndex: index => set({ activeIndex: index }),
}))

export const open = () => useMenuStore.getState().open()
export const close = () => useMenuStore.getState().close()
export const setActiveIndex = index => useMenuStore.getState().setActiveIndex(index)