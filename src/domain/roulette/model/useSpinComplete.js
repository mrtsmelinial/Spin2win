import { useCallback } from 'react'
import { spinComplete as historySpinComplete } from '@/domain/history'
import { spinComplete as statisticSpinComplete } from '@/domain/statistic'
import { spinComplete as myBetsSpinComplete } from '@/domain/mybets'
import { spinComplete as rouletteSpinComplete } from '@/domain/roulette'
import { spinComplete as betSpinComplete } from '@/domain/bet'

export function useSpinComplete() {
	return useCallback(cell => {
		betSpinComplete(cell)
		rouletteSpinComplete(cell)
		historySpinComplete(cell)
		statisticSpinComplete(cell)
		myBetsSpinComplete(cell)
	}, [])
}
