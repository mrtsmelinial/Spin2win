import { useCallback } from 'react'
import { spinComplete as rouletteSpinComplete } from '@/domain/roulette'
import { spinComplete as betSpinComplete } from '@/domain/bet'

export default function useSpinComplete() {
	return useCallback(cell => {
		betSpinComplete(cell)
		rouletteSpinComplete(cell)
	}, [])
}
