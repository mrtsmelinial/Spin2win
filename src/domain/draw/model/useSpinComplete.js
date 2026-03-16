import { useCallback } from 'react'
import { spinComplete as historySpinComplete } from '@/domain/history'
import { spinComplete as statisticSpinComplete } from '@/domain/statistic'
import { spinComplete as rouletteSpinComplete } from '@/domain/roulette'
import { spinComplete as betSpinComplete } from '@/domain/bet'

export default function useSpinComplete() {
	return useCallback(cell => {
		betSpinComplete(cell)
		rouletteSpinComplete(cell)
		historySpinComplete(cell)
		statisticSpinComplete(cell)
	}, [])
}
